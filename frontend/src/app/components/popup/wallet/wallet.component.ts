import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../../services/popup.service';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { MouseGradientService } from '../../../services/mouse-gradient.service';

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
    private blockchainStateService: BlockchainStateService, 
    private popupService: PopupService,
    private mouseGradientService: MouseGradientService
  ) {
    this.walletName.set(this.blockchainStateService.getCurrentWalletAddress()!);
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

  onDisconnect(): void {
    this.blockchainStateService.disconnect();
    this.popupService.closeAllPopups(); 
    this.disconnect.emit();
  }

  onWalletMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }
}
