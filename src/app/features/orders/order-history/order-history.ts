import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderService } from '../../../services/order.service';
import { OrderResponse } from '../../../models';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatExpansionModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  orders: OrderResponse[] = [];
  userId = 'user1'; // Placeholder user ID

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.orderService.getOrderHistory(this.userId).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => {
        console.error('Error loading order history:', error);
      }
    });
  }
}
