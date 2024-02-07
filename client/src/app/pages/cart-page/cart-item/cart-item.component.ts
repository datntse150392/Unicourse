import { Component, Input, OnInit } from '@angular/core';
import { CartItem } from '../../../cores/models/cart.model';
import { SharedModule } from '../../../shared';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input () cartItem: CartItem | undefined;

  ngOnInit(): void {
    console.log("AAA: ", typeof this.cartItem?.amount);
  }
}
