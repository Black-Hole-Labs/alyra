import { BlockchainStateService } from '../services/blockchain-state.service';
import { PopupService } from '../services/popup.service';
import { EvmWalletProvider } from './evm-wallet-provider';
import { SvmWalletProvider } from './svm-wallet-provider';
import { SuiWalletProvider } from './sui-wallet-provider';
import { NetworkId, TransactionRequestEVM, TransactionRequestSVM, TransactionRequestMVM, WalletProvider } from './wallet-provider.interface';
import { Injector } from '@angular/core';
export abstract class MultiChainWalletProvider implements WalletProvider {
  protected evmProviderInstance: any;
  protected svmProviderInstance: any;
  protected mvmProviderInstance: any;
  protected evmProvider: EvmWalletProvider | null = null;
  protected svmProvider: SvmWalletProvider | null = null;
  protected mvmProvider: SuiWalletProvider | null = null;
  public currentNetwork: 'EVM' | 'SVM' | 'MVM' = 'EVM'; // EVM as default
  protected address: string = '';

  protected blockchainStateService: BlockchainStateService;
  protected injector: Injector;
  private popupService: PopupService

  constructor(injector: Injector) {
    this.injector = injector;
    this.blockchainStateService = injector.get(BlockchainStateService);
    this.popupService = injector.get(PopupService);
  }

  isAvailable(): boolean {
    return !!this.evmProviderInstance || !!this.svmProviderInstance || !!this.mvmProviderInstance;
  }

  async connect(netowrkId: NetworkId = NetworkId.ETHEREUM_MAINNET): Promise<{ address: string, nameService: string | null }> {
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
    if (this.mvmProviderInstance) {
      //console.log(this.mvmProviderInstance);
      this.mvmProvider = new SuiWalletProvider(this.mvmProviderInstance, this.injector);
    }
    else {
      console.error("Multichain::connect(): MVM not found!")
    }

    let nameService;

    if (netowrkId === NetworkId.ETHEREUM_MAINNET && this.evmProvider) {
      const { address, nameService } = await this.evmProvider.connect(this.evmProviderInstance);
      this.address = address;
      this.currentNetwork = 'EVM';
    } else if (netowrkId === NetworkId.SOLANA_MAINNET && this.svmProvider) {
      const { address, nameService } = await this.svmProvider.connect(this.svmProviderInstance);
      this.address = address;
      this.currentNetwork = 'SVM';
    } else if (netowrkId === NetworkId.SUI_MAINNET && this.mvmProvider) {
      const { address } = await this.mvmProvider.connect();
      this.address = address;
      this.currentNetwork = 'MVM';
    } 
    else {
      throw new Error('No provider available');
    }

    return { address: this.address, nameService: nameService ? nameService : null };
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
    }
    else if (selectedNetwork.chainType === 'MVM') 
    {
      if(!this.mvmProvider) throw new Error('MVM Provider not initialized');
      
      if(this.currentNetwork != 'MVM')
      {
        const { address } = await this.mvmProvider.connect(this.mvmProviderInstance);
        this.currentNetwork = 'MVM';
        console.log(`Connected to MVM address: `, address);
        this.address = address;
      }
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

  async sendTx(txData: TransactionRequestEVM | TransactionRequestSVM | TransactionRequestMVM, isErc20From: boolean = false): Promise<string> {
    if (this.currentNetwork === 'EVM') {
      if (!this.evmProvider) throw new Error('EVM provider not initialized');
      return await this.evmProvider.sendTx(txData as TransactionRequestEVM, isErc20From);
    } else if (this.currentNetwork === 'SVM') {
      if (!this.svmProvider) throw new Error('SVM provider not initialized');
      return await this.svmProvider.sendTx(txData as TransactionRequestSVM);
    } else if (this.currentNetwork === 'MVM') {
      if (!this.mvmProvider) throw new Error('MVM provider not initialized');
      return await this.mvmProvider.sendTx(txData as TransactionRequestMVM);
    } else {
      throw new Error('Invalid network');
    }
  }
}