import { Component, OnInit } from '@angular/core';
import { Campaign, DataService } from '../shared/data.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styles: ['.menu-icon { vertical-align: middle }'],
})
export class CampaignsComponent implements OnInit {

  campaigns: Campaign[];

  constructor(private data: DataService) {
    this.data.campaigns.subscribe(campaigns => this.campaigns = campaigns);
  }

  ngOnInit() {
  }

}
