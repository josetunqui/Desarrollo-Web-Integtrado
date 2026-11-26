import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Reacciona de forma centralizada a 401 y 403
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const esLogin = req.url.endsWith('/auth/login');
      if (err.status === 401 && !esLogin) {
        auth.logout();
        router.navigate(['/login'], {
          queryParams: { volver: router.url, motivo: 'sesion' },
        });
      } else if (err.status === 403) {
        router.navigate(['/prohibido']);
      }
      return throwError(() => err); // el componente también puede reaccionar
    })
  );
};
