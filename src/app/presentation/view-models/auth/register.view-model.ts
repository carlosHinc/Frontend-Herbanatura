import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RegisterUseCase } from '@application/use-cases/auth/register.usecase';
import { RegisterPayload } from '@domain/auth/register.gateway';

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

@Injectable()
export class RegisterViewModel {
  private readonly useCase = inject(RegisterUseCase);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = signal<RegisterState>({
    loading: false,
    error: null,
    success: false,
  });

  register(payload: RegisterPayload): void {
    this.state.set({ loading: true, error: null, success: false });

    this.useCase
      .execute(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.set({ loading: false, error: null, success: true });
        },
        error: () => {
          this.state.set({
            loading: false,
            error: 'Error al registrar el usuario',
            success: false,
          });
        },
      });
  }
}
