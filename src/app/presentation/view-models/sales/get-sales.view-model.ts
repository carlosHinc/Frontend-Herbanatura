import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GetSalesUseCase } from '@application/use-cases/sales/get-sales.usecase';
import { Sale } from '@domain/sales/sales.entity';

export interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetSalesViewModel {
  private readonly getSalesUseCase = inject(GetSalesUseCase);

  state = signal<SalesState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getSales() {
    this.setLoading();
    this.getSalesUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateSales(response.sales);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar las ventas:', errorMessage);
    this.state.set({
      sales: [],
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

  private updateSales(sales: Sale[]) {
    console.log('updateSales', sales);
    this.state.set({
      sales,
      loading: false,
      error: null,
    });
  }
}
