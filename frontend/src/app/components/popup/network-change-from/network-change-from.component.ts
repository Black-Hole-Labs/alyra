import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Network } from '../../../models/wallet-provider.interface';
import { BlockchainStateService } from '../../../services/blockchain-state.service';

@Component({
  selector: 'app-network-change-from',
  standalone: true,
  templateUrl: './network-change-from.component.html',
  styleUrls: [
		'./network-change-from.component.scss',
		'./network-change-from.component.adaptives.scss'
	],
	imports: [CommonModule, FormsModule],
})
export class NetworkChangeFromPopupComponent implements OnInit, OnChanges  {

	@Input() networks: Network[] = [];
	@Output() close = new EventEmitter<void>();
	@Output() networkSelected = new EventEmitter<Network>();

	searchText: string = '';
	filteredNetworks: Network[] = [];

	constructor(private blockchainStateService: BlockchainStateService) {}

	ngOnInit(): void {
		if (this.networks.length === 0) {
			this.networks = this.blockchainStateService.allNetworks();
		}
		this.filteredNetworks = [...this.networks];
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['networks']) {
			this.filteredNetworks = [...this.networks];
			this.performSearch();
		}
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
