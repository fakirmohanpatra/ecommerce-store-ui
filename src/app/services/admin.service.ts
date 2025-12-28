import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AdminStatsResponse, CouponResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiService {

  getAdminStats(): Observable<AdminStatsResponse> {
    return this.get<AdminStatsResponse>('/api/admin/stats');
  }

  getAllCoupons(): Observable<{coupons: string[], totalGenerated: number}> {
    return this.get<{coupons: string[], totalGenerated: number}>('/api/admin/coupons');
  }

  getActiveCoupon(): Observable<CouponResponse> {
    return this.get<CouponResponse>('/api/admin/coupons/active');
  }

  generateCoupon(): Observable<CouponResponse> {
    return this.post<CouponResponse>('/api/admin/coupons/generate', {});
  }
}