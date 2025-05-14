import { ApplicationConfig, importProvidersFrom, Injector, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BlockchainStateService } from './services/blockchain-state.service';
import { routes } from './app.routes';
import { Network, ProviderType } from './models/wallet-provider.interface';
import {
  MetaMaskProvider, SolflareProvider, PhantomProvider, MagicEdenProvider,
  BackpackProvider, LedgerProvider, TrustWalletProvider, OkxWalletProvider,
  CoinbaseWalletProvider, RabbyWalletProvider, WalletProviderManager
} from './models/network.model';

function registerProviders(stateService: BlockchainStateService, providers: any[], walletManager: WalletProviderManager, injector: Injector): void {
  providers.forEach(provider => {
    switch (provider.id) {
      case 'metamask':
        stateService.registerProvider(provider.id, new MetaMaskProvider(walletManager, injector), provider.type as ProviderType);
        break;
      case 'solflare':
        stateService.registerProvider(provider.id, new SolflareProvider(injector), provider.type as ProviderType);
        break;
      case 'phantom':
        stateService.registerProvider(provider.id, new PhantomProvider(walletManager, injector), provider.type as ProviderType);
        break;
      case 'magic-eden':
        stateService.registerProvider(provider.id, new MagicEdenProvider(walletManager, injector), provider.type as ProviderType);
        break;
      case 'backpack':
        stateService.registerProvider(provider.id, new BackpackProvider(injector), provider.type as ProviderType);
        break;
      case 'ledger':
        stateService.registerProvider(provider.id, new LedgerProvider(), provider.type as ProviderType);
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
        stateService.registerProvider(provider.id, new RabbyWalletProvider(walletManager, injector), provider.type as ProviderType);
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
    const response = await fetch('/data/providers.json');
    if (!response.ok) throw new Error('Failed to load providers');
    const providers = await response.json();
    registerProviders(stateService, providers, walletManager, injector);
  } catch (error) {
    console.error('Error loading providers:', error);
  }

  try {
    const responseNetworks = await fetch('/data/networks.json');
    if (!responseNetworks.ok) throw new Error('Failed to load networks');
    const allNetworks: Network[] = await responseNetworks.json();

    // const excludeIds = [146, 1329, 324, 250, 1135, 13371, 1088, 42220, 122, 1284, 288];
    // const visibleNetworks = allNetworks.filter(network => !excludeIds.includes(network.id));

    // stateService.allNetworks.set(visibleNetworks);
    // stateService.networks.set(visibleNetworks);

    stateService.allNetworks.set(allNetworks);
    stateService.networks.set(allNetworks);
    stateService.updateNetwork(1);
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