import { CommonModule } from '@angular/common';
import { Component, computed, effect, OnDestroy, OnInit, signal } from '@angular/core';

import { RewardFailedNotificationComponent } from '../../components/notification/reward-failed-notification/reward-failed-notification.component';
import { RewardPendingNotificationComponent } from '../../components/notification/reward-pending-notification/reward-pending-notification.component';
import { RewardSuccessNotificationComponent } from '../../components/notification/reward-success-notification/reward-success-notification.component';
import { ProviderType } from '../../models/wallet-provider.interface';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { ReferralService } from '../../services/referral.service';
import { RewardsService } from '../../services/rewards.service';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [
    CommonModule,
    RewardSuccessNotificationComponent,
    RewardFailedNotificationComponent,
    RewardPendingNotificationComponent
  ],
  templateUrl: './rewards.component.html',
  styleUrls: [
    './rewards.component.scss',
    './rewards.component.adaptives.scss'
  ]
})
export class RewardsComponent implements OnInit, OnDestroy {
  // Сигналы для UI
  readonly isLoading = signal<boolean>(false);
  readonly showReferralInfo = signal<boolean>(false);
  readonly referralLink = signal<string>('');
  readonly copySuccess = signal<boolean>(false);

  // Флаги для предотвращения повторных инициализаций
  private isInitializingReferral = false;
  private isInitializingRewards = false;
  private lastInitializedAddress = '';

  // Computed значения
  readonly isConnected = signal<boolean>(false);//computed(() => this.blockchainStateService.connected());
  readonly walletAddress = computed(() => this.blockchainStateService.getCurrentWalletAddress());
  readonly networkName = computed(() => this.blockchainStateService.networkSell()?.name || 'ethereum');
  readonly chainId = computed(() => this.blockchainStateService.networkSell()?.id || 1);

  readonly isReferral = computed(() => this.referralService.isReferral());
  readonly hasJoined = computed(() => this.referralService.hasJoined());

  readonly referralInfo = computed(() => this.referralService.referralInfo());
  readonly referralStats = computed(() => this.referralService.referralStats());

