import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
	imports: [
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: [
		'./footer.component.scss',
		'./footer.component.adaptives.scss'
	]
})
export class FooterComponent {}
