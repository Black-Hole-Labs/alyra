import { Component, OnInit } from '@angular/core';
import { BlockchainProvidersService } from '../../services/blockchain-providers.service';
import { BlockchainStateService } from '../../services/blockchain-state.service';

@Component({
  selector: 'app-blockchain-select-provider',
  templateUrl: './blockchain-select-provider.component.html',
  styleUrls: ['./blockchain-select-provider.component.css'],
})
export class BlockchainSelectProviderComponent implements OnInit {
  providers: { id: string; name: string; type: string }[] = [];
  selectedProvider: string | null = null;

  constructor(
    private blockchainProvidersService: BlockchainProvidersService,
    private blockchainStateService: BlockchainStateService
  ) {}

  async ngOnInit(): Promise<void> {
    this.providers = await this.blockchainProvidersService.loadProviders();
    this.selectedProvider = this.providers.length > 0 ? this.providers[0].id : null;
  }

  async connect(): Promise<void> {
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
      const { address, network } = await provider.connect();
      this.blockchainStateService.updateWalletAddress(address);
      this.blockchainStateService.updateNetwork(network);
    } catch (error) {
      console.error('Connection error:', error);
    }
  }
}
