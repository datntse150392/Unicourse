import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input () cartItem!: CartItem;
  @Output() isDeleteItem = new EventEmitter<string>();

  ngOnInit(): void {}

  // Hàm xử lý khi delete khóa học khỏi giỏ hàng
  hadnleDeleteCourseFromCart(courseId: string) {
      this.isDeleteItem.emit(courseId);
  }
}
