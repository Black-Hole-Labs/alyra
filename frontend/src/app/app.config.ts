import {
  ApplicationConfig,
  importProvidersFrom,
  Injector,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BlockchainStateService } from './services/blockchain-state.service';
import { routes } from './app.routes';
import { Network, NetworkId, ProviderType } from './models/wallet-provider.interface';
import {
  MetaMaskProvider,
  SolflareProvider,
  PhantomProvider,
  MagicEdenProvider,
  BackpackProvider,
  TrustWalletProvider,
  OkxWalletProvider,
  CoinbaseWalletProvider,
  RabbyWalletProvider,
  WalletProviderManager,
} from './models/network.model';
import { WalletConnectEvmProvider } from './models/walletconnect-provider';

import providers from '@public/data/providers.json';
import networksImport from '@public/data/networks.json';

function registerProviders(
  stateService: BlockchainStateService,
  providers: any[],
  walletManager: WalletProviderManager,
  injector: Injector,
  networks: Network[],
): void {
  providers.forEach((provider) => {
    switch (provider.id) {
      case 'metamask':
        stateService.registerProvider(
          provider.id,
          new MetaMaskProvider(walletManager, injector),
          provider.type as ProviderType,
        );
        break;
      case 'solflare':
        stateService.registerProvider(provider.id, new SolflareProvider(injector), provider.type as ProviderType);
        break;
      case 'phantom':
        stateService.registerProvider(
          provider.id,
          new PhantomProvider(walletManager, injector),
          provider.type as ProviderType,
        );
        break;
      case 'magic-eden':
        stateService.registerProvider(
          provider.id,
          new MagicEdenProvider(walletManager, injector),
          provider.type as ProviderType,
        );
        break;
      case 'backpack':
        stateService.registerProvider(
          provider.id,
          new BackpackProvider(walletManager, injector),
          provider.type as ProviderType,
        );
        break;
      case 'trust-wallet':
        stateService.registerProvider(provider.id, new TrustWalletProvider(injector), provider.type as ProviderType);
        break;
      case 'okx-wallet':
        stateService.registerProvider(provider.id, new OkxWalletProvider(injector), provider.type as ProviderType);
        break;
      case 'coinbase-wallet':
        stateService.registerProvider(provider.id, new CoinbaseWalletProvider(injector), provider.type as ProviderType);
        break;
      case 'rabby-wallet':
        stateService.registerProvider(
          provider.id,
          new RabbyWalletProvider(walletManager, injector),
          provider.type as ProviderType,
        );
        break;
      case 'walletconnect':
        stateService.registerProvider(
          provider.id,
          new WalletConnectEvmProvider(injector, networks),
          provider.type as ProviderType,
        );
        break;
      default:
        console.warn(`Provider ${provider.id} is not yet implemented.`);
    }
  });
}

async function initializeApp(injector: Injector): Promise<void> {
  const walletManager = new WalletProviderManager();
  const stateService = injector.get(BlockchainStateService);

  try {
    const _providers: any[] = providers;
    const _networks: Network[] = networksImport;

    registerProviders(stateService, _providers, walletManager, injector, _networks);
  } catch (error) {
    console.error('Error loading config:', error);
  }

  try {
    const allNetworks: Network[] = networksImport;

    // const excludeIds = [146, 1329, 324, 250, 1135, 13371, 1088, 42220, 122, 1284, 288];
    // const visibleNetworks = allNetworks.filter(network => !excludeIds.includes(network.id));

    // stateService.allNetworks.set(visibleNetworks);
    // stateService.networks.set(visibleNetworks);

    stateService.allNetworks.set(allNetworks);
    stateService.networks.set(allNetworks);
    stateService.tryAutoConnect();
  } catch (error) {
    console.error('Error loading networks:', error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector) => () => initializeApp(injector),
      deps: [Injector],
      multi: true,
    },
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
