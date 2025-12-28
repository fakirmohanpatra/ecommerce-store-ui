import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AdminService } from '../../services/admin.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AdminStatsResponse } from '../../models';

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
  isGeneratingCoupon = false;
  errorMessage: string | null = null;

  constructor(
    private readonly adminService: AdminService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCoupons();
  }

  loadStats(): void {
    this.adminService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.activeCoupon = data.activeCoupon;
        this.errorMessage = null; // Clear any previous errors
      },
      error: (error) => {
        this.errorMessage = this.errorHandler.handleError(
          error,
          this.errorHandler.createContext('Load Admin Stats', 'AdminDashboard')
        );
        this.stats = null;
        this.activeCoupon = null;
      }
    });
  }

  loadCoupons(): void {
    this.adminService.getAllCoupons().subscribe({
      next: (data) => {
        this.coupons = data.coupons;
        this.errorMessage = null; // Clear any previous errors
      },
      error: (error) => {
        this.errorMessage = this.errorHandler.handleError(
          error,
          this.errorHandler.createContext('Load Coupons', 'AdminDashboard')
        );
        this.coupons = [];
      }
    });
  }

  generateCoupon(): void {
    // Confirm if replacing existing active coupon
    if (this.activeCoupon) {
      const confirmed = confirm(
        `Warning: This will replace the existing active coupon "${this.activeCoupon}".\n\nAre you sure you want to continue?`
      );
      if (!confirmed) {
        return;
      }
    }

    this.isGeneratingCoupon = true;
    this.errorMessage = null;

    this.adminService.generateCoupon().subscribe({
      next: (coupon) => {
        this.isGeneratingCoupon = false;
        alert(`New coupon generated: ${coupon.code}`);
        this.loadCoupons();
        this.loadStats(); // Reload stats to get updated active coupon
      },
      error: (error) => {
        this.isGeneratingCoupon = false;
        this.errorMessage = this.errorHandler.handleError(
          error,
          this.errorHandler.createContext('Generate Coupon', 'AdminDashboard')
        );
      }
    });
  }

  clearError(): void {
    this.errorMessage = null;
  }
}
