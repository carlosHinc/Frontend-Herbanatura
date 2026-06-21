import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '@infrastructure/services/auth/auth-token.service';
import { SystemActionsCode } from '@domain/auth/auth.response';

const ALERT_DURATION_MS = 5000; // 5 segundos

export const permissionsGuard =
  (requiredPermissions: SystemActionsCode[]): CanActivateFn =>
  () => {
    const authTokenService = inject(AuthTokenService);
    const router = inject(Router);

    const permissions = authTokenService.getPermissions();

    if (!permissions || permissions.length === 0) {
      showPermissionAlert(
        'No tienes permisos para acceder a esta sección',
        () => router.navigate(['/auth/login']),
      );
      return false;
    }

    const userPermissionCodes = permissions.map((p) => p.code);
    const hasPermission = requiredPermissions.every((requiredPerm) =>
      userPermissionCodes.includes(requiredPerm),
    );

    if (!hasPermission) {
      showPermissionAlert(
        'No tienes permisos para acceder a esta sección',
        () => router.navigate(['/auth/login']),
      );
      return false;
    }

    return true;
  };

function showPermissionAlert(message: string, onClose: () => void): void {
  // Crear contenedor para la alerta
  const alertContainer = document.createElement('div');
  alertContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 15px 20px;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;

  alertContainer.textContent = `⚠️ ${message}`;

  // Agregar estilos de animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(alertContainer);

  // Remover alerta y redirigir después de 5 segundos
  setTimeout(() => {
    alertContainer.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(alertContainer);
      onClose();
    }, 300);
  }, ALERT_DURATION_MS);
}
