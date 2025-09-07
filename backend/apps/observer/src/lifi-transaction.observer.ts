import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity, TransactionStateRepository } from '@black-hole/core-db';
import { CHAIN_ID_TO_NETWORK, LifiTransfer, LifiResponse, LifiTransactionData, formatTokenAmount } from '@black-hole/config';

@Injectable()
export class LifiTransactionObserver {
  private readonly logger = new Logger(LifiTransactionObserver.name);
  private readonly LIFI_API_BASE = 'https://li.quest/v2/analytics/transfers';
  private readonly INTEGRATOR = 'blackhole';
  private readonly LIFI_LAST_CURSOR_KEY = 'lifi_last_cursor';

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly transactionStateRepository: TransactionStateRepository,
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
    
    // Получаем или создаем состояние пагинации
    const paginationState = await this.transactionStateRepository.getOrCreate(
      this.LIFI_LAST_CURSOR_KEY,
      '', // Пустое значение по умолчанию
      'Last processed LI.FI pagination cursor (next parameter)'
    );
    
    if (paginationState.value) {
      // Если есть курсор пагинации, продолжаем с него
      url.searchParams.append('next', paginationState.value);
      this.logger.log(`Fetching transfers with pagination cursor: ${paginationState.value}`);
    } else {
      // Если курсор пустой, получаем данные за последние 720 дней
      const fromTimestamp = Math.floor((Date.now() - 720 * 24 * 60 * 60 * 1000) / 1000); // 720 дней назад
      url.searchParams.append('fromTimestamp', fromTimestamp.toString());
      this.logger.log(`No pagination cursor found, fetching transfers from ${fromTimestamp} (${new Date(fromTimestamp * 1000).toISOString()})`);
    }
    
    const allTransfers: LifiTransfer[] = [];
    let currentPaginationCursor = paginationState.value;
    let requestCount = 0;
    const maxRequests = 50; // Защита от бесконечного цикла
    let lastNextCursor: string | undefined; // Сохраняем последний next курсор из ответа
    
    while (requestCount < maxRequests) {
      if (currentPaginationCursor) {
        url.searchParams.set('next', currentPaginationCursor);
      }
      
      this.logger.log(`Request ${requestCount + 1}: Fetching transfers with URL: ${url.toString()}`);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`LI.FI API error: ${response.status} ${response.statusText}`);
      }

      const data: LifiResponse = await response.json();
      const transfers = data.data || [];
      
      this.logger.log(`Fetched ${transfers.length} transfers in request ${requestCount + 1}`);
      this.logger.log(`Response hasNext: ${data.hasNext}, next cursor: ${data.next || 'none'}`);
      
      if (transfers.length === 0) {
        this.logger.log('No more transfers found');
        break;
      }
      
      // Фильтруем только успешные транзакции
      const successfulTransfers = transfers.filter(transfer => transfer.status === 'DONE');
      allTransfers.push(...successfulTransfers);
      
      this.logger.log(`Added ${successfulTransfers.length} successful transfers (filtered from ${transfers.length} total)`);
      
      // Проверяем пагинацию согласно документации API
      if (!data.hasNext || !data.next) {
        this.logger.log('No more pages available (hasNext: false or no next cursor)');
        // Сохраняем текущий курсор перед выходом
        if (currentPaginationCursor) {
          lastNextCursor = currentPaginationCursor;
        }
        break;
      }
      
      // Сохраняем next курсор из ответа API для следующего запроса
      currentPaginationCursor = data.next;
      lastNextCursor = data.next; // Сохраняем для обновления состояния
      this.logger.log(`Next pagination cursor from API response: ${currentPaginationCursor}`);
      
      requestCount++;
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (requestCount >= maxRequests) {
      this.logger.warn(`Reached maximum request limit (${maxRequests}). There might be more data available.`);
    }

    this.logger.log(`Total transfers fetched: ${allTransfers.length} in ${requestCount} requests`);
    this.logger.log(`Final pagination cursor for next run: ${lastNextCursor || 'none'}`);
    
    // Обновляем состояние пагинации с последним полученным курсором
    if (lastNextCursor) {
      await this.updateLastProcessedCursor(lastNextCursor);
    }
    
    return allTransfers;
  }

  private async updateLastProcessedCursor(cursor: string): Promise<void> {
    try {
      await this.transactionStateRepository.updateByKey(this.LIFI_LAST_CURSOR_KEY, {
        value: cursor
      });
      this.logger.log(`Updated pagination cursor to: ${cursor}`);
    } catch (error) {
      this.logger.error('Error updating pagination cursor:', error);
    }
  }

  private async processTransfers(transfers: LifiTransfer[]): Promise<void> {
    if (transfers.length === 0) {
      this.logger.log('No transfers to process');
      return;
    }

    this.logger.log(`Processing ${transfers.length} transfers...`);

    for (const transfer of transfers) {
      this.logger.debug(`Processing transfer: ${transfer.transactionId}`);
      
      // Обрабатываем sending транзакцию
      await this.processTransferTransaction(
        transfer.sending,
        transfer.fromAddress,
        'send',
        transfer.transactionId
      );
      
      // Обрабатываем receiving транзакцию
      // await this.processTransferTransaction(
      //   transfer.receiving,
      //   transfer.toAddress,
      //   'receive',
      //   transfer.transactionId
      // );
      
      this.logger.debug(`Processed transfer: ${transfer.transactionId}`);
    }
    
    this.logger.log(`Successfully processed ${transfers.length} transfers`);
  }

  private async processTransferTransaction(
    txData: LifiTransactionData,
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