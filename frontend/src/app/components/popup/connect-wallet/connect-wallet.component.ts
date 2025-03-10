import { Component, Output, EventEmitter, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../../services/popup.service';
import { BlockchainStateService } from '../../../services/blockchain-state.service';

interface WalletProvider {
  id: string;
  name: string;
  cssClass: string;
  status?: 'recent' | 'detected' | 'install';
  installUrl?: string;
}

@Component({
  selector: 'app-connect-wallet',
  standalone: true,
  imports: [
		CommonModule, 
		RouterModule
	],
  templateUrl: './connect-wallet.component.html',
  styleUrl: './connect-wallet.component.scss'
})
export class ConnectWalletComponent {
  @Output() close = new EventEmitter<void>();
  @Output() openWallet = new EventEmitter<void>();

  readonly connected: any;

  availableWallets: WalletProvider[] = [
    { id: 'metamask', name: 'Metamask', cssClass: 'metamask', status: 'recent' },
    { id: 'rabby-wallet', name: 'Rabby Wallet', cssClass: 'rabby-wallet', status: 'detected' },
    { id: 'backpack', name: 'Backpack', cssClass: 'backpack', status: 'detected' },
    { id: 'phantom', name: 'Phantom', cssClass: 'phantom', status: 'detected' },
    { id: 'walletconnect', name: 'WalletConnect', cssClass: 'walletconnect' }
  ];

  otherWallets: WalletProvider[] = [
    { id: 'magic-eden', name: 'Magic Eden', cssClass: 'magic-eden', status: 'install', installUrl: 'https://magiceden.io/download' }
  ];

  private allProviders = [
    'metamask', 'solflare', 'phantom', 'magic-eden', 'backpack', 'ledger', 
    'trust-wallet', 'okx-wallet', 'coinbase-wallet', 'rabby-wallet', 'walletconnect'
  ];

  constructor(
    private popupService: PopupService,
    private blockchainStateService: BlockchainStateService
  ) 
  {
    this.connected = this.blockchainStateService.connected;
    
    effect(() => {
      if (this.connected()) {
        console.log('Wallet connected!:', this.blockchainStateService.walletAddress());
      } else {
        console.log('Wallet disconnected');
      }
    }, { allowSignalWrites: true });
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
    //const type = this.blockchainStateService.getType(providerId);
  
    try {
      const { address } = await provider.connect();
      provider.switchNetwork(this.blockchainStateService.getCurrentNetworkId());
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
