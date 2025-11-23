import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GetOrderDetailsUseCase } from '@application/use-cases/orders/get-order-details.usecase';
import { GetOrderDetailsResponse } from '@domain/orders/orders.response';

export interface OrderDetailsState {
  orderDetails: GetOrderDetailsResponse;
  loading: boolean;
  error: string | null;
}

const initialState: OrderDetailsState = {
  orderDetails: {} as GetOrderDetailsResponse,
  loading: true,
  error: null,
};

@Injectable()
export class GetOrderDetailsViewModel {
  private readonly getOrderDetailsUseCase = inject(GetOrderDetailsUseCase);

  state = signal<OrderDetailsState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getOrderDetails(idOrder: number) {
    this.setLoading();
    this.getOrderDetailsUseCase
      .execute(idOrder)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateOrders(response);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar ordenes:', errorMessage);
    this.state.set({
      orderDetails: {} as GetOrderDetailsResponse,
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

  private updateOrders(orderDetails: GetOrderDetailsResponse) {
    console.log('updateOrders', orderDetails);
    this.state.set({
      orderDetails,
      loading: false,
      error: null,
    });
  }
}
