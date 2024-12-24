import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlockchainStateService {
  readonly walletAddress = signal<string | null>(null); // Адрес кошелька
  readonly provider = signal<string | null>(null); // Выбранная сеть
  readonly network = signal<string | null>(null); // Выбранная сеть
  readonly connected = signal<boolean>(false); // Статус подключения

  constructor() {
    // Используем effect для автоматического обновления connected
    effect(() => {
      this.connected.set(this.walletAddress() !== null);
    },{ allowSignalWrites: true });
  }

  updateWalletAddress(address: string | null): void {
    this.walletAddress.set(address);
  }

  updateNetwork(networkId: string): void {
    this.network.set(networkId);
  }

  updateProvider(provider: string | null): void {
    this.provider.set(provider);
  }

  disconnect(): void {
    this.walletAddress.set(null);
    this.provider.set(null);
    this.network.set(null);
    this.connected.set(false);
  }
}
