import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Producto } from '../../core/models/producto.model';
import { ProductoService } from '../../core/services/producto.service';
import { mensajeError } from '../../core/utils/mensaje-error';

@Component({
  selector: 'app-admin-productos',
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './admin-productos.html',
})
export class AdminProductos {
  private readonly servicio = inject(ProductoService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['Laptops', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.servicio
      .listar()
      .pipe(
        finalize(() => this.cargando.set(false)),
        takeUntilDestroyed(this.destroyRef) // evita fugas de memoria
      )
      .subscribe({
        next: (datos) => this.productos.set(datos),
        error: (err) => this.error.set(mensajeError(err)),
      });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.aviso.set('');
    this.error.set('');
    this.servicio
      .crear(this.form.getRawValue())
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (nuevo) => {
          this.productos.update((lista) => [...lista, nuevo]); // 201 Created
          this.aviso.set(`Producto "${nuevo.nombre}" creado con id ${nuevo.id}.`);
          this.form.reset({ nombre: '', categoria: 'Laptops', precio: 0, stock: 0 });
        },
        error: (err) => this.error.set(mensajeError(err)),
      });
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.servicio.eliminar(p.id).subscribe({
      next: () => {
        this.productos.update((lista) => lista.filter((x) => x.id !== p.id)); // 204
        this.aviso.set(`Producto "${p.nombre}" eliminado.`);
      },
      error: (err) => this.error.set(mensajeError(err)),
    });
  }
}
