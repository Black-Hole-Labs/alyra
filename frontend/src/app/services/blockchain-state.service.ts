import { Injectable, signal, effect, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {
  // Управление провайдерами
  private providers: Record<string, { provider: any; type: 'EVM' | 'SVM' | 'multichain' }> = {};
  private currentProviderId: string | null = null;

  // Сигналы состояния
  readonly walletAddress = signal<string | null>(null); // Адрес кошелька
  readonly network = signal<string | null>(null); // Выбранная сеть
  readonly connected = signal<boolean>(false); // Статус подключения
  searchText = signal<string>('');
  // filteredTokens = [...this.tokens];

  tokens = signal<{ symbol: string; name: string; contractAddress: string; imageUrl: string; decimals: string }[]>([]);

  filteredTokens = computed(() => [...this.tokens()]);

  constructor() {
    // Эффект для обновления статуса подключения
    this.loadTokensForNetwork("1");

    effect(() => {
      this.connected.set(this.walletAddress() !== null);
    }, { allowSignalWrites: true });

    // Эффект для загрузки токенов при изменении сети
    effect(() => {
      if (this.network()) {
        this.loadTokensForNetwork(this.network()!);
      }
    });
  }

  setSearchText(value: string) {
    this.searchText.set(value);
  }

  // Методы управления провайдерами
  registerProvider(id: string, provider: any, type: string): void {
    if (type != 'EVM' && type != 'SVM' && type != 'multichain')
    {
      throw new Error(`Invalid providerType: ${type}`);
    }
    // else
    // {
    //   console.log(`Set Provider Type: ${type} for provider: ${id}`);
    // }

    this.providers[id] = { provider, type };
  }

  setCurrentProvider(id: string): void {
    this.currentProviderId = id;
  }

  getProvider(id: string): any {
    return this.providers[id].provider;
  }

  getType(id: string): any {
    return this.providers[id].type;
  }

  getCurrentProvider(): any {
    return this.currentProviderId ? this.providers[this.currentProviderId] : null;
  }

  async loadProviders(): Promise<{ id: string; name: string; type: string }[]> {
    const response = await fetch('/data/providers.json');
    return await response.json();
  }

  // Методы управления состоянием
  private loadTokensForNetwork(network: string): void {
    fetch(`/data/tokens.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load tokens for network ${network}`);
        }
        return response.json();
      })
      .then((data) => {
        const tokensForNetwork = data.tokensEVM[network] || data.tokensSVM[network];

        if (tokensForNetwork) {
          this.tokens.set(
            tokensForNetwork.map((token: any) => ({
              symbol: token.symbol,
              name: token.name,
              contractAddress: token.address,
              imageUrl: token.logoURI,
              decimals: token.decimals
            }))
          );          
          //this.filteredTokens = [...this.tokens];
        } else {
          console.warn(`No tokens found for network ${network}`);
          this.tokens.set([]);
          //this.filteredTokens = [];
        }
      })
      .catch((error) => {
        console.error(`Error loading tokens: ${error.message}`);
        this.tokens.set([]);
        //this.filteredTokens = [];
      });
  }

  updateWalletAddress(address: string | null): void {
    this.walletAddress.set(address);
  }

  getCurrentWalletAddress(): string | null {
    return this.walletAddress();
  }

  updateNetwork(networkId: string): void {
    this.network.set(networkId);
  }

  getCurrentNetworkId(): string | null {
    return this.network();
  }

  disconnect(): void {
    this.walletAddress.set(null);
    this.network.set(null);
    this.connected.set(false);
  }
}
