import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../../services/popup.service';
import { WalletService } from '../../../services/wallet.service';

@Component({
  selector: 'app-bridge-tx',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bridge-tx.component.html',
  styleUrl: './bridge-tx.component.scss'
})
export class BridgeTxComponent implements OnInit {
  @Input() selectedNetwork: string = '';
  @Input() selectedNetworkImage: string = '';
  @Input() selectedNetworkTo: string = '';
  @Input() selectedNetworkToImage: string = '';
  @Input() selectedToken: { symbol: string; imageUrl: string } = { symbol: '', imageUrl: '' };
  @Input() selectedReceiveToken: { symbol: string; imageUrl: string } = { symbol: '', imageUrl: '' };
  @Input() inputAmount: string = '';
  @Input() customAddress: string = '';
  @Output() close = new EventEmitter<void>();

  constructor(
    private popupService: PopupService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    console.log('BridgeTx initialized with amount:', this.inputAmount);
  }

  closePopup(): void {
    this.popupService.closePopup('bridgeTx');
  }

  getFromAddress(): string {
    return this.walletService.getAddress();
  }

  getToAddress(): string {
    return this.customAddress || this.walletService.getAddress();
  }
}
