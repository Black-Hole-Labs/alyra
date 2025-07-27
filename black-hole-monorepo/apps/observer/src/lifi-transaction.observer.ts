import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity, ObserverStateEntity } from '@black-hole/core-db';
import { CHAIN_ID_TO_NETWORK, LifiTransfer, LifiResponse, formatTokenAmount } from '@black-hole/config';

@Injectable()
export class LifiTransactionObserver {
  private readonly logger = new Logger(LifiTransactionObserver.name);
  private readonly LIFI_API_BASE = 'https://li.quest/v2/analytics/transfers';
  private readonly INTEGRATOR = 'blackhole';
  private readonly LIFI_LAST_CURSOR_KEY = 'lifi_last_cursor';

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(ObserverStateEntity)
    private readonly observerStateRepository: Repository<ObserverStateEntity>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchLifiTransactions() {
    this.logger.log('Starting LI.FI transaction fetch...');
    
    try {
      const transfers = await this.fetchTransfers();
      
      if (transfers.length > 0) {
        this.logger.log(`Found ${transfers.length} new transfers from LI.FI`);
        await this.processTransfers(transfers);
      } else {
        this.logger.log('No new transfers found');
      }
    } catch (error) {
      this.logger.error('Error fetching LI.FI transactions:', error);
    }
  }

  private async fetchTransfers(): Promise<LifiTransfer[]> {
    const url = new URL(this.LIFI_API_BASE);
    url.searchParams.append('integrator', this.INTEGRATOR);
    url.searchParams.append('status', 'DONE');
    url.searchParams.append('limit', '100'); // Максимальный размер страницы
    
    // Получаем последний обработанный курсор
    const lastCursor = await this.getLastProcessedCursor();
    
    // Проверяем, есть ли данные в БД
    const hasExistingData = await this.hasExistingTransactions();
    
    if (lastCursor) {
      // Если есть курсор, продолжаем с него
      url.searchParams.append('cursor', lastCursor);
      this.logger.log(`Fetching transfers with cursor: ${lastCursor}`);
    } else if (!hasExistingData) {
      // Если БД пустая, получаем данные за последние 720 дней
      const fromTimestamp = Math.floor((Date.now() - 720 * 24 * 60 * 60 * 1000) / 1000); // 720 дней назад
      url.searchParams.append('fromTimestamp', fromTimestamp.toString());
      this.logger.log(`Database is empty, fetching transfers from ${fromTimestamp} (${new Date(fromTimestamp * 1000).toISOString()})`);
    } else {
      this.logger.log('No cursor found, but database has data. Starting from latest available data.');
    }
    
    const allTransfers: LifiTransfer[] = [];
    let currentCursor = lastCursor;
    let requestCount = 0;
    const maxRequests = 50; // Защита от бесконечного цикла
    
    while (requestCount < maxRequests) {
      if (currentCursor) {
        url.searchParams.set('cursor', currentCursor);
      }
      
      this.logger.log(`Request ${requestCount + 1}: Fetching transfers...`);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`LI.FI API error: ${response.status} ${response.statusText}`);
      }

      const data: LifiResponse = await response.json();
      const transfers = data.data || [];
      
      this.logger.log(`Fetched ${transfers.length} transfers in request ${requestCount + 1}`);
      
      if (transfers.length === 0) {
        this.logger.log('No more transfers found');
        break;
      }
      
      // Фильтруем только успешные транзакции
      const successfulTransfers = transfers.filter(transfer => transfer.status === 'DONE');
      allTransfers.push(...successfulTransfers);
      
      this.logger.log(`Added ${successfulTransfers.length} successful transfers (filtered from ${transfers.length} total)`);
      
      // Проверяем, есть ли следующая страница
      if (!data.hasNext || !data.next) {
        this.logger.log('No more pages available');
        break;
      }
      
      currentCursor = data.next;
      this.logger.log(`Next cursor: ${currentCursor}`);
      
      requestCount++;
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (requestCount >= maxRequests) {
      this.logger.warn(`Reached maximum request limit (${maxRequests}). There might be more data available.`);
    }

    this.logger.log(`Total transfers fetched: ${allTransfers.length} in ${requestCount} requests`);
    return allTransfers;
  }

  private async hasExistingTransactions(): Promise<boolean> {
    try {
      const count = await this.transactionRepository.count();
      return count > 0;
    } catch (error) {
      this.logger.warn('Error checking existing transactions:', error);
      return false;
    }
  }

  private async getLastProcessedCursor(): Promise<string | null> {
    try {
      const state = await this.observerStateRepository.findOne({
        where: { key: this.LIFI_LAST_CURSOR_KEY }
      });
      
      if (state && state.value) {
        return state.value;
      }
    } catch (error) {
      this.logger.warn('Error getting last processed cursor:', error);
    }
    
    return null;
  }

  private async updateLastProcessedCursor(cursor: string): Promise<void> {
    try {
      await this.observerStateRepository.upsert(
        {
          key: this.LIFI_LAST_CURSOR_KEY,
          value: cursor,
          description: 'Last processed LI.FI transaction cursor'
        },
        ['key']
      );
    } catch (error) {
      this.logger.error('Error updating last processed cursor:', error);
    }
  }

  private async processTransfers(transfers: LifiTransfer[]) {
    let lastCursor: string | null = null;
    
    for (const transfer of transfers) {
      try {
        // Обрабатываем отправляющую транзакцию
        await this.processTransferTransaction(
          transfer.sending,
          transfer.fromAddress,
          'send',
          transfer.id
        );

        // Обрабатываем получающую транзакцию
        await this.processTransferTransaction(
          transfer.receiving,
          transfer.toAddress,
          'receive',
          transfer.id
        );

        // Сохраняем курсор последней обработанной транзакции
        lastCursor = transfer.id;
        
      } catch (error) {
        this.logger.error(`Error processing transfer ${transfer.id}:`, error);
      }
    }

    // Обновляем последний обработанный курсор
    if (lastCursor) {
      await this.updateLastProcessedCursor(lastCursor);
      this.logger.log(`Updated last processed cursor to: ${lastCursor}`);
    }
  }

  private async processTransferTransaction(
    txData: LifiTransfer['sending'] | LifiTransfer['receiving'],
    walletAddress: string,
    transactionType: 'send' | 'receive',
    transactionId: string
  ) {
    const amount = formatTokenAmount(txData.amount, txData.token.decimals);
    const amountUSD = txData.amountUSD ? parseFloat(txData.amountUSD) : null;
    const timestamp = txData.timestamp;

    // Проверяем, существует ли уже такая транзакция
    const existingTransaction = await this.transactionRepository.findOne({
      where: {
        transactionHash: txData.txHash,
        chainId: txData.chainId,
      },
    });

    if (existingTransaction) {
      this.logger.debug(`Transaction ${txData.txHash} already exists in chain ${txData.chainId}`);
      return;
    }

    // Создаем новую запись
    const transaction = this.transactionRepository.create({
      transactionHash: txData.txHash,
      chainId: txData.chainId,
      address: walletAddress.toLowerCase(),
      amount,
      amountUSD,
      tokenAddress: txData.token.address,
      tokenSymbol: txData.token.symbol,
      transactionType: `lifi_${transactionType}`,
      timestamp,
    });

    await this.transactionRepository.save(transaction);
    this.logger.log(`Saved ${transactionType} transaction: ${txData.txHash} for ${walletAddress} on chain ${txData.chainId} (USD: ${amountUSD})`);
  }
} 