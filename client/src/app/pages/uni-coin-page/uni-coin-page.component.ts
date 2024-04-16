import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';

@Component({
  selector: 'app-uni-coin-page',
  standalone: true,
  imports: [SharedModule, SharedModule, HeaderComponent],
  templateUrl: './uni-coin-page.component.html',
  styleUrl: './uni-coin-page.component.scss',
})
export class UniCoinPageComponent {}
