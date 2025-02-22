import { ethers, JsonRpcSigner } from 'ethers';
import { TransactionRequestEVM, TransactionRequestSVM, WalletProvider } from './wallet-provider.interface';
import { 
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  MessageV0,
  TransactionInstruction,
  MessageHeader,
  Transaction,
} from '@solana/web3.js';
import bs58 from 'bs58';
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
      else if (provider.isMetaMask) {
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

  getMetaMaskProvider(): any {
    return this.metaMaskProvider;
  }

  getRabbyWalletProvider(): any {
    return this.RabbyWalletProvider;
  }

  getTrustWalletProvider(): any {
    return this.trustWalletProvider;
  }

  getMagicEdenProvider(): any {
    return this.magicEdenProvider;
  }

  getPhantomProvider(): any {
    return this.PhantomProvider;
  }

  isMetaMaskInstalled(): boolean {
    return !!this.metaMaskProvider;
  }

  isTrustWalletInstalled(): boolean {
    return !!this.trustWalletProvider;
  }

  isMagicEdenInstalled(): boolean {
    return !!this.magicEdenProvider;
  }
}

export class MetaMaskProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private provider: any;
  public signer?: JsonRpcSigner;

  constructor(private walletManager: WalletProviderManager) {
    this.provider = this.walletManager.getMetaMaskProvider();
  }

  async connect(): Promise<{ address: string; network: string }> {
    if (!this.provider) throw new Error('MetaMask not installed');
    
    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    this.address = accounts[0];
    this.network = await this.getNetwork();

    const ethersProvider = new ethers.BrowserProvider(this.provider);
    this.signer = await ethersProvider.getSigner();

    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: selectedNetwork.idHex }],
      });
      this.network = selectedNetwork.idHex;
    } catch (error: any) {
      // Если сеть не найдена, добавляем её
      if (error.code === 4902) {
        await this.addNetwork(selectedNetwork);
      } else {
        throw error;
      }
    }
  }

  private async addNetwork(selectedNetwork:any): Promise<void> {
    //const network = this.networks[chainId];
    if (!selectedNetwork) {
      throw new Error(`Network ${selectedNetwork} is not configured.`);
    }
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.idHex,
          chainName: selectedNetwork.name,
          rpcUrls: selectedNetwork.rpcUrls,
          nativeCurrency: selectedNetwork.nativeCurrency,
        },
      ],
    });
  }

  async getNetwork(): Promise<string> {
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
  }

  async sendTx(txData: TransactionRequestEVM, isErc20From: boolean = false): Promise<void> {
    try {
      const txParams: any = {
        from: txData.from,
        to: txData.to,
        //gas: txData.gasLimit,
        data: txData.data,
        //gasPrice: txData.gasPrice,
      };
  
      if (!isErc20From) {
        txParams.value = txData.value; 
      } else {
        txParams.value = "0x0"; 
      }
  
      console.log("Отправка транзакции:", txParams);
  
      return await this.provider.request({
        method: "eth_sendTransaction",
        params: [txParams],
      });
    } catch (error: any) {
      console.error("Ошибка при отправке транзакции:", error);
      throw error;
    }
  }
}

export class SolflareProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private solflare: any;

  // constructor() {
  // }

  async connect(): Promise<{ address: string; network: string }> {
    this.solflare = (window as any).solflare;
    if (!this.solflare) {
      throw new Error('Solflare not installed');
    }

    if (!this.solflare.isConnected) {
      await this.solflare.connect();
    }
    const account = this.solflare.publicKey?.toString();
    if (!account) {
      throw new Error('Failed to retrieve Solflare account');
    }
    this.address = account;
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if (!selectedNetwork || selectedNetwork.chainType !== 'SVM') {
      throw new Error('Invalid network for Solflare');
    }

    // Assuming Solflare supports some kind of network switching in the future
    // Currently, Solflare doesn't natively support programmatic network switching.
    // This might involve reinitializing the Solflare instance or displaying a message to the user.
    console.warn('Switch network functionality is not supported in Solflare yet.');
    this.network = selectedNetwork.id;
  }

  async getNetwork(): Promise<string> {
    // Solflare doesn’t provide a direct way to get the network currently,
    // so this would depend on the app's configuration or default settings.
    // Replace with appropriate Solflare API calls if available.
    return this.network || 'mainnet';
  }

  getAddress(): string {
    return this.address;
  }
}

