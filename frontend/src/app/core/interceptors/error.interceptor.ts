import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      const status = error.status;
      let friendlyMessage = 'Ocurrió un error inesperado.';

      if (status === 401) {
        const hadToken = !!localStorage.getItem('ie_token');
        localStorage.removeItem('ie_token');
        localStorage.removeItem('ie_user');
        if (hadToken && !router.url.startsWith('/login')) {
          router.navigate(['/login'], { queryParams: { expired: '1' } });
        }
        friendlyMessage = 'Sesión expirada. Inicia sesión nuevamente.';
      } else if (status === 403) {
        friendlyMessage = 'No tienes permisos para realizar esta acción.';
      } else if (status === 404) {
        friendlyMessage = 'El recurso solicitado no existe.';
      } else if (status >= 500) {
        friendlyMessage = 'Error del servidor. Intenta nuevamente.';
      } else if (!error.response) {
        friendlyMessage = 'No se pudo conectar con el servidor.';
      } else {
        friendlyMessage = error.error?.message || error.error?.error || friendlyMessage;
      }

      if (status !== 401) {
        toast.error(friendlyMessage);
      }

      return throwError(() => ({ ...error, friendlyMessage }));
    })
  );
};
