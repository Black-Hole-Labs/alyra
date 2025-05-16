import { Injector } from "@angular/core";
import { EvmWalletProvider } from "./evm-wallet-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Network } from "./wallet-provider.interface";
import * as allNetworks from "../../../public/data/networks.json";

const networks = (allNetworks as any) as Network[];

export class WalletConnectEvmProvider extends EvmWalletProvider {
  private wcProvider: WalletConnectProvider;

  constructor(injector: Injector) {
    // Polyfill for global to fix "global is not defined" error
    if (typeof window !== 'undefined') {
      (window as any).global = window;
    }

    // Build a chainId->rpcUrl map from networks.json (pick first RPC per chain)
    const rpc: Record<number, string> = networks
      .filter(n => n.chainType === "EVM")
      .reduce((map, n) => {
        if (n.rpcUrls && n.rpcUrls.length) {
          map[n.id] = n.rpcUrls[0];
        }
        return map;
      }, {} as Record<number, string>);

    // Initialize WalletConnectProvider with the RPC map
    const wcProvider = new WalletConnectProvider({ rpc });
    super(wcProvider, injector);
    this.wcProvider = wcProvider;
  }

  override async connect(): Promise<{ address: string; network: string }> {
    await this.wcProvider.enable();
    return super.connect(this.wcProvider);
  }

  override async switchNetwork(_: any): Promise<void> {
    console.warn(
      "WalletConnect cannot programmatically switch chains. Prompt user to reconnect on the desired network."
    );
  }

  async disconnect(): Promise<void> {
    await this.wcProvider.disconnect();
  }
}