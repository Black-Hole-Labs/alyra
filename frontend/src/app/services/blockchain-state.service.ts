import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {
  readonly walletAddress = signal<string | null>(null); // Адрес кошелька
  readonly provider = signal<string | null>(null); // Выбранная сеть
  readonly network = signal<string | null>(null); // Выбранная сеть
  readonly connected = signal<boolean>(false); // Статус подключения
  tokens: { symbol: string; name: string; contractAddress: string; imageUrl: string }[] = [];
  filteredTokens = [...this.tokens];

  constructor() {
    // Используем effect для автоматического обновления connected
    effect(() => {
      this.connected.set(this.walletAddress() !== null);
    },{ allowSignalWrites: true });

    effect(() => {
      if (this.network()) {
        this.loadTokensForNetwork(this.network()!);
      }
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

  updateWalletAddress(address: string | null): void {
    this.walletAddress.set(address);
  }

  updateNetwork(networkId: string): void {
    this.network.set(networkId);
  }

  updateProvider(provider: string | null): void {
    this.provider.set(provider);
  }

  disconnect(): void {
    this.walletAddress.set(null);
    this.provider.set(null);
    this.network.set(null);
    this.connected.set(false);
  }
}