  constructor(
    public blockchainStateService: BlockchainStateService,
    public referralService: ReferralService,
    public rewardsService: RewardsService,
    private transactionsService: TransactionsService
  ) {
    // Эффект для инициализации реферальной системы при подключении кошелька
    effect(() => {
      const address = this.walletAddress();
      const isConnected = this.isConnected();

      if (isConnected && address && address !== this.lastInitializedAddress) {
        this.lastInitializedAddress = address;
        this.initializeReferralSystem(address);
        this.initializeRewards(address);
      } else if (!isConnected) {
        this.referralService.clearReferralData();
        this.rewardsService.rewards.set([]);
        this.lastInitializedAddress = '';
      }
    }, { allowSignalWrites: true });

    // Эффект для обновления реферальной ссылки
    effect(() => {
      const info = this.referralInfo();
      if (info) {
        this.referralLink.set(this.referralService.getReferralLink());
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Проверяем реферальный код в URL при загрузке страницы
    this.referralService.setReferralCodeFromUrl();
  }

  ngOnDestroy() {
    // Очистка при уничтожении компонента
  }

  // Инициализация реферальной системы
  private async initializeReferralSystem(address: string): Promise<void> {
    if (this.isInitializingReferral) {
      console.log('[QuestsComponent] Referral system initialization already in progress, skipping...');
      return;
    }

    this.isInitializingReferral = true;
    this.isLoading.set(true);
    try {
      const chainId = this.chainId();
      const referralCodeFromUrl = this.referralService.getReferralCodeFromUrl();
      const referralCodeFromStorage = this.referralService.getReferralCodeFromStorage();
      const existingReferralCode = referralCodeFromUrl || referralCodeFromStorage;

      // Пробуем получить referralInfo из сервиса или с бэка
      let info = this.referralService.referralInfo();
      if (!info) {
        info = await this.referralService.getReferralInfo(address, chainId);
      }
      const isReferral = !!info;
      const isOwnCode = info && existingReferralCode && info.referrerCode === existingReferralCode;

      if (referralCodeFromUrl && !isOwnCode) {
        // Присоединяемся к чужому рефералу
        await this.referralService.joinReferral(address, chainId);
        this.showSuccessMessage('Successfully joined referral program!');
        // После присоединения пробуем получить/создать свой код
        let ownInfo = await this.referralService.getReferralInfo(address, chainId);
        if (!ownInfo) {
          ownInfo = await this.referralService.registerReferral(address, chainId);
        }
        if (ownInfo) {
          console.log('[QuestsComponent] Getting stats for code:', ownInfo.referrerCode);
          await this.referralService.getReferralStatsByCode(ownInfo.referrerCode);
        }
        this.showReferralInfo.set(true);
      } else if (existingReferralCode) {
        if (!isReferral) {
          // Только если адрес еще не зарегистрирован — регистрируем
          info = await this.referralService.registerReferralWithCode(existingReferralCode, address, chainId);
        }
        if (info) {
          console.log('[QuestsComponent] Getting stats for code (existingReferralCode):', info.referrerCode);
          await this.referralService.getReferralStatsByCode(info.referrerCode);
        }
        this.showReferralInfo.set(true);
      } else {
        if (!isReferral) {
          // Только если адрес еще не зарегистрирован — регистрируем
          info = await this.referralService.registerReferral(address, chainId);
        }
        if (info) {
          console.log('[QuestsComponent] Getting stats for code (new registration):', info.referrerCode);
          await this.referralService.getReferralStatsByCode(info.referrerCode);
        }
        this.showReferralInfo.set(true);
      }
    } catch (error) {
      console.error('Error initializing referral system:', error);
      this.showErrorMessage('Failed to initialize referral system');
    } finally {
      this.isLoading.set(false);
      this.isInitializingReferral = false;
    }
  }

  // Копирование реферальной ссылки
  async copyReferralLink(): Promise<void> {
    try {
      const success = await this.referralService.copyReferralLink();
      if (success) {
        this.copySuccess.set(true);
        setTimeout(() => this.copySuccess.set(false), 2000);
        this.showSuccessMessage('Referral link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error copying referral link:', error);
      this.showErrorMessage('Failed to copy referral link');
    }
  }

  // Получение статистики реферала
  async refreshReferralStats(): Promise<void> {
    const info = this.referralInfo();
    if (!info) return;

    try {
      console.log('[QuestsComponent] Refreshing stats for code:', info.referrerCode);
      await this.referralService.forceGetReferralStatsByCode(info.referrerCode);
    } catch (error) {
      console.error('Error refreshing referral stats:', error);
    }
  }

  // Форматирование адреса для отображения
  formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Форматирование суммы
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Форматирование суммы ревардов
  formatRewardAmount(amount: number, decimals: number = 18): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount / Math.pow(10, decimals));
  }

  // Показ сообщения об успехе
  private showSuccessMessage(message: string): void {
    // Здесь можно добавить toast уведомление
    console.log('Success:', message);
  }

  // Показ сообщения об ошибке
  private showErrorMessage(message: string): void {
    // Здесь можно добавить toast уведомление
    console.error('Error:', message);
  }

  // Получение реферального кода для отображения
  getDisplayReferralCode(): string {
    const info = this.referralInfo();
    return info?.referrerCode || 'Not available';
  }

  // Получение общего объема торговли
  getTotalVolume(): string {
    const stats = this.referralStats();
    return stats ? this.formatAmount(stats.totalVolume) : '$0.00';
  }

  getTotalVolumeReferred(): string {
    const stats = this.referralStats();
    return stats ? this.formatAmount(stats.totalVolumeReferred) : '$0.00';
  }

  // Получение общего количества рефералов
  getTotalReferrals(): number {
    const stats = this.referralStats();
    return stats?.totalReferrals || 0;
  }

  // Получение общей комиссии (уже склеймленные награды)
  getTotalCommissions(): string {
    return this.formatAmount(this.totalClaimedAmount());
  }

  // Получение ожидающей комиссии (всегда 0, так как убираем логику pending)
  getPendingCommissions(): string {
    return '$0.00';
  }

  // Инициализация ревардов
  private async initializeRewards(address: string): Promise<void> {
    if (this.isInitializingRewards) {
      console.log('[QuestsComponent] Rewards initialization already in progress, skipping...');
      return;
    }

    this.isInitializingRewards = true;
    try {
      // Загружаем реварды пользователя
      await this.rewardsService.loadRewards(address);
    } catch (error) {
      console.error('Error initializing rewards:', error);
    } finally {
      this.isInitializingRewards = false;
    }
  }

  // Computed значения для ревардов
  readonly claimableRewards = computed(() => this.rewardsService.getClaimableRewards());
  readonly totalClaimableAmount = computed(() => this.rewardsService.getClaimableAmount());
  readonly hasClaimableRewards = computed(() => this.rewardsService.getClaimableRewards().length > 0);

  // Computed значение для уже склеймленных наград
  readonly totalClaimedAmount = computed(() => this.rewardsService.getClaimedRewards());

  // Сигналы для UI ревардов
  readonly isClaimingRewards = signal<boolean>(false);
  readonly showRewardSuccess = signal<boolean>(false);
  readonly showRewardError = signal<boolean>(false);
  readonly showRewardPending = signal<boolean>(false);
  readonly rewardErrorMessage = signal<string>('');
  readonly rewardTransactionHash = signal<string>('');

  // Клейм всех доступных ревардов
  async claimAllRewards(): Promise<void> {
    this.isClaimingRewards.set(true);
    try {
      const address = this.walletAddress();
      if (!address) {
        this.rewardErrorMessage.set('Wallet not connected');
        this.showRewardError.set(true);
        return;
      }

      // Получаем информацию о ревард пулах для определения нужной сети
      const rewardPools = await this.rewardsService.getRewardPools();
      if (rewardPools.length === 0) {
        this.rewardErrorMessage.set('No reward pools available');
        this.showRewardError.set(true);
        return;
      }

        // Берем первый ревард пул (предполагаем, что все реварды в одной сети)
       const rewardPool = rewardPools[0];
       const requiredChainId = Number(rewardPool.rewardToken.chainId);
       const currentChainId = this.blockchainStateService.networkSell()?.id;


       // Проверяем, нужно ли переключить сеть
      if (!currentChainId || currentChainId !== requiredChainId) {

         console.log(`Switching network from ${currentChainId || 'undefined'} to ${requiredChainId} for reward claim`);

        // Получаем информацию о нужной сети
        const targetNetwork = this.blockchainStateService.allNetworks().find(n => n.id === requiredChainId);
        if (!targetNetwork) {
          this.rewardErrorMessage.set(`Network with chainId ${requiredChainId} not found`);
          this.showRewardError.set(true);
          return;
        }

        // Проверяем, подключен ли кошелек к нужной экосистеме
        if (!this.blockchainStateService.isEcosystemConnected(targetNetwork.chainType as any)) {
          this.rewardErrorMessage.set(`Wallet not connected to ${targetNetwork.chainType} ecosystem`);
          this.showRewardError.set(true);
          return;
        }

        // Получаем провайдер
        const providerId = this.blockchainStateService.getCurrentProviderId();
        if (!providerId) {
          this.rewardErrorMessage.set('No provider selected');
          this.showRewardError.set(true);
          return;
        }

        const providerType = this.blockchainStateService.getType(providerId);
        const provider = this.blockchainStateService.getProvider(providerId);

        // Проверяем совместимость провайдера с сетью
        if (providerType !== ProviderType.MULTICHAIN && providerType !== targetNetwork.chainType) {
          this.rewardErrorMessage.set(`Selected wallet doesn't support ${targetNetwork.chainType} networks`);
          this.showRewardError.set(true);
          return;
        }

        try {
          // Обновляем сеть в состоянии
          this.blockchainStateService.updateNetworkSell(requiredChainId);
          // Переключаем сеть в кошельке
          await provider.switchNetwork(targetNetwork);

          // Обновляем адрес кошелька
          this.blockchainStateService.updateWalletAddress(provider.address);

          console.log(`Successfully switched to network ${targetNetwork.name} (${requiredChainId})`);
        } catch (error) {
          console.error('Error switching network:', error);
          if ((error as any).message.includes("User rejected the request") || (error as any).code === 4001) {
            this.rewardErrorMessage.set('Network switch was rejected by user');
          } else if ((error as any).message === 'unsupported_network') {
            this.rewardErrorMessage.set(`Network ${targetNetwork.name} is not supported by your wallet`);
          } else {
            this.rewardErrorMessage.set(`Failed to switch network: ${(error as Error).message}`);
          }
          this.showRewardError.set(true);
          return;
        }
      }

      const provider = this.blockchainStateService.getCurrentProvider().provider;
      const transactionHashes = await this.rewardsService.claimAllRewards(address, provider);

      if (transactionHashes.length > 0) {
        // Показываем pending уведомление для первой транзакции
        this.rewardTransactionHash.set(transactionHashes[0]);
        this.showRewardPending.set(true);

        // Пулим статус транзакции
        await this.pollTransactionStatus(transactionHashes[0]);

        // Принудительно обновляем реварды после завершения
        await this.rewardsService.forceLoadRewards(address);
      } else {
        this.rewardErrorMessage.set('No rewards were claimed');
        this.showRewardError.set(true);
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
      this.rewardErrorMessage.set('Failed to claim rewards: ' + (error as Error).message);
      this.showRewardError.set(true);
    } finally {
      this.isClaimingRewards.set(false);
    }
  }

  private async pollTransactionStatus(txHash: string): Promise<void> {
    try {
      // Получаем текущую сеть для определения RPC URL
      const currentNetwork = this.blockchainStateService.networkSell();
      if (!currentNetwork) {
        throw new Error('No current network found');
      }

      // Получаем рабочий RPC URL для сети
      const rpcUrl = await this.blockchainStateService.getWorkingRpcUrlForNetwork(currentNetwork.id);

      // Используем TransactionsService для пулинга
      const result = await this.transactionsService.pollTransactionReceipt(txHash, rpcUrl);

      if (result.success) {
        // Транзакция успешна
        this.showRewardPending.set(false);
        this.showRewardSuccess.set(true);
        console.log('Transaction successful:', txHash);
      } else {
        // Транзакция провалилась или таймаут
        this.showRewardPending.set(false);
        this.showRewardError.set(true);
        this.rewardErrorMessage.set(result.error || 'Transaction failed');
        console.log('Transaction failed:', txHash, result.error);
      }
    } catch (error) {
      console.error('Error polling transaction status:', error);
      this.showRewardPending.set(false);
      this.showRewardError.set(true);
      this.rewardErrorMessage.set('Error checking transaction status');
    }
  }



  // Закрытие уведомлений
  closeRewardSuccessNotification(): void {
    this.showRewardSuccess.set(false);
  }

  closeRewardErrorNotification(): void {
    this.showRewardError.set(false);
  }

  closeRewardPendingNotification(): void {
    this.showRewardPending.set(false);
  }
}
