import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-ecosystem-change',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ecosystem-change.component.html',
  styleUrls: [
    './ecosystem-change.component.scss',
    './ecosystem-change.component.adaptives.scss'
  ]
})
export class EcosystemChangeComponent {
  @Output() close = new EventEmitter<void>();
  @Output() ecosystemSelected = new EventEmitter<string>();
  
  ecosystems = [
    {
      id: 'evm',
      name: 'Ethereum & EVM',
      description: 'Ethereum and EVM-compatible blockchains',
      iconUrl: '/img/ecosystem/evm.png'
    },
    {
      id: 'svm',
      name: 'Solana',
      description: 'Solana blockchain ecosystem',
      iconUrl: '/img/ecosystem/sol.png'
    }
  ];
  
  constructor(private popupService: PopupService) {}
  
  closePopup(): void {
    this.popupService.closePopup('ecosystemChange');
    this.close.emit();
  }
  
  selectEcosystem(ecosystemId: string): void {
    this.ecosystemSelected.emit(ecosystemId);
    this.closePopup();
  }
}
