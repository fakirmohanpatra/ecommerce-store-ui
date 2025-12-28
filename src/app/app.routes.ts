import { Routes } from '@angular/router';
import { ProductCatalog } from './features/store/product-catalog';
import { Cart } from './features/cart/cart';
import { Checkout } from './features/checkout/checkout';
import { OrderHistory } from './features/orders/order-history';
import { AdminDashboard } from './features/admin/admin-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/store', pathMatch: 'full' },
  { path: 'store', component: ProductCatalog },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'orders', component: OrderHistory },
  { path: 'admin', component: AdminDashboard },
  { path: '**', redirectTo: '/store' }
];