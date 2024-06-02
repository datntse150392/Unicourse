import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { TransactionService } from '../../cores/services/transaction.service';
import { Transaction } from '../../cores/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-history-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent],
  templateUrl: './transaction-history-page.component.html',
  styleUrl: './transaction-history-page.component.scss',
})
export class TransactionHistoryPageComponent implements OnInit, OnDestroy {
  public transactionData: Transaction[] = [];

  private subscriptions: Subscription[] = [];
  constructor(private readonly transactionService: TransactionService) {}

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
}
