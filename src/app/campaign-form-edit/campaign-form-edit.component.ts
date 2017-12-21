import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { NotificationService } from '../shared/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, Campaign } from '../shared/data.service';

@Component({
  selector: 'app-campaign-form-edit',
  templateUrl: './campaign-form-edit.component.html',
  styleUrls: ['./campaign-form-edit.component.scss']
})
export class CampaignFormEditComponent implements OnInit {

  @ViewChild('keywordsInput') keywordsInput;

  private readonly errorMessages = {
    min: 'Invalid field value!',
    pattern: 'Invalid field value!',
    required: 'This field is required!',
  };

  initialBalance: number = null;
  initialFunds: number = null;
  campaign: Campaign = null;

  // Form
  campaignForm: FormGroup;

  // Chips AutoComplete
  separatorKeysCodes = [ENTER, COMMA];
  filteredInitialKeywords: Observable<string[]>;
  keywords: string[] = [];

  initialKeywords: string[] = [
    'Belts',
    'Clothes',
    'Glasses',
    'Hats',
    'Shoes',
  ];

  towns: string[] = [
    'London',
    'Birmingham',
    'Leeds',
    'Glasgow',
    'Sheffield',
    'Bradford',
    'Liverpool',
    'Edinburgh',
    'Manchester',
  ];

  private addKeywordHelper(value: string, input: any) {
    if ((value || '').trim()) {
      this.keywords.push(value.trim().replace(/[^a-z0-9 ]/gi, ''));
    }

    if (input) {
      input.value = '';
    }

    this.campaignForm.controls.keywords.setValue('');
  }

  private filter(val: string): string[] {
    return this.initialKeywords
      .filter(keyword => !this.keywords.includes(keyword))
      .filter(keyword => keyword.toLowerCase().startsWith(val.toLowerCase()));
  }

  private onCampaignFetched(campaign: Campaign) {
    const numbValidator = [
      Validators.required,
      Validators.min(0),
      Validators.pattern('\\d+(\\.\\d{1,2})?'),
    ];

    this.initialFunds = campaign.campaignFund;

    this.keywords = campaign.keywords.slice();

    this.campaignForm = this.fb.group({
      name: [campaign.name, Validators.required],
      keywords: [''],
      bidAmount: [campaign.bidAmount, numbValidator],
      campaignFund: [campaign.campaignFund, numbValidator],
      status: [campaign.status ? '1' : ''],
      town: [campaign.town],
      radius: [campaign.radius],
    });

    this.filteredInitialKeywords = this.campaignForm.controls.keywords.valueChanges
      .pipe(startWith(''), map(val => this.filter(val || '')));

    this.campaignForm.controls.campaignFund.valueChanges
      .subscribe(value => {
        if (value === '') {
          this.data.setUserBalance(this.initialBalance);
          return;
        }

        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          return;
        }

        const balance = Math.round(this.initialBalance * 100) / 100;
        const campaignFund = Math.round(parseFloat(value) * 100) / 100;

        if (balance < campaignFund) {
          return;
        }

        this.data.setUserBalance(balance - campaignFund + this.initialFunds);
      });
  }

  constructor(
    private data: DataService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      this.data.getCampaign(id).subscribe(campaign => {
        this.campaign = campaign;

        this.onCampaignFetched(campaign);
      });
    });

    this.data.balance.subscribe(balance => {
      if (this.initialBalance === null && balance !== '0.00') {
        this.initialBalance = parseFloat(balance);
      }
    });
  }

  addKeyword(event: MatChipInputEvent) {
    const { input, value } = event;

    this.addKeywordHelper(value, input);
  }

  addFromAutoComplete(value: string) {
    this.addKeywordHelper(value, this.keywordsInput.nativeElement);
  }

  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }

    this.campaignForm.controls.keywords.setValue('');
  }

  getErrorMessage(formControl: FormControl) {
    return this.errorMessages[Object.keys(formControl.errors)[0]];
  }

  saveCampaign() {
    if (this.keywords.length === 0) {
      this.notification.push('Keywords are required!');
      return;
    }

    this.campaignForm.value.keywords = this.keywords.slice();

    if (this.campaignForm.valid) {
      const sanitizedFormData = {
        ...this.campaignForm.value,
        bidAmount: parseFloat(this.campaignForm.value.bidAmount),
        campaignFund: parseFloat(this.campaignForm.value.campaignFund),
        status: this.campaignForm.value.status ? true : false,
      };

      this.data.saveCampaign(
        this.campaign.id,
        sanitizedFormData,
        this.initialBalance,
        this.initialFunds,
      ).subscribe(success => {
        if (success) {
          this.data.updateCampaigns();
          this.notification.push('Successfully updated a campaign');
          this.router.navigate(['']);
        }
      });
    }
  }

  onCancelButtonClick() {
    this.router.navigate(['']);
  }

}
