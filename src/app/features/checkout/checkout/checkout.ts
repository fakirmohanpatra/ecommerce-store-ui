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
  errorMessage = '';
  showProceedWithoutCoupon = false;

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

    const trimmedCoupon = this.couponCode.trim();
    const request: CheckoutRequest = {
      userId: this.userId,
      couponCode: trimmedCoupon || ''
    };

    this.orderService.checkout(request).subscribe({
      next: (order) => {
        alert(`Order placed successfully! Order #${order.orderNumber}`);
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error during checkout:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
          if (error.error.errorCode === 'INVALID_ARGUMENT' && error.error.message.includes('coupon code')) {
            this.showProceedWithoutCoupon = true;
          }
        } else {
          this.errorMessage = 'An error occurred during checkout. Please try again.';
        }
      }
    });
  }

  proceedWithoutCoupon(): void {
    this.errorMessage = '';
    this.showProceedWithoutCoupon = false;
    const request: CheckoutRequest = {
      userId: this.userId,
      couponCode: ''
    };

    this.orderService.checkout(request).subscribe({
      next: (order) => {
        alert(`Order placed successfully! Order #${order.orderNumber}`);
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error during checkout without coupon:', error);
        this.errorMessage = 'An error occurred during checkout. Please try again.';
      }
    });
  }
}
