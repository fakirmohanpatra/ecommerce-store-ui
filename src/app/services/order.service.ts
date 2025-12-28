import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CheckoutRequest, OrderResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiService {

  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.post<OrderResponse>('/api/orders/checkout', request);
  }

  getOrderHistory(userId: string): Observable<OrderResponse[]> {
    return this.get<OrderResponse[]>(`/api/orders/${userId}`);
  }
}