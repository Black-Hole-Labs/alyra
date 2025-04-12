import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Token } from '../../../pages/trade/trade.component';
import { Network } from '../../../models/wallet-provider.interface';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { TransactionsService } from '../../../services/transactions.service';

@Component({
  selector: 'app-bridge-tx',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bridge-tx.component.html',
  styleUrls: [
		'./bridge-tx.component.scss', 
		'./bridge-tx.component.adaptives.scss'
	]
})
export class BridgeTxComponent implements OnInit {
  @Input() selectedNetwork: Network | undefined = undefined; //??
  @Input() selectedNetworkTo: Network | undefined = undefined;
  @Input() selectedToken: Token | undefined = undefined;
  @Input() selectedReceiveToken: Token | undefined = undefined;
  @Input() inputAmount: number = 0;
  @Input() txHash: string = '';
  @Input() customAddress: string = '';
  @Output() close = new EventEmitter<void>();
  txStatusText = 'Pending';

  constructor(
      private blockchainStateService: BlockchainStateService,
      private transactionsService: TransactionsService
  )
  {
    
  }

  async ngOnInit() {
    console.log('BridgeTx initialized with amount:', this.inputAmount);
    const finalStatus = await this.transactionsService.pollStatus(this.txHash);
    if (finalStatus === 'DONE') {
      this.txStatusText = 'Transaction Successful';
    } else {
      this.txStatusText = 'Transaction Failed';
    }
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
