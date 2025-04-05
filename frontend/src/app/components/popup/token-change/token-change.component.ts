import { Component, EventEmitter, Output, inject, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Token } from '../../../pages/trade/trade.component';

@Component({
  selector: 'app-token-change',
  standalone: true,
  templateUrl: './token-change.component.html',
  styleUrls: [
		'./token-change.component.scss',
		'./token-change.component.adaptives.scss'
	],
  imports: [CommonModule, FormsModule, ScrollingModule],
})
export class TokenChangePopupComponent {
  @Input() mode!: 'sell' | 'buy';
  @Output() close = new EventEmitter<void>();
  @Output() tokenSelected = new EventEmitter<Token>();
  @Input() networkTokens: Token[] | undefined;
  searchText = signal<string>(''); 
  blockchainStateService = inject(BlockchainStateService);

  ngOnInit(): void {
    if (!this.mode) {
      throw new Error('Mode is required! Pass "sell" or "buy" to the mode input.');
    }
  }

  tokenList: Signal<Token[]> = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const tokens = this.networkTokens?.length ? this.networkTokens : this.blockchainStateService.tokens();

    if (!search) return tokens;

    return tokens.filter((token: Token) =>
      token.symbol.toLowerCase().includes(search) ||
      token.contractAddress.toLowerCase().includes(search)
    );
  });

  updateSearchText(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  closePopup(): void {
    this.close.emit();
  }

  selectToken(token: Token): void {
    this.tokenSelected.emit(token);
    this.closePopup();
  }

  copyToClipboard(address: string, event: Event): void {
    event.stopPropagation();
    navigator.clipboard.writeText(address).catch(() => console.error('Failed to copy to clipboard'));
  }

  getTokenImage(token: Token): string {
    return token.imageUrl ? `url(${token.imageUrl})` : 'none';
  }

  trackByToken(index: number, token: Token): string {
    return token.contractAddress || index.toString();
  }
}
