import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';

export const authGuard: CanActivateFn = () => {
  const authTokenService = inject(AuthTokenService);
  const router = inject(Router);

  if (authTokenService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
