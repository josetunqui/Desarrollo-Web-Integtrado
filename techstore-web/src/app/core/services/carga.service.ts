import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CargaService {
  private readonly pendientes = signal(0); // peticiones en curso
  readonly activo = computed(() => this.pendientes() > 0);

  iniciar(): void {
    this.pendientes.update((n) => n + 1);
  }

  terminar(): void {
    this.pendientes.update((n) => Math.max(0, n - 1));
  }
}
