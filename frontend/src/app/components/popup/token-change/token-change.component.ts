import { Component, EventEmitter, Output, inject, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { WalletBalanceService } from '../../../services/wallet-balance.service';
import { Token } from '../../../pages/trade/trade.component';
import { ethers } from 'ethers';
import { ScrollingModule } from '@angular/cdk/scrolling';

export interface TokenDisplay extends Token {
  name?: string;
}

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
  tokenBalances = signal<Map<string, string>>(new Map());
  copiedAddresses = signal<Set<string>>(new Set<string>());
  blockchainStateService = inject(BlockchainStateService);
  walletBalanceService = inject(WalletBalanceService);
  explorerUrl = computed(() => this.blockchainStateService.network()?.explorerUrl || "https://etherscan.io/token/");
  ethers = ethers;

  tokenList: Signal<TokenDisplay[]> = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const tokens = this.networkTokens?.length ? this.networkTokens : this.blockchainStateService.allTokens();

    if (!search) return tokens as TokenDisplay[];

    return tokens.filter((token: Token) =>
      token.symbol.toLowerCase().includes(search) ||
      token.contractAddress.toLowerCase().includes(search)
    ) as TokenDisplay[];
  });

  displayedTokens: Signal<TokenDisplay[]> = computed(() => {
    return (this.tokenList() || []).slice(0, 15);
  });

  ngOnInit(): void {
    if (!this.mode) {
      throw new Error('Mode is required! Pass "sell" or "buy" to the mode input.');
    }
    
    if (this.blockchainStateService.connected()) {
      this.loadDisplayedBalances();
    }
  }

  async loadDisplayedBalances(): Promise<void> {
    const list = this.displayedTokens();
    const balances = new Map<string, string>();
    
    for (const token of list) {
      try {
        const balance = await this.walletBalanceService.getBalanceForToken(token);
        balances.set(token.contractAddress, this.truncateTo6Decimals(parseFloat(balance)));
      } catch (error) {
        console.error(`Error loading balance for token ${token.symbol}:`, error);
        balances.set(token.contractAddress, '0');
      }
    }
    
    this.tokenBalances.set(balances);
  }
  
  getTokenBalance(token: Token): string {
    return this.tokenBalances()?.get(token.contractAddress) || '0';
  }

  truncateTo6Decimals(value: number): string {
    return (Math.trunc(value * 1e6) / 1e6).toString();
  }

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
    navigator.clipboard.writeText(address).then(() => {
      const currentCopied = this.copiedAddresses();
      const newCopied = new Set(currentCopied);
      newCopied.add(address);
      this.copiedAddresses.set(newCopied);
      
      setTimeout(() => {
        const currentCopied = this.copiedAddresses();
        const newCopied = new Set(currentCopied);
        newCopied.delete(address);
        this.copiedAddresses.set(newCopied);
      }, 2000);
    }).catch(() => console.error('Failed to copy to clipboard'));
  }

  isCopied(address: string): boolean {
    return this.copiedAddresses().has(address);
  }

  isNativeToken(token: TokenDisplay): boolean {
    const currentNetwork = this.blockchainStateService.network();
    if (!currentNetwork) return false;

    if (currentNetwork.chainType === 'SVM') {
      return token.symbol === 'SOL';
    }
    
    return token.contractAddress === ethers.ZeroAddress;
  }

  isVerifiedToken(token: TokenDisplay): boolean {
    // Заглушка - логика будет добавлена пользователем позже
    return true;
  }

  getTokenImage(token: TokenDisplay): string {
    return token.imageUrl ? `url(${token.imageUrl})` : 'none';
  }

  trackByToken(index: number, token: TokenDisplay): string {
    return token.contractAddress || index.toString();
  }
}
