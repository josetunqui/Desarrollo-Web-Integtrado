import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Producto } from '../../core/models/producto.model';
import { mensajeError } from '../../core/utils/mensaje-error';
import { SelectorCantidad } from '../../components/selector-cantidad/selector-cantidad';
import { CarritoService } from '../../services/carrito-service';

@Component({
  selector: 'app-producto-detalle',
  imports: [CurrencyPipe, RouterLink, SelectorCantidad],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss',
})
export class ProductoDetalle {
  private readonly carrito = inject(CarritoService);
  private readonly router = inject(Router);

  // Parámetro :id de la ruta (withComponentInputBinding)
  readonly id = input.required<string>();

  // Reto 1 (Semana 14): detalle del producto vía GET /api/productos/{id} con httpResource
  protected readonly producto = httpResource<Producto>(
    () => `${environment.apiUrl}/productos/${this.id()}`
  );

  protected readonly error = computed(() =>
    this.producto.error() ? mensajeError(this.producto.error()) : ''
  );

  protected readonly cantidad = signal(1);

  agregarAlCarrito(): void {
    if (!this.producto.hasValue()) return;
    this.carrito.agregar(this.producto.value(), this.cantidad());
    this.router.navigate(['/carrito']);
  }

  volver(): void {
    this.router.navigate(['/catalogo']);
  }
}
