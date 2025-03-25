import { Connection, VersionedTransaction } from '@solana/web3.js';
import { TransactionRequestSVM, WalletProvider } from './wallet-provider.interface';
import { BlockchainStateService } from '../services/blockchain-state.service';
import { Injector } from '@angular/core';

export class SvmWalletProvider implements WalletProvider {
  protected address: string = '';
  protected network: string = '';
  protected provider: any;

  protected blockchainStateService!: BlockchainStateService;

  constructor(provider: any, injector: Injector) {
    this.blockchainStateService = injector.get(BlockchainStateService);
    this.provider = provider;
  }

  isAvailable(): boolean {
    return !!this.provider;
  }

  // Provide a default implementation that forces override
  async connect(_provider?: any, isMultichain?: boolean): Promise<{ address: string; network: string }>  {
    if (_provider) this.provider = _provider;
    if (!this.provider) throw new Error('Solana not installed');
    if (!this.provider.isConnected) {
      await this.provider.connect();
    }
    const account = this.provider.publicKey?.toString();
    if (!account) throw new Error('Failed to retrieve Solana account');
    this.address = account;
    this.network = await this.getNetwork();

    if(!isMultichain){
      this.blockchainStateService.loadNetworks("SVM");
    }

    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    if (!selectedNetwork || selectedNetwork.chainType !== 'SVM') {
      throw new Error('Invalid network for SVM provider');
    }
    console.warn('Switch network functionality may not be supported.');
    this.network = selectedNetwork.id;
  }

  async getNetwork(): Promise<string> {
    return this.network || 'mainnet';
  }

  getAddress(): string {
    return this.address;
  }

  async sendTx(txData: TransactionRequestSVM): Promise<string> {
    const connection = new Connection('https://solana-rpc.publicnode.com"', 'confirmed');//todo rpc error after bridge
    const decodedTx = Uint8Array.from(atob(txData.data.toString()), c => c.charCodeAt(0));
    const versionedTx = VersionedTransaction.deserialize(decodedTx);
    const signedTx = await this.provider.signAndSendTransaction(versionedTx);
    console.log('SVM Transaction sent:', signedTx);
    await connection.confirmTransaction(signedTx, 'confirmed');
    return signedTx;
  }
}
