import { Injectable, signal } from '@angular/core';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';

import { NetworkId } from '../models/wallet-provider.interface';
import { Token } from '../pages/trade/trade.component';
import { BlockchainStateService } from './blockchain-state.service';

@Injectable({
  providedIn: 'root',
})
export class WalletBalanceService {
  private solanaRpcUrl: string | undefined;
  private solanaConnection: Connection | undefined;
  private balanceCache = new Map<number, Map<string, string>>();
  private suiClient?: SuiClient;

  nativeBalance = signal<number>(0);

  constructor(private blockchainStateService: BlockchainStateService) {
    (async () => {
      this.solanaRpcUrl =
        (await this.blockchainStateService.getWorkingRpcUrlForNetwork(NetworkId.SOLANA_MAINNET)) ||
        'https://solana-rpc.publicnode.com';
      this.solanaConnection = new Connection(this.solanaRpcUrl, 'confirmed');

      const suiUrl =
        (await this.blockchainStateService.getWorkingRpcUrlForNetwork(NetworkId.SUI_MAINNET)) ||
        getFullnodeUrl('mainnet');
      this.suiClient = new SuiClient({ url: suiUrl });
    })();
  }

  private async getSuiBalance(owner: string, coinType?: string): Promise<string> {
    if (!this.suiClient) throw new Error('SUI client not initialized');

    if (!coinType || coinType === '0x2::sui::SUI') {
      const bal = await this.suiClient.getBalance({ owner });
      return (Number(bal.totalBalance) / 10 ** 9).toString();
    }

    const bal = await this.suiClient.getBalance({ owner, coinType });
    if (!bal || !bal.totalBalance) return '0';

    const metadata = await this.suiClient.getCoinMetadata({ coinType });
    const decimals = metadata?.decimals ?? 0;

    return (Number(bal.totalBalance) / 10 ** decimals).toString();
  }

  private async getEvmBalance(
    walletAddress: string,
    providerUrl: string,
    decimals: number,
    tokenAddress?: string | null,
  ): Promise<string> {
    // // console.log(`getEvmBalance(). Wallet: ${walletAddress}, Provider: ${providerUrl}, Token address (can be null): ${tokenAddress}`);

    const provider = new ethers.JsonRpcProvider(providerUrl);

    if (
      tokenAddress &&
      tokenAddress !== '0x0000000000000000000000000000000000000000' &&
      tokenAddress !== '0'
    ) {
      const abi = ['function balanceOf(address owner) view returns (uint256)'];
      const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
      const balance = await tokenContract['balanceOf'](walletAddress);
      // console.log(`Token Balance: `, ethers.formatUnits(balance, decimals));
      return ethers.formatUnits(balance, decimals);
    } else {
      const balance = await provider.getBalance(walletAddress);
      const ret = ethers.formatEther(balance);
      // console.log(`Native Token Balance: `, ret);
      return ret;
    }
  }

  private async getSolanaBalance(
    walletAddress: string,
    tokenMintAddress?: string,
  ): Promise<string> {
    // // console.log(`getSolanaBalance(). Wallet: ${walletAddress}, Provider: ${this.solanaRpcUrl}, Token address (can be null): ${tokenMintAddress}`);
    const publicKey = new PublicKey(walletAddress);

    if (tokenMintAddress) {
      const tokenAccounts = await this.solanaConnection!.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(tokenMintAddress),
      });

      if (tokenAccounts.value.length > 0) {
        return tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount.toString();
      } else {
        return '0';
      }
    } else {
      const balance = await this.solanaConnection!.getBalance(publicKey);
      // console.log(`Native SOL Balance: `, (balance / LAMPORTS_PER_SOL));
      return (balance / LAMPORTS_PER_SOL).toString();
    }
  }

  async getBalanceForToken(token: Token): Promise<string> {
    let walletAddress = this.blockchainStateService.getCurrentWalletAddress();

    if (
      this.blockchainStateService.getNetworkById(token.chainId)?.chainType !==
      this.blockchainStateService.networkSell()?.chainType
    ) {
      return '0';
    }

    // if(token.chainId !== this.blockchainStateService.networkSell()?.id){
    if (this.blockchainStateService.customAddress() !== '') {
      walletAddress = this.blockchainStateService.customAddress();
    }
    //   else{
    //     return "0";
    //   }
    // }

    if (!walletAddress) {
      console.error(`Failed to get wallet address`);
      return '0';
    }

    const network = this.blockchainStateService.allNetworks().find((n) => n.id === token.chainId);
    if (!network) {
      console.error('Network not found: ', token.chainId);
      return '0';
    }

    if (token.chainId === NetworkId.SUI_MAINNET) {
      if (token.symbol === 'SUI') {
        const bal = await this.getSuiBalance(walletAddress);
        this.nativeBalance.set(Number(bal));
        return bal;
      } else {
        return await this.getSuiBalance(walletAddress, token.contractAddress);
      }
    }

    if (token.chainId === NetworkId.SOLANA_MAINNET) {
      // SVM
      if (token.symbol === 'SOL') {
        const solBalance = await this.getSolanaBalance(walletAddress);
        this.nativeBalance.set(Number(solBalance));
        return solBalance;
      } else {
        return this.getSolanaBalance(walletAddress, token.contractAddress);
      }
    } else {
      // EVM
      if (token.contractAddress === '0x0000000000000000000000000000000000000000') {
        const ethBalance = await this.getEvmBalance(
          walletAddress,
          network.rpcUrls[0],
          Number(token.decimals),
        );
        this.nativeBalance.set(Number(ethBalance));
        return ethBalance;
      } else {
        return await this.getEvmBalance(
          walletAddress,
          network.rpcUrls[0],
          Number(token.decimals),
          token.contractAddress,
        );
      }
    }
  }

  async getBalancesForNetwork(networkId: number, tokens: Token[]): Promise<Map<string, string>> {
    if (this.balanceCache.has(networkId)) {
      return new Map(this.balanceCache.get(networkId)!);
    }

    const balancesMap = new Map<string, string>();
    for (const token of tokens) {
      try {
        const raw = await this.getBalanceForToken(token);
        const num = parseFloat(raw);

        const truncated = (Math.trunc(num * 1e6) / 1e6).toString();
        balancesMap.set(token.contractAddress, truncated);
      } catch (err) {
        console.error(`Error getting balance ${token.symbol}:`, err);
        balancesMap.set(token.contractAddress, '0');
      }
    }
    this.balanceCache.set(networkId, balancesMap);
    return new Map(balancesMap);
  }

  invalidateBalanceCacheForToken(networkId: number, tokenAddress: string): void {
    const netMap = this.balanceCache.get(networkId);
    if (!netMap) return;
    netMap.delete(tokenAddress);

    if (netMap.size === 0) {
      this.balanceCache.delete(networkId);
    }
  }
}
