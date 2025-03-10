import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Token } from '../../../pages/trade/trade.component';
import { Network } from '../../../models/wallet-provider.interface';
import { BlockchainStateService } from '../../../services/blockchain-state.service';

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
  @Input() selectedToken: Token | undefined = undefined;
  @Input() selectedReceiveToken: Token | undefined = undefined;
  @Input() inputAmount: string = '';
  @Input() customAddress: string = '';
  @Output() close = new EventEmitter<void>();

  constructor(
      private blockchainStateService: BlockchainStateService,
  )
  {

  }

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

  getFromAddress(): string {
    return this.blockchainStateService.getCurrentWalletAddress()!;
  }

  getToAddress(): string {
    return this.customAddress || this.blockchainStateService.getCurrentWalletAddress()!;
  }
}
