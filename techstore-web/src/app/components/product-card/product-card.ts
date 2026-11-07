import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  // Padre -> hijo
  producto = input.required<Producto>();
  esFavorito = input(false);

  // Hijo -> padre
  agregar = output<Producto>();
  favorito = output<number>();

  agotado = computed(() => this.producto().stock === 0);

  onAgregar(): void {
    this.agregar.emit(this.producto());
  }

  onFavorito(): void {
    this.favorito.emit(this.producto().id);
  }
}

