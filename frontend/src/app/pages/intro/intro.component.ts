import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PopupService } from '../../services/popup.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss',
		'./intro.component.adaptives.scss'
	]
})
export class IntroComponent implements OnInit {
  constructor(
    private router: Router,
    private popupService: PopupService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.popupService.closeAllPopups();
    this.titleService.setTitle('Blackhole Labs');
  }

  launchApp() {
    this.router.navigate(['/trade']);
  }

  reloadPage() {
    window.location.reload();
  }
} 