export interface OrderItemResponse {
  itemId: string;        // UUID
  itemName: string;
  itemPrice: number;     // Price at time of order
  quantity: number;      // Integer >= 1
  subtotal: number;      // quantity × itemPrice
  stock?: number;        // Stock at time of order
}

export interface OrderResponse {
  orderId: string;           // UUID
  userId: string;
  orderNumber?: number;      // New API format - Sequential counter (1, 2, 3...)
  items: OrderItemResponse[]; // Snapshot of cart at checkout
  subtotal?: number;         // New API format - Total before discount
  totalAmount: number;       // Subtotal - discount
  discountAmount?: number;   // Discount applied (0 if no coupon)
  couponCode: string | null; // Coupon used (null if none)
  paymentStatus: "PAID";     // Always PAID for now
  createdAt: string;         // ISO 8601 timestamp
}

export interface CheckoutRequest {
  userId: string;
  couponCode: string; // Can be empty string
}