import { Component, EventEmitter, Output, inject, effect, Input } from '@angular/core';
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
  @Input() mode!: 'sell' | 'buy';
  @Output() close = new EventEmitter<void>();
  @Output() tokenSelected = new EventEmitter<{ symbol: string; imageUrl: string }>();

  searchText: string = '';
  public blockchainStateService = inject(BlockchainStateService);

  ngOnInit(): void {
    if (!this.mode) {
      throw new Error('Mode is required! Pass "sell" or "buy" to the mode input.');
    }
    console.log('Current mode:', this.mode);
  }

  performSearch(): void {
    const search = this.searchText.toLowerCase().trim();
    this.blockchainStateService.filteredTokens = this.blockchainStateService.tokens.filter(
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
}
