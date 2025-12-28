import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { CartResponse, CartItemResponse, UpdateCartItemRequest } from '../../../models';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cart: CartResponse | null = null;
  userId = 'user1'; // Placeholder user ID
  displayedColumns: string[] = ['name', 'quantity', 'pricePerUnit', 'subtotal', 'actions'];

  constructor(private readonly cartService: CartService) {}

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

  updateQuantity(item: CartItemResponse, newQuantity: number): void {
    if (newQuantity < 1) return;
    const request: UpdateCartItemRequest = { quantity: newQuantity };
    this.cartService.updateCartItemQuantity(this.userId, item.itemId, request).subscribe({
      next: () => {
        this.loadCart(); // Reload cart after update
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(item: CartItemResponse): void {
    this.cartService.removeItemFromCart(this.userId, item.itemId).subscribe({
      next: () => {
        this.loadCart(); // Reload cart after removal
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.loadCart(); // Reload cart after clearing
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      }
    });
  }
}
