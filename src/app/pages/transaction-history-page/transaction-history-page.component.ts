import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { TransactionService } from '../../cores/services/transaction.service';
import { Transaction } from '../../cores/models';
import { Subscription } from 'rxjs';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';

@Component({
  selector: 'app-transaction-history-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent],
  templateUrl: './transaction-history-page.component.html',
  styleUrl: './transaction-history-page.component.scss',
})
export class TransactionHistoryPageComponent implements OnInit, OnDestroy {
  public transactionData: Transaction[] = [];
  public visibleFeedback: boolean = false;
  public transationDetail: Transaction | null = null;
  public stars: number[] = [1, 2, 3, 4, 5];
  public rating: number = 5;
  public ratingLabel: string = 'Tuyệt vời';
  public content: string = '';

  private subscriptions: Subscription[] = [];
  constructor(
    private readonly transactionService: TransactionService,
    private readonly dialogBroadcastService: DialogBroadcastService
  ) {}

  ngOnInit(): void {
    this.getMyTransaction();
  }

  ngOnDestroy(): void {
    this.subscriptions.map((item: any) => item.unsubscribe());
  }

  getMyTransaction() {
    const getMyTransactionSub$ = this.transactionService
      .getMyTransaction()
      .subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.transactionData = res.data;
            console.log(this.transactionData);
          }
        },
      });

    this.subscriptions.push(getMyTransactionSub$);
  }

  showDialogFeedBack(transationDetail: Transaction) {
    this.transationDetail = transationDetail;
    this.visibleFeedback = true;
  }

  rateProduct(star: number) {
    this.rating = star;
    this.setRatingLabel();
  }

  setRatingLabel() {
    switch (this.rating) {
      case 1:
        this.ratingLabel = 'Tệ';
        break;
      case 2:
        this.ratingLabel = 'Không hài lòng';
        break;
      case 3:
        this.ratingLabel = 'Bình thường';
        break;
      case 4:
        this.ratingLabel = 'Hài lòng';
        break;
      case 5:
        this.ratingLabel = 'Tuyệt vời';
        break;
      default:
        this.ratingLabel = 'Tuyệt vời';
    }
  }

  submitFeedback(transactionId: string) {
    // Handle form submission logic here
    const sendFeebackSub$ = this.transactionService
      .sendFeedback(transactionId, this.rating, this.content)
      .subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.getMyTransaction();
            this.dialogBroadcastService.broadcastConfirmationDialog({
              header: 'Thông báo',
              message: 'Cảm ơn bạn đã đánh giá khóa học',
              type: 'success',
              return: false,
              numberBtn: 1,
            });
            this.rating = 5;
            this.content = '';
            this.transationDetail = null;
          } else {
            this.dialogBroadcastService.broadcastConfirmationDialog({
              header: 'Thông báo',
              message: 'Đã có lỗi xảy ra, vui lòng thử lại',
              type: 'error',
              return: false,
              numberBtn: 1,
            });
          }
        },
      });
    this.visibleFeedback = false;
    this.subscriptions.push(sendFeebackSub$);
  }

  openLink(link: string): void {
    window.open(`${link}`, '_blank');
  }
}