export class PhantomProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private provider: any;

  constructor(private walletManager: WalletProviderManager) {
    this.provider = this.walletManager.getPhantomProvider();
  }

  async connect(): Promise<{ address: string; network: string }> {
    console.log(this.provider);
    if (!this.provider) throw new Error('Phantom not installed');
    
    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if(selectedNetwork.id === 1151111081099710) // Solana ID
    {
      const phantom_solana = (window as any).phantom.solana;
      if (!phantom_solana) {
        throw new Error('Phantom SVM not added');
      }
  
      if (!phantom_solana.isConnected) {
        await phantom_solana.connect();
      }
      const account = phantom_solana.publicKey?.toString();
      if (!account) {
        throw new Error('Failed to retrieve Phantom SVM account');
      }
      this.address = account;
      console.log(`Phantom: Solana address: ${this.address}`);
      this.network = "1151111081099710"; //todo 
      // this.network = await this.getNetwork();
    }
    else
    {
      try {
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.idHex }],
        });
        this.network = selectedNetwork.idHex;
      } catch (error: any) {
        // Если сеть не найдена, добавляем её
        if (error.code === 4902) {
          await this.addNetwork(selectedNetwork);
        } else {
          throw error;
        }
      }
    }
  }

  private async addNetwork(selectedNetwork:any): Promise<void> {
    //const network = this.networks[chainId];
    if (!selectedNetwork) {
      throw new Error(`Network ${selectedNetwork} is not configured.`);
    }
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.idHex,
          chainName: selectedNetwork.name,
          rpcUrls: selectedNetwork.rpcUrls,
          nativeCurrency: selectedNetwork.nativeCurrency,
        },
      ],
    });
  }

  async getNetwork(): Promise<string> {
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
  }

  async sendTx(
    txData: TransactionRequestEVM | TransactionRequestSVM,
    isErc20From: boolean = false
  ): Promise<string> {
    // Если сеть Solana (SVM)
    if (this.network === "1151111081099710") {
      const phantom_solana = (window as any).phantom?.solana;
      if (!phantom_solana) {
        throw new Error('Phantom SVM not available');
      }
    
      const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');//todo
    
      const txDataSVM = txData as TransactionRequestSVM;
      // Декодируем base64-строку в Uint8Array
      const decodedTx = Uint8Array.from(atob(txDataSVM.data.toString()), c => c.charCodeAt(0));
      
      // Десериализуем полученные данные в VersionedTransaction
      const versionedTx = VersionedTransaction.deserialize(decodedTx);
    
      // Подписываем транзакцию через Phantom (подпись выполняется самим пользователем)
      const signedTx = await phantom_solana.signAndSendTransaction(versionedTx);
      console.log("SVM Transaction sent:", signedTx);
    
      // Подтверждаем статус транзакции
      await connection.confirmTransaction(signedTx, 'confirmed');
    
      return signedTx;
    }
     else {
      // Логика для EVM
      try {
        const txParams: any = {
          from: (txData as TransactionRequestEVM).from,
          to: (txData as TransactionRequestEVM).to,
          //gas: txData.gasLimit,
          data: (txData as TransactionRequestEVM).data,
          //gasPrice: txData.gasPrice,
        };
    
        if (!isErc20From) {
          txParams.value = (txData as TransactionRequestEVM).value; 
        } else {
          txParams.value = "0x0"; 
        }
    
        console.log("Отправка транзакции:", txParams);
    
        return await this.provider.request({
          method: "eth_sendTransaction",
          params: [txParams],
        });
      } catch (error: any) {
        console.error("Ошибка при отправке транзакции:", error);
        throw error;
      }
    }
  }
}

