import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _logueado = signal(false);
  private readonly _rol = signal<'ADMIN' | 'CLIENTE'>('CLIENTE');

  readonly logueado = this._logueado.asReadonly();
  readonly rol = this._rol.asReadonly();

  ingresar(rol: 'ADMIN' | 'CLIENTE' = 'ADMIN'): void {
    this._rol.set(rol);
    this._logueado.set(true);
  }

  salir(): void {
    this._logueado.set(false);
  }
}
