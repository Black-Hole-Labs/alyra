import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { FailedNotificationComponent } from '../../notification/failed-notification/failed-notification.component';
import { PopupService } from '../../../services/popup.service';

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
  
  private currentNetworkIcon1: string | null = null;
  private currentNetworkIcon2: string | null = null;

  @Output() close = new EventEmitter<void>();

  constructor(
    private blockchainStateService: BlockchainStateService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    const root = document.documentElement;
    this.currentNetworkIcon1 = root.style.getPropertyValue('--current-network-icon-1');
    this.currentNetworkIcon2 = root.style.getPropertyValue('--current-network-icon-2');
    
    const currentNetwork = this.blockchainStateService.getCurrentNetwork();
    if (currentNetwork) {
      this.selectedNetwork = currentNetwork.id;
    }
  }
  
  ngOnDestroy(): void {
    const currentNetwork = this.blockchainStateService.getCurrentNetwork();
    if (currentNetwork) {
      const root = document.documentElement;
      root.style.setProperty('--current-network-icon-1', `url(${currentNetwork.logoURI})`);
      root.style.setProperty('--current-network-icon-2', `url(${currentNetwork.logoURI})`);
    }
  }

  async selectNetwork(networkId: number): Promise<void> {
    const selectedNetwork = this.networks().find((network) => network.id === networkId);
    if (!selectedNetwork) {
      console.error('Network not found');
      return;
    }

    if(!this.blockchainStateService.connected()){
      this.blockchainStateService.updateNetwork(networkId);
      this.popupService.closePopup('networkPopup');
      this.close.emit();
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
      
      this.popupService.closePopup('networkPopup');
      this.close.emit();
    } catch (error) {
      console.error('Failed to switch network:', error);
      this.errorMessage = `Failed to switch to network ${selectedNetwork.name}!`;
      this.showFailedNotification = true;
    }
  }

  getCurrentNetwork(): any {
    if (!this.selectedNetwork) return null;
    return this.networks().find(n => n.id === this.selectedNetwork);
  }

  private updateNetworkBackgroundIcons(network: any): void {
    const root = document.documentElement;
    root.style.setProperty('--current-network-icon-1', `url(${network.logoURI})`);
    root.style.setProperty('--current-network-icon-2', `url(${network.logoURI})`);
  }
}
