import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-pending-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pending-notification.component.html',
  styleUrls: ['./pending-notification.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-in'))
    ])
  ]
})
export class PendingNotificationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() selectedToken: string = 'ETH';
  @Input() selectedBuyToken: string = 'USDT';
  @Input() sellAmount: string = '0';
  @Input() buyAmount: string = '0';
  isVisible = true;

  ngOnInit() {
    setTimeout(() => {
      this.startClosing();
    }, 5000);
  }

  private startClosing() {
    this.isVisible = false;
    setTimeout(() => {
      this.close.emit();
    }, 300); // Ждем завершения анимации перед удалением
  }
}
