import { NetworkId, TransactionRequestMVM, WalletProvider } from './wallet-provider.interface';
import { BlockchainStateService } from '../services/blockchain-state.service';
import { Injector } from '@angular/core';
import { Transaction } from '@mysten/sui/transactions';
import { registerSlushWallet } from '@mysten/slush-wallet';
import { getWallets, type Wallet } from '@mysten/wallet-standard';

export class SuiWalletProvider implements WalletProvider {
  private address: string = '';
  protected provider: any;
  private wallet: Wallet | null = null;
  protected blockchainStateService!: BlockchainStateService;

  constructor(private appName: string, provider: any, injector: Injector) {
    this.blockchainStateService = injector.get(BlockchainStateService);
    this.provider = provider;
    registerSlushWallet(this.appName);
  }

  isAvailable(): boolean {
    const wallets = getWallets().get().filter(w => w.chains.includes('sui:mainnet'));
    return wallets.length > 0;
  }

  async connect(_provider?: any): Promise<{ address: string; nameService: string | null }> {
    if (this.blockchainStateService.networkSell()?.chainType !== 'MVM') {
      this.blockchainStateService.updateNetworkSell(NetworkId.SUI_MAINNET);
    }
    if (_provider) this.provider = _provider;
    if (!this.provider) {
      throw new Error('SUI wallet not installed');
    }

    console.log(this.provider);

    const wallets = getWallets()
      .get()
      .filter(w => w.name === this.provider.name && w.chains.includes('sui:mainnet') || this.provider.isPhantom && w.chains.includes('sui:mainnet'));

    if (wallets.length === 0) throw new Error(`No SUI wallet named ${this.provider}`);

    this.wallet = wallets[0];

    const connectFE = this.wallet.features['standard:connect'] as any;
    const { accounts } = await connectFE.connect({ chains: ['sui:mainnet'] });
    if (!accounts?.length) throw new Error('No accounts');
    this.address = accounts[0].address;

    return { address: this.address, nameService: null };
  }

  getAddress(): string {
    return this.address;
  }

  async sendTx(txData: TransactionRequestMVM): Promise<string> {
    if (!this.wallet) throw new Error('Wallet not connected');
    const txBytes = Uint8Array.from(atob(txData.data), c => c.charCodeAt(0));
    const txBlock = Transaction.from(txBytes);

    const feat = this.wallet.features['sui:signAndExecuteTransaction'] as any;
    if (!feat) throw new Error('Wallet missing execution feature');

    const account = this.wallet.accounts[0];
    const chain = account.chains[0];

    const result = await feat.signAndExecuteTransaction({
      transaction: txBlock,
      account,
      chain,
      options: { showEffects: true },
    });

    if (!result?.digest) throw new Error('Execution failed');
    return result.digest;
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    throw new Error('Network switching not supported');
  }
}
