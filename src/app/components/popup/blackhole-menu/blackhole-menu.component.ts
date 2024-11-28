import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-blackhole-menu',
  standalone: true,
  templateUrl: './blackhole-menu.component.html',
  styleUrls: ['./blackhole-menu.component.css']
})
export class BlackholeMenuComponent {
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}