import { Injectable, signal, effect, computed, Injector, Signal } from '@angular/core';
import { Network, NetworkId, ProviderType, Wallets } from '../models/wallet-provider.interface';
import { Token } from '../pages/trade/trade.component';
import { BehaviorSubject } from 'rxjs';

import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';

import { BackpackProvider, CoinbaseWalletProvider, MagicEdenProvider, MetaMaskProvider, OkxWalletProvider, PhantomProvider, RabbyWalletProvider, SlushProvider, SolflareProvider, TrustWalletProvider } from '../models/network.model';
import { WalletConnectEvmProvider } from '../models/walletconnect-provider';
import {
  WalletProviderManager,
} from '../models/network.model';

import tokensSearch from '@public/data/tokens_search.json';
import providersImport from '@public/data/providers.json';
import tokensImport from '@public/data/tokens.json';
import { SuiClient } from '@mysten/sui/client';

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
  tokensMVM: Record<string, TokenData[]>;
}

type ProviderInfo = {
  id: string | null;
  address: string | null;
  nameService: string | null;
};

export type Ecosystem = Exclude<ProviderType, ProviderType.MULTICHAIN>;

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {
  private providers: Record<string, { provider: any; type: ProviderType }> = {};
  // private currentProviderId: string | null = null;
  readonly currentEcosystem: Signal<Ecosystem> = computed( () => this.networkSell()!.chainType as Ecosystem);
  private rpcCache = new Map<number, string>();

  // readonly walletAddress = signal<string | null>(null);

  readonly networkSell = signal<Network | undefined>(undefined);
  readonly networkBuy = signal<Network | undefined>(undefined);
  
  //readonly connected = signal<boolean>(false);
  readonly allNetworks = signal<Network[]>([]);

  customAddress = signal<string>('');

  searchText = signal<string>('');

  tokens = signal<Token[]>([]);
  allTokens = signal<Token[]>([]);

  private tokensSubject = new BehaviorSubject<boolean>(false);
  readonly tokensLoading$ = this.tokensSubject.asObservable();

  private static isRegisteredProviders = false;
  walletManager: WalletProviderManager | undefined;
  public pendingProviderId: string | null = null;
  private ecosystemForPopup = signal<Ecosystem | null>(null);

  readonly currentProviderIds = signal<Record<Ecosystem, ProviderInfo>>({
    [ProviderType.EVM]: { id: null, address: null, nameService: null },
    [ProviderType.SVM]: { id: null, address: null, nameService: null },
    [ProviderType.MVM]: { id: null, address: null, nameService: null },
  });

  readonly connected = computed(() => {
    const m = this.currentProviderIds();
    return !!m[ProviderType.EVM].address || !!m[ProviderType.SVM].address || !!m[ProviderType.MVM].address;
  });
  // readonly evmWalletAddress = signal<string | null>(null);
  // readonly svmWalletAddress = signal<string | null>(null);

  constructor(private injector: Injector) {
    // effect(
    //   () => {
    //     this.connected.set(
    //       (this.currentProviderIds()[ProviderType.EVM].address !== null) || (this.currentProviderIds()[ProviderType.SVM].address !== null)
    //     );
    //   },
    //   { allowSignalWrites: true }
    // );

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

  // public setEvmAddress(address: string): void {
  //   this.evmWalletAddress.set(address);
  // }
  // public setSvmAddress(address: string): void {
  //   this.svmWalletAddress.set(address);
  // }

  public setCurrentProvider(id: string, address: string, nameService: string | null = null): void {
    const raw = this.currentProviderIds();
    let type = this.providers[id].type;
    if (type === ProviderType.MULTICHAIN)
    {
      type = this.currentEcosystem() ? this.currentEcosystem() : ProviderType.EVM;
    }
    this.currentProviderIds.set({
      ...raw,
      [type]: { id, address, nameService },
    });
  }

  public getCurrentProviderIdByType(type: Ecosystem): string | null {
    return this.currentProviderIds()[type].id || null;
  }

  // public getCurrentAddressByType(type: Ecosystem): string | null {
  //   return type === ProviderType.EVM
  //     ? this.evmWalletAddress()
  //     : this.svmWalletAddress();
  // }

  public disconnectEvm(): void {
    const raw = this.currentProviderIds();
    this.currentProviderIds.set({
      ...raw,
      [ProviderType.EVM]: { id: null, address: null, nameService: null },
    });
  }
  
  public disconnectSvm(): void {
    const raw = this.currentProviderIds();
    this.currentProviderIds.set({
      ...raw,
      [ProviderType.SVM]: { id: null, address: null, nameService: null },
    });
  }

    public disconnectMvm(): void {
    const raw = this.currentProviderIds();
    this.currentProviderIds.set({
      ...raw,
      [ProviderType.MVM]: { id: null, address: null, nameService: null },
    });
  }

  public disconnectAll(): void {
    this.currentProviderIds.set({
      [ProviderType.EVM]: { id: null, address: null, nameService: null },
      [ProviderType.SVM]: { id: null, address: null, nameService: null },
      [ProviderType.MVM]: { id: null, address: null, nameService: null },
    });
    sessionStorage.clear();
  }

  registerProviders()
  {
    if (BlockchainStateService.isRegisteredProviders) return;

    providersImport.forEach((provider) => {
    switch (provider.id) {
      case 'metamask':
        this.registerProvider(
          provider.id,
          new MetaMaskProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'solflare':
        this.registerProvider(provider.id, new SolflareProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'slush':
        this.registerProvider(provider.id, new SlushProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'phantom':
        this.registerProvider(
          provider.id,
          new PhantomProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'magic-eden':
        this.registerProvider(
          provider.id,
          new MagicEdenProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'backpack':
        this.registerProvider(
          provider.id,
          new BackpackProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'trust-wallet':
        this.registerProvider(provider.id, new TrustWalletProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'okx-wallet':
        this.registerProvider(provider.id, new OkxWalletProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'coinbase-wallet':
        this.registerProvider(provider.id, new CoinbaseWalletProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'rabby-wallet':
        this.registerProvider(
          provider.id,
          new RabbyWalletProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'walletconnect':
        this.registerProvider(
          provider.id,
          new WalletConnectEvmProvider(this.injector!, this.allNetworks()),
          provider.type as ProviderType,
        );
        break;
      default:
        console.warn(`Provider ${provider.id} is not yet implemented.`);
    }
  })
    
    BlockchainStateService.isRegisteredProviders = true;
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
        } else if (network.chainType === 'SVM') {
          const connection = new Connection(url, 'confirmed');
          await connection.getVersion();
        } else if (network.chainType === ProviderType.MVM || network.chainType === 'SUI') {
        const sui = new SuiClient({ url });
        await sui.getRpcApiVersion();
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
      this.updateNetworkBuy(NetworkId.ETHEREUM_MAINNET);
      return Promise.resolve();
    }
    this.registerProviders();
    const provider = this.getProvider(providerId);
    if (!provider) return Promise.resolve();

    this.updateNetworkSell(Number(networkId!));
    this.updateNetworkBuy(Number(networkId!));

    return provider
      .connect()
      .then(({ address, nameService }: { address: string, nameService: string | null }) => {
        this.setCurrentProvider(providerId, address, nameService);
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

  // setCurrentProvider(id: string): void {
  //   this.currentProviderId = id;
  // }

  getProvider(id: string): any {
    return this.providers[id].provider;
  }

  getType(id: string): any {
    return this.providers[id].type;
  }

  getCurrentProvider(): any {
    if (this.currentEcosystem() === ProviderType.EVM)
    {
      const id = this.currentProviderIds()[ProviderType.EVM].id;
      return id ? this.providers[id] : null;
    }
    else if (this.currentEcosystem() === ProviderType.SVM)
    {
      const id = this.currentProviderIds()[ProviderType.SVM].id;
      return id ? this.providers[id] : null;
    }
    else if (this.currentEcosystem() === ProviderType.MVM)
    {
      const id = this.currentProviderIds()[ProviderType.MVM].id;
      return id ? this.providers[id] : null;
    }
  }

  getCurrentProviderId(): string | null {
    // console.log('Getting current provider ID:', this.currentProviderId);
    if (this.currentEcosystem() === ProviderType.EVM)
    {
      return this.currentProviderIds()[ProviderType.EVM].id;
    }
    else if (this.currentEcosystem() === ProviderType.SVM)
    {
      return this.currentProviderIds()[ProviderType.SVM].id;
    }
    else
    {
      return this.currentProviderIds()[ProviderType.MVM].id;
    }
  }

  async loadProviders(): Promise<Wallets[]> {
    return providersImport;
  }

  setAllTokensForNetwork(network: number): void {
    const networkKey = network.toString();
    const tokensData = tokensSearch as unknown as TokensData;
    const tokensForNetwork = tokensData.tokensEVM[networkKey] || tokensData.tokensSVM[networkKey] || tokensData.tokensMVM[networkKey];

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
    const tokensForNetwork = tokensData.tokensEVM[networkKey] || tokensData.tokensSVM[networkKey] || tokensData.tokensMVM[networkKey];

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
    const mvmList = (tokensImport as TokensData).tokensMVM[networkKey] || [];
    const tokensForNetwork = evmList.length ? evmList : svmList.length ? svmList : mvmList.length ? mvmList : [];

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

    public getAllTokensForNetwork(networkId: number): Token[] {
    const networkKey = networkId.toString();
    const evmList = (tokensSearch as TokensData).tokensEVM[networkKey] || [];
    const svmList = (tokensSearch as TokensData).tokensSVM[networkKey] || [];
    const mvmList = (tokensSearch as TokensData).tokensMVM[networkKey] || [];
    const tokensForNetwork = evmList.length ? evmList : svmList.length ? svmList : mvmList.length ? mvmList : [];

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
    if (this.currentEcosystem() === ProviderType.EVM)
    {
      this.currentProviderIds()[ProviderType.EVM].address = address;
    }
    else if (this.currentEcosystem() === ProviderType.SVM)
    {
      this.currentProviderIds()[ProviderType.SVM].address = address;
    }
    else if (this.currentEcosystem() === ProviderType.MVM)
    {
      this.currentProviderIds()[ProviderType.MVM].address = address;
    }

    // this.walletAddress.set(address);
  }

  getCurrentWalletAddress(): string | null {
    if (this.currentEcosystem() === ProviderType.EVM)
    {
      return this.currentProviderIds()[ProviderType.EVM].address;
    }
    else if (this.currentEcosystem() === ProviderType.SVM)
    {
      return this.currentProviderIds()[ProviderType.SVM].address;
    }
    else
    {
      return this.currentProviderIds()[ProviderType.MVM].address;
    }
    // return this.walletAddress();
  }

  updateNetworkSell(chainId: number): void {
    const foundNetwork = this.allNetworks().find((n) => n.id === chainId);
    this.networkSell.set(foundNetwork ?? undefined);
    if (foundNetwork) {
      this.updateNetworkBackgroundIcons(foundNetwork);
    }
  }

  updateNetworkBuy(chainId: number): void {
    const foundNetwork = this.allNetworks().find((n) => n.id === chainId);
    this.networkBuy.set(foundNetwork ?? undefined);
  }

  getCurrentNetworkSell(): Network | undefined {
    return this.networkSell();
  }

  getCurrentNetworkBuy(): Network | undefined {
    return this.networkBuy();
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

  disconnect(address: string): void {
    // this.walletAddress.set(null);
    if (this.currentProviderIds()[ProviderType.EVM].address === address)
    {
      this.currentProviderIds()[ProviderType.EVM].address = null;
      this.currentProviderIds()[ProviderType.EVM].id = null;
    }
    else if (this.currentProviderIds()[ProviderType.SVM].address === address)
    {
      this.currentProviderIds()[ProviderType.SVM].address = null;
      this.currentProviderIds()[ProviderType.SVM].id = null;
    }
    else if (this.currentProviderIds()[ProviderType.MVM].address === address)
    {
      this.currentProviderIds()[ProviderType.MVM].address = null;
      this.currentProviderIds()[ProviderType.MVM].id = null;
    }
    sessionStorage.clear();
    //this.network.set(null);
    // this.connected.set(false);
  }

  public updateNetworkBackgroundIcons(network: Network): void {
    const root = document.documentElement;
    root.style.setProperty('--current-network-icon-1', `url(${network.logoURI})`);
    root.style.setProperty('--current-network-icon-2', `url(${network.logoURI})`);
  }

  public getNetworkById(id: number): Network | undefined {
    return this.allNetworks().find((network) => network.id === id);
  }

  isEcosystemConnected(type: Ecosystem): boolean {
    return !!this.currentProviderIds()[type]?.address;
  }

  setEcosystemForPopup(type: Ecosystem): void {
    this.ecosystemForPopup.set(type);
  }

  getEcosystemForPopup(): Ecosystem | null {
    return this.ecosystemForPopup();
  }

  clearEcosystemForPopup(): void {
    this.ecosystemForPopup.set(null);
  }
}
