import { Directive, HostListener } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Directive({
  selector: '[appClosePopups]',
  standalone: true
})
export class ClosePopupsDirective {
  constructor(
    private popupService: PopupService,
  ) {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    const currentPopup = this.popupService.getCurrentPopup();
    if (!currentPopup) return;

    const isPopupClick = target.closest('.popup-menu, .connect-wallet, .settings-popup, .settings-bridge-popup, .wallet-popup, .network-popup, .blackhole-menu, .token-change, .token-change-buy, .network-change-from, .network-change-to, .bridge-tx, .ecosystem-change');
    
    const isToggleClick = target.closest('.settings, .wallet, .network, .token, button[class*="open"], button[class*="closed"], h3, .menu, .main-button, .network-from, .network-to');

    if (!isPopupClick && !isToggleClick) {
      this.popupService.closePopup(currentPopup);
    }
  }
}
