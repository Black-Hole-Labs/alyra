import { Component, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { NetworkId } from '../../models/wallet-provider.interface';
import { SuiClient } from '@mysten/sui/client';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss', './footer.component.adaptives.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  public block = signal<number>(0);
  private providerEvm = signal<ethers.JsonRpcProvider | undefined>(undefined);
  private providerSol = signal<Connection | undefined>(undefined);
  private providerSui = signal<SuiClient | undefined>(undefined);
  private updateInterval: any;

  private isStopBlockFetching = false;

  constructor(
    private blockchainStateService: BlockchainStateService,
  ) {
    effect(
      async () => {
        const chainId = this.blockchainStateService.networkSell()?.id;
        this.isStopBlockFetching = false;
        if (!chainId) return;

        if (chainId === NetworkId.SOLANA_MAINNET)
        {
          this.updateBlockNumber();
        }

        const rpc = await this.blockchainStateService.getWorkingRpcUrlForNetwork(chainId);

        if (rpc) {
          this.providerEvm.set(new ethers.JsonRpcProvider(rpc));
          this.updateBlockNumber();
        }
      },
      { allowSignalWrites: true },
    );
  }

  async ngOnInit() {
    const rpcUrlEvm = await this.blockchainStateService.getWorkingRpcUrlForNetwork(NetworkId.ETHEREUM_MAINNET);
    const rpcUrlSol = await this.blockchainStateService.getWorkingRpcUrlForNetwork(NetworkId.SOLANA_MAINNET);
    const rpcUrlSui = await this.blockchainStateService.getWorkingRpcUrlForNetwork(NetworkId.SUI_MAINNET);
    this.providerEvm.set(new ethers.JsonRpcProvider(rpcUrlEvm));
    this.providerSol.set(new Connection(rpcUrlSol));
    this.providerSui.set(new SuiClient({url: rpcUrlSui}));

    this.updateBlockNumber();

    this.updateInterval = setInterval(() => {
      this.updateBlockNumber();
    }, 12000);
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private async updateBlockNumber() {
    if (this.isStopBlockFetching) return;

    try {
      const chainId = this.blockchainStateService.networkSell()?.id;
      if (!chainId) return;
      if (chainId === NetworkId.SUI_MAINNET) {
        const client = this.providerSui();
        if (!client) return;
        const seq = await client.getLatestCheckpointSequenceNumber();
        this.block.set(Number(seq));
      } else if (chainId === NetworkId.SOLANA_MAINNET) {
        const slot = await this.providerSol()?.getSlot();
        this.block.set(slot ?? 0);
      } else {
        const blockNumber = await this.providerEvm()?.getBlockNumber();
        this.block.set(blockNumber ?? 0);
      }
    } catch (error) {
      this.isStopBlockFetching = true;
      console.error('Error fetching block number:', error);
    }
  }
}
