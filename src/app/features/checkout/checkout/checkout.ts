import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { CartResponse, CheckoutRequest } from '../../../models';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  cart: CartResponse | null = null;
  couponCode = '';
  userId = 'user1'; // Placeholder user ID

  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getUserCart(this.userId).subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  checkout(): void {
    if (!this.cart || this.cart.items.length === 0) return;

    const request: CheckoutRequest = {
      userId: this.userId,
      couponCode: this.couponCode || ''
    };

    this.orderService.checkout(request).subscribe({
      next: (order) => {
        alert(`Order placed successfully! Order #${order.orderNumber}`);
        this.router.navigate(['/orders']); // Navigate to order history
      },
      error: (error) => {
        console.error('Error during checkout:', error);
      }
    });
  }
}
