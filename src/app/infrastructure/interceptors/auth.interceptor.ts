import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authTokenService = inject(AuthTokenService);
  const router = inject(Router);
  const token = authTokenService.getToken();

  let request = req;
  if (token && !req.url.includes('/auth/login')) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authTokenService.clearSession();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
