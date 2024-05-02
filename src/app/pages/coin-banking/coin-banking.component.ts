import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';

@Component({
  selector: 'app-coin-banking',
  standalone: true,
  imports: [SharedModule, HeaderComponent],
  templateUrl: './coin-banking.component.html',
  styleUrl: './coin-banking.component.scss',
})
export class CoinBankingComponent {
  constructor() {
    // Scroll to top and smooth
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Setting title for page
    document.title = 'Nạp Point';
  }
}
