import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GetSaleDetailsUseCase } from '@application/use-cases/sales/get-sale-details.usecase';
import { GetSaleDetailsGateway } from '@domain/sales/get-sale-details.gateway';
import { HttpGetSaleDetailsService } from '@infrastructure/services/sales/http-get-sale-details.service';
import { GetSaleDetailsViewModel } from '@presentation/view-models/sales/get-sale-details.view-model';

@Component({
  selector: 'app-sale-details',
  imports: [CommonModule],
  providers: [
    GetSaleDetailsViewModel,
    GetSaleDetailsUseCase,
    {
      provide: GetSaleDetailsGateway,
      useClass: HttpGetSaleDetailsService,
    },
  ],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.scss',
})
export class SaleDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly saleDetailsVM = inject(GetSaleDetailsViewModel);

  ngOnInit(): void {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId) {
      this.saleDetailsVM.getSaleDetails(parseInt(saleId));
    } else {
      this.router.navigate(['/ventas']);
    }
  }

  retry(): void {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId) {
      this.saleDetailsVM.getSaleDetails(parseInt(saleId));
    }
  }

  goBack(): void {
    this.router.navigate(['/ventas']);
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
      this.saleDetailsVM.state().saleDetails?.saleDetails?.details;
    return details?.length || 0;
  }

  getTotalUnits(): number {
    const details =
      this.saleDetailsVM.state().saleDetails?.saleDetails?.details;
    return details?.reduce((sum, detail) => sum + detail.stock, 0) || 0;
  }
}
