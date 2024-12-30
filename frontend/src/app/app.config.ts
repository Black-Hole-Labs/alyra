import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER } from '@angular/core';
import { BlockchainStateService } from './services/blockchain-state.service';
import { routes } from './app.routes';
import { MetaMaskProvider, SolflareProvider } from './models/network.model';

function initializeApp(
  stateService: BlockchainStateService
): () => Promise<void> {
  return async () => {
    // Загрузка списка провайдеров из JSON
    const response = await fetch('/data/providers.json');
    const providers = await response.json();

    // Регистрация провайдеров
    providers.forEach((provider: { id: string; name: string; type: string }) => {
      if (provider.id === 'metamask') {
        stateService.registerProvider('metamask', new MetaMaskProvider(), provider.type);
      } 
      else if (provider.id === 'solflare') {
        stateService.registerProvider('solflare', new SolflareProvider(), provider.type);
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
  ],
};
