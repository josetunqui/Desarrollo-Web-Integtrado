import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly _lista = signal<Producto[]>([
    { id: 1, nombre: 'Laptop Lenovo IdeaPad', precio: 2499, stock: 8, categoria: 'laptops' },
    { id: 2, nombre: 'Mouse Logitech M280', precio: 49.9, stock: 25, categoria: 'accesorios' },
    { id: 3, nombre: 'Teclado Redragon K552', precio: 159, stock: 0, categoria: 'accesorios' },
    { id: 4, nombre: 'Monitor Samsung 24"', precio: 599, stock: 4, categoria: 'monitores' },
    { id: 5, nombre: 'Laptop HP Victus', precio: 3199, stock: 3, categoria: 'laptops' },
    { id: 6, nombre: 'Audífonos Sony WH-CH520', precio: 229, stock: 12, categoria: 'accesorios' },
  ]);

  readonly lista = this._lista.asReadonly();

  buscarPorId(id: number): Producto | undefined {
    return this._lista().find((p) => p.id === id);
  }
}

