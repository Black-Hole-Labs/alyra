import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Token } from '../../../pages/trade/trade.component';
import { Network } from '../../../models/wallet-provider.interface';

@Component({
  selector: 'app-bridge-tx',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bridge-tx.component.html',
  styleUrl: './bridge-tx.component.scss'
})
export class BridgeTxComponent implements OnInit {
  @Input() selectedNetwork: Network | undefined = undefined; //??
  @Input() selectedNetworkTo: Network | undefined = undefined;
  //<Token | undefined>(undefined);
  @Input() selectedToken: Token | undefined = undefined;
  @Input() inputAmount: string = '';
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    console.log('BridgeTx initialized with amount:', this.inputAmount); // Добавим для отладки
  }

  closePopup(): void {
    this.close.emit();
  }
  //todo
  // closePopup(): void {
  //   this.popupService.closePopup('bridgeTx');
  // }

  // getFromAddress(): string {
  //   return this.walletService.getAddress();
  // }

  // getToAddress(): string {
  //   return this.customAddress || this.walletService.getAddress();
  // }
}
