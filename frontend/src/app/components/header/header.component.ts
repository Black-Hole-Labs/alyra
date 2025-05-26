import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../services/popup.service';
import { Subscription } from 'rxjs';
import {
  Component,
  ElementRef,
  Renderer2,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  computed,
  signal,
  effect,
} from '@angular/core';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { NetworkId, Wallets } from '../../models/wallet-provider.interface';
import { WalletBalanceService } from '../../services/wallet-balance.service';

import providers from '@public/data/providers.json';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './header.component.adaptives.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  //@Input() isPopupVisible: boolean = false;
  //@Input() isNetworkPopupVisible: boolean = false;
  //@Input() selectedNetwork: string = 'ethereum';
  //@Input() selectedNetwork: { id: string; name: string; icon: string; } | null = null;
  gmCount: number | null = null;
  popupMessage: string = ''; // Сообщение для мини-попапа
  showPopup: boolean = false; // Управление отображением мини-попапа
  private readonly GM_COUNT_KEY = 'gmCount';
  private readonly LAST_GM_TIME_KEY = 'lastGmTime';
  showBlackholeMenu = false;
  showConnectWalletPopup = false;
  showWalletPopup = false;
  //walletName: string = 'Connect Wallet';
  walletName = computed(() => this.blockchainStateService.walletAddress() ?? 'Connect Wallet');
  private subscription: Subscription;
  private providers: Wallets[] = [];
  walletIcon = signal<string>('/img/header/wallet.png');
  nativeBalance = signal<string>('0');

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleNetwork = new EventEmitter<void>();

  private menuItems: { element: HTMLElement; originalText: string }[] = [];
  private possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|';
  private glitchChars = '!@#$%^&*()_+{}:"<>?|\\';
  private cyberChars = '01010101110010101010101110101010';
  private animationFrames = 20;
  private animationSpeed = 20;
  private animationTimeouts: { [key: string]: number } = {};

  NetworkId = NetworkId;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    public blockchainStateService: BlockchainStateService,
    public popupService: PopupService,
    public walletBalanceService: WalletBalanceService
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
          this.updateWalletIcon();
        } else {
          this.updateWalletIcon();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const network = this.blockchainStateService.network();
        const address = this.blockchainStateService.walletAddress();
        if (network && address) {
          this.loadNativeBalance();
        } else {
          this.nativeBalance.set('0');
        }
      },
      { allowSignalWrites: true },
    );
  }

  selectedNetwork = computed(() => {
    const networks = this.blockchainStateService.network();
    return networks;
  });

  ngOnInit() {
    this.loadGmCount();
    this.loadProviders();

    setTimeout(() => {
      this.initTextAnimation();
    }, 0);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    Object.values(this.animationTimeouts).forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
  }

  loadGmCount() {
    const savedCount = localStorage.getItem(this.GM_COUNT_KEY);
    const lastGmTime = localStorage.getItem(this.LAST_GM_TIME_KEY);

    if (savedCount && lastGmTime) {
      const now = new Date().getTime();
      const timeDiff = now - parseInt(lastGmTime);
      if (timeDiff > 172800000) {
        localStorage.removeItem(this.GM_COUNT_KEY);
        localStorage.removeItem(this.LAST_GM_TIME_KEY);
        this.gmCount = null;
      } else {
        this.gmCount = parseInt(savedCount);
      }
    }
  }

  togglePopup(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const currentPopup = this.popupService.getCurrentPopup();
    if (currentPopup === 'blackholeMenu') {
      this.popupService.closeAllPopups();
    } else {
      this.popupService.openPopup('blackholeMenu');
    }
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
    const lastClickTime = localStorage.getItem('lastGmClick');
    const now = new Date();

    if (lastClickTime) {
      const lastClickDate = new Date(lastClickTime);
      const nextAllowedClick = new Date(lastClickDate);
      nextAllowedClick.setUTCDate(lastClickDate.getUTCDate() + 1);

      if (now < nextAllowedClick) {
        const timeLeft = this.calculateTimeLeft(nextAllowedClick, now);
        this.showPopupWithMessage(`Next GM in ${timeLeft}`);
        return;
      }
    }

    this.gmCount = (this.gmCount ?? 0) + 1;
    localStorage.setItem('lastGmClick', now.toISOString());
    this.triggerFireworks();
  }

  calculateTimeLeft(nextAllowed: Date, current: Date): string {
    const diff = nextAllowed.getTime() - current.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
      this.popupService.openPopup('connectWallet');
    }
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

  private initTextAnimation(): void {
    const menuLinks = this.elRef.nativeElement.querySelectorAll('nav a');

    menuLinks.forEach((link: HTMLElement) => {
      const originalText = link.textContent || '';
      this.menuItems.push({ element: link, originalText });

      this.renderer.listen(link, 'mouseenter', () => {
        this.animateText(link, originalText);
      });

      this.renderer.listen(link, 'mouseleave', () => {
        link.textContent = originalText;
      });
    });
  }

  private animateText(element: HTMLElement, finalText: string): void {
    const elementId = element.getAttribute('data-animation-id') || Math.random().toString(36).substring(2, 9);
    element.setAttribute('data-animation-id', elementId);

    if (this.animationTimeouts[elementId]) {
      clearTimeout(this.animationTimeouts[elementId]);
    }

    let frame = 0;
    const totalFrames = this.animationFrames;

    const glitchStates = Array(finalText.length).fill(false);
    const resolvedChars = Array(finalText.length).fill(false);

    const animate = () => {
      if (frame >= totalFrames) {
        element.textContent = finalText;
        delete this.animationTimeouts[elementId];
        return;
      }

      let result = '';
      const progress = frame / totalFrames;

      const resolvedCount = Math.floor(finalText.length * Math.pow(progress, 0.8));

      for (let i = 0; i < resolvedCount; i++) {
        if (!resolvedChars[i]) {
          resolvedChars[i] = true;
        }
      }

      if (frame % 3 === 0) {
        for (let i = 0; i < finalText.length; i++) {
          if (Math.random() < 0.1) {
            glitchStates[i] = !glitchStates[i];
          }
        }
      }

      for (let i = 0; i < finalText.length; i++) {
        if (resolvedChars[i]) {
          if (glitchStates[i] && frame < totalFrames * 0.9 && finalText[i] !== ' ') {
            if (Math.random() < 0.3) {
              const cyberIndex = Math.floor(Math.random() * this.cyberChars.length);
              result += this.cyberChars[cyberIndex];
            } else {
              const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
              result += this.glitchChars[glitchIndex];
            }
          } else {
            result += finalText[i];
          }
        } else {
          if (finalText[i] === ' ') {
            result += ' ';
          } else {
            const rand = Math.random();
            if (rand < 0.2) {
              const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
              result += this.glitchChars[glitchIndex];
            } else if (rand < 0.4) {
              const cyberIndex = Math.floor(Math.random() * this.cyberChars.length);
              result += this.cyberChars[cyberIndex];
            } else {
              const randomIndex = Math.floor(Math.random() * this.possibleChars.length);
              result += this.possibleChars[randomIndex];
            }
          }
        }
      }

      element.textContent = result;
      frame++;

      this.animationTimeouts[elementId] = window.setTimeout(animate, this.animationSpeed);
    };

    animate();
  }

  loadProviders() {
    this.providers = providers;
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
    const network = this.blockchainStateService.network();
    const address = this.blockchainStateService.walletAddress();
    if (!network || !address) {
      this.nativeBalance.set('0');
      return;
    }
    try {
      const nativeToken = {
        symbol: network.nativeCurrency.symbol,
        imageUrl: '',
        contractAddress: network.chainType === 'SVM' ? address : '0x0000000000000000000000000000000000000000',
        chainId: network.id,
        decimals: network.nativeCurrency.decimals,
      };
      const balance = await this.walletBalanceService.getBalanceForToken(nativeToken);
      this.nativeBalance.set(this.truncateTo6Decimals(parseFloat(balance)));
    } catch (e) {
      this.nativeBalance.set('0');
    }
  }

  truncateTo6Decimals(value: number): string {
    return (Math.trunc(value * 1e6) / 1e6).toString();
  }
}
