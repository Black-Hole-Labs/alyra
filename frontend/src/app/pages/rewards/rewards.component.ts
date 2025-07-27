import { Component, OnInit, OnDestroy, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { ReferralService, ReferralInfo, ReferralStats } from '../../services/referral.service';
import { RewardsService } from '../../services/rewards.service';
import { ethers } from 'ethers';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule],
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
  readonly isConnected = computed(() => this.blockchainStateService.connected());
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
    public rewardsService: RewardsService
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

  // Получение общего количества рефералов
  getTotalReferrals(): number {
    const stats = this.referralStats();
    return stats?.totalReferrals || 0;
  }

  // Получение общей комиссии
  getTotalCommissions(): string {
    const stats = this.referralStats();
    return stats ? this.formatAmount(stats.totalCommissions) : '$0.00';
  }

  // Получение ожидающей комиссии
  getPendingCommissions(): string {
    const stats = this.referralStats();
    return stats ? this.formatAmount(stats.pendingCommissions) : '$0.00';
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

  // Сигналы для UI ревардов
  readonly isClaimingRewards = signal<boolean>(false);
  readonly showRewardSuccess = signal<boolean>(false);
  readonly showRewardError = signal<boolean>(false);
  readonly rewardErrorMessage = signal<string>('');

  // Клейм всех доступных ревардов
  async claimAllRewards(): Promise<void> {
    this.isClaimingRewards.set(true);
    try {
      const address = this.walletAddress();
      if (!address) {
        this.showRewardErrorMessage('Wallet not connected');
        return;
      }
      
      const provider = this.blockchainStateService.getCurrentProvider().provider;
      const transactionHashes = await this.rewardsService.claimAllRewards(address, provider);
      
      if (transactionHashes.length > 0) {
        this.showRewardSuccessMessage();
        console.log('Successfully claimed rewards! Transaction hashes:', transactionHashes);
        // Принудительно обновляем реварды после успешного клейма
        await this.rewardsService.forceLoadRewards(address);
      } else {
        this.showRewardErrorMessage('No rewards were claimed');
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
      this.showRewardErrorMessage('Failed to claim rewards: ' + (error as Error).message);
    } finally {
      this.isClaimingRewards.set(false);
    }
  }

  // Показ сообщения об успехе клейма
  private showRewardSuccessMessage(): void {
    this.showRewardSuccess.set(true);
    setTimeout(() => this.showRewardSuccess.set(false), 3000);
  }

  // Показ сообщения об ошибке клейма
  private showRewardErrorMessage(message: string): void {
    this.rewardErrorMessage.set(message);
    this.showRewardError.set(true);
    setTimeout(() => this.showRewardError.set(false), 5000);
  }
}