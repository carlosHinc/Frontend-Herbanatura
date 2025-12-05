import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  Product,
  ProductsCloseToExpiring,
} from '../../../domain/products/products.entity';
import { GetProductsExpiringUseCase } from '@application/use-cases/products/get-products-expiring.usecase';

export interface ProductsState {
  products: ProductsCloseToExpiring[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetProductsExpiringViewModel {
  private readonly useCase = inject(GetProductsExpiringUseCase);

  state = signal<ProductsState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getProductsExpiring(daysToExpiration: number) {
    this.setLoading();
    this.useCase
      .execute(daysToExpiration)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateProducts(response.products);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar productos:', errorMessage);
    this.state.set({
      products: [],
      loading: false,
      error: 'Error al cargar los productos. Por favor, intenta de nuevo.',
    });
  }

  private setLoading() {
    this.state.update((currentStatus) => ({
      ...currentStatus,
      loading: true,
      error: null,
    }));
  }

  private updateProducts(products: ProductsCloseToExpiring[]) {
    this.state.set({
      products: products,
      loading: false,
      error: null,
    });
  }
}
