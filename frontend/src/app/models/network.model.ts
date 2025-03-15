import { Injector } from '@angular/core';
import { EvmWalletProvider } from './evm-wallet-provider';
import { MultiChainWalletProvider } from './multichain-wallet-provider';
import { SvmWalletProvider } from './svm-wallet-provider';
import { WalletProvider } from './wallet-provider.interface';

// WalletProviderManager остается без изменений
export class WalletProviderManager {
  private metaMaskProvider: any = null;
  private trustWalletProvider: any = null;
  private magicEdenProvider: any = null;
  private PhantomProvider: any = null;
  private RabbyWalletProvider: any = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    window.addEventListener("eip6963:announceProvider", (event: any) => {
      const provider = event.detail.provider;

      if (provider.isMagicEden) {
        console.log("Detected MagicEden");
        this.magicEdenProvider = provider;
      }
      else if (provider.isPhantom) {
        console.log("Detected Phantom");
        this.PhantomProvider = provider;
      }
      else if (provider.isRabby) {
        console.log("Detected RabbyWallet");
        this.RabbyWalletProvider = provider;
      }
      else if (provider.isMetaMask && !provider.isPontem && !provider.isKeplr) {
        console.log("Detected MetaMask");
        this.metaMaskProvider = provider;
      }
      else if (provider.isTrust) {
        console.log("Detected Trust");
        this.trustWalletProvider = provider;
      }
    });

    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }

  getMetaMaskProvider(): any { return this.metaMaskProvider; }
  getRabbyWalletProvider(): any { return this.RabbyWalletProvider; }
  getTrustWalletProvider(): any { return this.trustWalletProvider; }
  getMagicEdenProvider(): any { return this.magicEdenProvider; }
  getPhantomProvider(): any { return this.PhantomProvider; }
  isMetaMaskInstalled(): boolean { return !!this.metaMaskProvider; }
  isTrustWalletInstalled(): boolean { return !!this.trustWalletProvider; }
  isMagicEdenInstalled(): boolean { return !!this.magicEdenProvider; }
}

/***************EVM***************/
export class MetaMaskProvider extends EvmWalletProvider {
  constructor(walletManager: WalletProviderManager, injector: Injector) {
    super(walletManager.getMetaMaskProvider(), injector);
  }
}

export class RabbyWalletProvider extends EvmWalletProvider {
  constructor(walletManager: WalletProviderManager, injector: Injector) {
    super(walletManager.getRabbyWalletProvider(), injector);
  }
}

/***************SVM***************/
export class SolflareProvider extends SvmWalletProvider {
  constructor(injector: Injector) {
    super((window as any).solflare, injector);
  }
}

export class BackpackProvider extends SvmWalletProvider {
  constructor(injector: Injector) {
    super((window as any).backpack, injector);
  }
}

/***************MULTICHAIN***************/
export class PhantomProvider extends MultiChainWalletProvider {
  constructor(walletManager: WalletProviderManager,injector: Injector) {
    super(injector);
    this.evmProviderInstance = walletManager.getPhantomProvider();
    this.svmProviderInstance = (window as any).phantom?.solana;
  }
}

export class MagicEdenProvider extends MultiChainWalletProvider {
  constructor(walletManager: WalletProviderManager, injector: Injector) {
    super(injector);
    this.evmProviderInstance = walletManager.getMagicEdenProvider();
    this.svmProviderInstance = (window as any).magicEden?.solana;
  }
}

export class TrustWalletProvider extends MultiChainWalletProvider {
  constructor(injector: Injector) {
    super(injector);
    this.evmProviderInstance = window.trustwallet;
    this.svmProviderInstance = (window as any).trustwallet?.solana;
  }
}

export class OkxWalletProvider extends MultiChainWalletProvider {
  constructor(injector: Injector) {
    super(injector);
    this.evmProviderInstance = window.okexchain;
    this.svmProviderInstance = (window as any).okexchain?.solana;
  }
}

export class CoinbaseWalletProvider extends MultiChainWalletProvider {
  constructor(injector: Injector) {
    super(injector);
    this.evmProviderInstance = window.coinbaseWalletExtension;
    this.svmProviderInstance = (window as any).coinbaseSolana;
  }
}

export class LedgerProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private ledger: any;

  isAvailable(): boolean {
    return !!this.ledger;
  }

  async connect(): Promise<{ address: string; network: string }> {
    // Предполагаем, что для работы с Ledger используется Web3 или специальный SDK
    this.ledger = (window as any).ledger; // Подключение к глобальному объекту или SDK
    if (!this.ledger) {
      throw new Error('Ledger Wallet not available');
    }

    const accounts = await this.ledger.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('Failed to retrieve Ledger accounts');
    }

    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    console.warn('Ledger does not support network switching programmatically.');
    this.network = selectedNetwork.id;
  }

  async getNetwork(): Promise<string> {
    return this.network || 'mainnet';
  }

  getAddress(): string {
    return this.address;
  }
}