export class MagicEdenProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private provider: any;

  constructor(private walletManager: WalletProviderManager) {
    this.provider = this.walletManager.getMagicEdenProvider();
  }

  async connect(): Promise<{ address: string; network: string }> {
    if (!this.provider) throw new Error('Magic Eden not installed');

    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if(selectedNetwork.id === 1151111081099710) // Solana ID
    {
      const magicEden_solana = (window as any).magicEden.solana;
      if (!magicEden_solana) {
        throw new Error('MagicEden SVM not added');
      }
  
      if (!magicEden_solana.isConnected) {
        await magicEden_solana.connect();
      }
      const account = magicEden_solana.publicKey?.toString();
      if (!account) {
        throw new Error('Failed to retrieve MagicEden SVM account');
      }
      this.address = account;
      console.log(`MagicEden: Solana address: ${this.address}`);
      // this.network = await this.getNetwork();
    }
    else
    {
      try {
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.idHex }],
        });
        this.network = selectedNetwork.idHex;
      } catch (error: any) {
        // Если сеть не найдена, добавляем её
        if (error.code === 4902) {
          await this.addNetwork(selectedNetwork);
        } else {
          throw error;
        }
      }
    }
  }

  private async addNetwork(selectedNetwork: any): Promise<void> {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.idHex,
          chainName: selectedNetwork.name,
          rpcUrls: selectedNetwork.rpcUrls,
          nativeCurrency: selectedNetwork.nativeCurrency,
        },
      ],
    });
  }

  async getNetwork(): Promise<string> {
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
  }
}
export class BackpackProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private backpack: any;

  async connect(): Promise<{ address: string; network: string }> {
    this.backpack = (window as any).backpack; // Backpack доступен как глобальный объект
    if (!this.backpack) {
      throw new Error('Backpack Wallet not installed');
    }

    if (!this.backpack.isConnected) {
      await this.backpack.connect();
    }

    const account = this.backpack.publicKey?.toString();
    if (!account) {
      throw new Error('Failed to retrieve Backpack account');
    }

    this.address = account;
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if (!selectedNetwork || selectedNetwork.chainType !== 'SVM') {
      throw new Error('Invalid network for Backpack');
    }

    // Предполагаем, что Backpack пока не поддерживает переключение сети
    console.warn('Switch network functionality is not supported in Backpack yet.');
    this.network = selectedNetwork.id;
  }

  async getNetwork(): Promise<string> {
    // Backpack не предоставляет способ получить сеть программно.
    // Если есть настройки сети в приложении, можно использовать их.
    return this.network || 'mainnet';
  }

  getAddress(): string {
    return this.address;
  }
}

export class LedgerProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private ledger: any;

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

export class TrustWalletProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private provider: any;

  async connect(): Promise<{ address: string; network: string }> {
    this.provider = window.trustwallet;
    if (!this.provider) {
      throw new Error('Trust Wallet not available');
    }

    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('Failed to retrieve Trust Wallet accounts');
    }

    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if(selectedNetwork.id === 1151111081099710) // Solana ID
    {
      const trust_solana = (window as any).trustwallet.solana;
      if (!trust_solana) {
        throw new Error('Trust SVM not added');
      }
  
      if (!trust_solana.isConnected) {
        await trust_solana.connect();
      }
      const account = trust_solana.publicKey?.toString();
      if (!account) {
        throw new Error('Failed to retrieve Trust SVM account');
      }
      this.address = account;
      console.log(`Trust: Solana address: ${this.address}`);
      // this.network = await this.getNetwork();
    }
    else
    {
      try {
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.idHex }],
        });
        this.network = selectedNetwork.idHex;
      } catch (error: any) {
        // Если сеть не найдена, добавляем её
        if (error.code === 4902) {
          await this.addNetwork(selectedNetwork);
        } else {
          throw error;
        }
      }
    }
  }

  private async addNetwork(selectedNetwork: any): Promise<void> {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.idHex,
          chainName: selectedNetwork.name,
          rpcUrls: selectedNetwork.rpcUrls,
          nativeCurrency: selectedNetwork.nativeCurrency,
        },
      ],
    });
  }

  async getNetwork(): Promise<string> {
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
  }
}

