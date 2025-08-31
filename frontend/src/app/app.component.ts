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
import { ThemeService } from './services/theme.service';

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
  private renderer = inject(Renderer2);
  public popupService = inject(PopupService);
  private themeService = inject(ThemeService);

  constructor() {
    this.setDynamicTitle();
    this.handleThemeOnRouteChange();
  }

  isDocumentationPage(): boolean {
    return this.router.url.startsWith('/documentation');
  }

  isProPage(): boolean {
    return this.router.url.startsWith('/pro');
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
      .subscribe((/*data*/) => {
        // const pageTitle = data['title'] ? `Alyra | ${data['title']}` : 'Alyra';
        const pageTitle = "Alyra | Swap anything, across any chain.";
        this.titleService.setTitle(pageTitle);
      });
  }

  private handleThemeOnRouteChange() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.themeService.handleRouteChange(event.url);
      });
  }
}
