import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetProductsUseCase } from '@application/use-cases/products/get-products.usecase';
import { Product } from '@domain/products/products.entity';

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
export class GetProductsViewModel {
  private readonly getProductsUseCase = inject(GetProductsUseCase);
  private readonly destroyRef = inject(DestroyRef);

  state = signal<ProductsState>(initialState);

  getProducts(): void {
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

  private setError(errorMessage: string): void {
    console.error('Error al cargar productos:', errorMessage);
    this.state.set({
      products: [],
      loading: false,
      error: 'Error al cargar los productos. Por favor, intenta de nuevo.',
    });
  }

  private setLoading(): void {
    this.state.update((currentState) => ({
      ...currentState,
      loading: true,
      error: null,
    }));
  }

  private updateProducts(products: Product[]): void {
    this.state.set({
      products: products,
      loading: false,
      error: null,
    });
  }
}