export class OkxWalletProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private provider: any;

  async connect(): Promise<{ address: string; network: string }> {    
    this.provider = window.okexchain;
    if (!this.provider) {
      throw new Error('OKX Wallet not available');
    }

    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('Failed to retrieve OKX Wallet accounts');
    }

    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if(selectedNetwork.id === 1151111081099710) // Solana ID
    {
      const okx_solana = this.provider.solana;
      if (!okx_solana) {
        throw new Error('OKX SVM not added');
      }
  
      if (!okx_solana.isConnected) {
        await okx_solana.connect();
      }
      const account = okx_solana.publicKey?.toString();
      if (!account) {
        throw new Error('Failed to retrieve OKX SVM account');
      }
      this.address = account;
      console.log(`OKX: Solana address: ${this.address}`);
      // this.network = await this.getNetwork();
    }
    else
    {
      try {
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.idHex }],
        });
        this.network = selectedNetwork.idHex;
      } catch (error: any) {
        // Если сеть не найдена, добавляем её
        if (error.code === 4902) {
          await this.addNetwork(selectedNetwork);
        } else {
          throw error;
        }
      }
    }
  }

  private async addNetwork(selectedNetwork: any): Promise<void> {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.idHex,
          chainName: selectedNetwork.name,
          rpcUrls: selectedNetwork.rpcUrls,
          nativeCurrency: selectedNetwork.nativeCurrency,
        },
      ],
    });
  }

  async getNetwork(): Promise<string> {
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
  }
}

export class CoinbaseWalletProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private provider: any;

  async connect(): Promise<{ address: string; network: string }> {
    this.provider = window.coinbaseWalletExtension;
    if (!this.provider) {
      throw new Error('Coinbase Wallet not available');
    }

    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('Failed to retrieve Coinbase Wallet accounts');
    }

    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if(selectedNetwork.id === 1151111081099710) // Solana ID
    {
      const coinbase_solana = (window as any).coinbaseSolana;
      if (!coinbase_solana) {
        throw new Error('Coinbase SVM not added');
      }
  
      if (!coinbase_solana.isConnected) {
        await coinbase_solana.connect();
      }
      const account = coinbase_solana.publicKey?.toString();
      if (!account) {
        throw new Error('Failed to retrieve Coinbase SVM account');
      }
      this.address = account;
      console.log(`Coinbase: Solana address: ${this.address}`);
      // this.network = await this.getNetwork();
    }
    else
    {
      try {
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.idHex }],
        });
        this.network = selectedNetwork.idHex;
      } catch (error: any) {
        // Если сеть не найдена, добавляем её
        if (error.code === 4902) {
          await this.addNetwork(selectedNetwork);
        } else {
          throw error;
        }
      }
    }
  }

  private async addNetwork(selectedNetwork: any): Promise<void> {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.idHex,
          chainName: selectedNetwork.name,
          rpcUrls: selectedNetwork.rpcUrls,
          nativeCurrency: selectedNetwork.nativeCurrency,
        },
      ],
    });
  }

  async getNetwork(): Promise<string> {
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
  }
}

export class RabbyWalletProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private provider: any;

  constructor(private walletManager: WalletProviderManager) {
    this.provider = this.walletManager.getRabbyWalletProvider();
  }

  async connect(): Promise<{ address: string; network: string }> {
    console.log(window);
    if (!this.provider) {
      throw new Error('Rabby Wallet not available');
    }

    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('Failed to retrieve Rabby Wallet accounts');
    }

    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: selectedNetwork.idHex }],
      });
      this.network = selectedNetwork.idHex;
    } catch (error: any) {
      // Если сеть не найдена, добавляем её
      if (error.code === 4902) {
        await this.addNetwork(selectedNetwork);
      } else {
        throw error;
      }
    }
  }

  private async addNetwork(selectedNetwork: any): Promise<void> {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: selectedNetwork.idHex,
          chainName: selectedNetwork.name,
          rpcUrls: selectedNetwork.rpcUrls,
          nativeCurrency: selectedNetwork.nativeCurrency,
        },
      ],
    });
  }

  async getNetwork(): Promise<string> {
    const chainId = await this.provider.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
  }
}

