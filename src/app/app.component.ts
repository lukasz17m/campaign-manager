import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { DataService } from './shared/data.service';
import { NotificationService } from './shared/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  balance: string;

  constructor(
    private data: DataService,
    private notification: NotificationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.data.balance.subscribe(balance => this.balance = balance);

    // Notifications
    this.notification.notificationSubject.subscribe(message => {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    });
  }
}
