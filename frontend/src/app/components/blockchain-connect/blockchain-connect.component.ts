import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { FormsModule } from '@angular/forms';
import { Network } from '../../models/wallet-provider.interface';
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
  networks: any[] = [];
  selectedNetwork: string | null = null;

  constructor(
    private blockchainStateService: BlockchainStateService
  ) {
    this.connected = this.blockchainStateService.connected;
    // Подписка на изменения connected
    effect(() => {
      if (this.connected()) {
        console.log('Wallet connected:', this.blockchainStateService.walletAddress());
      } else {
        this.networks = [];
        this.selectedNetwork = null;
        console.log('Wallet disconnected');
      }
    },{ allowSignalWrites: true });
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
      await this.loadNetworks(type);
      // Select Solana by default for SVM
      if (type === 'SVM')
      {
        const solanaNetwork = this.networks.find(network => network.name === 'Solana');

        if (solanaNetwork) {
          this.onNetworkChange(solanaNetwork.id.toString());
        } else {
          console.error('Network for SVM not found!');
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  disconnectWallet(): void {
    this.blockchainStateService.disconnect();
    this.networks = []; 
    this.selectedNetwork = null;
  }

  private async loadNetworks(type : string): Promise<void> {
    try {
      const response = await fetch('/data/networks.json');
      const allNetworks: any[] = await response.json();

      if (type === 'multichain') // Both EVM and SVM
      {
        this.networks = allNetworks;
      }
      else
      {
        this.networks = allNetworks.filter(
          (network: Network) => network.chainType === type
        );
      }
    } catch (error) {
      console.error('Failed to load networks:', error);
    }
  }

  async onNetworkChange(networkId: string): Promise<void> {
    const selectedNetwork = this.networks.find((network) => (network.id).toString() === networkId);
    if (!selectedNetwork) {
      console.error('Network not found');
      return;
    }

    const provider = this.blockchainStateService.getProvider(this.selectedProvider!);
    if (!provider) {
      alert('Provider not registered');
      return;
    }

    try {
      await provider.switchNetwork(selectedNetwork);
      this.selectedNetwork = networkId;
      this.blockchainStateService.updateNetwork(networkId);
      console.log(`Switched to network: ${selectedNetwork.name}`);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  }
}
