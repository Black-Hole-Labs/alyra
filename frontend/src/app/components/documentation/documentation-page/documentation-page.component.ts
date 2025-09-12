import { CommonModule } from '@angular/common';
import { Component, HostBinding,OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClosePopupsDirective } from '../../../directives/close-popups.directive';
import { DocumentationFooterComponent } from '../documentation-footer/documentation-footer.component';
import { DocumentationHeaderComponent } from '../documentation-header/documentation-header.component';

@Component({
  selector: 'app-documentation-page',
  standalone: true,
  templateUrl: './documentation-page.component.html',
  styleUrls: [
		'./documentation-page.component.scss',
		'./documentation-page.component.adaptives.scss'
	],
  imports: [
    RouterModule,
		CommonModule,
    DocumentationHeaderComponent,
    DocumentationFooterComponent,
  ],
	hostDirectives: [ClosePopupsDirective]
})
export class DocumentationPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.documentation-page') isDocumentationPage = true;

  ngOnInit() {
    document.documentElement.classList.add('documentation-page');
  }

  ngOnDestroy() {
    document.documentElement.classList.remove('documentation-page');
  }
}
