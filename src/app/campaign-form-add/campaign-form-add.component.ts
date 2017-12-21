import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { NotificationService } from '../shared/notification.service';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-campaign-form-add',
  templateUrl: './campaign-form-add.component.html',
  styleUrls: ['./campaign-form-add.component.scss']
})
export class CampaignFormAddComponent implements OnInit {

  @ViewChild('keywordsInput') keywordsInput;

  private readonly errorMessages = {
    min: 'Invalid field value!',
    pattern: 'Invalid field value!',
    required: 'This field is required!',
  };

  initialBalance: number = null;

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

  constructor(
    private data: DataService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private router: Router,
  ) {
    const numbValidator = [
      Validators.required,
      Validators.min(0),
      Validators.pattern('\\d+(\\.\\d{1,2})?'),
    ];

    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      keywords: [''],
      bidAmount: ['', numbValidator],
      campaignFund: ['', numbValidator],
      status: ['1'],
      town: ['London'],
      radius: [500],
    });
  }

  ngOnInit() {
    this.data.balance.subscribe(balance => {
      if (this.initialBalance === null && balance !== '0.00') {
        this.initialBalance = parseFloat(balance);
      }
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

        this.data.setUserBalance(balance - campaignFund);
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

  addCampaign() {
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

      this.data.addCampaign(sanitizedFormData, this.initialBalance).subscribe(success => {
        if (success) {
          this.data.updateCampaigns();
          this.notification.push('Successfully added a new campaign');
          this.router.navigate(['']);
        }
      });
    }
  }

  onCancelButtonClick() {
    this.router.navigate(['']);
  }

}
