import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { SelectorCantidad } from '../../components/selector-cantidad/selector-cantidad';
import { ProductoService } from '../../services/producto-service';
import { CarritoService } from '../../services/carrito-service';

@Component({
  selector: 'app-producto-detalle',
  imports: [CurrencyPipe, SelectorCantidad],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss',
})
export class ProductoDetalle {
  private productos = inject(ProductoService);
  private carrito = inject(CarritoService);
  private router = inject(Router);

  // Mismo nombre que el parámetro :id de la ruta
  id = input.required<string>();

  producto = computed(() => this.productos.buscarPorId(Number(this.id())));
  cantidad = signal(1);

  agregarAlCarrito(): void {
    const p = this.producto();
    if (!p) return;
    this.carrito.agregar(p, this.cantidad());
    this.router.navigate(['/carrito']);
  }

  volver(): void {
    this.router.navigate(['/catalogo']);
  }
}
