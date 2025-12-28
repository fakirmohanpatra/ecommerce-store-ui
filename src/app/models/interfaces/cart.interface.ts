export interface CartItemResponse {
  itemId: string;        // UUID
  name: string;
  quantity: number;      // Integer >= 1
  pricePerUnit: number;  // Price at time of adding to cart
  subtotal: number;      // quantity × pricePerUnit
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