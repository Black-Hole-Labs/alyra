import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reward-pending-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reward-pending-notification.component.html',
  styleUrls: [
    './reward-pending-notification.component.scss',
    './reward-pending-notification.component.adaptives.scss',
  ],
  animations: [
    trigger('slideInOut', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        }),
      ),
      state(
        '*',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        }),
      ),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-in')),
    ]),
  ],
})
export class RewardPendingNotificationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() amount: number = 0;
  @Input() transactionHash: string = '';
  isVisible = true;

  ngOnInit() {
    // Pending уведомление не закрывается автоматически
    // Оно закрывается только при успехе или ошибке
  }

  startClosing() {
    this.isVisible = false;
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }
}
