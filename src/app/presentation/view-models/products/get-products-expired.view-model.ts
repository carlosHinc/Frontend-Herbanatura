import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductsCloseToExpiring } from '@domain/products/products.entity';
import { GetProductsExpiredUseCase } from '@application/use-cases/products/get-products-expired.usecase';

export interface ProductsExpiredState {
  products: ProductsCloseToExpiring[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsExpiredState = {
  products: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetProductsExpiredViewModel {
  private readonly useCase = inject(GetProductsExpiredUseCase);
  private readonly destroyRef = inject(DestroyRef);

  state = signal<ProductsExpiredState>(initialState);

  getProductsExpired(): void {
    this.setLoading();
    this.useCase
      .execute()
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

  private setLoading(): void {
    this.state.update((currentState) => ({
      ...currentState,
      loading: true,
      error: null,
    }));
  }

  private setError(errorMessage: string): void {
    console.error('Error al cargar productos vencidos:', errorMessage);
    this.state.set({
      products: [],
      loading: false,
      error:
        'Error al cargar los productos vencidos. Por favor, intenta de nuevo.',
    });
  }

  private updateProducts(products: ProductsCloseToExpiring[]): void {
    console.log('Productos vencidos cargados:', products);
    this.state.set({
      products,
      loading: false,
      error: null,
    });
  }
}

