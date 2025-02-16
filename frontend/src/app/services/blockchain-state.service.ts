import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {
  // Управление провайдерами
  private providers: Record<string, { provider: any; type: 'EVM' | 'SVM' | 'multichain' }> = {};
  private currentProviderId: string | null = null;

  // Сигналы состояния
  readonly walletAddress = signal<string | null>(null); // Адрес кошелька
  readonly network = signal<string | null>(null); // Выбранная сеть
  readonly connected = signal<boolean>(false); // Статус подключения

  tokens: { symbol: string; name: string; contractAddress: string; imageUrl: string, decimals: string }[] = [];
  filteredTokens = [...this.tokens];

  constructor() {
    // Эффект для обновления статуса подключения
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

  // Методы управления провайдерами
  registerProvider(id: string, provider: any, type: string): void {
    if (type != 'EVM' && type != 'SVM' && type != 'multichain')
    {
      throw new Error(`Invalid providerType: ${type}`);
    }
    else
    {
      console.log(`Set Provider Type: ${type} for provider: ${id}`);
    }

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
          this.tokens = tokensForNetwork.map((token: any) => ({
            symbol: token.symbol,
            name: token.name,
            contractAddress: token.address,
            imageUrl: token.logoURI,
            decimals: token.decimals
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

  disconnect(): void {
    this.walletAddress.set(null);
    this.network.set(null);
    this.connected.set(false);
  }
}
