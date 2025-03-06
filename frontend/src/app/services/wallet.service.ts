import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  private walletNameSubject = new BehaviorSubject<string>('');
  private walletAddressSubject = new BehaviorSubject<string>('lunar.eth');

  isConnected$ = this.isConnectedSubject.asObservable();
  walletName$ = this.walletNameSubject.asObservable();
  walletAddress$ = this.walletAddressSubject.asObservable();

  connect(walletName: string): void {
    this.isConnectedSubject.next(true);
    this.walletNameSubject.next(walletName);
    this.walletAddressSubject.next('lunar.eth');
  }

  disconnect(): void {
    this.isConnectedSubject.next(false);
    this.walletNameSubject.next('');
    this.walletAddressSubject.next('');
  }

  isConnected(): boolean {
    return this.isConnectedSubject.value;
  }

  getWalletName(): string {
    return this.walletNameSubject.value;
  }

  getAddress(): string {
    return this.walletAddressSubject.value;
  }
}
