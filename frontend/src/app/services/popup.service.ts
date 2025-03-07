import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private activePopupSubject = new BehaviorSubject<string | null>(null);
  activePopup$ = this.activePopupSubject.asObservable();

  openPopup(popupName: string): void {
    console.log(`Opening popup: ${popupName}`);
    document.body.classList.add('popup-opening');
    this.activePopupSubject.next(popupName);
  }

  closePopup(popupName: string): void {
    if (this.getCurrentPopup() === popupName) {
      console.log(`Closing popup: ${popupName}`);
      document.body.classList.add('popup-closing');
      setTimeout(() => {
        this.activePopupSubject.next(null);
        document.body.classList.remove('popup-closing');
        document.body.classList.remove('popup-opening');
      }, 200);
    }
  }

  closeAllPopups(): void {
    console.log('Closing all popups');
    if (this.getCurrentPopup()) {
      document.body.classList.add('popup-closing');
      setTimeout(() => {
        this.activePopupSubject.next(null);
        document.body.classList.remove('popup-closing');
        document.body.classList.remove('popup-opening');
      }, 200);
    }
  }

  getCurrentPopup(): string | null {
    return this.activePopupSubject.value;
  }
}