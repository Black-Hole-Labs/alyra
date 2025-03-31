
import { Component, EventEmitter, Output, inject, effect, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { Token } from '../../../pages/trade/trade.component';
import { PopupService } from '../../../services/popup.service';

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
  

  searchText: string = '';
  public blockchainStateService = inject(BlockchainStateService);

  ngOnInit(): void {
    if (!this.mode) {
      throw new Error('Mode is required! Pass "sell" or "buy" to the mode input.');
    }

    
  }

  get tokenList(): Token[] {
    return this.networkTokens?.length ? this.networkTokens : this.blockchainStateService.filteredTokens();
  }
  
  

  performSearch(): void {
    console.log("todo")
    // this.blockchainStateService.setSearchText(this.searchText);
    // const search = this.searchText.toLowerCase().trim();
    // this.blockchainStateService.filteredTokens = this.blockchainStateService.tokens.filter(
    //   token =>
    //     token.name.toLowerCase().includes(search) ||
    //     token.symbol.toLowerCase().includes(search) ||
    //     token.contractAddress.toLowerCase().includes(search)
    // );
  }

  closePopup(): void {
    this.close.emit();
  }

  selectToken(token: { symbol: string; name: string; contractAddress: string; imageUrl: string ; decimals: string}): void {
    this.tokenSelected.emit({ symbol: token.symbol, imageUrl: token.imageUrl, contractAddress: token.contractAddress, decimals: token.decimals });
    this.closePopup();
  }

  copyToClipboard(address: string, event: Event): void {
    event.stopPropagation(); // Останавливаем всплытие события
    navigator.clipboard.writeText(address).catch(() => {
      console.error('Failed to copy to clipboard');
    });
  }

  getTokenImage(token: any): string {
    return token.imageUrl ? `url(${token.imageUrl})` : 'none';
  }

  trackByToken(index: number, token: any): string {
    return token.contractAddress || index.toString(); 
  } //todo?
}
