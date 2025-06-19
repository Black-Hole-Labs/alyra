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
import { Network, NetworkId } from './models/wallet-provider.interface';
import {
  WalletProviderManager,
} from './models/network.model';

import providersImport from '@public/data/providers.json';
import networksImport from '@public/data/networks.json';
import { ProvidersService } from './services/providers.service';

async function initializeApp(injector: Injector): Promise<void> {
  const walletManager  = new WalletProviderManager();
  const stateService   = injector.get(BlockchainStateService);
  const providerService = injector.get(ProvidersService);

  providerService.providers = providersImport;
  providerService.walletManager = walletManager;
  providerService.networks = networksImport;

  try {
    const allNetworks: Network[] = networksImport;

    // const excludeIds = [146, 1329, 324, 250, 1135, 13371, 1088, 42220, 122, 1284, 288];
    // const visibleNetworks = allNetworks.filter(network => !excludeIds.includes(network.id));

    // stateService.allNetworks.set(visibleNetworks);
    // stateService.networks.set(visibleNetworks);

    stateService.allNetworks.set(allNetworks);
    await stateService.tryAutoConnect();
  } catch (error) {
    console.error('Error loading networks:', error);
  }

  await stateService.getWorkingRpcUrlForNetwork(NetworkId.ETHEREUM_MAINNET);
  await stateService.getWorkingRpcUrlForNetwork(NetworkId.SOLANA_MAINNET);
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
