import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { DataService } from './shared/data.service';
import { NetService } from './shared/net.service';
import { NotificationService } from './shared/notification.service';
import { AppComponent } from './app.component';
import { CampaignFormAddComponent } from './campaign-form-add/campaign-form-add.component';
import { CampaignFormEditComponent } from './campaign-form-edit/campaign-form-edit.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CampaignItemComponent } from './campaign-item/campaign-item.component';


@NgModule({
  declarations: [
    AppComponent,
    CampaignFormAddComponent,
    CampaignFormEditComponent,
    CampaignsComponent,
    PageNotFoundComponent,
    ToolbarComponent,
    CampaignItemComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [DataService, NetService, NotificationService],
  bootstrap: [AppComponent],
})
export class AppModule { }
