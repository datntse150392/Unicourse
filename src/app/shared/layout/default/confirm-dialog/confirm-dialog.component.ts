import { Component } from '@angular/core';
import { DialogBroadcastService } from '../../../../cores/services/dialog-broadcast.service';
import { ConfirmDialog } from '../../../../cores/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [SharedModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  display: boolean = false;
  message!: String;
  header!: String; // header: Thông báo, Lỗi, Cảnh báo, Thành công
  icon!: String; // icon: pi pi-info-circle, pi pi-exclamation-triangle, pi pi-exclamation-circle, pi pi-check-circle
  type!: String; // type: error, warning, info, success
  return!: boolean; // Có muốn dialog trả về giá trị không?
  numberBtn!: number; // Số lượng button: 2 [Có, Không] hoặc 1 [OK]
  public confirmSubscription: Subscription | undefined;

  constructor(
    public dialogBroadcastService: DialogBroadcastService,
    public confirmationService: ConfirmationService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.confirmSubscription = this.dialogBroadcastService.getConfirmationDialog().subscribe((dialog) => {
      this.confirm(dialog);
    });
  }

  confirm(dialog: ConfirmDialog) {
    this.header = dialog.header || 'Thông báo';
    this.message = dialog.message || 'Bạn có chắc chắn muốn tiếp tục không?';
    this.type = dialog.type || 'info';
    this.return = dialog.return || true;
    this.numberBtn = dialog.numberBtn || 2;
    this.display = true;
  }

  handleConfirmBtn(action: boolean) {
    if (this.return) {
      this.dialogBroadcastService.confirmDialog(action);
    }
    this.display = false;
  }

  ngDestroy(): void {
    if (this.confirmSubscription) {
      this.confirmSubscription.unsubscribe();
    }
  }
}
