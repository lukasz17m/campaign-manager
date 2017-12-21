import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignFormAddComponent } from './campaign-form-add/campaign-form-add.component';
import { CampaignFormEditComponent } from './campaign-form-edit/campaign-form-edit.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: '', component: CampaignsComponent, pathMatch: 'full' },
  { path: 'campaign', component: CampaignFormAddComponent },
  { path: 'campaign/:id', component: CampaignFormEditComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
