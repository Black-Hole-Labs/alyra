import { Injector } from '@angular/core';
import { EvmWalletProvider } from './evm-wallet-provider';
import { MultiChainWalletProvider } from './multichain-wallet-provider';
import { SvmWalletProvider } from './svm-wallet-provider';
import { NetworkId } from './wallet-provider.interface';

export class WalletProviderManager {
  private metaMaskProvider: any = null;
  private trustWalletProvider: any = null;
  private magicEdenProvider: any = null;
  private PhantomProvider: any = null;
  private RabbyWalletProvider: any = null;
  private backPackProvider: any = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    window.addEventListener("eip6963:announceProvider", (event: any) => {
      const provider = event.detail.provider;

      if (provider.isMagicEden) {
        // console.log("Detected MagicEden");
        this.magicEdenProvider = provider;
      }
      else if (provider.isPhantom) {
        // console.log("Detected Phantom");
        this.PhantomProvider = provider;
      }
      else if (provider.isBackpack) {
        // console.log("Detected BackPack");
        this.backPackProvider = provider;
      }
      else if (provider.isRabby) {
        // console.log("Detected RabbyWallet");
        this.RabbyWalletProvider = provider;
      }
      else if (provider.isMetaMask && !provider.isPontem && !provider.isKeplr) {
        // console.log("Detected MetaMask");
        this.metaMaskProvider = provider;
      }
      else if (provider.isTrust || provider.isTrustWallet) {
        // console.log("Detected Trust");
        this.trustWalletProvider = provider;
      }
      // else if (provider.isOkxWallet || provider.isOKExWallet) {
      //   // console.log("Detected OKX");
      //   // this.trustWalletProvider = provider;
      // }
      // else if (provider.isCoinbaseWallet) {
      //   // console.log("Detected Coinbase");
      //   // this.trustWalletProvider = provider;
      // }
    });

    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }

  getMetaMaskProvider(): any { return this.metaMaskProvider; }
  getRabbyWalletProvider(): any { return this.RabbyWalletProvider; }
  getTrustWalletProvider(): any { return this.trustWalletProvider; }
  getMagicEdenProvider(): any { return this.magicEdenProvider; }
  getPhantomProvider(): any { return this.PhantomProvider; }
  getBackPackProvider(): any { return this.backPackProvider; }
}

/***************EVM***************/
export class MetaMaskProvider extends EvmWalletProvider {
  constructor(walletManager: WalletProviderManager, injector: Injector) {
    super(walletManager.getMetaMaskProvider(), injector);
  }

  override async connect(): Promise<{ address: string }> {
    this.blockchainStateService.updateNetworkSell(NetworkId.ETHEREUM_MAINNET);
    const connection = await super.connect();

    return connection;
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

  override async connect(): Promise<{ address: string }> {
    this.blockchainStateService.updateNetworkSell(NetworkId.SOLANA_MAINNET); // Solana is default for Phantom
    const connection = await super.connect();

    return connection;
  }
}

/***************MULTICHAIN***************/
export class BackpackProvider extends MultiChainWalletProvider {
  constructor(walletManager: WalletProviderManager, injector: Injector) {
    super(injector);
    this.evmProviderInstance = walletManager.getBackPackProvider();
    this.svmProviderInstance = (window as any).backpack?.solana;
  }

  override async connect(): Promise<{ address: string }> {
    this.blockchainStateService.updateNetworkSell(NetworkId.SOLANA_MAINNET); // Solana is default for BackPack
    const connection = await super.connect();

    return connection;
  }
}

export class PhantomProvider extends MultiChainWalletProvider {
  constructor(walletManager: WalletProviderManager, injector: Injector) {
    super(injector);
    this.evmProviderInstance = walletManager.getPhantomProvider();
    this.svmProviderInstance = (window as any).phantom?.solana;
  }

  override async connect(): Promise<{ address: string }> {
    this.blockchainStateService.updateNetworkSell(NetworkId.SOLANA_MAINNET); // Solana is default for Phantom
    const connection = await super.connect();

    return connection;
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

