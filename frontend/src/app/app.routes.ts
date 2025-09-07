import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeComponent } from './pages/trade/trade.component';
import { RewardsComponent } from './pages/rewards/rewards.component';
import { QuestsComponent } from './pages/quests/quests.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { DocumentationPageComponent } from './components/documentation/documentation-page/documentation-page.component';
import { documentationRoutes } from './components/documentation/documentation.routes';

export const routes: Routes = [
  { path: '', component: TradeComponent, data: { title: 'Trade' } },
  // { path: 'trade', component: TradeComponent, data: { title: 'Trade' } },
  { path: 'rewards', component: RewardsComponent, data: { title: 'Rewards' } },
  { path: 'quests', component: QuestsComponent, data: { title: 'Quests' } },
  { path: 'pro', component: FormPageComponent, data: { title: 'Pro' } },
	{
    path: 'documentation',
    component: DocumentationPageComponent,
    children: documentationRoutes,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
