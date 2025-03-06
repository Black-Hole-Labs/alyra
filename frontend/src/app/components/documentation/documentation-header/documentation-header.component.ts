import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-documentation-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './documentation-header.component.html',
  styleUrls: ['./documentation-header.component.scss'],
})
export class DocumentationHeaderComponent {
  constructor(public popupService: PopupService) {}

  togglePopup() {
    if (this.popupService.getCurrentPopup() === 'blackholeMenu') {
      this.popupService.closePopup('blackholeMenu');
    } else {
      this.popupService.openPopup('blackholeMenu');
    }
  }
}