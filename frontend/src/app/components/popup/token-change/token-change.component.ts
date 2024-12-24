import { Component, EventEmitter, Output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainStateService } from '../../../services/blockchain-state.service';

@Component({
  selector: 'app-token-change',
  standalone: true,
  templateUrl: './token-change.component.html',
  styleUrls: ['./token-change.component.css'],
  imports: [CommonModule, FormsModule],
})
export class TokenChangePopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() tokenSelected = new EventEmitter<{ symbol: string; imageUrl: string }>();

  searchText: string = '';
  tokens: { symbol: string; name: string; contractAddress: string; imageUrl: string }[] = [];
  filteredTokens = [...this.tokens];
  private blockchainStateService = inject(BlockchainStateService);

  constructor() {
    effect(() => {
      const network = this.blockchainStateService.network();
      console.log(network);
      if (network) {
        this.loadTokensForNetwork(network);
      }
    });
  }

  ngOnInit(): void {
  }

  performSearch(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredTokens = this.tokens.filter(
      token =>
        token.name.toLowerCase().includes(search) ||
        token.symbol.toLowerCase().includes(search) ||
        token.contractAddress.toLowerCase().includes(search)
    );
  }

  closePopup(): void {
    this.close.emit();
  }

  selectToken(token: { symbol: string; name: string; contractAddress: string; imageUrl: string }): void {
    this.tokenSelected.emit({ symbol: token.symbol, imageUrl: token.imageUrl });
    this.closePopup();
  }

  copyToClipboard(address: string, event: Event): void {
    event.stopPropagation(); // Останавливаем всплытие события
    navigator.clipboard.writeText(address).catch(() => {
      console.error('Failed to copy to clipboard');
    });
  }

  private loadTokensForNetwork(network: string): void {
    fetch(`/data/tokens.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load tokens for network ${network}`);
        }
        return response.json();
      })
      .then((data) => {
        const tokensForNetwork = data.tokensEVM[network];
        if (tokensForNetwork) {
          // console.log(tokensForNetwork);
          this.tokens = tokensForNetwork.map((token: any) => ({
            symbol: token.symbol,
            name: token.name,
            contractAddress: token.address,
            imageUrl: token.logoURI,
          }));
          this.filteredTokens = [...this.tokens];
        } else {
          console.warn(`No tokens found for network ${network}`);
          this.tokens = [];
          this.filteredTokens = [];
        }
      })
      .catch((error) => {
        console.error(`Error loading tokens: ${error.message}`);
        this.tokens = [];
        this.filteredTokens = [];
      });
  }
}
