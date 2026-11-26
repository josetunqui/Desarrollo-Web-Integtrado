import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

// Agrega "Authorization: Bearer <token>" a cada petición hacia NUESTRA API
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const esNuestraApi = req.url.startsWith(environment.apiUrl);

  if (!token || !esNuestraApi) {
    return next(req); // pasa sin cambios
  }

  const reqConToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(reqConToken);
};
