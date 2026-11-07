export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
