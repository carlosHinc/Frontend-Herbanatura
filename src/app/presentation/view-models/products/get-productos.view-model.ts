import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { Product } from '../../../domain/products/products.entity';
import { GetProductsUseCase } from '../../../application/use-cases/products/get-products.usecase';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { GetProductsResponse } from '../../../domain/products/products.response';

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

  private readonly retrySubject = new Subject<void>();

  readonly productsSignal: Signal<ProductsState> = toSignal(
    this.retrySubject.pipe(
      startWith(undefined),
      switchMap(() => this.fetchProducts()),
      takeUntilDestroyed(this.destroyRef)
    ),
    { initialValue: initialState }
  );

  retry(): void {
    this.retrySubject.next();
  }

  private fetchProducts(): Observable<ProductsState> {
    return this.getProductsUseCase.execute().pipe(
      map((response) => this.toSuccessState(response)),
      catchError((error) => this.toErrorState(error)),
      startWith(initialState)
    );
  }

  private toSuccessState(response: GetProductsResponse): ProductsState {
    return {
      products: response.products,
      loading: false,
      error: null,
    };
  }

  private toErrorState(error: unknown): Observable<ProductsState> {
    console.error('Error fetching products:', error);
    return of({
      products: [],
      loading: false,
      error: 'Error al cargar los productos. Por favor, reintente.',
    });
  }
}
