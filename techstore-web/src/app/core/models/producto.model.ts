export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

// Para crear o actualizar: el id lo asigna/gestiona el servidor
export type ProductoNuevo = Omit<Producto, 'id'>;

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
