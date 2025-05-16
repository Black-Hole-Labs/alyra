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
  sendingTxLink: string | null = null;
  receivingTxLink: string | null = null;
  isLoading: boolean = true;

  constructor(
      private blockchainStateService: BlockchainStateService,
      private transactionsService: TransactionsService
  )
  {
    
  }

  async ngOnInit() {
    // console.log('BridgeTx initialized with amount:', this.inputAmount);
    
    try {
      const initialStatus = await this.transactionsService.getInitialStatus(this.txHash);
      this.updateLinkState(initialStatus);
      
      if (initialStatus.status !== 'DONE' && initialStatus.status !== 'FAILED') {
        const finalStatus = await this.transactionsService.waitForCompletion(this.txHash);
        this.updateLinkState(finalStatus);
        this.txStatusText = finalStatus.status === 'DONE' ? 'Successful' : 'Failed';
      } else {
        this.txStatusText = initialStatus.status === 'DONE' ? 'Successful' : 'Failed';
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      this.txStatusText = 'Error';
    } finally {
      this.isLoading = false;
    }
  }

  private updateLinkState(status: any): void {
    if (status?.sending?.txLink) {
      this.sendingTxLink = status.sending.txLink;
    }
    
    if (status?.receiving?.txLink) {
      this.receivingTxLink = status.receiving.txLink;
    }
  }
  
  navigateTo(url: string | null): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
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
