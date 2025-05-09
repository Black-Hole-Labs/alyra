import { ApplicationConfig, Injector, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';
import { BlockchainStateService } from './services/blockchain-state.service';
import { routes } from './app.routes';
import { BackpackProvider, CoinbaseWalletProvider, MagicEdenProvider, MetaMaskProvider, OkxWalletProvider, PhantomProvider, RabbyWalletProvider, SolflareProvider, TrustWalletProvider, WalletProviderManager } from './models/network.model';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { Network } from './models/wallet-provider.interface';

function initializeApp(
  injector: Injector
): () => Promise<void> {
  return async () => {
    const walletManager = new WalletProviderManager();
    
    const stateService = injector.get(BlockchainStateService);

    const response = await fetch('/data/providers.json');
    const providers = await response.json();

    // Регистрация провайдеров
    providers.forEach((provider: { id: string; name: string; type: string }) => {
      switch (provider.id) {
        case 'metamask':
          stateService.registerProvider(provider.id, new MetaMaskProvider(walletManager, injector), provider.type);
          break;
        case 'solflare':
          stateService.registerProvider(provider.id, new SolflareProvider(injector), provider.type);
          break;
        case 'phantom':
          stateService.registerProvider(provider.id, new PhantomProvider(walletManager, injector), provider.type);
          break;
        case 'magic-eden':
          stateService.registerProvider(provider.id, new MagicEdenProvider(walletManager, injector), provider.type);
          break;
        case 'backpack':
          stateService.registerProvider(provider.id, new BackpackProvider(walletManager, injector), provider.type);
          break;
        case 'trust-wallet':
          stateService.registerProvider(provider.id, new TrustWalletProvider(injector), provider.type);
          break;
        case 'okx-wallet':
          stateService.registerProvider(provider.id, new OkxWalletProvider(injector), provider.type);
          break;
        case 'coinbase-wallet':
          stateService.registerProvider(provider.id, new CoinbaseWalletProvider(injector), provider.type);
          break;
        case 'rabby-wallet':
          stateService.registerProvider(provider.id, new RabbyWalletProvider(walletManager, injector), provider.type);
          break;
        default:
          console.warn(`Provider ${provider.id} is not yet implemented.`);
      }
    });

    const responseNetworks = await fetch('/data/networks.json');
    const allNetworks: Network[] = await responseNetworks.json();

    // const excludeIds = [146, 1329, 324, 250, 1135, 13371, 1088, 42220, 122, 1284, 288];
    // const visibleNetworks = allNetworks.filter(network => !excludeIds.includes(network.id));

    // stateService.allNetworks.set(visibleNetworks);
    stateService.networks.set(allNetworks);
    stateService.updateNetwork(1);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector) => initializeApp(injector),
      deps: [Injector],
      multi: true,
    },
    provideHttpClient(),
    provideRouter(routes), // Обеспечивает маршрутизацию
    provideHttpClient(), // Обеспечивает HTTP-клиент для работы с API
    importProvidersFrom(BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations()
  ],
}
