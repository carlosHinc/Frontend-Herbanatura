import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { GetOrderDetailsUseCase } from '@application/use-cases/orders/get-order-details.usecase';
import { GetOrderDetailsGateway } from '@domain/orders/get-order-details.gateway';
import { HttpGetOrderDetailsService } from '@infrastructure/services/orders/http-get-order-details.service';
import { GetOrderDetailsViewModel } from '@presentation/view-models/orders/get-order-details.view-model';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule],
  providers: [
    GetOrderDetailsViewModel,
    GetOrderDetailsUseCase,
    {
      provide: GetOrderDetailsGateway,
      useClass: HttpGetOrderDetailsService,
    },
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly orderDetailsVM = inject(GetOrderDetailsViewModel);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderDetailsVM.getOrderDetails(parseInt(orderId));
    } else {
      this.router.navigate(['/order-list']);
    }
  }

  retry(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderDetailsVM.getOrderDetails(parseInt(orderId));
    }
  }

  goBack(): void {
    this.router.navigate(['/order-list']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  getTotalProducts(): number {
    const details =
      this.orderDetailsVM.state().orderDetails?.orderDetails?.details;
    return details?.length || 0;
  }

  getTotalUnits(): number {
    const details =
      this.orderDetailsVM.state().orderDetails?.orderDetails?.details;
    return details?.reduce((sum, detail) => sum + detail.amount, 0) || 0;
  }
}
