import { EvmWalletProvider } from './evm-wallet-provider';
import { SvmWalletProvider } from './svm-wallet-provider';
import { TransactionRequestEVM, TransactionRequestSVM, WalletProvider } from './wallet-provider.interface';

export abstract class MultiChainWalletProvider implements WalletProvider {
  protected evmProviderInstance: any;
  protected svmProviderInstance: any;
  protected evmProvider: EvmWalletProvider | null = null;
  protected svmProvider: SvmWalletProvider | null = null;
  protected currentNetwork: 'EVM' | 'SVM' = 'EVM'; // EVM as default
  protected address: string = '';
  protected network: string = '';

  async connect(): Promise<{ address: string; network: string }> {
    if (this.evmProviderInstance) {
      this.evmProvider = new EvmWalletProvider(this.evmProviderInstance);
    }
    else {
      console.error("Multichain::connect(): EVM not found!")
    }
    if (this.svmProviderInstance) {
      this.svmProvider = new SvmWalletProvider(this.svmProviderInstance);
    }
    else {
      console.error("Multichain::connect(): SVM not found!")
    }

    if (this.currentNetwork === 'EVM' && this.evmProvider) {
      const { address, network } = await this.evmProvider.connect(this.evmProviderInstance);
      this.address = address;
      this.network = network;
    } else if (this.currentNetwork === 'SVM' && this.svmProvider) {
      const { address, network } = await this.svmProvider.connect(this.svmProviderInstance);
      this.address = address;
      this.network = network;
    } else {
      throw new Error('No provider available');
    }
  
    return { address: this.address, network: this.network };
  }
  async switchNetwork(selectedNetwork: any): Promise<void> 
  {
    if (selectedNetwork.chainType === 'EVM') 
    {
      if(!this.evmProvider) throw new Error('EVM Provider not initialized');

      if(this.currentNetwork !== 'EVM')
      {
        const { address } = await this.evmProvider.connect(this.evmProviderInstance);
        this.currentNetwork = 'EVM';
        console.log(`Connected to EVM address: `, address);
        this.address = address;
      }
      await this.evmProvider.switchNetwork(selectedNetwork);
      this.network = await this.evmProvider.getNetwork() || '';
    } 
    else if (selectedNetwork.chainType === 'SVM') 
    {
      if(!this.svmProvider) throw new Error('SVM Provider not initialized');
      
      if(this.currentNetwork != 'SVM')
      {
        const { address } = await this.svmProvider.connect(this.svmProviderInstance);
        this.currentNetwork = 'SVM';
        console.log(`Connected to SVM address: `, address);
        this.address = address;
      }
      await this.svmProvider.switchNetwork(selectedNetwork); 
      this.network = await this.svmProvider.getNetwork() || '';
    } 
    else 
    {
      throw new Error('Unsupported network type');
    }
  }

  async getNetwork(): Promise<string> {
    return this.network;
  }

  getAddress(): string {
    return this.address;
  }

  async sendTx(txData: TransactionRequestEVM | TransactionRequestSVM, isErc20From: boolean = false): Promise<string> {
    if (this.currentNetwork === 'EVM') {
      if (!this.evmProvider) throw new Error('EVM provider not initialized');
      return await this.evmProvider.sendTx(txData as TransactionRequestEVM, isErc20From);
    } else if (this.currentNetwork === 'SVM') {
      if (!this.svmProvider) throw new Error('SVM provider not initialized');
      return await this.svmProvider.sendTx(txData as TransactionRequestSVM);
    } else {
      throw new Error('Invalid network');
    }
  }
}