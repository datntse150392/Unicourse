import { ErrorHandler, Injectable } from '@angular/core';
import { DialogBroadcastService } from './dialog-broadcast.service';

@Injectable()
export class GlobalDialogHandlerService implements ErrorHandler {
  
  constructor(private dialogBroadcastService: DialogBroadcastService) {}

  // Impletement function của Angular core để hiển thị dialog
  handleError(error: any): void {
    // Hiển thị dialog
    console.log('An dialog occurred:', error);

    // Phát ra tín hiệu (Broadcast) value dialog cho các component đang subscribe
    this.dialogBroadcastService.broadcastDialog(error);
  }
}
