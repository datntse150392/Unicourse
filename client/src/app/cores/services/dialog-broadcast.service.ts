import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Dialog } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DialogBroadcastService {
  private dialogSubject = new Subject<Dialog>();

  constructor() {}

  // Method to broadcast the dialog
  broadcastDialog(dialog: Dialog) {
    this.dialogSubject.next(dialog);
  }

  // Method for components to subscribe to dialogs
  getDialog(): Observable<Dialog> {
    return this.dialogSubject.asObservable();
  }
}
