import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../services/popup.service';
import { ConnectWalletComponent } from '../popup/connect-wallet/connect-wallet.component';
import { WalletComponent } from '../popup/wallet/wallet.component';
import { BlackholeMenuComponent } from '../popup/blackhole-menu/blackhole-menu.component';
import { BlackholeNetworkComponent } from '../popup/blackhole-network/blackhole-network.component';
import { NetworkService } from '../../services/network.service';

interface Network {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-app-content',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ConnectWalletComponent,
    WalletComponent,
    BlackholeMenuComponent,
    BlackholeNetworkComponent
  ],
  templateUrl: './app-content.component.html',
  styleUrls: ['./app-content.component.scss']
})
export class AppContentComponent {
  showDefaultLayout = true;
  networks: Network[] = [];
  
  constructor(
    public popupService: PopupService,
    public networkService: NetworkService
  ) {
    this.networks = this.networkService.getNetworks();
  }

  onNetworkSelected(network: Network): void {
    this.networkService.setSelectedNetwork(network);
    this.popupService.closeAllPopups();
  }
}
