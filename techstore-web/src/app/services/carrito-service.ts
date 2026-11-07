import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito, Producto } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items = signal<ItemCarrito[]>([]);
  readonly items = this._items.asReadonly();

  readonly cantidadTotal = computed(() =>
    this._items().reduce((suma, i) => suma + i.cantidad, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0)
  );

  agregar(producto: Producto, cantidad = 1): void {
    this._items.update((items) => {
      const existe = items.find((i) => i.producto.id === producto.id);
      return existe
        ? items.map((i) =>
            i.producto.id === producto.id
              ? { ...i, cantidad: i.cantidad + cantidad }
              : i
          )
        : [...items, { producto, cantidad }];
    });
  }

  cambiarCantidad(id: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.quitar(id);
      return;
    }
    this._items.update((items) =>
      items.map((i) => (i.producto.id === id ? { ...i, cantidad } : i))
    );
  }

  quitar(id: number): void {
    this._items.update((items) => items.filter((i) => i.producto.id !== id));
  }

  vaciar(): void {
    this._items.set([]);
  }
}

