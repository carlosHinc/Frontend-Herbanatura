import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Order } from '@domain/orders/orders.entity';
import { GetOrdersUseCase } from '@application/use-cases/orders/get-orders-usecase';

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetOrdersViewModel {
  private readonly getOrdersUseCase = inject(GetOrdersUseCase);

  state = signal<OrdersState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getOrders() {
    this.setLoading();
    this.getOrdersUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateOrders(response.orders);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar ordenes:', errorMessage);
    this.state.set({
      orders: [],
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

  private updateOrders(orders: Order[]) {
    console.log('updateOrders', orders);
    this.state.set({
      orders,
      loading: false,
      error: null,
    });
  }
}
