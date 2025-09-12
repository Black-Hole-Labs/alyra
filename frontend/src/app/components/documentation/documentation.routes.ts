import { Routes } from '@angular/router';

import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';

export const documentationRoutes: Routes = [
  { path: 'termsofuse', component: TermsofuseComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: '', redirectTo: 'termsofuse', pathMatch: 'full' },
];
