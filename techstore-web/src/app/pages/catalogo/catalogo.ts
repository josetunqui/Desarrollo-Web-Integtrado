import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductoService } from '../../services/producto-service';
import { CarritoService } from '../../services/carrito-service';
import { FavoritosService } from '../../services/favoritos-service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-catalogo',
  imports: [ProductCard, RouterLink, RouterLinkActive],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class Catalogo {
  private productos = inject(ProductoService);
  private carrito = inject(CarritoService);
  protected favs = inject(FavoritosService);

  // Llega desde la URL: /catalogo?categoria=laptops
  categoria = input<string>();

  categorias = ['laptops', 'accesorios', 'monitores'];
  mensaje = signal('');

  filtrados = computed(() => {
    const c = this.categoria();
    const todos = this.productos.lista();
    return c ? todos.filter((p) => p.categoria.toLowerCase() === c.toLowerCase()) : todos;
  });

  alAgregar(producto: Producto): void {
    this.carrito.agregar(producto);
    this.mensaje.set(producto.nombre + ' se agregó al carrito');
    setTimeout(() => this.mensaje.set(''), 3000);
  }
}

