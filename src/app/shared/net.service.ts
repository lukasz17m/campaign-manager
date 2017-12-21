import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Campaign } from './data.service';

@Injectable()
export class NetService {

  constructor(private http: HttpClient) { }

  getUser(token: string): Observable<any> {
    return this.http.get('/api/user/' + token);
  }

  updateUserBalance(token: string, balance: number): Observable<any> {
    return this.http.put('/api/user/' + token, { balance })
      .map((res: { balance: number }) => res ? res.balance : null);
  }

  getCampaigns(): Observable<any> {
    return this.http.get('/api/campaigns');
  }

  getCampaign(id: string): Observable<any> {
    return this.http.get('/api/campaign/' + id);
  }

  createCampaign(campaign: Campaign): Observable<any> {
    return this.http.post('/api/campaign', campaign);
  }

  updateCampaign(id: string, campaign: Campaign): Observable<any> {
    return this.http.put('/api/campaign/' + id, campaign);
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete('/api/campaign/' + id);
  }

}
