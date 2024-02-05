import { Component } from '@angular/core';
import { SharedModule } from '../../shared';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {

}
