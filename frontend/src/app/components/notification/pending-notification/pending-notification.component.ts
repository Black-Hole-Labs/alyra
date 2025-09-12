import { animate, state, style, transition,trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input,OnInit, Output } from '@angular/core';

import { Token } from '../../../pages/trade/trade.component';

@Component({
  selector: 'app-pending-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pending-notification.component.html',
  styleUrls: [
		'./pending-notification.component.scss',
		'./pending-notification.component.adaptives.scss'
	],
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
  @Input() selectedToken: Token | undefined = undefined;
  @Input() selectedBuyToken: Token | undefined = undefined;
  @Input() sellAmount: string = '0';
  @Input() buyAmount: string = '0';
  isVisible = true;

  ngOnInit() {
    // console.log("selectedBuyToken",this.selectedBuyToken);
    // setTimeout(() => {
    //   this.startClosing();
    // }, 5000);
  }

  private startClosing() {
    this.isVisible = false;
    setTimeout(() => {
      this.close.emit();
    }, 300);
  }
}
