import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { PayOSService } from '../../cores/services/payOS.service';

@Component({
  selector: 'app-coin-banking',
  standalone: true,
  imports: [SharedModule, HeaderComponent],
  templateUrl: './coin-banking.component.html',
  styleUrl: './coin-banking.component.scss',
})
export class CoinBankingComponent {
  public pointDeposit: number = 0;

  public isBlockUI: boolean = false;

  constructor(private readonly payOSService: PayOSService) {
    // Scroll to top and smooth
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Setting title for page
    document.title = 'Nạp Point';
  }

  // Thực hiện gọi API để tạo link payment nạp point
  handleCreatePaymentLink(): void {
    this.isBlockUI = true;
    // Tạo orderCode ngẫu nhiên không trùng lặp theo thời gian
    const orderCode = new Date().getTime();
    const data = {
      orderCode: orderCode,
      amount: parseInt(this.pointDeposit.toString()),
      description: 'nap point',
      items: [
        {
          name: 'Nạp point',
          quantity: 1,
          price: parseInt(this.pointDeposit.toString()),
          currency: 'VND',
        },
      ],
    };

    this.payOSService.createPaymentLink(data).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // Lưu vào localStorage trạng thái nạp point
          localStorage.setItem('isDepositPoint', 'true');
          // Chuyển thẳng sang trang thanh toán
          window.location.href = res.data.checkoutUrl;
          this.isBlockUI = false;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.isBlockUI = false;
      },
    });
  }
}
