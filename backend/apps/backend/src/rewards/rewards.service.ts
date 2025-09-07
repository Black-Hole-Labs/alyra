import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, parseUnits, hexlify } from 'ethers';
import { RewardRepository } from '@black-hole/core-db';
import { RewardPoolRepository } from '@black-hole/core-db';
import { TransactionRepository } from '@black-hole/core-db';
import { getRpcProvider } from '@black-hole/config';

// ABI для ERC20 Claimer контракта
const ERC20_CLAIMER_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_asset",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_context",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  constructor(
    private readonly rewardRepository: RewardRepository,
    private readonly rewardPoolRepository: RewardPoolRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly configService: ConfigService,
  ) {}

  async getRewardsByAddress(address: string) {
    return await this.rewardRepository.findByAddress(address);
  }

  // async getRewardPools() {
  //   return await this.rewardPoolRepository.findAll();
  // }

  async getClaimTransaction(address: string) {
    // Получаем все доступные для клейма реварды пользователя
    const availableRewards = await this.rewardRepository.findUnclaimedByAddress(address);
    
    if (!availableRewards || availableRewards.length === 0) {
      throw new Error('No rewards available for claim');
    }

    // Группируем реварды по пулам
    const rewardsByPool = availableRewards.reduce((acc, reward) => {
      if (!acc[reward.rewardPoolId]) {
        acc[reward.rewardPoolId] = [];
      }
      acc[reward.rewardPoolId].push(reward);
      return acc;
    }, {} as Record<number, typeof availableRewards>);

    // Для каждого пула создаем подписанную транзакцию
    const transactions = [];

    for (const [poolId, rewards] of Object.entries(rewardsByPool)) {
      try {
        const rewardPool = await this.rewardPoolRepository.findById(parseInt(poolId));
        if (!rewardPool) {
          this.logger.warn(`Reward pool ${poolId} not found, skipping`);
          continue;
        }

        // Суммируем все реварды для этого пула
        const totalAmount = (rewards as any[]).reduce((sum, reward) => {
          const rewardAmount = parseFloat(reward.amount.toString());
          return sum + rewardAmount;
        }, 0);
        
        if (totalAmount <= 0) {
          continue;
        }

        // Форматируем значение для корректной обработки parseUnits
        const decimals = rewardPool.rewardToken?.decimals || 18;
        const formattedAmount = this.formatAmountForParseUnits(totalAmount, decimals);
        
        //this.logger.debug(`Pool ${poolId}: totalAmount=${totalAmount}, decimals=${decimals}, formattedAmount=${formattedAmount}`);
        
        // Создаем bigint напрямую из wei значения, если formattedAmount равен '0'
        let assetAmount: bigint;
        if (formattedAmount === '0') {
          // Используем исходное значение в wei
          assetAmount = BigInt(Math.floor(totalAmount));
        } else {
          // Используем parseUnits
          assetAmount = parseUnits(formattedAmount, decimals);
        }
        
        const assetAmounts: [string, bigint] = [
          rewardPool.rewardToken?.address || '0x',
          assetAmount
        ];

        const signature = await this.getSignature(rewardPool, address, assetAmounts);

        const provider = getRpcProvider(rewardPool.rewardToken.chainId);

        // Проверяем, что claimerAddress определен
        if (!rewardPool.claimerAddress) {
          continue;
        }

        // Создаем подписанную транзакцию
        const claimerContract = new ethers.Contract(
          rewardPool.claimerAddress,
          ERC20_CLAIMER_ABI,
          provider
        );

        const rawTx = await claimerContract.claim.populateTransaction(
          assetAmounts[0],
          assetAmounts[1],
          '0x',
          signature
        );

        const rewardIds = (rewards as any[]).map(item => item.id);

        const textEncoder = new TextEncoder();
        const additionalData = hexlify(textEncoder.encode(JSON.stringify({ rewards: rewardIds })));
        rawTx.data = rawTx.data + additionalData.slice(2);

        transactions.push({
          rewardPool,
          rewards,
          totalAmount,
          signature,
          transaction: rawTx,
          rewardIds: rewardIds
        });
      } catch (error) {
        this.logger.error(`Error processing pool ${poolId}:`, error);
        // Продолжаем обработку других пулов
        continue;
      }
    }

    if (transactions.length === 0) {
      throw new Error('No valid claim transactions could be created');
    }

    return transactions;
  }

  private async getSignature(
    pool: any,
    address: string,
    assetAmounts: [string, bigint]
  ) {
    const abiCoder = new ethers.AbiCoder();

    const data = abiCoder.encode(
      [
        'address',
        'address',
        'uint256',
        'bytes'
      ],
      [
        address,
        assetAmounts[0],
        assetAmounts[1],
        '0x'
      ]
    );

    const encodedMessage = abiCoder.encode(
      [
        'uint256',
        'address',
        'bytes'
      ],
      [
        pool.rewardToken?.chainId || 11155111, // Sepolia по умолчанию
        pool.claimerAddress,
        data
      ]
    );

    const signerKey = this.configService.get(`CLAIMER_SIGNER_${pool.id}`);
    if (!signerKey) {
      throw new Error(`Signer key not found for pool ${pool.id}`);
    }

    const provider = getRpcProvider(pool.rewardToken?.chainId || 11155111);
    const signer = new ethers.Wallet(signerKey, provider);

    const bytes = ethers.getBytes(encodedMessage);
    const signature = await signer.signMessage(bytes);

    return signature;
  }

  private formatAmountForParseUnits(amount: number | string, decimals: number): string {
    try {
      // Преобразуем amount в строку и убираем ведущие нули
      let amountStr = amount.toString();
        
      // Убираем ведущие нули, но оставляем один ноль перед точкой
      amountStr = amountStr.replace(/^0+/, '');
      if (amountStr.startsWith('.')) {
        amountStr = '0' + amountStr;
      }
            
      // Если строка пустая или равна '0', возвращаем '0'
      if (!amountStr || amountStr === '0') {
        return '0';
      }
      
      // Проверяем, что это валидное число
      const numValue = parseFloat(amountStr);
      if (isNaN(numValue)) {
        throw new Error(`Invalid amount string: ${amountStr}`);
      }
            
      // Если значение уже в правильном формате (меньше 1), используем его как есть
      if (numValue < 1) {
        // Проверяем, что значение не слишком маленькое
        const minValue = Math.pow(10, -decimals);
        if (numValue < minValue) {
          return '0';
        }
        
        // Ограничиваем количество десятичных знаков до decimals
        const limitedDecimals = Math.min(decimals, 18); // Максимум 18 десятичных знаков
        // Используем Math.floor для округления в меньшую сторону
        const multiplier = Math.pow(10, limitedDecimals);
        const roundedValue = Math.floor(numValue * multiplier) / multiplier;
        const result = roundedValue.toString();
        return result;
      }
      
      // Если значение больше 1, преобразуем из wei в обычные единицы
      const power = Math.pow(10, decimals);
      const normalizedAmount = numValue / power;
      
      // Используем Math.floor для округления в меньшую сторону
      const multiplier = Math.pow(10, decimals);
      const roundedAmount = Math.floor(normalizedAmount * multiplier) / multiplier;
      const formatted = roundedAmount.toString();
            
      // Дополнительная проверка на корректность
      if (isNaN(parseFloat(formatted))) {
        throw new Error(`Invalid formatted amount: ${formatted}`);
      }
      
      return formatted;
    } catch (error) {
      // Возвращаем безопасное значение
      return '0';
    }
  }
} 