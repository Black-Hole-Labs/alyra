import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeComponent } from './pages/trade/trade.component';
import { BridgeComponent } from './pages/bridge/bridge.component';
import { QuestsComponent } from './pages/quests/quests.component';

export const routes: Routes = [
  { path: 'trade', component: TradeComponent },
  { path: 'bridge', component: BridgeComponent },
  { path: 'quests', component: QuestsComponent },
  { path: '', redirectTo: '/trade', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
