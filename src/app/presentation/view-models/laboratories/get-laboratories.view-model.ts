import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetLaboratoriesUseCase } from '@application/use-cases/laboratories/get-laboratories.usecase';

import { Laboratory } from '@domain/laboratories/laboratories.entity';

export interface GetLaboratoriesState {
  laboratories: Laboratory[];
  loading: boolean;
  error: string | null;
}

const initialState: GetLaboratoriesState = {
  laboratories: [],
  loading: true,
  error: null,
};

@Injectable()
export class GetLaboratoriesViewModel {
  private readonly getLaboratoriesUseCase = inject(GetLaboratoriesUseCase);

  state = signal<GetLaboratoriesState>(initialState);

  private readonly destroyRef = inject(DestroyRef);

  getLaboratories() {
    this.setLoading();
    this.getLaboratoriesUseCase
      .execute()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateLaboratories(response.laboratories);
        },
        error: (error) => {
          this.setError(error);
        },
      });
  }

  private setError(errorMessage: string) {
    console.error('Error al cargar laboratorios:', errorMessage);
    this.state.set({
      laboratories: [],
      loading: false,
      error: 'Error al cargar los laboratorios. Por favor, intenta de nuevo.',
    });
  }

  private setLoading() {
    this.state.update((currentStatus) => ({
      ...currentStatus,
      loading: true,
      error: null,
    }));
  }

  private updateLaboratories(laboratories: Laboratory[]) {
    this.state.set({
      laboratories: laboratories,
      loading: false,
      error: null,
    });
  }
}
