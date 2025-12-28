import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AddToCartRequest, CartResponse, UpdateCartItemRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService extends ApiService {

  addItemToCart(userId: string, request: AddToCartRequest): Observable<CartResponse> {
    return this.post<CartResponse>(`/api/cart/${userId}/items`, request);
  }

  removeItemFromCart(userId: string, itemId: string): Observable<CartResponse> {
    return this.delete<CartResponse>(`/api/cart/${userId}/items/${itemId}`);
  }

  updateCartItemQuantity(userId: string, itemId: string, request: UpdateCartItemRequest): Observable<CartResponse> {
    return this.put<CartResponse>(`/api/cart/${userId}/items/${itemId}`, request);
  }

  getUserCart(userId: string): Observable<CartResponse> {
    return this.get<CartResponse>(`/api/cart/${userId}`);
  }

  clearCart(userId: string): Observable<void> {
    return this.delete<void>(`/api/cart/${userId}`);
  }
}