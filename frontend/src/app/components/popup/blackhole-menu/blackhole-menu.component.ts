import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../../services/popup.service';
import { MouseGradientService } from '../../../services/mouse-gradient.service';

@Component({
  selector: 'app-blackhole-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blackhole-menu.component.html',
  styleUrls: [
		'./blackhole-menu.component.scss', 
		'./blackhole-menu.component.adaptives.scss'
	]
})
export class BlackholeMenuComponent {
  @Output() close = new EventEmitter<void>();
  @Output() mouseEnter = new EventEmitter<void>();
  @Output() mouseLeave = new EventEmitter<void>();

  constructor(
    private popupService: PopupService,
    private mouseGradientService: MouseGradientService
  ) {}

  closePopup(): void {
    this.popupService.closePopup('blackholeMenu');
    this.close.emit();
  }

  onMenuMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }

  onPopupMouseEnter(): void {
    this.mouseEnter.emit();
  }

  onPopupMouseLeave(): void {
    this.mouseLeave.emit();
  }
}