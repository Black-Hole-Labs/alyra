import { Routes } from '@angular/router';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';

export const documentationRoutes: Routes = [
  { path: 'termsofuse', component: TermsofuseComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: '', redirectTo: 'termsofuse', pathMatch: 'full' },
];
