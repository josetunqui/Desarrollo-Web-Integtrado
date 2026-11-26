import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Sesion } from '../models/auth.model';

const CLAVE_TOKEN = 'techstore_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/auth`;
  private temporizador?: ReturnType<typeof setTimeout>;

  // Estado de la sesión como signal: la UI se actualiza sola
  private readonly _sesion = signal<Sesion | null>(this.leerSesionGuardada());
  readonly sesion = this._sesion.asReadonly();
  readonly estaAutenticado = computed(() => this._sesion() !== null);
  readonly rol = computed(() => this._sesion()?.rol ?? null);

  constructor() {
    const inicial = this._sesion();
    if (inicial) {
      this.programarCierre(inicial.expira);
    }
  }

  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.url}/login`, datos)
      .pipe(tap((resp) => this.guardarSesion(resp.token)));
  }

  logout(): void {
    clearTimeout(this.temporizador);
    sessionStorage.removeItem(CLAVE_TOKEN);
    this._sesion.set(null);
  }

  // Devuelve el token solo si sigue vigente
  token(): string | null {
    const s = this._sesion();
    if (!s) return null;
    if (s.expira <= Date.now()) {
      this.logout();
      return null;
    }
    return s.token;
  }

  tieneRol(...roles: string[]): boolean {
    const rol = this.rol();
    return rol !== null && roles.includes(rol);
  }

  private guardarSesion(token: string): void {
    const sesion = this.decodificar(token);
    if (!sesion) return;
    sessionStorage.setItem(CLAVE_TOKEN, token);
    this._sesion.set(sesion);
    this.programarCierre(sesion.expira);
  }

  private leerSesionGuardada(): Sesion | null {
    const token = sessionStorage.getItem(CLAVE_TOKEN);
    const sesion = token ? this.decodificar(token) : null;
    if (!sesion || sesion.expira <= Date.now()) {
      sessionStorage.removeItem(CLAVE_TOKEN);
      return null;
    }
    return sesion;
  }

  // Reto 4 (Semana 14): cierre de sesión automático al expirar el token
  private programarCierre(expira: number): void {
    clearTimeout(this.temporizador);
    const espera = Math.max(0, expira - Date.now());
    this.temporizador = setTimeout(() => {
      this.logout();
      this.router.navigate(['/login'], { queryParams: { motivo: 'sesion' } });
    }, espera);
  }

  // Lee el payload del JWT (no verifica la firma: eso lo hace el back-end)
  private decodificar(token: string): Sesion | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return { token, usuario: payload.sub, rol: payload.rol, expira: payload.exp * 1000 };
    } catch {
      return null;
    }
  }
}
