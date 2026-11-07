import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../services/producto-service';

@Component({
  selector: 'app-admin',
  imports: [CurrencyPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private productos = inject(ProductoService);

  lista = this.productos.lista;
  bajoStock = computed(() => this.lista().filter((p) => p.stock < 5));
  valorInventario = computed(() =>
    this.lista().reduce((suma, p) => suma + p.precio * p.stock, 0)
  );
}

