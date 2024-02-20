import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { DialogBroadcastService } from '../../../../cores/services/dialog-broadcast.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [SharedModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  display: boolean = false;
  message: string = '';
  header: string = '';
  public errorSubscription: Subscription | undefined;

  constructor(
    public dialogBroadcastService: DialogBroadcastService,
    public confirmationService: ConfirmationService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.errorSubscription = this.dialogBroadcastService.getDialog().subscribe((dialog) => {
      this.message = dialog.message;
      this.header = dialog.header;
      this.display = true;
      this.confirm1(this.message, this.header);
    });
  }

  ngDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  confirm1(message: string, header: string) {
    this.confirmationService.confirm({
      message: message || 'Bạn có chắc chắn muốn tiếp tục không?',
      header: header || 'Thông báo',
      icon: 'pi pi-info-circle',
      acceptIcon:"none",
      acceptLabel: 'Đã hiểu',
      rejectVisible: false,
      rejectButtonStyleClass:"p-button-text",
      // Xử lý nếu người dùng chọn OK hoặc Cancel
      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Thông báo', detail: 'Bạn được chấp nhận' });
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Từ chối', detail: 'Bạn bị từ chối', life: 3000 });
      }
  });
  }
}
