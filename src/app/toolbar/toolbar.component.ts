import { Component, OnInit } from '@angular/core';

import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  balance: string;
  name: string;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.balance.subscribe(balance => this.balance = balance);
    this.data.name.subscribe(name => this.name = name);
  }

  resetFunds() {
    this.data.updateUserBalance(50000);
  }

}
