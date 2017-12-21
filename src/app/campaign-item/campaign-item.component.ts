import { Component, OnInit, Input } from '@angular/core';
import { Campaign, DataService } from '../shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-item',
  templateUrl: './campaign-item.component.html',
  styleUrls: ['./campaign-item.component.scss']
})
export class CampaignItemComponent implements OnInit {
  @Input('campaign') campaign: Campaign;

  constructor(private data: DataService, private router: Router) { }

  ngOnInit() {
  }

  onEditButtonClick(campaign: Campaign) {
    this.router.navigate(['campaign', campaign.id]);
  }

  onDeleteButtonClick(campaign: Campaign) {
    this.data.removeCampaign(campaign, this.data.balanceSource.value);
  }

}
