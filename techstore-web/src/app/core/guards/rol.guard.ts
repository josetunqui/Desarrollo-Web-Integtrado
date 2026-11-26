import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ¿Tiene el rol que pide la ruta en data.roles?
export const rolGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rolesPermitidos = (route.data['roles'] as string[]) ?? [];

  return auth.tieneRol(...rolesPermitidos)
    ? true
    : router.createUrlTree(['/prohibido']);
};
