import { Injectable, signal, effect, computed } from '@angular/core';
import { Network, Wallets } from '../models/wallet-provider.interface';
import { Token } from '../pages/trade/trade.component';

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {
  // Управление провайдерами
  private providers: Record<string, { provider: any; type: 'EVM' | 'SVM' | 'multichain' }> = {};
  private currentProviderId: string | null = null;

  // Сигналы состояния
  readonly walletAddress = signal<string | null>(null); // Адрес кошелька
  readonly network = signal<Network | null>(null); // Выбранная сеть
  readonly connected = signal<boolean>(false); // Статус подключения
  readonly allNetworks = signal<Network[]>([]);
  searchText = signal<string>('');
  // filteredTokens = [...this.tokens];

  networks = signal<Network[]>([]);

  tokens = signal<Token[]>([]);

  filteredTokens = computed(() => [...this.tokens()]);

  constructor() {
    // Эффект для обновления статуса подключения
    effect(() => {
      this.connected.set(this.walletAddress() !== null);
    }, { allowSignalWrites: true });

    // Эффект для загрузки токенов при изменении сети
    effect(() => {
      if (this.network()) {
        this.loadTokensForNetwork(this.network()!.id);
      }
    });

    effect(() => {
      console.log("netowrk", this.network());
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

  async loadProviders(): Promise<Wallets[]> {
    const response = await fetch('/data/providers.json');
    return await response.json();
  }

  // Методы управления состоянием
  private loadTokensForNetwork(network: number): void {
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

  async fetchTokensForNetwork(networkId: number): Promise<Token[]> {
    try {
        const response = await fetch(`/data/tokens.json`);
        if (!response.ok) {
            throw new Error(`Failed to load tokens for network ${networkId}`);
        }
        const data = await response.json();
        const tokensForNetwork = data.tokensEVM[networkId] || data.tokensSVM[networkId];

        if (tokensForNetwork) {
            return tokensForNetwork.map((token: any) => ({
                symbol: token.symbol,
                name: token.name,
                contractAddress: token.address,
                imageUrl: token.logoURI,
                decimals: token.decimals
            }));
        } else {
            console.warn(`No tokens found for network ${networkId}`);
            return [];
        }
    } catch (error) {
        console.error(`Error loading tokens: ${error}`);
        return [];
    }
}


public loadNetworks(type: string, force?: boolean): void {
  const allNetworks = this.allNetworks();
  if (type === 'multichain') {
    this.networks.set(allNetworks);
  } else {
    this.networks.set(allNetworks.filter((network: Network) => network.chainType === type));
  }

  if (force) {
    this.updateNetwork(1);
  }
}

  updateWalletAddress(address: string | null): void {
    this.walletAddress.set(address);
  }

  getCurrentWalletAddress(): string | null {
    return this.walletAddress();
  }

  updateNetwork(chainId: number): void {
    const foundNetwork = this.networks().find(n => n.id === chainId);
    this.network.set(foundNetwork ?? null);
  }

  getCurrentNetwork(): Network | null {
    return this.network();
  }

  disconnect(): void {
    this.walletAddress.set(null);
    this.loadNetworks("multichain", true);
    //this.network.set(null);
    this.connected.set(false);
  }
}
