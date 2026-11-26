import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ¿Hay sesión válida? Si no, al login recordando a dónde quería ir
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.token()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
};
