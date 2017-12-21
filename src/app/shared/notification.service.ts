import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotificationService {
  notificationSubject: Subject<string> = new Subject();

  constructor(private snackBar: MatSnackBar) { }

  push(message: string) {
    this.notificationSubject.next(message);
  }

}
