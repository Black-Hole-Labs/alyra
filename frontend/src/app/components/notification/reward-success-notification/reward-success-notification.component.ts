import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-reward-success-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './reward-success-notification.component.html',
  styleUrls: [
    './reward-success-notification.component.scss', 
    './reward-success-notification.component.adaptives.scss'
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
export class RewardSuccessNotificationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() amount: string = '0';
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