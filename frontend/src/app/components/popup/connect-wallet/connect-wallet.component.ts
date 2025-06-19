import { Component, Output, EventEmitter, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { PopupService } from '../../../services/popup.service';
import { BlockchainStateService } from '../../../services/blockchain-state.service';
import { MouseGradientService } from '../../../services/mouse-gradient.service';
import { Wallets } from '../../../models/wallet-provider.interface';
import { ProvidersService } from '../../../services/providers.service';

@Component({
  selector: 'app-connect-wallet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './connect-wallet.component.html',
  styleUrls: [
		'./connect-wallet.component.scss',
		'./connect-wallet.component.adaptives.scss'
  ],
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'scale(0.9)',
          backgroundColor: 'rgba(var(--black), 0)',
          backdropFilter: 'blur(0px)'
        }),
        animate('150ms ease-out', style({ 
          opacity: 1, 
          transform: 'scale(1)',
          backgroundColor: 'rgba(var(--black), 0.3)',
          backdropFilter: 'blur(35px)'
        }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ 
          opacity: 0, 
          transform: 'scale(0.9)',
          backgroundColor: 'rgba(var(--black), 0)',
          backdropFilter: 'blur(0px)'
        }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
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
    private providerService: ProvidersService
  ) {
    this.providerService.registerProviders();
   }

  async ngOnInit(): Promise<void> {
    this.allWallets = await this.blockchainStateService.loadProviders();
    this.allProviders = this.allWallets.map(wallet => wallet.id);

    this.availableWallets = [];
    this.otherWallets = [];

    this.allWallets.forEach(wallet => {
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

    try {
      // console.log('Attempting to connect to provider...');
      const { address } = await provider.connect();
      // console.log('Successfully connected, address:', address);

      sessionStorage.setItem('currentProvider', providerId);
      sessionStorage.setItem('networkId', (this.blockchainStateService.networkSell()!.id).toString());

      try {
        // console.log('Updating wallet address...');
        this.blockchainStateService.updateWalletAddress(address);
        // console.log('Wallet address updated');
        
        // console.log('Setting current provider:', providerId);
        this.blockchainStateService.setCurrentProvider(providerId);
        // console.log('Current provider set');
        
        this.closePopup();
        
        this.popupService.openPopup('ecosystemChange');
      } catch(e: unknown) {
        console.error("Error in post-connection steps:", e);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  disconnectWallet(): void {
    this.blockchainStateService.disconnect();
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