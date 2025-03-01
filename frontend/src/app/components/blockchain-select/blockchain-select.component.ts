import { Component, OnInit } from '@angular/core';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Network } from '../../models/wallet-provider.interface';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-blockchain-select',
  templateUrl: './blockchain-select.component.html',
  styleUrls: ['./blockchain-select.component.scss'],
})
export class BlockchainSelectComponent implements OnInit {
  networks: any[] = [];
  selectedNetwork: string | null = null;

  constructor(
    private blockchainStateService: BlockchainStateService
  ) {}

  ngOnInit(): void {
    this.loadNetworksForCurrentProvider();
  }

  private async loadNetworksForCurrentProvider(): Promise<void> {
    const currentProvider = this.blockchainStateService.getCurrentProvider();
    
    if (!currentProvider) {
      console.error('No provider selected');
      return;
    }

    const type = this.blockchainStateService.getType(currentProvider);
    await this.loadNetworks(type);
    
    // Select default network based on type
    if (type === 'SVM') {
      const solanaNetwork = this.networks.find(network => network.name === 'Solana');
      if (solanaNetwork) {
        this.onNetworkChange(solanaNetwork.id.toString());
      } else {
        console.error('Network for SVM not found!');
      }
    } else { // EVM / multichain -> default Ethereum
      const ethereumNetwork = this.networks.find(network => network.name === 'Ethereum');
      if (ethereumNetwork) {
        this.onNetworkChange(ethereumNetwork.id.toString());
      } else {
        console.error('Network for EVM not found!');
      }
    }
  }

  private async loadNetworks(type: string): Promise<void> {
    try {
      const response = await fetch('/data/networks.json');
      const allNetworks: any[] = await response.json();

      if (type === 'multichain') { // Both EVM and SVM
        this.networks = allNetworks;
      } else {
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

    const currentProvider = this.blockchainStateService.getCurrentProvider();
    if (!currentProvider) {
      console.error('No provider selected');
      return;
    }

    const provider = this.blockchainStateService.getProvider(currentProvider);
    if (!provider) {
      alert('Provider not registered');
      return;
    }

    try {
      await provider.switchNetwork(selectedNetwork);
      this.selectedNetwork = networkId;
      this.blockchainStateService.updateNetwork(networkId);
      this.blockchainStateService.updateWalletAddress(provider.address);
      console.log(`Switched to network: ${selectedNetwork.name}`);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  }
}