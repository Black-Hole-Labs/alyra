import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  Injector,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import networksImport from '@public/data/networks.json';

import { routes } from './app.routes';
import { WalletProviderManager } from './models/network.model';
import { NetworkId } from './models/wallet-provider.interface';
import { BlockchainStateService } from './services/blockchain-state.service';

async function initializeApp(injector: Injector): Promise<void> {
  const walletManager = new WalletProviderManager();
  const stateService = injector.get(BlockchainStateService);

  stateService.walletManager = walletManager;
  stateService.allNetworks.set(networksImport);

  await stateService.getWorkingRpcUrlForNetwork(NetworkId.ETHEREUM_MAINNET);
  await stateService.getWorkingRpcUrlForNetwork(NetworkId.SOLANA_MAINNET);
  await stateService.getWorkingRpcUrlForNetwork(NetworkId.SUI_MAINNET);

  try {
    // const allNetworks: Network[] = networksImport;

    // const excludeIds = [146, 1329, 324, 250, 1135, 13371, 1088, 42220, 122, 1284, 288];
    // const visibleNetworks = allNetworks.filter(network => !excludeIds.includes(network.id));

    // stateService.allNetworks.set(visibleNetworks);
    // stateService.networks.set(visibleNetworks);

    await stateService.tryAutoConnect();
  } catch (error) {
    console.error('Error during autoconnect:', error);
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
