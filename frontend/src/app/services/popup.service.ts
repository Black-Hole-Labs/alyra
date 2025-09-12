import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private activePopupSubject = new BehaviorSubject<string | null>(null);
  public activePopup$ = this.activePopupSubject.asObservable();

  private menuCloseTimer: number | null = null;
  private isMenuClickedOpen: boolean = false;

  constructor() {}

  openPopup(popupName: string): void {
    document.body.classList.add('popup-opening');
    this.activePopupSubject.next(popupName);
  }

  closePopup(popupName: string): void {
    if (this.getCurrentPopup() === popupName) {
      document.body.classList.add('popup-closing');
      setTimeout(() => {
        this.activePopupSubject.next(null);
        document.body.classList.remove('popup-closing');
        document.body.classList.remove('popup-opening');
        this.isMenuClickedOpen = false;
      }, 200);
    }
  }

  closeAllPopups(): void {
    if (this.getCurrentPopup()) {
      document.body.classList.add('popup-closing');
      setTimeout(() => {
        this.activePopupSubject.next(null);
        document.body.classList.remove('popup-closing');
        document.body.classList.remove('popup-opening');
        this.isMenuClickedOpen = false;
        this.clearMenuTimer();
      }, 200);
    } else {
      this.isMenuClickedOpen = false;
      this.clearMenuTimer();
    }
  }

  getCurrentPopup(): string | null {
    return this.activePopupSubject.value;
  }

  onMenuMouseEnter(): void {
    this.clearMenuTimer();

    if (this.getCurrentPopup() !== 'blackholeMenu') {
      this.openPopup('blackholeMenu');
      this.isMenuClickedOpen = false;
    }
  }

  onMenuMouseLeave(): void {
    if (!this.isMenuClickedOpen) {
      this.setMenuCloseTimer();
    }
  }

  onMenuClick(): void {
    this.clearMenuTimer();

    if (this.getCurrentPopup() === 'blackholeMenu') {
      if (!this.isMenuClickedOpen) {
        this.isMenuClickedOpen = true;
      } else {
        this.closePopup('blackholeMenu');
      }
    } else {
      this.openPopup('blackholeMenu');
      this.isMenuClickedOpen = true;
    }
  }

  onPopupMouseEnter(): void {
    this.clearMenuTimer();
  }

  onPopupMouseLeave(): void {
    if (!this.isMenuClickedOpen) {
      this.setMenuCloseTimer();
    }
  }

  private setMenuCloseTimer(): void {
    this.clearMenuTimer();
    this.menuCloseTimer = window.setTimeout(() => {
      this.closePopup('blackholeMenu');
      this.menuCloseTimer = null;
    }, 200);
  }

  private clearMenuTimer(): void {
    if (this.menuCloseTimer) {
      clearTimeout(this.menuCloseTimer);
      this.menuCloseTimer = null;
    }
  }
}
