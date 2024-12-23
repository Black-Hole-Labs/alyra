import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { BlockchainProvidersService } from '../../services/blockchain-providers.service';
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
  providers = ['metamask', 'solflare']; 
  selectedProvider: string | null = null;
  readonly connected;
  networks: any[] = [];
  selectedNetwork: string | null = null;

  constructor(
    private blockchainProvidersService: BlockchainProvidersService,
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

    const provider = this.blockchainProvidersService.getProvider(this.selectedProvider);
    if (!provider) {
      alert('Provider not registered');
      return;
    }

    try {
      const { address } = await provider.connect();
      this.blockchainStateService.updateWalletAddress(address);
      this.blockchainStateService.updateProvider(this.selectedProvider);
      this.loadNetworks();
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  disconnectWallet(): void {
    this.blockchainStateService.disconnect();
    this.networks = []; 
    this.selectedNetwork = null;
  }

  private async loadNetworks(): Promise<void> {
    try {
      const response = await fetch('/data/networks.json');
      const allNetworks: any[] = await response.json();

      // Фильтруем сети по текущему провайдеру
      this.networks = allNetworks.filter(
        (network: Network) => network.provider === this.selectedProvider
      );
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

    const provider = this.blockchainProvidersService.getProvider(this.selectedProvider!);
    if (!provider) {
      alert('Provider not registered');
      return;
    }

    try {
      await provider.switchNetwork(selectedNetwork);
      this.selectedNetwork = networkId;
      console.log(`Switched to network: ${selectedNetwork.name}`);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  }
}
