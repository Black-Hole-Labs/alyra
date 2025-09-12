import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reward-failed-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reward-failed-notification.component.html',
  styleUrls: [
    './reward-failed-notification.component.scss',
    './reward-failed-notification.component.adaptives.scss',
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
export class RewardFailedNotificationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() amount: number = 0;
  @Input() message: string = '';
  @Input() transactionHash: string = '';
  isVisible = true;

  ngOnInit() {
    setTimeout(() => {
      this.startClosing();
    }, 5000);
  }

  public startClosing() {
    this.isVisible = false;
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }
}
