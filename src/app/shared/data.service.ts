import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { NetService } from './net.service';
import { NotificationService } from './notification.service';

export interface User {
  name: string;
  balance: number;
}

export interface Campaign {
  id?: string;
  name: string;
  keywords: string[];
  bidAmount: number;
  campaignFund: number;
  status: boolean;
  town: string;
  radius: number;
}

@Injectable()
export class DataService {

  private userToken = 'secret';

  // User data source
  balanceSource = new BehaviorSubject<number>(null);
  private nameSource = new BehaviorSubject<string>('guest');

  // Campaigns data source
  private campaignsSource = new BehaviorSubject<Campaign[]>([]);

  // User data
  balance: Observable<string>;
  name: Observable<string>;

  // Campaigns data
  campaigns: Observable<Campaign[]>;

  constructor(private net: NetService, private notification: NotificationService) {
    // Setup Observables
    this.balance = this.balanceSource.asObservable().map(balance => {
      return balance === null ? '0.00' : balance.toFixed(2);
    });
    this.name = this.nameSource.asObservable();
    this.campaigns = this.campaignsSource.asObservable();

    // Get user info from the database
    this.net.getUser(this.userToken).subscribe(user => this.setUserData(user));

    // Get user info from the database
    this.net.getCampaigns().subscribe(campaigns => this.setCampaigns = campaigns);
  }

  set setBalance(balance: number) {
    this.balanceSource.next(balance);
  }

  set setName(name: string) {
    this.nameSource.next(name);
  }

  set setCampaigns(campaigns: Campaign[]) {
    this.campaignsSource.next(campaigns);
  }

  setUserData(user: User) {
    if (!user) {
      return;
    }

    this.setBalance = user.balance || 0;
    this.setName = user.name || 'guest';
  }

  updateUserBalance(balance: number) {
    this.net.updateUserBalance(this.userToken, balance)
      .subscribe(this.setUserBalance.bind(this));
  }

  setUserBalance(newBalance: number) {
    if (newBalance !== null && newBalance >= 0) {
      this.setBalance = newBalance;
    }
  }

  updateCampaigns(success: boolean = true) {
    if (success) {
      this.net.getCampaigns().subscribe(campaigns => this.setCampaigns = campaigns);
    }
  }

  addCampaign(campaign: Campaign, funds: number): Observable<boolean> {
    const balance = Math.round(funds * 100) / 100;
    const campaignFund = Math.round(campaign.campaignFund * 100) / 100;

    if (balance < campaignFund) {
      this.notification.push('You don’t have enough funds!');

      return Observable.of(false);
    }

    return this.net.createCampaign(campaign).map(addedCampaign => {
      if (addedCampaign.name === campaign.name) {
        // Deduct funds
        const newBalance = funds - campaign.campaignFund;

        this.net.updateUserBalance(this.userToken, newBalance)
        .subscribe(this.setUserBalance.bind(this));

        return true;
      }
      return false;
    });
  }

  getCampaign(id: string) {
    return this.net.getCampaign(id);
  }

  saveCampaign(
    id: string,
    campaign: Campaign,
    funds: number,
    initialCampaignFund: number,
  ): Observable<boolean> {
    const balance = Math.round(funds * 100) / 100;
    const campaignFund = Math.round(campaign.campaignFund * 100) / 100;

    if (balance < campaignFund) {
      this.notification.push('You don’t have enough funds!');

      return Observable.of(false);
    }

    return this.net.updateCampaign(id, campaign).map(updatedCampaign => {
      if (updatedCampaign.name === campaign.name) {
        // Deduct funds
        const newBalance = funds - campaign.campaignFund + initialCampaignFund;

        this.net.updateUserBalance(this.userToken, newBalance)
          .subscribe(this.setUserBalance.bind(this));

        return true;
      }
      return false;
    });
  }

  removeCampaign(campaign: Campaign, balance: number) {
    this.net.deleteCampaign(campaign.id).subscribe(({ ok }) => {
      this.updateCampaigns(ok);

      const newBalance = balance + campaign.campaignFund;

      this.net.updateUserBalance(this.userToken, newBalance)
        .subscribe(this.setUserBalance.bind(this));
    });
  }

}
