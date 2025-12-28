import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AdminService } from '../../../services/admin.service';
import { AdminStatsResponse } from '../../../models';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: AdminStatsResponse | null = null;
  coupons: string[] = [];
  activeCoupon: string | null = null;

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCoupons();
    this.loadActiveCoupon();
  }

  loadStats(): void {
    this.adminService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  loadCoupons(): void {
    this.adminService.getAllCoupons().subscribe({
      next: (data) => {
        this.coupons = data.coupons;
      },
      error: (error) => {
        console.error('Error loading coupons:', error);
      }
    });
  }

  loadActiveCoupon(): void {
    this.adminService.getActiveCoupon().subscribe({
      next: (data) => {
        this.activeCoupon = data.code;
      },
      error: (error) => {
        console.error('Error loading active coupon:', error);
      }
    });
  }

  generateCoupon(): void {
    this.adminService.generateCoupon().subscribe({
      next: (coupon) => {
        alert(`New coupon generated: ${coupon.code}`);
        this.loadCoupons();
        this.loadActiveCoupon();
      },
      error: (error) => {
        console.error('Error generating coupon:', error);
      }
    });
  }
}
