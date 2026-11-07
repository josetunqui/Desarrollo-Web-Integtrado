import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly _ids = signal<number[]>([]);
  readonly total = computed(() => this._ids().length);

  esFavorito(id: number): boolean {
    return this._ids().includes(id);
  }

  alternar(id: number): void {
    this._ids.update((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }
}
