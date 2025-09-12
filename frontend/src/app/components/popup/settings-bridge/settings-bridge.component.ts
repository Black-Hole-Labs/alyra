import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-settings-bridge',
  standalone: true,
  templateUrl: './settings-bridge.component.html',
  styleUrls: ['./settings-bridge.component.scss', './settings-bridge.component.adaptives.scss'],
  imports: [CommonModule],
})
export class SettingsBridgeComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  options: string[] = ['Auto', '0.1%', '0.5%'];
  selectedIndex: number | null = 0;
  customValue: string = '';

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    const savedIndex = localStorage.getItem('selectedIndex');
    const savedCustomValue = localStorage.getItem('customValue');

    if (savedIndex !== null) {
      this.selectedIndex = JSON.parse(savedIndex);
    }
    if (savedCustomValue) {
      this.customValue = savedCustomValue;
    }
  }

  onOpen(): void {
    this.popupService.openPopup('settingsBridge');
  }

  onClose(): void {
    this.popupService.closePopup('settingsBridge');
    this.close.emit();
  }

  closePopup(): void {
    this.popupService.closePopup('settingsBridge');
    this.close.emit();
  }

  selectOption(index: number): void {
    this.selectedIndex = index;
    this.customValue = '';
    localStorage.setItem('selectedIndex', JSON.stringify(index));
    localStorage.setItem('customValue', '');
  }

  restrictInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.', ','];

    if ((event.key >= '0' && event.key <= '9') || allowedKeys.includes(event.key)) {
      return;
    }

    event.preventDefault();
  }

  onCustomInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    value = value.replace(/,/g, '.');

    if (value.startsWith('.')) {
      value = '0' + value;
    }

    value = value.replace(/[^0-9.]/g, '');

    const firstDotIndex = value.indexOf('.');
    if (firstDotIndex !== -1) {
      value = value.slice(0, firstDotIndex + 1) + value.slice(firstDotIndex + 1).replace(/\./g, '');
    }

    value = value.slice(0, 4);

    this.customValue = value;
    localStorage.setItem('customValue', value);
  }

  selectCustom(): void {
    this.selectedIndex = null;
    localStorage.setItem('selectedIndex', 'null');
  }

  saveValue(): void {
    let value;
    if (this.selectedIndex !== null) {
      value = this.options[this.selectedIndex];
    } else if (this.customValue) {
      value = this.customValue + '%';
    }

    if (value) {
      localStorage.setItem('slippageValue', value);
      this.save.emit(value);
    }

    this.popupService.closePopup('settingsBridge');
    this.close.emit();
  }
}
