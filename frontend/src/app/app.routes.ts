import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeComponent } from './pages/trade/trade.component';
import { QuestsComponent } from './pages/quests/quests.component';

export const routes: Routes = [
  { path: '', component: TradeComponent, data: { title: 'Trade' } },
  // { path: 'trade', component: TradeComponent, data: { title: 'Trade' } },
  { path: 'rewards', component: QuestsComponent, data: { title: 'Rewards' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
