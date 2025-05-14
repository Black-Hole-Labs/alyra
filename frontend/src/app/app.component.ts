import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppContentComponent } from './components/app-content/app-content.component';
import { ClosePopupsDirective } from './directives/close-popups.directive';
import { PopupService } from './services/popup.service';
import { BlockchainStateService } from './services/blockchain-state.service';
import { ProviderType } from './models/wallet-provider.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    AppContentComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  hostDirectives: [ClosePopupsDirective]
})
export class AppComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private blockchainStateService = inject(BlockchainStateService);
  public popupService = inject(PopupService);

  constructor() {
    this.setDynamicTitle();
    this.initializeNetworks();
  }

  private async initializeNetworks() {
    try {
      const response = await fetch('/data/networks.json');
      const networks = await response.json();
      this.blockchainStateService.allNetworks.set(networks);
      this.blockchainStateService.loadNetworks(ProviderType.MULTICHAIN, true);
    } catch (error) {
      console.error('Failed to load networks:', error);
    }
  }

  private setDynamicTitle() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        const pageTitle = data['title']
          ? `Blackhole | ${data['title']}` 
          : 'Blackhole';
        this.titleService.setTitle(pageTitle);
      });
  }
}
