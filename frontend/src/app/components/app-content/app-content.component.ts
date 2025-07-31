import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { NetworkId, ProviderType } from '../../models/wallet-provider.interface';
import { PopupService } from '../../services/popup.service';
import { BlackholeMenuComponent } from '../popup/blackhole-menu/blackhole-menu.component';
import { WalletComponent } from "../popup/wallet/wallet.component";
import { ConnectWalletComponent } from "../popup/connect-wallet/connect-wallet.component";
import { EcosystemChangeComponent } from '../popup/ecosystem-change/ecosystem-change.component';
import { BlockchainStateService } from '../../services/blockchain-state.service';

@Component({
  selector: 'app-app-content',
  standalone: true,
  templateUrl: './app-content.component.html',
  styleUrls: [
		'./app-content.component.scss',
		'./app-content.component.adaptives.scss'
	],
  imports: [
    RouterOutlet,
    RouterModule,
    BlackholeMenuComponent,
    CommonModule,
    WalletComponent,
    ConnectWalletComponent,
    EcosystemChangeComponent
  ]
})
export class AppContentComponent {
  isPopupVisible = false;
  isNetworkPopupVisible = false;

  @HostBinding('class.documentation-page') get isDocumentationPage(): boolean {
    return this.router.url.startsWith('/documentation');
  }

  constructor(
    private router: Router, 
    public popupService: PopupService,
    private blockchainStateService: BlockchainStateService,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeAllPopups();
    });
  }

  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  toggleNetworkPopup() {
    this.isNetworkPopupVisible = !this.isNetworkPopupVisible;
  }

  closeAllPopups() {
    this.isPopupVisible = false;
    this.isNetworkPopupVisible = false;
  }
  // TODO
  async onEcosystemSelected(ecosystemId: string): Promise<void> {

    const providerId = this.blockchainStateService.pendingProviderId;
    if (!providerId) {
      console.error('No pending multichain provider');
      return;
    }
    const provider = this.blockchainStateService.getProvider(providerId);

    const networkId = ecosystemId === ProviderType.EVM
    ? NetworkId.ETHEREUM_MAINNET
    : ecosystemId === ProviderType.SVM
      ? NetworkId.SOLANA_MAINNET
      : NetworkId.SUI_MAINNET;

    const { address, nameService } = await provider.connect(networkId);

    this.popupService.openPopup('wallet');

    this.blockchainStateService.setCurrentProvider(providerId, address, nameService);
    if (ecosystemId === ProviderType.EVM) 
    {
      sessionStorage.setItem('currentEvmProvider', providerId);
    } 
    else 
    {
      sessionStorage.setItem('currentSvmProvider', providerId);
    }
    sessionStorage.setItem('networkId', networkId.toString());

    this.blockchainStateService.pendingProviderId = null;

    // if (ecosystemId === ProviderType.EVM)
    // {
    //   this.blockchainStateService.updateNetworkSell(NetworkId.ETHEREUM_MAINNET);
    // }
    // else if (ecosystemId === ProviderType.SVM)
    // {
    //   this.blockchainStateService.updateNetworkSell(NetworkId.SOLANA_MAINNET);
    // }

  }

  closeEcosystemPopup(): void {
    this.popupService.closePopup('ecosystemChange');
  }

  onPopupMouseEnter(): void {
    this.popupService.onPopupMouseEnter();
  }

  onPopupMouseLeave(): void {
    this.popupService.onPopupMouseLeave();
  }
}
