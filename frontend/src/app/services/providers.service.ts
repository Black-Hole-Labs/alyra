import { Injectable, Injector } from '@angular/core';
import { BackpackProvider, CoinbaseWalletProvider, MagicEdenProvider, MetaMaskProvider, OkxWalletProvider, PhantomProvider, RabbyWalletProvider, SolflareProvider, TrustWalletProvider, WalletProviderManager } from '../models/network.model';
import { Network, ProviderType } from '../models/wallet-provider.interface';
import { BlockchainStateService } from './blockchain-state.service';
import { WalletConnectEvmProvider } from '../models/walletconnect-provider';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  providers: any[] | undefined;
  walletManager: WalletProviderManager | undefined;
  networks: Network[] | undefined;

  constructor(private stateService: BlockchainStateService,
    private injector: Injector
  ) {}

  registerProviders()
  {
    this.providers?.forEach((provider) => {
    switch (provider.id) {
      case 'metamask':
        this.stateService?.registerProvider(
          provider.id,
          new MetaMaskProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'solflare':
        this.stateService?.registerProvider(provider.id, new SolflareProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'phantom':
        this.stateService?.registerProvider(
          provider.id,
          new PhantomProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'magic-eden':
        this.stateService?.registerProvider(
          provider.id,
          new MagicEdenProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'backpack':
        this.stateService?.registerProvider(
          provider.id,
          new BackpackProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'trust-wallet':
        this.stateService?.registerProvider(provider.id, new TrustWalletProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'okx-wallet':
        this.stateService?.registerProvider(provider.id, new OkxWalletProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'coinbase-wallet':
        this.stateService?.registerProvider(provider.id, new CoinbaseWalletProvider(this.injector!), provider.type as ProviderType);
        break;
      case 'rabby-wallet':
        this.stateService?.registerProvider(
          provider.id,
          new RabbyWalletProvider(this.walletManager!, this.injector!),
          provider.type as ProviderType,
        );
        break;
      case 'walletconnect':
        this.stateService?.registerProvider(
          provider.id,
          new WalletConnectEvmProvider(this.injector!, this.networks!),
          provider.type as ProviderType,
        );
        break;
      default:
        console.warn(`Provider ${provider.id} is not yet implemented.`);
    }
  })
  }
  

}
