import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';
import { BlockchainStateService } from './services/blockchain-state.service';
import { routes } from './app.routes';
import { BackpackProvider, CoinbaseWalletProvider, LedgerProvider, MagicEdenProvider, MetaMaskProvider, OkxWalletProvider, PhantomProvider, RabbyWalletProvider, SolflareProvider, TrustWalletProvider, WalletProviderManager } from './models/network.model';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

function initializeApp(
  stateService: BlockchainStateService
): () => Promise<void> {
  return async () => {
    const walletManager = new WalletProviderManager();

    const response = await fetch('/data/providers.json');
    const providers = await response.json();

    // Регистрация провайдеров
    providers.forEach((provider: { id: string; name: string; type: string }) => {
      switch (provider.id) {
        case 'metamask':
          stateService.registerProvider(provider.id, new MetaMaskProvider(walletManager), provider.type);
          break;
        case 'solflare':
          stateService.registerProvider(provider.id, new SolflareProvider(), provider.type);
          break;
        case 'phantom':
          stateService.registerProvider(provider.id, new PhantomProvider(walletManager), provider.type);
          break;
        case 'magic-eden':
          stateService.registerProvider(provider.id, new MagicEdenProvider(walletManager), provider.type);
          break;
        case 'backpack':
          stateService.registerProvider(provider.id, new BackpackProvider(), provider.type);
          break;
        case 'ledger':
          stateService.registerProvider(provider.id, new LedgerProvider(), provider.type);
          break;
        case 'trust-wallet':
          stateService.registerProvider(provider.id, new TrustWalletProvider(), provider.type);
          break;
        case 'okx-wallet':
          stateService.registerProvider(provider.id, new OkxWalletProvider(), provider.type);
          break;
        case 'coinbase-wallet':
          stateService.registerProvider(provider.id, new CoinbaseWalletProvider(), provider.type);
          break;
        case 'rabby-wallet':
          stateService.registerProvider(provider.id, new RabbyWalletProvider(walletManager), provider.type);
          break;
        default:
          console.warn(`Provider ${provider.id} is not yet implemented.`);
      }
    });
  };
}



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: (providersService: BlockchainStateService) =>
        initializeApp(providersService),
      deps: [BlockchainStateService],
      multi: true,
    },
    provideHttpClient(),
    provideRouter(routes), // Обеспечивает маршрутизацию
    provideHttpClient(), // Обеспечивает HTTP-клиент для работы с API
    importProvidersFrom(BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true })
  ],
}
