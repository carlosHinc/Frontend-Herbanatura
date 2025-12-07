import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Product } from '../../../domain/products/products.entity';
import { GetProductUseCase } from '@application/use-cases/products/get-product.usecase';

export interface ProductState {
  product: Product;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: {} as Product,
  loading: true,
  error: null,
};

@Injectable()
export class GetProductViewModel {
  private readonly useCase = inject(GetProductUseCase);

  state = signal<ProductState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getProduct(idProduct: number) {
    this.setLoading();
    this.useCase
      .execute(idProduct)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateProduct(response.product);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar productos:', errorMessage);
    this.state.set({
      product: {} as Product,
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

  private updateProduct(product: Product) {
    this.state.set({
      product: product,
      loading: false,
      error: null,
    });
  }
}
