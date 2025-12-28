export interface ItemResponse {
  itemId: string;        // UUID
  name: string;
  price: number;         // Decimal, 2 decimal places
  stock: number;         // Available stock quantity
}