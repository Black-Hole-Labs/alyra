import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Directive({
  selector: '[appClosePopups]',
  standalone: true
})
export class ClosePopupsDirective {
  constructor(
    private popupService: PopupService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    // Делаем элемент с директивой полностью прозрачным
    this.renderer.setStyle(this.el.nativeElement, 'background', 'transparent');
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
    // Убираем все эффекты, которые могут создавать затемнение
    this.renderer.setStyle(this.el.nativeElement, 'backdrop-filter', 'none');
    this.renderer.setStyle(this.el.nativeElement, '-webkit-backdrop-filter', 'none');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Проверяем, есть ли открытый попап
    const currentPopup = this.popupService.getCurrentPopup();
    if (!currentPopup) return;

    // Проверяем, кликнули ли мы по самому попапу или его содержимому
    const isPopupClick = target.closest('.popup-menu, .connect-wallet, .settings-popup, .settings-bridge-popup, .wallet-popup, .network-popup, .blackhole-menu, .token-change, .token-change-buy, .network-change-from, .network-change-to, .bridge-tx');
    
    // Проверяем, кликнули ли мы по кнопке, которая открывает попап
    const isToggleClick = target.closest('.settings, .wallet, .network, .token, button[class*="open"], button[class*="closed"], h3, .menu, .main-button, .network-from, .network-to');

    // Закрываем попап только если клик был вне попапа и не по кнопке открытия
    if (!isPopupClick && !isToggleClick) {
      this.popupService.closePopup(currentPopup);
    }
  }
}
