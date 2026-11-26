import { HttpErrorResponse } from '@angular/common/http';

// Traduce un error HTTP a un mensaje claro para el usuario
export function mensajeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    switch (err.status) {
      case 0:
        return 'No hay conexión con el servidor. ¿Está encendida la API?';
      case 400: {
        const errores = err.error?.errores;
        if (errores && typeof errores === 'object' && Object.keys(errores).length > 0) {
          return Object.entries(errores)
            .map(([campo, msg]) => `${campo}: ${msg}`)
            .join('; ');
        }
        return err.error?.mensaje ?? 'Los datos enviados no son válidos.';
      }
      case 401:
        return 'Tu sesión no es válida. Inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return err.error?.mensaje ?? 'El recurso solicitado no existe.';
      default:
        return err.status >= 500
          ? 'Error interno del servidor. Intenta más tarde.'
          : `Error inesperado (${err.status}).`;
    }
  }
  return 'Ocurrió un error inesperado.';
}
