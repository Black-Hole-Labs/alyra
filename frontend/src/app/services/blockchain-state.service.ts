import { Injectable, signal, effect, computed } from '@angular/core';
import { Network, NetworkId, ProviderType, Wallets } from '../models/wallet-provider.interface';
import { Token } from '../pages/trade/trade.component';
import { BehaviorSubject } from 'rxjs';

import tokensSearch from '@public/data/tokens_search.json';

import providersImport from '@public/data/providers.json';
import tokensImport from '@public/data/tokens.json';
import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';

interface TokenData {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  priceUSD: string;
  coinKey?: string;
  logoURI: string;
}

interface TokensData {
  tokensEVM: Record<string, TokenData[]>;
  tokensSVM: Record<string, TokenData[]>;
}

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {
  private providers: Record<string, { provider: any; type: ProviderType }> = {};
  private currentProviderId: string | null = null;
  private rpcCache = new Map<number, string>();

  readonly walletAddress = signal<string | null>(null);

  readonly networkSell = signal<Network | undefined>(undefined);
  readonly networkBuy = signal<Network | undefined>(undefined);
  
  readonly connected = signal<boolean>(false);
  readonly allNetworks = signal<Network[]>([]);

  customAddress = signal<string>('');

  searchText = signal<string>('');

  tokens = signal<Token[]>([]);
  allTokens = signal<Token[]>([]);

  private tokensSubject = new BehaviorSubject<boolean>(false);
  public tokensLoading$ = this.tokensSubject.asObservable();

  constructor() {
    effect(
      () => {
        this.connected.set(this.walletAddress() !== null);
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        if (this.networkSell()) {
          this.setTokensForNetwork(this.networkSell()!.id);
          this.updateNetworkBackgroundIcons(this.networkSell()!);
          this.setAllTokensForNetwork(this.networkSell()!.id);
        }
      },
      { allowSignalWrites: true },
    );
  }

  public async getWorkingRpcUrlForNetwork(id: number): Promise<string> {
    if (this.rpcCache.has(id)) {
      return this.rpcCache.get(id)!;
    }

    const network = this.getNetworkById(id);
    if (!network) {
      throw new Error(`Network with id ${id} not found!`);
    }

    const urls = network.rpcUrls || [];
    if (!urls.length) {
      throw new Error(`Network with id=${id} does not contain any RPCs!`);
    }

    for (const url of urls) {
      try {
        if (network.chainType === 'EVM') {
          const provider = new ethers.JsonRpcProvider(url);
          await provider.getBlockNumber();
        } else {
          const connection = new Connection(url, 'confirmed');
          await connection.getVersion();
        }

        this.rpcCache.set(id, url);
        return url;

      } catch (error) {
        console.warn(`RPC ${url} is broken for id=${id}:`, error);
      }
    }

    throw new Error(`No working RPCs for network id=${id}!`);
  }

  public tryAutoConnect(): Promise<void> {
    const providerId = sessionStorage.getItem('currentProvider');
    const networkId = sessionStorage.getItem('networkId');
    if (!providerId) {
      this.updateNetworkSell(NetworkId.ETHEREUM_MAINNET);
      return Promise.resolve();
    }

    const provider = this.getProvider(providerId);
    if (!provider) return Promise.resolve();

    return provider
      .connect()
      .then(({ address }: { address: string }) => {
        this.updateWalletAddress(address);
        this.setCurrentProvider(providerId);
        this.updateNetworkSell(Number(networkId!));
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
    return providersImport;
  }

  setAllTokensForNetwork(network: number): void {
    const networkKey = network.toString();
    const tokensData = tokensSearch as unknown as TokensData;
    const tokensForNetwork = tokensData.tokensEVM[networkKey] || tokensData.tokensSVM[networkKey];

    if (tokensForNetwork) {
      this.allTokens.set(
        tokensForNetwork.map((token: TokenData) => ({
          symbol: token.symbol,
          name: token.name,
          contractAddress: token.address,
          chainId: token.chainId,
          imageUrl: token.logoURI,
          decimals: token.decimals,
        })) as Token[],
      );
    } else {
      console.warn(`No tokens found for network ${network}`);
      this.allTokens.set([]);
    }
  }

  private setTokensForNetwork(network: number): void {
    const tokensData = tokensImport as unknown as TokensData;
    const networkKey = network.toString();
    const tokensForNetwork = tokensData.tokensEVM[networkKey] || tokensData.tokensSVM[networkKey];

    if (tokensForNetwork) {
      this.tokens.set(
        tokensForNetwork.map((token: TokenData) => ({
          symbol: token.symbol,
          name: token.name,
          contractAddress: token.address,
          chainId: token.chainId,
          imageUrl: token.logoURI,
          decimals: token.decimals,
        })) as Token[],
      );
    } else {
      console.warn(`No tokens found for network ${network}`);
      this.tokens.set([]);
    }
  }

  public getTokensForNetwork(networkId: number): Token[] {
    const networkKey = networkId.toString();
    const evmList = (tokensImport as TokensData).tokensEVM[networkKey] || [];
    const svmList = (tokensImport as TokensData).tokensSVM[networkKey] || [];
    const tokensForNetwork = evmList.length ? evmList : svmList.length ? svmList : [];

    if (!tokensForNetwork.length) {
      console.warn(`No tokens found for network ${networkId}`);
      return [];
    }

    return tokensForNetwork.map((t: TokenData) => ({
      symbol: t.symbol,
      name: t.name,
      contractAddress: t.address,
      chainId: t.chainId,
      imageUrl: t.logoURI,
      decimals: t.decimals,
    }));
  }

  updateWalletAddress(address: string | null): void {
    this.walletAddress.set(address);
  }

  getCurrentWalletAddress(): string | null {
    return this.walletAddress();
  }

  updateNetworkSell(chainId: number): void {
    const foundNetwork = this.allNetworks().find((n) => n.id === chainId);
    this.networkSell.set(foundNetwork ?? undefined);
    if (foundNetwork) {
      this.updateNetworkBackgroundIcons(foundNetwork);
    }
  }

  getCurrentNetworkSell(): Network | undefined {
    return this.networkSell();
  }

  setCustomAddress(customAddress: string) {
    this.customAddress.set(customAddress);
  }

  setNetworkSell(network: Network) {
    this.networkSell.set(network);
    this.updateNetworkBackgroundIcons(network);
  }

  setNetworkBuy(network: Network) {
    this.networkBuy.set(network);
  }

  disconnect(): void {
    this.walletAddress.set(null);
    sessionStorage.clear();
    //this.network.set(null);
    this.connected.set(false);
  }

  public updateNetworkBackgroundIcons(network: Network): void {
    const root = document.documentElement;
    root.style.setProperty('--current-network-icon-1', `url(${network.logoURI})`);
    root.style.setProperty('--current-network-icon-2', `url(${network.logoURI})`);
  }

  public getNetworkById(id: number): Network | undefined {
    return this.allNetworks().find((network) => network.id === id);
  }
}
