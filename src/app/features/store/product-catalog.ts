import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ItemService } from '../../services/item.service';
import { CartService } from '../../services/cart.service';
import { ItemResponse, AddToCartRequest } from '../../models';

@Component({
  selector: 'app-product-catalog',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-catalog.html',
  styleUrl: './product-catalog.css'
})
export class ProductCatalog implements OnInit {
  items: ItemResponse[] = [];
  userId = 'user1'; // Placeholder user ID

  constructor(
    private readonly itemService: ItemService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Error loading items:', error);
      }
    });
  }

  addToCart(item: ItemResponse): void {
    if (item.stock <= 0) {
      alert('Item is out of stock!');
      return;
    }

    const request: AddToCartRequest = {
      itemId: item.itemId,
      quantity: 1
    };
    this.cartService.addItemToCart(this.userId, request).subscribe({
      next: () => {
        // Decrease stock locally in UI and trigger change detection
        item.stock = Math.max(0, item.stock - 1);
        this.items = [...this.items]; // Trigger change detection
        alert('Item added to cart!');
      },
      error: (error) => {
        // Handle insufficient stock error with item name
        if (error.error?.message?.includes('Insufficient stock')) {
          alert(`Insufficient stock for ${item.name}. Available: ${item.stock}`);
        } else {
          console.error('Error adding to cart:', error);
          alert('Error adding item to cart. Please try again.');
        }
      }
    });
  }
}
