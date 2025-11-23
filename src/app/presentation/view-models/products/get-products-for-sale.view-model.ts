import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Product } from '../../../domain/products/products.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GetProductsForSaleUseCase } from '@application/use-cases/products/get-products-for-sale.usecase';

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetProductsForSaleViewModel {
  private readonly getProductsUseCase = inject(GetProductsForSaleUseCase);

  state = signal<ProductsState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getProducts() {
    this.setLoading();
    this.getProductsUseCase
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

  private updateProducts(products: Product[]) {
    this.state.set({
      products: products,
      loading: false,
      error: null,
    });
  }
}
