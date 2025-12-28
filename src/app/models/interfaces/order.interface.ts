import { CartItemResponse } from "./cart.interface";

export interface OrderResponse {
  orderId: string;           // UUID
  userId: string;
  items: CartItemResponse[]; // Snapshot of cart at checkout
  discountAmount?: number;    // Discount applied (0 if no coupon)
  totalAmount?: number;       // Subtotal - discount
  couponCode: string | null; // Coupon used (null if none)
  paymentStatus: "PAID";     // Always PAID for now
  createdAt: string;         // ISO 8601 timestamp
}

export interface CheckoutRequest {
  userId: string;
  couponCode: string; // Can be empty string
}