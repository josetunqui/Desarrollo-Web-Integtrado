import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Producto } from '../../core/models/producto.model';
import { mensajeError } from '../../core/utils/mensaje-error';
import { ProductCard } from '../../components/product-card/product-card';
import { CarritoService } from '../../services/carrito-service';
import { FavoritosService } from '../../services/favoritos-service';

@Component({
  selector: 'app-catalogo',
  imports: [ProductCard, RouterLink, RouterLinkActive],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class Catalogo {
  private readonly carrito = inject(CarritoService);
  protected readonly favs = inject(FavoritosService);

  // Query param opcional (?categoria=laptops) del Taller 12
  readonly categoria = input<string>();

  protected readonly busqueda = signal('');
  protected readonly categorias = ['Laptops', 'Accesorios', 'Monitores'];
  protected readonly mensaje = signal('');

  constructor() {
    effect(() => {
      const cat = this.categoria();
      this.busqueda.set(cat ?? '');
    });
  }

  // httpResource (Angular 22): se vuelve a pedir automáticamente cuando cambia busqueda()
  protected readonly productos = httpResource<Producto[]>(
    () => ({
      url: `${environment.apiUrl}/productos`,
      params: { q: this.busqueda() }, // GET /api/productos?q=texto
    }),
    { defaultValue: [] }
  );

  protected readonly error = computed(() =>
    this.productos.error() ? mensajeError(this.productos.error()) : ''
  );

  alAgregar(producto: Producto): void {
    this.carrito.agregar(producto);
    this.mensaje.set(`${producto.nombre} se agregó al carrito`);
    setTimeout(() => this.mensaje.set(''), 3000);
  }
}
