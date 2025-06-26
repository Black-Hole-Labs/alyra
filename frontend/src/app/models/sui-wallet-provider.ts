// import { SlushWallet, registerSlushWallet } from '@mysten/slush-wallet';
// import { WalletAccount } from '@mysten/wallet-standard';
// import { WalletProvider } from './wallet-provider.interface';

// export class SlushWalletProvider implements WalletProvider {
//   private wallet?: SlushWallet;
//   private account?: WalletAccount;

//   constructor() {
//     // this.injector = injector;
//     // this.blockchainStateService = injector.get(BlockchainStateService);
//     // this.provider = provider;
//     const wallet = registerSlushWallet('0xf9124ad2c9867ea2924a1426e8791c80f357a574e2a2bd408f4c8f21ba8f23e7');
//     console.log(wallet);
//     if (!wallet) throw new Error('Slush Wallet не найден');
//     this.wallet = wallet.wallet;
//   }

//   switchNetwork(network: any): Promise<void> {
//       throw new Error('Method not implemented.');
//   }

//   isAvailable(): boolean {
//     return !!this.wallet;
//   }

//   async connect(): Promise<{ address: string; network: string }> {

//     const result = await this.wallet!.features['standard:connect'].connect();
//     if (!result.accounts.length) throw new Error('Нет аккаунтов');
//     this.account = result.accounts[0];

//     let retVal = { address: this.account.address, network: this.account.chains[0] };
//     return retVal;
//   }

//   getAddress(): string {
//     if (!this.account) throw new Error('Не подключено');
//     return this.account.address;
//   }

//   async getNetwork(): Promise<string> {
//     if (!this.account) throw new Error('Не подключено');
//     return this.account.chains[0];
//   }

//   async signAndSendTransaction(tx: { toJSON: () => any }): Promise<string> {
//     if (!this.wallet || !this.account) throw new Error('Не подключено');
//     const txResult = await this.wallet.features['sui:signAndExecuteTransaction'].signAndExecuteTransaction({
//       account: this.account,
//       chain: this.account.chains[0],
//       transaction: tx,
//     });
//     return txResult.digest;
//   }
// }

// import { Wallet, getWallets } from '@mysten/wallet-standard';
// import { registerSlushWallet } from '@mysten/slush-wallet';
// import { WalletProvider } from './wallet-provider.interface';

// export class SuiWalletProvider{
//   private wallet: Wallet | null = null;
//   // private provider: any;
//   private address: string = '';
//   private chain: string = 'sui:mainnet';  // default chain

//   // constructor(private appName: string) {}
//   constructor(private appName: string) {}

//   /** Detect & connect to a Sui wallet (e.g. Phantom, Backpack, Slush) */
//   async connect(): Promise<void> {
//     // Register Slush Wallet with the app name (if Slush extension is installed)
//     registerSlushWallet(this.appName);

//     const walletsApi = getWallets();
//     const available = walletsApi.get().filter(w => w.chains.includes(this.chain as `${string}:${string}`));
//     // if (available.length === 0) {
//     //   throw new Error('No Sui wallet found');
//     // }
//     // Prefer Phantom if available
//     this.wallet = available.find(w => w.name === 'Phantom') || available[0];

//     // Request connection (Wallet Standard)
//     const connectFeature = this.wallet.features['standard:connect'] as any;
//     if (!connectFeature) throw new Error('Wallet does not support connect');
//     const { accounts } = await connectFeature.connect({ chains: [this.chain] });
//     if (accounts && accounts.length > 0) {
//       this.address = accounts[0].address;
//     } else {
//       throw new Error('No account found after connect');
//     }
//   }

//   /** Switch to a different Sui chain (e.g. "sui:testnet") */
//   async switchNetwork(newChain: string): Promise<void> {
//     this.chain = newChain;
//     if (!this.wallet) throw new Error('No wallet connected');
//     const connectFeature = this.wallet.features['standard:connect'] as any;
//     await connectFeature.connect({ chains: [this.chain] });
//   }

//   getNetwork(): string {
//     return this.chain;
//   }

//   getAddress(): string {
//     return this.address;
//   }

//   isAvailable(): boolean {
//     // Check for Phantom's Sui (extension) or any wallet-standard wallet
//     const phantomPresent = !!(window as any).phantom?.sui?.isPhantom;
//     // SuiWallet/Slush detection (legacy)
//     const slushPresent = !!(window as any).suiWallet;
//     // Or use wallet-standard detection:
//     const wallets = getWallets().get();
//     const anySui = wallets.some(w => w.chains.some(ch => ch.startsWith('sui:')));
//     return phantomPresent || slushPresent || anySui;
//   }

//   /** Example method: sign and execute a serialized Sui transaction */
//   async signAndExecuteSerializedTx(txBytes: Uint8Array): Promise<any> {
//     if (!this.wallet) throw new Error('No wallet connected');
//     const execFeature = this.wallet.features['sui:signAndExecuteTransaction'] as any;
//     if (!execFeature) throw new Error('Wallet cannot sign/execute');
//     // The wallet-standard API expects raw transaction bytes
//     return await execFeature.signAndExecuteTransaction({ transaction: txBytes });
//   }
// }
import { ProviderType, TransactionRequestSVM, WalletProvider } from './wallet-provider.interface';
import { BlockchainStateService } from '../services/blockchain-state.service';
import { Injector } from '@angular/core';

export class SuiWalletProvider implements WalletProvider {
  protected address: string = '';
  protected provider: any;

  protected blockchainStateService!: BlockchainStateService;

  constructor(provider: any, injector: Injector) {
    this.blockchainStateService = injector.get(BlockchainStateService);
    this.provider = provider;
  }

  isAvailable(): boolean {
    return !!this.provider;
  }

  async connect(_provider?: any, isMultichain?: boolean): Promise<{ address: string }> {
    if (_provider) this.provider = _provider;
    if (!this.provider) throw new Error('SUI not installed');
    const account = await this.provider.requestAccount();
    this.address = account.address;
    // if (!isMultichain) {
    //   this.blockchainStateService.loadNetworks(ProviderType.SUI);
    // }
    console.log("ADDRESS: ", this.address);
    return { address: this.address };
  }

  // async switchNetwork(selectedNetwork: any): Promise<void> {
  //   if (!selectedNetwork || selectedNetwork.chainType !== 'MVM') {
  //     throw new Error('Incorrect network for SUI provider');
  //   }
  //   console.warn('Switch network functionality may not be supported.');
  //   this.network = selectedNetwork.id;
  // }
  async switchNetwork(selectedNetwork: any): Promise<void> {
    this.blockchainStateService.disconnect();
    throw new Error("unsupported_network");
  }

  // async getNetwork(): Promise<string> {
  //   return this.network || 'mainnet'; // ???
  // }

  getAddress(): string {
    console.log("1ADDRESS: ", this.address);
    return this.address;
  }

  async sendTx(txData: TransactionRequestSVM): Promise<string> {
    const tx = txData.data;
    const result = await this.provider.signAndExecuteTransaction(tx);
    return result.transactionDigest;
  }
}