import { WalletProvider } from './wallet-provider.interface';

export class MetaMaskProvider implements WalletProvider {
  private address: string = '';
  private network: string = '';
  private networks: Record<string, any> = {};

  constructor() {
    this.loadNetworks();
  }

  async connect(): Promise<{ address: string; network: string }> {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.address = accounts[0];
    this.network = await this.getNetwork();
    return { address: this.address, network: this.network };
  }

  async switchNetwork(chainId: string): Promise<void> {
    try {
      // Попытка переключения сети
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      this.network = chainId;
    } catch (error: any) {
      // Если сеть не найдена, добавляем её
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  private async loadNetworks(): Promise<void> {
    try {
      const response = await fetch('/data/networks.json');
      const networks = await response.json();
      this.networks = networks.reduce((map: Record<string, any>, network: any) => {
        map[network.chainId] = network;
        return map;
      }, {});
    } catch (error) {
      console.error('Failed to load networks:', error);
    }
  }

  private async addNetwork(chainId: string): Promise<void> {
    const network = this.networks[chainId];
    if (!network) {
      throw new Error(`Network with chainId ${chainId} is not configured.`);
    }

    await window.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          chainName: network.name,
          rpcUrls: network.rpcUrls,
          nativeCurrency: network.nativeCurrency,
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
