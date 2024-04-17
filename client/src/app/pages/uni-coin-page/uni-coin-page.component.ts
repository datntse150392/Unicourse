import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { Coin } from '../../cores/models';
import { CoinService } from '../../cores/services';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-uni-coin-page',
  standalone: true,
  imports: [SharedModule, SharedModule, HeaderComponent],
  templateUrl: './uni-coin-page.component.html',
  styleUrl: './uni-coin-page.component.scss',
})
export class UniCoinPageComponent {
  public coins: Coin[] = [];
  public listCoinsUsed: Coin[] = [];
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
        if (this.coins.length > 0) {
          // Tính tổng số xu sau
          const totalCoinAfter = this.coins.reduce(
            (acc: number, coin: Coin) => acc + coin.coin,
            0
          );

          // Trừ đi số xu đã sử dụng có trạng thái là is_used === true
          const totalCoinUsed = this.coins
            .filter((coin: Coin) => coin.is_used === true)
            .reduce((acc: number, coin: Coin) => acc + coin.coin, 0);

          // Tính tổng số xu hiện tại
          this.totalCoin = totalCoinAfter - totalCoinUsed;
        }
        // Lọc ra những xu đã sử dụng
        this.listCoinsUsed = this.coins.filter(
          (coin: Coin) => coin.is_used === true
        );
        console.log(this.coins);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.subscriptions.push(coinSub$);
  }
}
