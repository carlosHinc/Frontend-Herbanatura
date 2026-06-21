import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoginUseCase } from '@application/use-cases/auth/login.usecase';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';

interface LoginState {
  loading: boolean;
  error: string | null;
}

@Injectable()
export class LoginViewModel {
  private readonly useCase = inject(LoginUseCase);
  private readonly authTokenService = inject(AuthTokenService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = signal<LoginState>({ loading: false, error: null });

  login(username: string, password: string): void {
    this.state.set({ loading: true, error: null });

    this.useCase
      .execute(username, password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('response login', response);
          this.authTokenService.saveSession(
            response.token,
            response.user,
            response.permissions,
          );
          this.state.set({ loading: false, error: null });
          this.router.navigate(['/inventario/productos']);
        },
        error: () => {
          this.state.set({
            loading: false,
            error: 'Credenciales inválidas',
          });
        },
      });
  }
}
