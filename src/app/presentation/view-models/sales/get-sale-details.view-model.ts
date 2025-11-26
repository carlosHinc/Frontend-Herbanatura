import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GetSaleDetailsUseCase } from '@application/use-cases/sales/get-sale-details.usecase';
import { GetSaleDetailsResponse } from '@domain/sales/sales.response';

export interface SaleDetailsState {
  saleDetails: GetSaleDetailsResponse;
  loading: boolean;
  error: string | null;
}

const initialState: SaleDetailsState = {
  saleDetails: {} as GetSaleDetailsResponse,
  loading: true,
  error: null,
};

@Injectable()
export class GetSaleDetailsViewModel {
  private readonly getSaleDetailsUseCase = inject(GetSaleDetailsUseCase);

  state = signal<SaleDetailsState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getSaleDetails(idOrder: number) {
    this.setLoading();
    this.getSaleDetailsUseCase
      .execute(idOrder)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateSales(response);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar ventas:', errorMessage);
    this.state.set({
      saleDetails: {} as GetSaleDetailsResponse,
      loading: false,
      error: 'Error al cargar las ordenes. Por favor, intenta de nuevo.',
    });
  }

  private setLoading() {
    this.state.update((currentStatus) => ({
      ...currentStatus,
      loading: true,
      error: null,
    }));
  }

  private updateSales(saleDetails: GetSaleDetailsResponse) {
    console.log('updateSales', saleDetails);
    this.state.set({
      saleDetails,
      loading: false,
      error: null,
    });
  }
}
