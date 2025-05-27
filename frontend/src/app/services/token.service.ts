import { Injectable, signal } from '@angular/core';
import { Token } from '../pages/trade/trade.component';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private selectedTokenSignal = signal<Token | undefined>(undefined);

  setSelectedToken(token: Token | undefined) {
    this.selectedTokenSignal.set(token);
  }

  getSelectedToken() {
    return this.selectedTokenSignal();
  }
}
