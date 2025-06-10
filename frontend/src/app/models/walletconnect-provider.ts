import { Injector } from '@angular/core';
import { EvmWalletProvider } from './evm-wallet-provider';
import EthereumProvider from "@walletconnect/ethereum-provider";
import { Network } from './wallet-provider.interface';

export class WalletConnectEvmProvider extends EvmWalletProvider {
  private chains: number[];

  constructor(injector: Injector, networks: Network[]) {
    super(undefined as any, injector);
    this.chains = networks
      .filter(n => n.chainType === 'EVM')
      .map(n => n.id);
  }

  override async connect(): Promise<{ address: string }> {
    this.provider = await EthereumProvider.init({
      projectId: "07389ba7749da9fd1b3bc8761a313675",
      chains: [1, 137],
      showQrModal: true,
    });
    await this.provider.enable();
    return super.connect(this.provider, /* suppressModal: */);
  }

  override async switchNetwork(chainId: number): Promise<void> {
    await this.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }
}
