import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ExpireInventoryBatchesUseCase } from '@application/use-cases/products/expire-inventory-batches.usecase';

export interface ExpireInventoryBatchesState {
  expiring: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ExpireInventoryBatchesState = {
  expiring: false,
  error: null,
  success: false,
};

@Injectable()
export class ExpireInventoryBatchesViewModel {
  private readonly useCase = inject(ExpireInventoryBatchesUseCase);
  private readonly destroyRef = inject(DestroyRef);

  state = signal<ExpireInventoryBatchesState>(initialState);

  expireBatches(batchIds: number[]): void {
    this.state.set({ expiring: true, error: null, success: false });
    this.useCase
      .execute(batchIds)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.set({ expiring: false, error: null, success: true });
        },
        error: () => {
          this.state.set({
            expiring: false,
            error:
              'Error al descontar los lotes del inventario. Por favor, intenta de nuevo.',
            success: false,
          });
        },
      });
  }
}
