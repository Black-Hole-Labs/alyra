import { BlockchainStateService } from '../services/blockchain-state.service';
import { EvmWalletProvider } from './evm-wallet-provider';
import { SuiWalletProvider } from './sui-wallet-provider';
import { SvmWalletProvider } from './svm-wallet-provider';
import { NetworkId, ProviderType, TransactionRequestEVM, TransactionRequestSVM, WalletProvider } from './wallet-provider.interface';
import { Injector } from '@angular/core';
export abstract class MultiChainWalletProvider implements WalletProvider {
  protected evmProviderInstance: any;
  protected svmProviderInstance: any;
  protected suiProviderInstance: any;
  protected evmProvider: EvmWalletProvider | null = null;
  protected svmProvider: SvmWalletProvider | null = null;
  protected suiProvider: SuiWalletProvider | null = null; // SUI
  protected currentNetwork: 'EVM' | 'SVM' | 'MVM' = 'EVM'; // EVM as default
  protected address: string = '';

  protected blockchainStateService: BlockchainStateService;
  protected injector: Injector;

  constructor(injector: Injector) {
    this.injector = injector;
    this.blockchainStateService = injector.get(BlockchainStateService);
  }

  isAvailable(): boolean {
    return !!this.evmProviderInstance || !!this.svmProviderInstance || !!this.suiProviderInstance;
  }

  async connect(netowrkId: NetworkId = NetworkId.ETHEREUM_MAINNET): Promise<{ address: string }> {
    if (this.evmProviderInstance) {
      this.evmProvider = new EvmWalletProvider(this.evmProviderInstance, this.injector);
    }
    else {
      console.error("Multichain::connect(): EVM not found!")
    }
    if (this.svmProviderInstance) {
      this.svmProvider = new SvmWalletProvider(this.svmProviderInstance, this.injector);
    }
    else {
      console.error("Multichain::connect(): SVM not found!")
    }
    if (this.suiProviderInstance) {
      this.suiProvider = new SuiWalletProvider(this.suiProviderInstance, this.injector);
    }
    else {
      console.error("Multichain::connect(): MVM not found!")
    }


    if (netowrkId === NetworkId.ETHEREUM_MAINNET && this.evmProvider) {
      const { address } = await this.evmProvider.connect(this.evmProviderInstance);
      this.address = address;
      this.currentNetwork = 'EVM';
    } else if (netowrkId === NetworkId.SOLANA_MAINNET && this.svmProvider) {
      const { address } = await this.svmProvider.connect(this.svmProviderInstance);
      this.address = address;
      this.currentNetwork = 'SVM';
    } else if (this.blockchainStateService.networkSell()!.chainType === 'MVM' && this.suiProvider) {
      const { address } = await this.suiProvider.connect(this.suiProviderInstance, true);
      this.address = address;
      this.currentNetwork = 'MVM';
    } else {
      throw new Error('No provider available');
    }

    return { address: this.address };
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
        // console.log(`Connected to EVM address: `, address);
        this.address = address;
      }
      await this.evmProvider.switchNetwork(selectedNetwork);
    } 
    else if (selectedNetwork.chainType === 'SVM') 
    {
      if(!this.svmProvider) throw new Error('SVM Provider not initialized');
      
      if(this.currentNetwork != 'SVM')
      {
        const { address } = await this.svmProvider.connect(this.svmProviderInstance);
        this.currentNetwork = 'SVM';
        // console.log(`Connected to SVM address: `, address);
        this.address = address;
      }
      await this.svmProvider.switchNetwork(selectedNetwork); 
      // this.network = await this.svmProvider.getNetwork() || '';
    } 
    else if (selectedNetwork.chainType === 'MVM') 
    {
      if(!this.suiProvider) throw new Error('Sui Provider not initialized');
      
      if(this.currentNetwork != 'MVM')
      {
        const { address } = await this.suiProvider.connect(this.svmProviderInstance, true);
        this.currentNetwork = 'MVM';
        // console.log(`Connected to Sui address: `, address);
        this.address = address;
      }
      await this.suiProvider.switchNetwork(selectedNetwork); 
      // this.network = await this.suiProvider.getNetwork() || '';
    } 
    else 
    {
      throw new Error('Unsupported network type');
    }
  }

  // async getNetwork(): Promise<string> {
  //   return this.network;
  // }

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