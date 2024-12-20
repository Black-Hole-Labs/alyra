import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlockchainProvidersService {
  private providers: Record<string, any> = {};
  private currentProviderId: string | null = null;

  registerProvider(id: string, provider: any): void {
    this.providers[id] = provider;
  }

  getProvider(id: string): any {
    return this.providers[id];
  }

  setCurrentProvider(id: string): void {
    this.currentProviderId = id;
  }

  getCurrentProvider(): any {
    return this.currentProviderId ? this.providers[this.currentProviderId] : null;
  }

  async loadProviders(): Promise<{ id: string; name: string; type: string }[]> {
    const response = await fetch('/assets/providers.json');
    return await response.json();
  }
}
