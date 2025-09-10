import { Component, EventEmitter, Output, inject, Input, Signal, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlockchainStateService, Ecosystem } from '../../../services/blockchain-state.service';
import { WalletBalanceService } from '../../../services/wallet-balance.service';
import { Token } from '../../../pages/trade/trade.component';
import { Network, ProviderType } from '../../../models/wallet-provider.interface';
import { ethers } from 'ethers';
import { NetworkChangeFromPopupComponent } from '../network-change-from/network-change-from.component';
import { TokenService } from '../../../services/token.service';
import { MouseGradientService } from '../../../services/mouse-gradient.service';
import { PopupService } from '../../../services/popup.service';

export interface TokenDisplay extends Token {
  name?: string;
}

@Component({
  selector: 'app-token-selector',
  standalone: true,
  templateUrl: './token-selector.component.html',
  styleUrls: ['./token-selector.component.scss', './token-selector.component.adaptives.scss'],
  imports: [CommonModule, FormsModule, NetworkChangeFromPopupComponent],
})
export class TokenChangePopupComponent {
  @Input() mode!: 'sell' | 'buy';
  @Output() close = new EventEmitter<void>();
  @Output() tokenSelected = new EventEmitter<Token>();
  @Input() excludeToken: Token | undefined;
  @Input() selectedToken: Token | undefined;
  searchText = signal<string>('');
  tokenBalances = signal<Map<string, string>>(new Map());
  copiedAddresses = signal<Set<string>>(new Set<string>());

  selectedNetworkId = signal<number | undefined>(undefined);
  selectedNetworkTokens = signal<Token[]>([]);

  constructor(
    private tokenService: TokenService,
    public popupService: PopupService,
  ) {}

  private tokenCache = new Map<number, Token[]>();

  blockchainStateService = inject(BlockchainStateService);
  walletBalanceService = inject(WalletBalanceService);
  explorerUrl = computed(
    () =>
      this.blockchainStateService.getNetworkById(this.displayedTokens()[0].chainId)?.explorerUrl ||
      'https://etherscan.io/token/',
  );
  ethers = ethers;

  networks = computed(() => {
    const all = this.blockchainStateService.allNetworks();

    const selectedId = this.selectedNetworkId();
    const first6 = all.slice(0, 6);
    if (!selectedId) return first6;
    const selected = all.find((n) => n.id === selectedId);
    if (!selected) return first6;

    if (all.slice(0, 6).some((n) => n.id === selectedId)) {
      return first6;
    }

    return [...first6.slice(0, 5), selected];
  });
  currentNetwork = computed(() => this.blockchainStateService.networkSell());

  additionalNetworksCount = computed(() => {
    const totalNetworks = this.blockchainStateService.allNetworks().length;
    const displayedNetworks = 6;
    return Math.max(0, totalNetworks - displayedNetworks);
  });

  tokenList: Signal<TokenDisplay[]> = computed(() => {
    const search = this.searchText().toLowerCase().trim();

    if (!search) {
      const tokens = this.getBaseTokens();
      const filteredByExclude = this.filterByExcludeToken(tokens);
      return filteredByExclude as TokenDisplay[];
    }

    const allTokens = this.blockchainStateService.allTokens();
    const filteredBySearch = this.filterBySearch(allTokens, search);
    const filteredByExclude = this.filterByExcludeToken(filteredBySearch);
    return filteredByExclude as TokenDisplay[];
  });

  displayedTokens: Signal<TokenDisplay[]> = computed(() => {
    return (this.tokenList() || []).slice(0, 15);
  });

  showNetworkChangeFrom = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    if (!this.mode) {
      throw new Error('Mode is required! Pass "sell" or "buy" to the mode input.');
    }

    let networkToUse: number | undefined;

    if (this.mode === 'sell') {
      networkToUse = this.blockchainStateService.networkSell()?.id || this.blockchainStateService.networkSell()?.id;
    } else {
      networkToUse = this.blockchainStateService.networkBuy()?.id || this.blockchainStateService.networkSell()?.id;
    }

    if (networkToUse) {
      this.selectedNetworkId.set(networkToUse);
      await this.loadTokensForNetwork(networkToUse);
    } else {
      const currentNetworkId = this.blockchainStateService.networkSell()?.id;
      if (currentNetworkId) {
        this.selectedNetworkId.set(currentNetworkId);
        await this.loadTokensForNetwork(currentNetworkId);
      }
    }

