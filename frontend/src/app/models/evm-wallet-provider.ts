import { ethers, JsonRpcSigner } from 'ethers';
import { ProviderType, TransactionRequestEVM, WalletProvider } from './wallet-provider.interface';
import { Injector } from '@angular/core';
import { BlockchainStateService } from '../services/blockchain-state.service';

export class EvmWalletProvider implements WalletProvider {
  protected address: string = '';
  protected network: string = '';
  protected provider: any;
  public signer?: JsonRpcSigner;

  protected blockchainStateService: BlockchainStateService;
  protected injector: Injector;

  constructor(provider: any, injector: Injector) {
    this.injector = injector;
    this.blockchainStateService = injector.get(BlockchainStateService);
    this.provider = provider;
  }

  isAvailable(): boolean {
    return !!this.provider;
  }

  async connect(_provider?: any, isMultichain?: boolean): Promise<{ address: string; network: string }> {
    if (_provider) this.provider = _provider;
    if (!this.provider) throw new Error('Provider not installed');
    const accounts = await this.provider.request({ method: 'eth_requestAccounts' });
    this.address = accounts[0];
    this.network = await this.getNetwork();
    const ethersProvider = new ethers.BrowserProvider(this.provider);
    this.signer = await ethersProvider.getSigner();

    if(!isMultichain){
      this.blockchainStateService.loadNetworks(ProviderType.EVM);
    }

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

  async sendTx(txData: TransactionRequestEVM, isErc20From: boolean = false): Promise<string> {
    try {
      const txParams: any = {
        from: txData.from,
        to: txData.to,
        data: txData.data,
      };
      if (!isErc20From) {
        txParams.value = txData.value;
      } else {
        txParams.value = '0x0';
      }
      // console.log('Отправка транзакции:', txParams);
      return await this.provider.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
    } catch (error: any) {
      console.error('Ошибка при отправке транзакции:', error);
      throw error;
    }
  }
}