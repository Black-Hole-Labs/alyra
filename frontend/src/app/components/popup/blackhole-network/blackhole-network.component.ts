import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { FailedNotificationComponent } from '../../notification/failed-notification/failed-notification.component';

@Component({
  selector: 'app-blackhole-network',
  standalone: true,
  templateUrl: './blackhole-network.component.html',
  styleUrls: [
		'./blackhole-network.component.scss',
		'./blackhole-network.component.adaptives.scss'
	],
  imports: [CommonModule, FailedNotificationComponent]
})
export class BlackholeNetworkComponent {
  networks = computed(() => this.blockchainStateService.networks());
  selectedNetwork: number | null = null;
  showFailedNotification = false;
  errorMessage = '';

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

  async selectNetwork(networkId: number): Promise<void> {
    const selectedNetwork = this.networks().find((network) => network.id === networkId);
    if (!selectedNetwork) {
      console.error('Network not found');
      return;
    }


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
      this.blockchainStateService.updateWalletAddress(provider.address);
      this.blockchainStateService.updateNetwork(networkId);
      console.log(`Switched to network: ${selectedNetwork.name}`);
      
      // Close the popup after successful network selection
      this.close.emit();
    } catch (error) {
      console.error('Failed to switch network:', error);
      this.errorMessage = `Failed to switch to network ${selectedNetwork.name}!`;
      this.showFailedNotification = true;
    }
  }

  // Method to get the current selected network object
  getCurrentNetwork(): any {
    if (!this.selectedNetwork) return null;
    return this.networks().find(n => n.id === this.selectedNetwork);
  }
}
