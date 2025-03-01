import { Component, effect } from '@angular/core';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-blockchain-connect',
  templateUrl: './blockchain-connect.component.html',
  styleUrls: ['./blockchain-connect.component.scss'],
})
export class BlockchainConnectComponent {
  providers = ['metamask', 'solflare', 'phantom', 'magic-eden', 'backpack', 'ledger', 'trust-wallet', 'okx-wallet', 'coinbase-wallet', 'rabby-wallet']; 
  selectedProvider: string | null = null;
  readonly connected;

  constructor(
    private blockchainStateService: BlockchainStateService
  ) {
    this.connected = this.blockchainStateService.connected;
    
    // Подписка на изменения connected
    effect(() => {
      if (this.connected()) {
        console.log('Wallet connected:', this.blockchainStateService.walletAddress());
      } else {
        console.log('Wallet disconnected');
      }
    }, { allowSignalWrites: true });
  }

  async connectWallet(): Promise<void> {
    if (!this.selectedProvider) {
      alert('Please select a provider');
      return;
    }
  
    const provider = this.blockchainStateService.getProvider(this.selectedProvider);
    if (!provider) {
      alert('Provider not registered');
      return;
    }
  
    const type = this.blockchainStateService.getType(this.selectedProvider);
  
    try {
      const { address } = await provider.connect();
      this.blockchainStateService.updateWalletAddress(address);
      this.blockchainStateService.setCurrentProvider(this.selectedProvider);
      
      // Network loading moved to the network select component
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  disconnectWallet(): void {
    this.blockchainStateService.disconnect();
  }
}