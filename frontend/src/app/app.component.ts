import { Component, inject, Renderer2 } from '@angular/core';
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

import networks from './../../public/data/networks.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, AppContentComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  hostDirectives: [ClosePopupsDirective],
})
export class AppComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private blockchainStateService = inject(BlockchainStateService);
  private renderer = inject(Renderer2);
  public popupService = inject(PopupService);
  public isIntroPage = false;

  constructor() {
    this.setDynamicTitle();
    this.initializeNetworks();
    this.checkCurrentRoute();
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

  private checkCurrentRoute() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe(data => {
        this.isIntroPage = !!data['isIntroPage'];
        if (this.isIntroPage) {
          this.renderer.addClass(document.documentElement, 'intro-page');
        } else {
          this.renderer.removeClass(document.documentElement, 'intro-page');
        }
      });
  }

  private setDynamicTitle() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => {
        const pageTitle = data['title'] ? `Blackhole | ${data['title']}` : 'Blackhole';
        this.titleService.setTitle(pageTitle);
      });
  }
}
