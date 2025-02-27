import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { BlackholeMenuComponent } from './components/popup/blackhole-menu/blackhole-menu.component';
import { CommonModule } from '@angular/common';
import { BlackholeNetworkComponent } from './components/popup/blackhole-network/blackhole-network.component';
import { Router, NavigationEnd } from '@angular/router';  // Импортируем Router и NavigationEnd
import { filter } from 'rxjs/operators';
import { BlockchainConnectComponent } from "./components/blockchain-connect/blockchain-connect.component";
import { RouterModule } from '@angular/router';
import { PopupService } from './services/popup.service';
import { ClosePopupsDirective } from './directives/close-popups.directive';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  hostDirectives: [ClosePopupsDirective],
  imports: [RouterOutlet, RouterModule,  HeaderComponent, FooterComponent, BlackholeMenuComponent, CommonModule, BlackholeNetworkComponent, BlockchainConnectComponent]
})
export class AppComponent {
  isPopupVisible = false;
  isNetworkPopupVisible = false;
	selectedNetwork = 'ethereum';

  constructor(private router: Router, private popupService: PopupService) {
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

	onNetworkSelected(network: string) {
    this.selectedNetwork = network; // Обновляем выбранную сеть
    console.log(`Network changed to: ${this.selectedNetwork}`); // Проверка
  }
}
