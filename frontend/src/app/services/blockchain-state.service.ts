import { Injectable, signal, effect, computed } from '@angular/core';
import { Network, NetworkId, ProviderType, Wallets } from '../models/wallet-provider.interface';
import { Token } from '../pages/trade/trade.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {

  private providers: Record<string, { provider: any; type: ProviderType }> = {};
  private currentProviderId: string | null = null;

  readonly walletAddress = signal<string | null>(null);
  readonly network = signal<Network | null>(null);
  readonly connected = signal<boolean>(false);
  readonly allNetworks = signal<Network[]>([]);

  searchText = signal<string>('');

  networks = signal<Network[]>([]);

  tokens = signal<Token[]>([]);
  allTokens = signal<Token[]>([]);

  filteredTokens = computed(() => [...this.tokens()]);

  private tokensSubject = new BehaviorSubject<boolean>(false);
  public tokensLoading$ = this.tokensSubject.asObservable();

  constructor() {
    effect(() => {
      this.connected.set(this.walletAddress() !== null);
    }, { allowSignalWrites: true });

    effect(() => {
      if (this.network()) {
        this.loadTokensForNetwork(this.network()!.id);
        this.updateNetworkBackgroundIcons(this.network()!);
        this.loadAllTokensForNetwork(this.network()!.id);
      }
    });

    effect(() => {
      // console.log("network", this.network());
    });

  }

  public tryAutoConnect(): Promise<void> {
      const providerId = sessionStorage.getItem('currentProvider');
      const networkId = sessionStorage.getItem('networkId');
      if (!providerId) return Promise.resolve();
      const provider = this.getProvider(providerId);
      if (!provider) return Promise.resolve();

      return provider.connect()
        .then(({ address } : { address: string }) => {
          this.updateWalletAddress(address);
          this.setCurrentProvider(providerId);
          this.updateNetwork(Number(networkId!))
        })
        .catch(console.error);

  }

  setSearchText(value: string) {
    this.searchText.set(value);
  }

  registerProvider(id: string, provider: any, type: ProviderType): void {
    if (!Object.values(ProviderType).includes(type)) {
      throw new Error(`Invalid providerType: ${type}`);
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
    return this.currentProviderId ? this.providers[this.currentProviderId!] : null;
  }

  getCurrentProviderId(): string | null {
    // console.log('Getting current provider ID:', this.currentProviderId);
    return this.currentProviderId;
  }

  async loadProviders(): Promise<Wallets[]> {
    const response = await fetch('/data/providers.json');
    return await response.json();
  }

  private loadAllTokensForNetwork(network: number): void {
    fetch(`/data/tokens_search.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load tokens for network`);
        }
        return response.json();
      })
      .then((data) => {
        const tokensForNetwork = data.tokensEVM[network] || data.tokensSVM[network];

        if (tokensForNetwork) {
          this.allTokens.set(
            tokensForNetwork.map((token: any) => ({
              symbol: token.symbol,
              name: token.name,
              contractAddress: token.address,
              chainId: token.chainId,
              imageUrl: token.logoURI,
              decimals: token.decimals
            }))
          );          
          //this.filteredTokens = [...this.tokens];
        } else {
          console.warn(`No tokens found for network ${network}`);
          this.allTokens.set([]);
          //this.filteredTokens = [];
        }
      })
      .catch((error) => {
        console.error(`Error loading tokens: ${error.message}`);
        this.allTokens.set([]);
        //this.filteredTokens = [];
    });
  }

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
              chainId: token.chainId,
              imageUrl: token.logoURI,
              decimals: token.decimals
            }))
          );          
        } else {
          console.warn(`No tokens found for network ${network}`);
          this.tokens.set([]);
        }
      })
      .catch((error) => {
        console.error(`Error loading tokens: ${error.message}`);
        this.tokens.set([]);
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
                chainId: token.chainId,
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


public loadNetworks(type: ProviderType, force: boolean = false): void {
  const allNetworks = this.allNetworks();
  if (type === ProviderType.MULTICHAIN) {
    this.networks.set(allNetworks);
  } else {
    this.networks.set(allNetworks.filter(network => network.chainType === type));
  }

  if (force) {
    const defaultNetwork = this.networks().find(n => n.id === NetworkId.ETHEREUM_MAINNET);
    if (defaultNetwork) {
      this.updateNetwork(1);
    } else {
      console.warn('Default network with id 1 not found');
    }
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
    if (foundNetwork) {
      this.updateNetworkBackgroundIcons(foundNetwork);
    }
  }

  getCurrentNetwork(): Network | null {
    return this.network();
  }

  disconnect(): void {
    this.walletAddress.set(null);
    this.loadNetworks(ProviderType.MULTICHAIN, true);
    sessionStorage.clear();
    //this.network.set(null);
    this.connected.set(false);
  }

  private updateNetworkBackgroundIcons(network: Network): void {
    const root = document.documentElement;
    root.style.setProperty('--current-network-icon-1', `url(${network.logoURI})`);
    root.style.setProperty('--current-network-icon-2', `url(${network.logoURI})`);
  }
}
