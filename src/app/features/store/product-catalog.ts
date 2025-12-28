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
  styleUrl: './product-catalog.css',
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
    const request: AddToCartRequest = {
      itemId: item.itemId,
      quantity: 1
    };
    this.cartService.addItemToCart(this.userId, request).subscribe({
      next: () => {
        alert('Item added to cart!');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }
}
