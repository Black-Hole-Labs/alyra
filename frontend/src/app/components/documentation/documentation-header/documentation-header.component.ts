import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PopupService } from '../../../services/popup.service';
import { BlackholeMenuComponent } from '../../popup/blackhole-menu/blackhole-menu.component';

@Component({
  selector: 'app-documentation-header',
  standalone: true,
  imports: [RouterModule, CommonModule, BlackholeMenuComponent],
  templateUrl: './documentation-header.component.html',
  styleUrls: [
    './documentation-header.component.scss',
    './documentation-header.component.adaptives.scss',
  ],
})
export class DocumentationHeaderComponent {
  constructor(public popupService: PopupService) {}

  togglePopup() {
    const currentPopup = this.popupService.getCurrentPopup();
    if (currentPopup === 'blackholeMenu') {
      this.popupService.closePopup('blackholeMenu');
    } else {
      this.popupService.openPopup('blackholeMenu');
    }
  }
}
