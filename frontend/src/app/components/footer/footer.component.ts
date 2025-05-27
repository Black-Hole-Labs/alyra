import { Component, OnInit, OnDestroy, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ethers } from 'ethers';
import { TokenService } from '../../services/token.service';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { Connection } from '@solana/web3.js';

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

  constructor(
    private tokenService: TokenService,
    private blockchainStateService: BlockchainStateService,
  ) {
    const rpcUrlEvm = this.blockchainStateService.getNetworkById(1)?.rpcUrls[0];
    const rpcUrlSol = this.blockchainStateService.getNetworkById(1151111081099710)?.rpcUrls[0];
    this.providerEvm.set(new ethers.JsonRpcProvider(rpcUrlEvm));
    this.providerSol.set(new Connection(rpcUrlSol!));

    effect(
      () => {
        const token = this.tokenService.getSelectedToken();
        if (!token) return;

        const network = this.blockchainStateService.getNetworkById(token.chainId);
        if (network?.rpcUrls[0] && token.chainId !== 1151111081099710) {
          console.log('network', network);
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

      if (token.chainId === 1151111081099710) {
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
