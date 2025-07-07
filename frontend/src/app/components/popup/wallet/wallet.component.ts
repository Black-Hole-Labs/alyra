import { Component, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../../services/popup.service';
import { BlockchainStateService, Ecosystem } from '../../../services/blockchain-state.service';
import { MouseGradientService } from '../../../services/mouse-gradient.service';
import { ProviderType, Wallets } from '../../../models/wallet-provider.interface';

interface Token {
  name: string;
  balance: string;
  usdBalance: number;
  usdChange: string;
  percentChange: string;
  image: string;
}

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet.component.html',
  styleUrls: [
		'./wallet.component.scss',
		'./wallet.component.adaptives.scss'
	],
})
export class WalletComponent {
  @Output() close = new EventEmitter<void>();
  @Output() disconnect = new EventEmitter<void>();
  walletName = signal<string>('');
  walletIcon = signal<string>('/img/wallet-icns/profile.png');
  private providers: Wallets[] = [];
  copiedAddresses = signal<Set<string>>(new Set<string>());
  
  tokens: Token[] = [
    {
      name: 'Ethereum',
      balance: '0.1346 $ETH',
      usdBalance: 450.45,
      usdChange: '-$1.4',
      percentChange: '(-0.34%)',
      image: '/img/trade/eth.png'
    },
    {
      name: 'Arbitrum',
      balance: '20.324 $ARB',
      usdBalance: 1130.12,
      usdChange: '-$20.1',
      percentChange: '(-1.28%)',
      image: '/img/trade/arbitrum.png'
    },
  ];

  constructor(
    public blockchainStateService: BlockchainStateService, 
    private popupService: PopupService,
    private mouseGradientService: MouseGradientService
  ) {
    this.walletName.set(this.blockchainStateService.getCurrentWalletAddress()!);
    this.loadProviders();

    effect(
      () => {
        const isConnected = this.blockchainStateService.connected();
        if (!isConnected) {
          this.walletIcon.set('/img/wallet-icns/profile.png');
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
  }

  get walletCount(): number {
    const evm = this.blockchainStateService.currentProviderIds()[ProviderType.EVM].id;
    const svm = this.blockchainStateService.currentProviderIds()[ProviderType.SVM].id;
    return (evm ? 1 : 0) + (svm ? 1 : 0);
  }

  getIconUrl(type: string): string {
    const providerId = this.blockchainStateService.getCurrentProviderIdByType(type as Ecosystem);
    const provider = this.providers.find(p => p.id === providerId);
    return provider?.iconUrl || '/img/wallet-icns/profile.png';
  }

  onDisconnect(type: string): void {
    if (type === 'EVM') {
      this.blockchainStateService.disconnectEvm();
    } else if (type === 'SVM') {
      this.blockchainStateService.disconnectSvm();
    }
    this.popupService.closeAllPopups();
    this.disconnect.emit();
  }

  copyToClipboard(address: string, event: Event): void {
    event.stopPropagation();
    navigator.clipboard
      .writeText(address)
      .then(() => {
        const currentCopied = this.copiedAddresses();
        const newCopied = new Set(currentCopied);
        newCopied.add(address);
        this.copiedAddresses.set(newCopied);

        setTimeout(() => {
          const currentCopied = this.copiedAddresses();
          const newCopied = new Set(currentCopied);
          newCopied.delete(address);
          this.copiedAddresses.set(newCopied);
        }, 2000);
      })
      .catch(() => console.error('Failed to copy to clipboard'));
  }

  isCopied(address: string): boolean {
    return this.copiedAddresses().has(address);
  }

  onConnectAnotherWallet(): void {
    this.popupService.openPopup('connectWallet');
  }

  get totalBalance(): number {
    return this.tokens.reduce((sum, token) => sum + token.usdBalance, 0);
  }

  get totalUsdChange(): number {
    return this.tokens.reduce((sum, token) => {
      const change = parseFloat(token.usdChange.replace('$', ''));
      return sum + change;
    }, 0);
  }

  get averagePercentChange(): number {
    const total = this.tokens.reduce((sum, token) => {
      const percent = parseFloat(token.percentChange.replace('(', '').replace('%)', ''));
      return sum + percent;
    }, 0);
    
    return total / this.tokens.length;
  }

  get formattedUsdChange(): string {
    return `$${this.totalUsdChange.toFixed(1)}`;
  }

  get formattedPercentChange(): string {
    return `(${this.averagePercentChange.toFixed(2)}%)`;
  }

  closePopup(): void {
    this.popupService.closePopup('wallet');
    this.close.emit();
  }

  // onDisconnect(): void {
  //   this.blockchainStateService.disconnect();
  //   this.popupService.closeAllPopups(); 
  //   this.disconnect.emit();
  // }

  formatAddress(addr: string): string {
    return addr.length > 20 ? addr.slice(0,6) + '...' + addr.slice(-4) : addr;
  }


  onWalletMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }
  async loadProviders() {
    this.providers = await this.blockchainStateService.loadProviders();
    return this.updateWalletIcon();
  }

  updateWalletIcon(): void {
    const providerId = this.blockchainStateService.getCurrentProviderId();
    if (!providerId || !this.blockchainStateService.connected()) {
      this.walletIcon.set('/img/wallet-icns/profile.png');
      return;
    }

    const provider = this.providers.find((p) => p.id === providerId);
    if (provider?.iconUrl) {
      this.walletIcon.set(provider.iconUrl);
    } else {
      this.walletIcon.set('/img/wallet-icns/profile.png');
    }
  }
}
