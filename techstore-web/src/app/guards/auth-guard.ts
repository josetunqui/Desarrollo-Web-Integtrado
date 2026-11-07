import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.logueado()) {
    return true; // Acceso permitido
  }

  // Redirige a login recordando la ruta solicitada
  return router.createUrlTree(['/login'], {
    queryParams: { volver: state.url },
  });
};
