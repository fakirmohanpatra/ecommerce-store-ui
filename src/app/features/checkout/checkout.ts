import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartResponse, CheckoutRequest } from '../../models';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDialogModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  cart: CartResponse | null = null;
  couponCode = '';
  userId = 'user1'; // Placeholder user ID
  errorMessage = '';

  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly dialog: MatDialog
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
        this.errorMessage = 'Failed to load cart. Please try again.';
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
        alert(`Order placed successfully! Total: $${order.totalAmount?.toFixed(2) || '0.00'}`);
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        if (error.error?.message?.includes('coupon code')) {
          // Show confirmation dialog for invalid coupon
          const proceed = confirm('Invalid Coupon Code\n\nThe coupon code you entered is invalid or already used. Would you like to proceed with the order without the coupon?');

          if (proceed) {
            this.proceedWithoutCoupon();
          }
        } else {
          // Show generic error message
          this.errorMessage = error.error?.message || 'An error occurred during checkout. Please try again.';
        }
      }
    });
  }

  proceedWithoutCoupon(): void {
    this.couponCode = ''; // Clear the invalid coupon code
    this.errorMessage = '';
    const request: CheckoutRequest = {
      userId: this.userId,
      couponCode: ''
    };

    this.orderService.checkout(request).subscribe({
      next: (order) => {
        alert(`Order placed successfully! Total: $${order.totalAmount?.toFixed(2) || '0.00'}`);
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during checkout. Please try again.';
      }
    });
  }
}
