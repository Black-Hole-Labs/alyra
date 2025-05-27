import { Component, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { TokenService } from '../../services/token.service';

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
  private updateInterval: any;
  private SOL_CHAIN_ID = 1151111081099710;
  private EVM_CHAIN_ID = 1;

  constructor(
    private tokenService: TokenService,
    private blockchainStateService: BlockchainStateService,
  ) {
    const rpcUrlEvm = this.blockchainStateService.getNetworkById(this.EVM_CHAIN_ID)?.rpcUrls[0];
    const rpcUrlSol = this.blockchainStateService.getNetworkById(this.SOL_CHAIN_ID)?.rpcUrls[0];
    this.providerEvm.set(new ethers.JsonRpcProvider(rpcUrlEvm));
    this.providerSol.set(new Connection(rpcUrlSol!));

    effect(
      () => {
        const token = this.tokenService.getSelectedToken();
        if (!token) return;

        const network = this.blockchainStateService.getNetworkById(token.chainId);
        if (network?.rpcUrls[0] && token.chainId !== this.SOL_CHAIN_ID) {
          this.providerEvm.set(new ethers.JsonRpcProvider(network.rpcUrls[0]));
          this.updateBlockNumber();
        }
        this.updateBlockNumber();
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
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
    try {
      const token = this.tokenService.getSelectedToken();
      if (!token) return;

      if (token.chainId === this.SOL_CHAIN_ID) {
        const slot = await this.providerSol()?.getSlot();
        this.block.set(slot ?? 0);
      } else {
        const blockNumber = await this.providerEvm()?.getBlockNumber();
        this.block.set(blockNumber ?? 0);
      }
    } catch (error) {
      console.error('Error fetching block number:', error);
    }
  }
}
