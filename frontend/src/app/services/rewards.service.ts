import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ethers } from 'ethers';
import { BlockchainStateService } from './blockchain-state.service';
import rewardPoolsData from '@public/data/reward-pools.json';

// Типизация данных из reward-pools.json
const rewardPools: RewardPool[] = rewardPoolsData as RewardPool[];

export interface Reward {
  id: number;
  address: string;
  rewardPoolId: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  claimedAmount?: number; // Уже склеймленное количество
  availableAmount?: number; // Доступное для клейма количество
}

export interface RewardPool {
  id: number;
  claimerAddress: string;
  rewardToken: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    chainId: number;
  };
}

export interface ClaimTransaction {
  rewardPool: RewardPool;
  rewards: Reward[];
  totalAmount: number;
  signature: string;
  data: string;
  transaction: {
    to: string;
    data: string;
    value: string;
    gasLimit?: string;
  };
  rewardIds: number[];
}

// ABI для функции claimed_
const CLAIMED_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "asset",
        "type": "address"
      }
    ],
    "name": "claimed_",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "claimedAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  private readonly API_BASE_URL = environment.apiUrl || 'http://localhost:3000';

  // Флаги для предотвращения повторных запросов
  private isLoadingRewards = false;
  private lastRewardsRequest: { address: string; timestamp: number } | null = null;
  private readonly REWARDS_CACHE_DURATION = 10000; // 10 секунд кэширования

  readonly rewards = signal<Reward[]>([]);
  readonly isLoading = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private blockchainStateService: BlockchainStateService
  ) {}

  // Загрузка всех ревардов пользователя
  async loadRewards(walletAddress: string): Promise<Reward[]> {
    // Проверяем, не выполняется ли уже запрос
    if (this.isLoadingRewards) {
      console.log('[loadRewards] Request already in progress, skipping...');
      return this.rewards();
    }

    // Проверяем кэш - если недавно запрашивали тот же адрес, возвращаем кэшированный результат
    if (this.lastRewardsRequest && 
        this.lastRewardsRequest.address === walletAddress && 
        Date.now() - this.lastRewardsRequest.timestamp < this.REWARDS_CACHE_DURATION) {
      console.log('[loadRewards] Using cached rewards for address:', walletAddress);
      return this.rewards();
    }

    this.isLoadingRewards = true;
    this.lastRewardsRequest = { address: walletAddress, timestamp: Date.now() };

    try {
      this.isLoading.set(true);
      console.log('[loadRewards] walletAddress:', walletAddress);
      const rewards = await this.http.get<Reward[]>(`${this.API_BASE_URL}/rewards/address/${walletAddress}`).toPromise();
      console.log('[loadRewards] rewards from backend:', rewards);
      
      // Получаем информацию о склеймленных значениях для каждого реварда
      const rewardsWithClaimed = await Promise.all(
        (rewards || []).map(async (reward) => {
          try {
            // Получаем информацию о пуле ревардов из локального файла
            const rewardPool = rewardPools.find(pool => pool.id === reward.rewardPoolId);
            
            if (rewardPool && rewardPool.claimerAddress && rewardPool.rewardToken?.address) {
              const claimedAmount = await this.getClaimedAmount(
                walletAddress,
                rewardPool.rewardToken.address,
                rewardPool.claimerAddress,
                rewardPool.rewardToken.chainId
              );
              
              // Приводим reward.amount к wei для корректного сравнения
              const decimals = rewardPool.rewardToken.decimals;
              const rewardAmountInWei = BigInt(Math.floor(reward.amount * Math.pow(10, decimals)));
              const availableAmountInWei = rewardAmountInWei - claimedAmount;
              const availableAmount = Math.max(0, Number(availableAmountInWei) / Math.pow(10, decimals));
              
              console.log(`[loadRewards] Reward ${reward.id}: amount=${reward.amount}, amount(wei)=${rewardAmountInWei}, claimedAmount(wei)=${claimedAmount}, availableAmount(wei)=${availableAmountInWei}, availableAmount=${availableAmount}, decimals=${decimals}`);
              
              return {
                ...reward,
                claimedAmount: Number(claimedAmount) / Math.pow(10, decimals),
                availableAmount
              };
            }
            
            return { ...reward, claimedAmount: 0, availableAmount: reward.amount };
          } catch (error) {
            console.error(`Error getting claimed amount for reward ${reward.id}:`, error);
            return { ...reward, claimedAmount: 0, availableAmount: reward.amount };
          }
        })
      );
      
      this.rewards.set(rewardsWithClaimed);
      return rewardsWithClaimed;
    } catch (error) {
      console.error('[loadRewards] Error loading rewards:', error);
      this.rewards.set([]);
      return [];
    } finally {
      this.isLoading.set(false);
      this.isLoadingRewards = false;
    }
  }

  // Принудительная загрузка ревардов (игнорирует кэш)
  async forceLoadRewards(walletAddress: string): Promise<Reward[]> {
    this.lastRewardsRequest = null; // Сбрасываем кэш
    return this.loadRewards(walletAddress);
  }

  // Получение claim-транзакций для клейма
  async getClaimTransaction(walletAddress: string): Promise<ClaimTransaction[]> {
    try {
      console.log('[getClaimTransaction] walletAddress:', walletAddress);
      const transactions = await this.http.get<ClaimTransaction[]>(`${this.API_BASE_URL}/rewards/claim/${walletAddress}`).toPromise();
      console.log('[getClaimTransaction] claim transactions from backend:', transactions);
      return transactions || [];
    } catch (error) {
      console.error('[getClaimTransaction] Error getting claim transaction:', error);
      return [];
    }
  }

  // Клейм всех ревардов (используя provider.sendTx как в trade.component.ts)
  async claimAllRewards(walletAddress: string, provider: any): Promise<string[]> {
    const claimTxs = await this.getClaimTransaction(walletAddress);
    const hashes: string[] = [];
    
    for (const claimTx of claimTxs) {
      try {
        if (!(claimTx.transaction as any).from) {
          (claimTx.transaction as any).from = walletAddress;
        }
        
        const txHash = await provider.sendTx(claimTx.transaction);
        hashes.push(txHash);
      } catch (error) {
        throw error;
      }
    }
    
    return hashes;
  }

  // Группировка и вычисление claimableAmount для UI (пример)
  getClaimableRewards(): Reward[] {
    return this.rewards().filter(reward => (reward.availableAmount || reward.amount) > 0);
  }

  getClaimableAmount(): number {
    return this.getClaimableRewards().reduce((sum, r) => sum + (r.availableAmount || r.amount), 0);
  }

  // Получение уже склеймленного количества из контракта (в wei)
  async getClaimedAmount(
    userAddress: string,
    assetAddress: string,
    claimerAddress: string,
    chainId: number
  ): Promise<bigint> {
    try {
      // Получаем провайдер для нужной сети
      const provider = await this.getProviderForChainId(chainId);
      if (!provider) {
        console.error(`Provider not found for chainId: ${chainId}`);
        return BigInt(0);
      }

      const claimerContract = new ethers.Contract(
        claimerAddress,
        CLAIMED_ABI,
        provider
      );

      const claimedAmount = await claimerContract['claimed_'](userAddress, assetAddress);
      console.log('[getClaimedAmount] claimedAmount (wei):', claimedAmount.toString());
      return claimedAmount;
    } catch (error) {
      console.error('Error reading claimed amount from contract:', error);
      return BigInt(0);
    }
  }

  // Получение провайдера для конкретной сети
  private async getProviderForChainId(chainId: number): Promise<any> {
    try {
      // Получаем RPC URL для сети
      const rpcUrl = await this.blockchainStateService.getWorkingRpcUrlForNetwork(chainId);
      if (!rpcUrl) {
        console.error(`RPC URL not found for chainId: ${chainId}`);
        return null;
      }

      // Создаем провайдер
      return new ethers.JsonRpcProvider(rpcUrl);
    } catch (error) {
      console.error(`Error creating provider for chainId ${chainId}:`, error);
      return null;
    }
  }
} 