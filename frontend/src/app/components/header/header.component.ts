import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { NetworkId, Wallets } from '../../models/wallet-provider.interface';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { MouseGradientService } from '../../services/mouse-gradient.service';
import { PopupService } from '../../services/popup.service';
import { WalletBalanceService } from '../../services/wallet-balance.service';
import { GmCounterService } from './gm-counter.service';
import { TextScrambleDirective } from './text-scramble.directive';

// import providers from '@public/data/providers.json';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, TextScrambleDirective, NgOptimizedImage],
  providers: [GmCounterService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './header.component.adaptives.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  //@Input() isPopupVisible: boolean = false;
  //@Input() isNetworkPopupVisible: boolean = false;
  //@Input() selectedNetwork: string = 'ethereum';
  //@Input() selectedNetwork: { id: string; name: string; icon: string; } | null = null;
  gmCount: number | null = null;
  popupMessage: string = '';
  showPopup: boolean = false;
  showBlackholeMenu = false;
  showConnectWalletPopup = false;
  showWalletPopup = false;
  //walletName: string = 'Connect Wallet';
  walletName = computed(
    () => this.blockchainStateService.getCurrentWalletAddress() ?? 'Connect Wallet',
  );
  currentWalletIcon = computed(() => {
    if (!this.blockchainStateService.connected()) {
      return '';
    }
    const providerId = this.blockchainStateService.getCurrentProviderId();
    const provider = this.providers.find((p) => p.id === providerId);
    return provider?.iconUrl ?? '/img/header/wallet.png';
  });
  private readonly subscription: Subscription;
  private providers: Wallets[] = [];
  walletIcon = signal<string>('/img/header/wallet.png');
  nativeBalance = signal<string>('0');

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleNetwork = new EventEmitter<void>();

  private menuItems: { element: HTMLElement; originalText: string }[] = [];

  private animationTimeouts: { [key: string]: number } = {};
  private menuCloseTimer: number | null = null;
  private isMenuClickedOpen: boolean = false;

  NetworkId = NetworkId;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    public blockchainStateService: BlockchainStateService,
    public popupService: PopupService,
    public walletBalanceService: WalletBalanceService,
    private mouseGradientService: MouseGradientService,
    private gm: GmCounterService,
  ) {
    this.subscription = this.popupService.activePopup$.subscribe((popupType) => {
      this.showBlackholeMenu = false;
      this.showConnectWalletPopup = false;
      this.showWalletPopup = false;

      switch (popupType) {
        case 'blackholeMenu':
          this.showBlackholeMenu = true;
          break;
        case 'connectWallet':
          this.showConnectWalletPopup = true;
          break;
        case 'wallet':
          this.showWalletPopup = true;
          break;
      }
    });

    effect(
      () => {
        const isConnected = this.blockchainStateService.connected();
        if (!isConnected) {
          this.walletIcon.set('/img/header/wallet.png');
          return;
        }

        if (this.providers.length === 0) {
          this.loadProviders();
        }
        this.updateWalletIcon();
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        this.blockchainStateService.networkSell();
        //this.blockchainStateService.walletAddress();
        this.loadNativeBalance();
      },
      { allowSignalWrites: true },
    );
  }

  // selectedNetwork = computed(() => {
  //   const networks = this.blockchainStateService.networkSell();
  //   return networks;
  // });

  ngOnInit() {
    this.gmCount = this.gm.loadGmCount();
    this.loadProviders();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Очищаем таймер закрытия меню
    if (this.menuCloseTimer) {
      clearTimeout(this.menuCloseTimer);
    }

    Object.values(this.animationTimeouts).forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
  }

  togglePopup(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.popupService.onMenuClick();
  }

  onMenuMouseEnter(): void {
    this.popupService.onMenuMouseEnter();
  }

  onMenuMouseLeave(): void {
    this.popupService.onMenuMouseLeave();
  }

  onPopupMouseEnter(): void {
    this.popupService.onPopupMouseEnter();
  }

  onPopupMouseLeave(): void {
    this.popupService.onPopupMouseLeave();
  }

  get isNetworkPopupVisible(): boolean {
    return this.popupService.getCurrentPopup() === 'networkPopup';
  }

  toggleNetworkPopup(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const currentPopup = this.popupService.getCurrentPopup();
    if (currentPopup === 'networkPopup') {
      this.popupService.closeAllPopups();
    } else {
      this.popupService.openPopup('networkPopup');
    }
  }

  incrementGmCount() {
    const res = this.gm.tryIncrement();
    if (!res.ok) {
      this.showPopupWithMessage(`Next GM in ${res.timeLeft}`);
      return;
    }
    this.gmCount = (this.gmCount ?? 0) + 1;
    this.triggerFireworks();
  }

  showPopupWithMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 5000);
  }

  triggerFireworks() {
    const gmElement = this.elRef.nativeElement.querySelector('.gm');
    const container = this.elRef.nativeElement.querySelector('.fireworks-container');

    const gmRect = gmElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const centerX = gmRect.left + gmRect.width / 2 - containerRect.left;
    const centerY = gmRect.top + gmRect.height / 2 - containerRect.top;

    for (let i = 0; i < 20; i++) {
      const spark = this.renderer.createElement('div');
      this.renderer.addClass(spark, 'spark');
      this.renderer.appendChild(container, spark);

      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 100 + 50;
      const duration = Math.random() * 800 + 500;

      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      this.renderer.setStyle(spark, 'background-color', '');
      this.renderer.setStyle(spark, 'background-image', 'url("/img/animation/ufo.png")');
      this.renderer.setStyle(spark, 'background-size', 'contain');
      this.renderer.setStyle(spark, 'border-radius', '0');
      this.renderer.setStyle(spark, 'box-shadow', 'none');

      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentX = centerX + targetX * progress;
        const currentY = centerY + targetY * progress;

        this.renderer.setStyle(spark, 'left', `${currentX}px`);
        this.renderer.setStyle(spark, 'top', `${currentY}px`);
        this.renderer.setStyle(spark, 'opacity', `${1 - progress}`);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.renderer.removeChild(container, spark);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  openConnectWalletPopup(): void {
    if (this.blockchainStateService.connected()) {
      this.popupService.openPopup('wallet');
    } else {
      this.blockchainStateService.clearEcosystemForPopup();
      this.popupService.openPopup('connectWallet');
    }
  }

  onWalletMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }

  closeAllPopups(): void {
    this.popupService.closeAllPopups();
  }

  get isPopupVisible(): boolean {
    return this.popupService.getCurrentPopup() === 'blackholeMenu';
  }

  openNetwork(): void {
    this.popupService.openPopup('network');
  }

  openSettings(): void {
    this.popupService.openPopup('settings');
  }

  async loadProviders() {
    this.providers = await this.blockchainStateService.loadProviders();
    return this.updateWalletIcon();
  }

  updateWalletIcon(): void {
    const providerId = this.blockchainStateService.getCurrentProviderId();
    if (!providerId || !this.blockchainStateService.connected()) {
      this.walletIcon.set('/img/header/wallet.png');
      return;
    }

    const provider = this.providers.find((p) => p.id === providerId);
    if (provider?.iconUrl) {
      this.walletIcon.set(provider.iconUrl);
    } else {
      this.walletIcon.set('/img/header/wallet.png');
    }
  }

  async loadNativeBalance() {
    const network = this.blockchainStateService.networkSell();
    const address = this.blockchainStateService.getCurrentWalletAddress();
    if (!network || !address) {
      this.nativeBalance.set('0');
      return;
    }
    try {
      const nativeToken = {
        symbol: network.nativeCurrency.symbol,
        imageUrl: '',
        contractAddress:
          network.chainType === 'SVM' ? address : '0x0000000000000000000000000000000000000000',
        chainId: network.id,
        decimals: network.nativeCurrency.decimals,
      };
      const balance = await this.walletBalanceService.getBalanceForToken(nativeToken);
      this.nativeBalance.set(this.truncateTo6Decimals(parseFloat(balance)));
    } catch {
      this.nativeBalance.set('0');
    }
  }

  truncateTo6Decimals(value: number): string {
    return (Math.trunc(value * 1e6) / 1e6).toString();
  }
}
