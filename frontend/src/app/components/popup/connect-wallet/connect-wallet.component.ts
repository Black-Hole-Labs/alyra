import { Component, Output, EventEmitter, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../../services/popup.service';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { Wallets } from '../../../models/wallet-provider.interface';

@Component({
  selector: 'app-connect-wallet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './connect-wallet.component.html',
  styleUrls: [
		'./connect-wallet.component.scss',
		'./connect-wallet.component.adaptives.scss'
  ]
})
export class ConnectWalletComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() openWallet = new EventEmitter<void>();

  readonly connected: any;
  allWallets: Wallets[] = [];
  availableWallets: Wallets[] = [];
  otherWallets: Wallets[] = [];

  private allProviders: string[] = [];

  constructor(
    private popupService: PopupService,
    private blockchainStateService: BlockchainStateService
  ) {
    this.connected = this.blockchainStateService.connected;

    effect(() => {
      if (this.connected()) {
        console.log('Wallet connected!:', this.blockchainStateService.walletAddress());
      } else {
        console.log('Wallet disconnected');
      }
    }, { allowSignalWrites: true });
  }

  async ngOnInit(): Promise<void> {
    this.allWallets = await this.blockchainStateService.loadProviders();
    this.allProviders = this.allWallets.map(wallet => wallet.id);

    this.availableWallets = [];
    this.otherWallets = [];

    this.allWallets.forEach(wallet => {
      if (['ledger', 'walletconnect'].includes(wallet.id)) {
        wallet.status = 'connect';
        this.availableWallets.push(wallet);
      } else {
        const isDetected = this.isWalletDetected(wallet.id);
        wallet.status = isDetected ? 'detected' : 'install';

        if (wallet.status === 'detected') {
          this.availableWallets.push(wallet);
        } else {
          this.otherWallets.push(wallet);
        }
      }
    });

    // TODO recent logic
    const recentWallet = this.availableWallets.find(w => w.id === 'metamask');
    if (recentWallet) {
      recentWallet.status = 'recent';
    }
  }

  private isWalletDetected(providerId: string): boolean {
    const provider = this.blockchainStateService.getProvider(providerId);
    return provider && provider.isAvailable();
  }

  closePopup(): void {
    this.popupService.closePopup('connectWallet');
    this.close.emit();
  }

  async onWalletClick(providerId: string): Promise<void> {
    if (!this.allProviders.includes(providerId)) {
      alert('Provider not supported');
      return;
    }

    const provider = this.blockchainStateService.getProvider(providerId);
    if (!provider) {
      alert('Provider not registered');
      return;
    }

    try {
      const { address } = await provider.connect();

      try
      {
        await provider.switchNetwork(this.blockchainStateService.getCurrentNetwork());
      }
      catch(e: unknown)
      {
        console.log("caught error: ", e);
        console.log("Force switching to available network Etherium or Solana");
        if (this.blockchainStateService.getType(providerId) == "SVM")
        {
          this.blockchainStateService.updateNetwork(1151111081099710);
        }
        else
        {
          this.blockchainStateService.updateNetwork(1);
        }

        provider.switchNetwork(this.blockchainStateService.getCurrentNetwork());
      }
      
      this.blockchainStateService.updateWalletAddress(address);
      this.blockchainStateService.setCurrentProvider(providerId);

      this.closePopup();
    } catch (error) {
      console.error('Connection error:', error);
    }
    this.popupService.openPopup('wallet');
    this.openWallet.emit();
  }

  disconnectWallet(): void {
    this.blockchainStateService.disconnect();
  }
}