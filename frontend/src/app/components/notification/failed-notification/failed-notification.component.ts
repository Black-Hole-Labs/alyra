import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { Token } from '../../../pages/trade/trade.component';

@Component({
  selector: 'app-failed-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './failed-notification.component.html',
  styleUrls: [
    './failed-notification.component.scss',
    './failed-notification.component.adaptives.scss',
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
export class FailedNotificationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() selectedToken: Token | undefined = undefined;
  @Input() selectedBuyToken: Token | undefined = undefined;
  @Input() sellAmount: string = '0';
  @Input() buyAmount: string = '0';
  @Input() message: string = '';
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
    }, 300);
  }
}
