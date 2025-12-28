export interface CouponResponse {
  code: string;                   // Format: "SAVE10-{orderNumber}"
  used: boolean;
  generatedAtOrderNumber: number; // Order that triggered generation
  createdAt: string;              // ISO 8601 timestamp
}

export interface AdminStatsResponse {
  totalItemsPurchased: number;    // Total item quantity sold
  totalPurchaseAmount: number;    // Total revenue (after discounts)
  totalDiscountAmount: number;    // Total discounts given
  totalOrders: number;            // Number of orders
  ordersWithCoupons: number;      // Orders that used coupons
  totalCouponsGenerated: number;  // Coupons generated
  activeCoupon: string | null;    // Current unused coupon
}