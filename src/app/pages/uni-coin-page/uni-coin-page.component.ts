import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { Coin } from '../../cores/models';
import { CoinService } from '../../cores/services';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-uni-coin-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent],
  templateUrl: './uni-coin-page.component.html',
  styleUrl: './uni-coin-page.component.scss',
})
export class UniCoinPageComponent {
  public coins: Coin[] = [];
  public listCoinsUsed: Coin[] = [];
  public listCounsActived: Coin[] = [];
  public totalCoin: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(private readonly coinService: CoinService) {
    // Scroll to top and smooth
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Setting title for page
    document.title = 'Nhận xu hấp dẫn';
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {}

  initForm() {
    const coinSub$ = this.coinService.getCoinByUserId().subscribe({
      next: (res: any) => {
        this.coins = res.data;
        // Sắp xếp xu theo thời gian tạo mới nhất
        this.coins.sort((a: Coin, b: Coin) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        if (this.coins.length > 0) {
          // Tính tổng số xu sau
          this.totalCoin = this.coins.reduce((acc: number, coin: Coin) => {
            return acc + coin.coin;
          }, 0);
        }
        // Lọc ra những xu đã sử dụng
        this.listCoinsUsed = this.coins.filter(
          (coin: Coin) => coin.status == 'used'
        );
        // Lọc ra những xu chưa sử dụng
        this.listCounsActived = this.coins.filter(
          (coin: Coin) => coin.status == 'active'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.push(coinSub$);
  }
}
