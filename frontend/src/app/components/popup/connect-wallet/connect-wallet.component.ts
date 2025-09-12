import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

import type { Wallets } from '../../../models/wallet-provider.interface';
import { ProviderType } from '../../../models/wallet-provider.interface';
import type { BlockchainStateService } from '../../../services/blockchain-state.service';
import type { MouseGradientService } from '../../../services/mouse-gradient.service';
import type { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-connect-wallet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss', './connect-wallet.component.adaptives.scss'],
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.9)',
          backgroundColor: 'rgba(var(--black), 0)',
          backdropFilter: 'blur(0px)',
        }),
        animate(
          '150ms ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
            backgroundColor: 'rgba(var(--black), 0.3)',
            backdropFilter: 'blur(35px)',
          }),
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.9)',
            backgroundColor: 'rgba(var(--black), 0)',
            backdropFilter: 'blur(0px)',
          }),
        ),
      ]),
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
  ],
})
export class ConnectWalletComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() openWallet = new EventEmitter<void>();

  allWallets: Wallets[] = [];
  availableWallets: Wallets[] = [];
  otherWallets: Wallets[] = [];
  isOtherWalletsVisible = false;

  private allProviders: string[] = [];

  constructor(
    private popupService: PopupService,
    private blockchainStateService: BlockchainStateService,
    private mouseGradientService: MouseGradientService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.blockchainStateService.registerProviders();

    this.allWallets = await this.blockchainStateService.loadProviders();
    this.allProviders = this.allWallets.map((wallet) => wallet.id);

    const ecosystem = this.blockchainStateService.getEcosystemForPopup();

    if (ecosystem) {
      this.allWallets = this.allWallets.filter((wallet) => {
        const type = this.blockchainStateService.getType(wallet.id);
        return type === ProviderType.MULTICHAIN || type === ecosystem;
      });
    }

    this.availableWallets = [];
    this.otherWallets = [];

    this.allWallets.forEach((wallet) => {
      if (['walletconnect'].includes(wallet.id)) {
        wallet.status = 'connect';
        this.availableWallets.push(wallet);
      } else {
        const isDetected = this.isWalletDetected(wallet.id);
        wallet.status = isDetected ? 'detected' : 'install';

        if (wallet.status === 'detected') {
          this.availableWallets.push(wallet);
        } else {
          this.otherWallets.push(wallet);
        }
      }
    });

    // TODO recent logic
    // const recentWallet = this.availableWallets.find(w => w.id === 'metamask');
    // if (recentWallet) {
    //   recentWallet.status = 'recent';
    // }
  }

  private isWalletDetected(providerId: string): boolean {
    const provider = this.blockchainStateService.getProvider(providerId);
    return provider && provider.isAvailable();
  }

  closePopup(): void {
    this.popupService.closePopup('connectWallet');
    this.close.emit();
  }

  async onWalletClick(providerId: string): Promise<void> {
    // console.log('Starting wallet connection for provider:', providerId);

    if (!this.allProviders.includes(providerId)) {
      console.error('Provider not supported:', providerId);
      alert('Provider not supported');
      return;
    }

    const provider = this.blockchainStateService.getProvider(providerId);
    if (!provider) {
      console.error('Provider not registered:', providerId);
      alert('Provider not registered');
      return;
    }

    const type = this.blockchainStateService.getType(providerId);

    if (type === ProviderType.MULTICHAIN) {
      this.blockchainStateService.pendingProviderId = providerId;
      this.popupService.openPopup('ecosystemChange');
      return;
    }

    this.closePopup();
    const { address, nameService } = await provider.connect();
    this.popupService.openPopup('wallet');

    try {
      // console.log('Attempting to connect to provider...');

      this.blockchainStateService.setCurrentProvider(providerId, address, nameService);

      if (type === ProviderType.EVM) {
        sessionStorage.setItem('currentEvmProvider', providerId);
        // sessionStorage.setItem('evmNetworkId', ...);
      } else if (type === ProviderType.SVM) {
        sessionStorage.setItem('currentSvmProvider', providerId);
        // sessionStorage.setItem('svmNetworkId', ...);
      } else if (type === ProviderType.MVM) {
        sessionStorage.setItem('currentMvmProvider', providerId);
        // sessionStorage.setItem('svmNetworkId', ...);
      } else if (type === ProviderType.MULTICHAIN) {
        if (provider.currentNetwork === ProviderType.EVM) {
          sessionStorage.setItem('currentEvmProvider', providerId);
        } else if (provider.currentNetwork === ProviderType.SVM) {
          sessionStorage.setItem('currentSvmProvider', providerId);
        } else if (provider.currentNetwork === ProviderType.MVM) {
          sessionStorage.setItem('currentMvmProvider', providerId);
        }
      }
      // console.log('Successfully connected, address:', address);

      // sessionStorage.setItem('currentProvider', providerId);
      sessionStorage.setItem('networkId', this.blockchainStateService.networkSell()!.id.toString());
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  handleWalletClick(wallet: Wallets): void {
    if (wallet.status === 'install' && wallet.installUrl) {
      window.open(wallet.installUrl, '_blank');
    } else {
      this.onWalletClick(wallet.id);
    }
  }

  toggleOtherWallets(): void {
    this.isOtherWalletsVisible = !this.isOtherWalletsVisible;
  }

  onMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }
}
