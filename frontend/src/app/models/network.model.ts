import { WalletProvider } from './wallet-provider.interface';

export class MetaMaskProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';

  // constructor() {
  // }

  async connect(): Promise<{ address: string; network: string }> {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(selectedNetwork: any): Promise<void> {
    try {
      await window.ethereum?.request({
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
    await window.ethereum?.request({
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
    const chainId = await window.ethereum?.request({ method: 'eth_chainId' });
    return chainId || '';
  }

  getAddress(): string {
    return this.address;
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
