import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetSuppliersUseCase } from '@application/use-cases/suppliers/get-suppliers.usecase';
import { Supplier } from '@domain/suppliers/suppliers.entity';

export interface GetSuppliersState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
}

const initialState: GetSuppliersState = {
  suppliers: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetSuppliersViewModel {
  private readonly useCase = inject(GetSuppliersUseCase);

  state = signal<GetSuppliersState>(initialState);
  private readonly destroyRef = inject(DestroyRef);

  getSuppliers() {
    this.setLoading();
    this.useCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateSuppliers(response.suppliers);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar proveedores:', errorMessage);
    this.state.set({
      suppliers: [],
      loading: false,
      error: 'Error al cargar los proveedores. Por favor, intenta de nuevo.',
    });
  }

  private setLoading() {
    this.state.update((s) => ({ ...s, loading: true, error: null }));
  }

  private updateSuppliers(suppliers: Supplier[]) {
    this.state.set({ suppliers, loading: false, error: null });
  }
}
