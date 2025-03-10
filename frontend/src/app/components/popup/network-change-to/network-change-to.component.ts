import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Network } from '../../../models/wallet-provider.interface';
import { BlockchainStateService } from '../../../services/blockchain-state.service';

@Component({
  selector: 'app-network-change-to',
  standalone: true,
  templateUrl: './network-change-to.component.html',
  styleUrls: ['./network-change-to.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class NetworkChangeToPopupComponent {
  @Input() networks: Network[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() networkSelected = new EventEmitter<Network>();

  searchText: string = '';
  filteredNetworks: Network[] = [];

  constructor(private blockchainStateService: BlockchainStateService) {
    if (this.networks.length === 0) {
      this.networks = this.blockchainStateService.networks();
    }
    this.filteredNetworks = [...this.networks];
  }

  ngOnChanges() {
    this.filteredNetworks = [...this.networks];
  }

  performSearch(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredNetworks = this.networks.filter(
      network => network.name.toLowerCase().includes(search)
    );
  }

  closePopup(): void {
    this.close.emit();
  }

  selectNetwork(network: Network): void {
    this.networkSelected.emit(network);
    this.closePopup();
  }
}
