import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { GetOrdersUseCase } from '@application/use-cases/orders/get-orders-usecase';
import { GetOrdersGateway } from '@domain/orders/get-orders.gateway';
import { HttpGetOrdersService } from '@infrastructure/services/orders/http-get-orders.service';

import { GetOrdersViewModel } from '@presentation/view-models/orders/get-orders.view-model';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, RouterLink],
  providers: [
    GetOrdersViewModel,
    GetOrdersUseCase,
    {
      provide: GetOrdersGateway,
      useClass: HttpGetOrdersService,
    },
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  protected readonly ordersVM = inject(GetOrdersViewModel);

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.ordersVM.getOrders();
    console.log('this.ordersVM.state().orders', this.ordersVM.state().orders);
  }

  retry(): void {
    this.ordersVM.getOrders();
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
    }).format(date);
  }

  goToDetail(orderId: number) {
    this.router.navigate([`/pedidos-realizados/${orderId}`]);
  }
}