    if (this.blockchainStateService.connected()) {
      this.loadDisplayedBalances();
    }
  }

  async loadDisplayedBalances(): Promise<void> {
    const networkId = this.selectedNetworkId() || this.blockchainStateService.networkSell()?.id;
    if (!networkId) {
      return;
    }

    const list = this.getBaseTokens();

    try {
      const balancesForThisNetwork = await this.walletBalanceService.getBalancesForNetwork(networkId, list);
      this.tokenBalances.set(balancesForThisNetwork);
    } catch (err) {
      console.error('Unable to get cached balances:', err);
      this.tokenBalances.set(new Map());
    }
  }

  async loadTokensForNetwork(networkId: number): Promise<void> {
    if (this.tokenCache.has(networkId)) {
      this.selectedNetworkTokens.set(this.tokenCache.get(networkId)!);
      return;
    }

    try {
      const tokens = await this.blockchainStateService.getTokensForNetwork(networkId);
      this.tokenCache.set(networkId, tokens);
      this.selectedNetworkTokens.set(tokens);
    } catch (error) {
      console.error(`Error loading tokens for network ${networkId}:`, error);
      this.selectedNetworkTokens.set([]);
    }
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
    navigator.clipboard
      .writeText(address)
      .then(() => {
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
      })
      .catch(() => console.error('Failed to copy to clipboard'));
  }

  isCopied(address: string): boolean {
    return this.copiedAddresses().has(address);
  }

  isNativeToken(token: TokenDisplay): boolean {
    const currentNetwork = this.blockchainStateService.getNetworkById(token.chainId);
    if (!currentNetwork) return false;

    if (currentNetwork.chainType === 'SVM') {
      return token.symbol === 'SOL';
    }

    if (currentNetwork.chainType === 'MVM') {
      return token.symbol === 'SUI';
    }

    return token.contractAddress === ethers.ZeroAddress;
  }

  isVerifiedToken(token: TokenDisplay): boolean {
    return true;
  }

  getTokenImage(token: TokenDisplay): string {
    return token.imageUrl ? `url(${token.imageUrl})` : 'none';
  }

  trackByToken(index: number, token: TokenDisplay): string {
    return token.contractAddress || index.toString();
  }

  trackByNetwork(index: number, network: Network): number {
    return network.id;
  }

  async selectNetwork(network: Network): Promise<void> {
    if (this.selectedNetworkId() === network.id) {
      return;
    }

    const prevNetworkId = this.selectedNetworkId();
    const prevTokens = this.selectedNetworkTokens();

    this.selectedNetworkId.set(network.id);
    await this.loadTokensForNetwork(network.id);

    if (this.mode === 'sell') {
      this.blockchainStateService.updateNetworkSell(network.id);

      if (network.id != this.blockchainStateService.getCurrentNetworkBuy()?.id) {
        this.blockchainStateService.setNetworkBuy(network);
      }

      if (!this.blockchainStateService.isEcosystemConnected(network.chainType as Ecosystem)) {
        this.blockchainStateService.setEcosystemForPopup(network.chainType as Ecosystem);
        this.popupService.openPopup('connectWallet');
        return;
      }

      const providerId = this.blockchainStateService.getCurrentProviderId();

      if (!providerId) {
        console.error('No provider selected');
        return;
      }

      const providerType = this.blockchainStateService.getType(providerId);

      const provider = this.blockchainStateService.getProvider(providerId);

      if (providerType != ProviderType.MULTICHAIN && providerType != network.chainType) {
        console.warn('Selected Unsupported network for the wallet! Disconnect');
        this.blockchainStateService.disconnect(provider.address);
        return;
      }

      // this.blockchainStateService.updateNetworkSell(network.id);

      try {
        await provider.switchNetwork(network);
      } catch (error) {
        if ((error as any).message.includes('User rejected the request') || (error as any).code === 4001) {
          this.selectedNetworkId.set(prevNetworkId);
          this.selectedNetworkTokens.set(prevTokens);
          this.blockchainStateService.updateNetworkSell(prevNetworkId!);
          return;
        } else if ((error as any).message === 'unsupported_network') {
          throw error;
        } else {
          this.selectedNetworkId.set(prevNetworkId);
          this.selectedNetworkTokens.set(prevTokens);
          this.blockchainStateService.updateNetworkSell(prevNetworkId!);
          throw error;
        }
      }

      this.blockchainStateService.updateWalletAddress(provider.address);
    } else {
      this.blockchainStateService.setNetworkBuy(network);
    }

    if (this.blockchainStateService.connected()) {
      this.loadDisplayedBalances();
    }
  }

  isCurrentNetwork(network: Network): boolean {
    if (this.selectedNetworkId()) {
      return this.selectedNetworkId() === network.id;
    }

    return this.currentNetwork()?.id === network.id;
  }

  isSelectedToken(token: Token): boolean {
    return this.selectedToken?.contractAddress === token.contractAddress;
  }

  openNetworkChangeFrom(): void {
    this.showNetworkChangeFrom.set(true);
  }

  onNetworkSelected(network: Network): void {
    this.selectNetwork(network);
    this.showNetworkChangeFrom.set(false);
  }

  private getBaseTokens(): Token[] {
    if (this.selectedNetworkId()) {
      return this.selectedNetworkTokens();
    }

    return this.blockchainStateService.tokens();
  }

  private filterBySearch(tokens: Token[], search: string): Token[] {
    if (!search) return tokens;

    return tokens.filter(
      (token) => token.symbol.toLowerCase().includes(search) || token.contractAddress.toLowerCase().includes(search),
    );
  }

  private filterByExcludeToken(tokens: Token[]): Token[] {
    if (!this.excludeToken) return tokens;

    return tokens.filter((token) => {
      const isSameAddress = token.contractAddress === this.excludeToken!.contractAddress;
      const isSameChain = token.chainId === this.excludeToken!.chainId;
      return !(isSameAddress && isSameChain);
    });
  }
}
