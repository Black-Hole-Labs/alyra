import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { Network } from '../../models/wallet-provider.interface';
import { PopupService } from '../../services/popup.service';
import { BlackholeMenuComponent } from '../popup/blackhole-menu/blackhole-menu.component';
import { BlackholeNetworkComponent } from '../popup/blackhole-network/blackhole-network.component';
import { WalletComponent } from "../popup/wallet/wallet.component";
import { ConnectWalletComponent } from "../popup/connect-wallet/connect-wallet.component";
@Component({
  selector: 'app-app-content',
  standalone: true,
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.scss'],
  imports: [RouterOutlet, RouterModule, BlackholeMenuComponent, CommonModule, BlackholeNetworkComponent, WalletComponent, ConnectWalletComponent]
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
