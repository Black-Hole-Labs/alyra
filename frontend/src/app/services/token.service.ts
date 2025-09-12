import { Injectable, signal } from '@angular/core';

import { Token } from '../pages/trade/trade.component';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  selectedBuyToken = signal<Token | undefined>(undefined);
  selectedSellToken = signal<Token | undefined>(undefined);
  // selectedBuyNetwork = signal<Network | undefined>(undefined);
  // selectedSellNetwork = signal<Network | undefined>(undefined);

  public setSelectedBuyToken(token: Token | undefined) {
    this.selectedBuyToken.set(token);
  }

  public setSelectedSellToken(token: Token | undefined) {
    this.selectedSellToken.set(token);
  }

  // public setSelectedBuyNetwork(network: Network | undefined) {
  //   this.selectedBuyNetwork.set(network);
  // }

  // public setSelectedSellNetwork(network: Network | undefined) {
  //   this.selectedSellNetwork.set(network);
  // }
}
