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
  protected appName: string = 'MyDApp';

  constructor(provider: any, injector: Injector) {
    this.blockchainStateService = injector.get(BlockchainStateService);
    this.provider = provider;
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

    if (String(this.provider).toLowerCase().includes('slush')) {
      registerSlushWallet(this.appName);
    }
    
    const walletsList = getWallets().get();
    const wanted = (this.provider && typeof this.provider === 'string')
      ? this.provider
      : (this.provider && (this.provider as any).name) || 'slush';
    const wantedLower = String(wanted).toLowerCase();

    let found: any = walletsList.find((w: any) => {
      if ((this.provider as any)?.isPhantom) {
        return Array.isArray(w.chains) && w.chains.includes('sui:mainnet');
      }
      const name = (w.name || w.id || w.constructor?.name || w.client?.name || '').toString().toLowerCase();
      const supportsSui = Array.isArray(w.chains) && w.chains.includes('sui:mainnet');
      return supportsSui && name.includes(wantedLower);
    });

    if (!found) {
      throw new Error(`No SUI wallet named ${wanted}`);
    }

    this.wallet = found as Wallet;

    const existingAccounts = (this.wallet as any).accounts;
    if (Array.isArray(existingAccounts) && existingAccounts.length > 0) {
      this.address = existingAccounts[0].address;
      return { address: this.address, nameService: null };
    }

    const connectFE = (this.wallet.features && this.wallet.features['standard:connect']) as any;

    if (!connectFE || typeof connectFE.connect !== 'function') {
      if (typeof (this.wallet as any).connect === 'function') {
        await (this.wallet as any).connect({ chains: ['sui:mainnet'] });
        const accountsAfter = (this.wallet as any).accounts;
        if (!accountsAfter || !accountsAfter.length) throw new Error('No accounts after connect');
        this.address = accountsAfter[0].address;
        return { address: this.address, nameService: null };
      }
      throw new Error('Wallet does not expose standard:connect feature');
    }

    const res = await connectFE.connect({ chains: ['sui:mainnet'] });
    const accounts = res?.accounts || (this.wallet as any).accounts;
    if (!accounts || !accounts.length) throw new Error('No accounts returned by wallet.connect()');
    
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
