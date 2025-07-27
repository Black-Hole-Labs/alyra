import { clusterApiUrl, Connection, VersionedTransaction } from '@solana/web3.js';
import { NetworkId, TransactionRequestSVM, WalletProvider } from './wallet-provider.interface';
import { BlockchainStateService } from '../services/blockchain-state.service';
import { Injector } from '@angular/core';
import { reverseLookup } from '@bonfida/spl-name-service';

export class SvmWalletProvider implements WalletProvider {
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

  async connect(_provider?: any): Promise<{ address: string, nameService: string | null }>  {
    if(this.blockchainStateService.networkSell() !== undefined && this.blockchainStateService.networkSell()?.chainType !== "SVM")
    {
      this.blockchainStateService.updateNetworkSell(NetworkId.SOLANA_MAINNET);
    }

    if (_provider) this.provider = _provider;
    if (!this.provider) throw new Error('Solana not installed');
    if (!this.provider.isConnected) {
      await this.provider.connect();
    }
    const account = this.provider.publicKey?.toString();
    if (!account) throw new Error('Failed to retrieve Solana account');
    this.address = account;

    const rpcUrl =
      (await this.blockchainStateService.getWorkingRpcUrlForNetwork(
        NetworkId.SOLANA_MAINNET
      )) || clusterApiUrl('mainnet-beta');
    const connection = new Connection(rpcUrl, 'confirmed');

    let sns: string | null;
    try {
      // returns the base name (without .sol)
      const base = await reverseLookup(
        connection,
        this.provider.publicKey
      );
      sns = base ? `${base}.sol` : null;
    } catch (e) {
      // it can probably throw
      sns = null;
    }

    return { address: this.address, nameService: sns };
  }

  getAddress(): string {
    return this.address;
  }

  async sendTx(txData: TransactionRequestSVM): Promise<string> {
    const solanaRPC = await this.blockchainStateService.getWorkingRpcUrlForNetwork(NetworkId.SOLANA_MAINNET) || "https://solana-rpc.publicnode.com";
    const connection = new Connection(solanaRPC, 'confirmed');//todo rpc error after bridge
    const decodedTx = Uint8Array.from(atob(txData.data.toString()), c => c.charCodeAt(0));
    const versionedTx = VersionedTransaction.deserialize(decodedTx);
    const signedTx = await this.provider.signAndSendTransaction(versionedTx);
    // console.log('SVM Transaction sent:', signedTx);
    await connection.confirmTransaction(signedTx, 'confirmed');
    return signedTx;
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    //this.blockchainStateService.disconnect(this.address);
    throw new Error("unsupported_network"); //TODO
  }
}
