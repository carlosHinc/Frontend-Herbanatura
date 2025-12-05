import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GetProductsExpiringUseCase } from '@application/use-cases/products/get-products-expiring.usecase';
import { GetProductsExpiringGateway } from '@domain/products/get-products-expiring.gateway';
import { HttpGetProductsExpiringService } from '@infrastructure/services/products/http-get-products-expiring.service';
import { GetProductsExpiringViewModel } from '@presentation/view-models/products/get-products-expiring.view-model';

@Component({
  selector: 'app-get-products-expiring',
  imports: [CommonModule, FormsModule],
  providers: [
    GetProductsExpiringViewModel,
    GetProductsExpiringUseCase,
    {
      provide: GetProductsExpiringGateway,
      useClass: HttpGetProductsExpiringService,
    },
  ],
  templateUrl: './get-products-expiring.component.html',
  styleUrl: './get-products-expiring.component.scss',
})
export class GetProductsExpiringComponent implements OnInit {
  protected readonly productsExpiringVM = inject(GetProductsExpiringViewModel);

  protected readonly daysFilter = signal(30);
  protected readonly quickFilters = [7, 15, 30, 60, 90];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const days = this.daysFilter();
    if (days > 0) {
      this.productsExpiringVM.getProductsExpiring(days);
    }
  }

  onDaysChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);

    if (value > 0) {
      this.daysFilter.set(value);
    }
  }

  setQuickFilter(days: number): void {
    this.daysFilter.set(days);
    this.loadProducts();
  }

  retry(): void {
    this.loadProducts();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  getExpirationClass(daysToExpire: number): string {
    if (daysToExpire <= 7) return 'critical';
    if (daysToExpire <= 30) return 'warning';
    return 'normal';
  }

  getTotalProducts(): number {
    return this.productsExpiringVM.state().products.length;
  }

  getTotalStock(): number {
    return this.productsExpiringVM
      .state()
      .products.reduce((sum, product) => sum + product.product.stock, 0);
  }

  getTotalBatches(): number {
    return this.productsExpiringVM
      .state()
      .products.reduce((sum, product) => sum + product.inventory.length, 0);
  }
}
