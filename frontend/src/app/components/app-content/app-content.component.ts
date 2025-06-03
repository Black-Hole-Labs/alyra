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

  onEcosystemSelected(ecosystemId: string): void {
    if (ecosystemId === ProviderType.EVM)
    {
      this.blockchainStateService.updateNetwork(NetworkId.ETHEREUM_MAINNET);
    }
    else if (ecosystemId === ProviderType.SVM)
    {
      this.blockchainStateService.updateNetwork(NetworkId.SOLANA_MAINNET);
    }
    
    const provider = this.blockchainStateService.getCurrentProvider();
    provider.provider.switchNetwork(this.blockchainStateService.getCurrentNetwork());
    
    this.popupService.openPopup('wallet');
  }

  closeEcosystemPopup(): void {
    this.popupService.closePopup('ecosystemChange');
  }
}
