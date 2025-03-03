import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { Network } from '../../../models/wallet-provider.interface';


@Component({
  selector: 'app-blackhole-network',
  standalone: true,
  templateUrl: './blackhole-network.component.html',
  styleUrls: ['./blackhole-network.component.scss'],
  imports: [CommonModule]
})
export class BlackholeNetworkComponent {
  networks = computed(() => this.blockchainStateService.networks());
  selectedNetwork: string | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(
    private blockchainStateService: BlockchainStateService
  ) {}

  ngOnInit(): void {
    //this.loadNetworksForCurrentProvider();
  }

  // private async loadNetworksForCurrentProvider(): Promise<void> {
  //   const currentProvider = this.blockchainStateService.getCurrentProvider();
    
  //   if (!currentProvider) {
  //     console.error('No provider selected');
  //     return;
  //   }

  //   console.log("currentProvider",currentProvider);
  //   // const type = this.blockchainStateService.getType(currentProvider);
  //   await this.loadNetworks(currentProvider.type);
  // }

  // private async loadNetworks(type: string): Promise<void> {
  //   try {
  //     const response = await fetch('/data/networks.json');
  //     const allNetworks: any[] = await response.json();

  //     if (type === 'multichain') { // Both EVM and SVM
  //       this.networks = allNetworks;
  //     } else {
  //       this.networks = allNetworks.filter(
  //         (network: Network) => network.chainType === type
  //       );
  //     }

  //     console.log("this.networks",this.networks);
  //   } catch (error) {
  //     console.error('Failed to load networks:', error);
  //   }
  // }

  async selectNetwork(networkId: string): Promise<void> {
    const selectedNetwork = this.networks().find((network) => (network.id).toString() === networkId);
    if (!selectedNetwork) {
      console.error('Network not found');
      return;
    }

    this.blockchainStateService.updateNetwork(networkId);

    const currentProvider = this.blockchainStateService.getCurrentProvider();
    if (!currentProvider) {
      console.error('No provider selected');
      return;
    }

    const provider = currentProvider.provider;
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
      
      // Close the popup after successful network selection
      this.close.emit();
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  }

  // Method to get the current selected network object
  getCurrentNetwork(): any {
    if (!this.selectedNetwork) return null;
    return this.networks().find(n => n.id.toString() === this.selectedNetwork);
  }
}
