import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';  // Импортируем Router и NavigationEnd
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { Network } from '../../models/wallet-provider.interface';
import { PopupService } from '../../services/popup.service';
import { HeaderComponent } from '../header/header.component';
import { BlockchainConnectComponent } from '../blockchain-connect/blockchain-connect.component';
import { FooterComponent } from '../footer/footer.component';
import { BlackholeMenuComponent } from '../popup/blackhole-menu/blackhole-menu.component';
import { BlackholeNetworkComponent } from '../popup/blackhole-network/blackhole-network.component';
import { WalletComponent } from "../popup/wallet/wallet.component";
import { ConnectWalletComponent } from "../popup/connect-wallet/connect-wallet.component";
@Component({
  selector: 'app-app-content',
  standalone: true,
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.scss'],
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent, BlackholeMenuComponent, CommonModule, BlackholeNetworkComponent, BlockchainConnectComponent, WalletComponent, ConnectWalletComponent]
})
export class AppContentComponent {
  isPopupVisible = false;
  isNetworkPopupVisible = false;
  selectedNetwork = 'ethereum';
  showDefaultLayout = true;
  networks: Network[] = [];

  constructor(
    private router: Router, 
    public popupService: PopupService,
    ) {
      //this.networks = this.networkService.getNetworks();
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

}
