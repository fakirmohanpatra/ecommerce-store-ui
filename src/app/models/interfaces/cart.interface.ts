export interface CartItemResponse {
  itemId: string;        // UUID
  itemName: string;
  quantity: number;      // Integer >= 1
  itemPrice?: number;    // Price at time of adding to cart
  subtotal?: number;     // quantity × itemPrice
}

export interface CartResponse {
  userId: string;
  items: CartItemResponse[];
  totalItems: number;    // Sum of all quantities
  totalAmount: number;   // Sum of all subtotals
}

export interface AddToCartRequest {
  itemId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}