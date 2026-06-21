import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Product } from '@domain/products/products.entity';
import {
  ProductExpirationDatesHistory,
  ProductOrdersHistory,
  ProductSalesHistory,
} from '@domain/products/product-history.entity';
import { GetProductHistoryUseCase } from '@application/use-cases/products/get-product-history.usecase';

export interface ProductHistoryState {
  product: Product;
  salesHistory: ProductSalesHistory[];
  ordersHistory: ProductOrdersHistory[];
  expirationDatesHistory: ProductExpirationDatesHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductHistoryState = {
  product: {} as Product,
  salesHistory: [],
  ordersHistory: [],
  expirationDatesHistory: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetProductHistoryViewModel {
  private readonly useCase = inject(GetProductHistoryUseCase);
  private readonly destroyRef = inject(DestroyRef);

  state = signal<ProductHistoryState>(initialState);

  getProductHistory(idProduct: number): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
    this.useCase
      .execute(idProduct)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.state.set({
            product: response.product,
            salesHistory: response.salesHistory,
            ordersHistory: response.ordersHistory,
            expirationDatesHistory: response.expirationDatesHistory,
            loading: false,
            error: null,
          });
        },
        error: () => {
          this.state.set({
            ...initialState,
            loading: false,
            error: 'Error al cargar el historial del producto.',
          });
        },
      });
  }
}
