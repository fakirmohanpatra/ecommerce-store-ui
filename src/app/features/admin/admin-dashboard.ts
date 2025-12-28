import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { AdminStatsResponse } from '../../models';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit, OnDestroy {
  stats: AdminStatsResponse | null = null;
  coupons: string[] = [];
  activeCoupon: string | null = null;
  activeCouponUsed: boolean = false;
  isGeneratingCoupon = false;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadCoupons();
    this.loadActiveCouponDetails();

    // Refresh data when navigating to this route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('/admin')) {
          this.loadActiveCouponDetails();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats(): void {
    this.adminService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.errorMessage = null; // Clear any previous errors
      },
      error: (error) => {
        this.errorMessage = this.errorHandler.handleError(
          error,
          this.errorHandler.createContext('Load Admin Stats', 'AdminDashboard')
        );
        this.stats = null;
      }
    });
  }

  loadActiveCouponDetails(): void {
    this.adminService.getActiveCoupon().subscribe({
      next: (coupon) => {
        // Only show as active if the coupon is not used
        if (coupon.used) {
          // If backend returns a used coupon, treat it as no active coupon
          this.activeCoupon = null;
          this.activeCouponUsed = false;
        } else {
          this.activeCoupon = coupon.code;
          this.activeCouponUsed = false;
        }
      },
      error: (error) => {
        // If no active coupon or error, show none
        this.activeCoupon = null;
        this.activeCouponUsed = false;
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
        this.loadStats();
        this.loadCoupons();
        this.loadActiveCouponDetails(); // Reload active coupon details
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
