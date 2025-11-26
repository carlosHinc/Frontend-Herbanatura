import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GetSalesUseCase } from '@application/use-cases/sales/get-sales.usecase';
import { GetSalesGateway } from '@domain/sales/get-sales.gateway';
import { HttpGetSalesService } from '@infrastructure/services/sales/http-get-sales.service';
import { GetSalesViewModel } from '@presentation/view-models/sales/get-sales.view-model';

@Component({
  selector: 'app-sales-list',
  imports: [CommonModule, RouterLink],
  providers: [
    GetSalesViewModel,
    GetSalesUseCase,
    {
      provide: GetSalesGateway,
      useClass: HttpGetSalesService,
    },
  ],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.scss',
})
export class SalesListComponent implements OnInit {
  protected readonly salesVM = inject(GetSalesViewModel);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.salesVM.getSales();
  }

  retry(): void {
    this.salesVM.getSales();
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

  goToDetail(saleId: number): void {
    this.router.navigate([`/ventas/${saleId}`]);
  }
}
