import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductoService } from '../../core/services/producto.service';
import { mensajeError } from '../../core/utils/mensaje-error';

@Component({
  selector: 'app-producto-editar',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h1>Editar producto #{{ id() }}</h1>
    @if (cargando()) {
      <p class="cargando">Cargando...</p>
    }
    @if (error()) {
      <div class="alerta error">{{ error() }}</div>
    }
    <form class="tarjeta" [formGroup]="form" (ngSubmit)="guardar()">
      <label for="nombre">Nombre</label>
      <input id="nombre" formControlName="nombre" />

      <label for="categoria">Categoría</label>
      <input id="categoria" formControlName="categoria" />

      <label for="precio">Precio</label>
      <input id="precio" type="number" formControlName="precio" />

      <label for="stock">Stock</label>
      <input id="stock" type="number" formControlName="stock" />

      <div style="margin-top:16px; display:flex; align-items:center; gap:12px;">
        <button class="btn-rojo" type="submit" [disabled]="guardando() || form.invalid">
          {{ guardando() ? 'Guardando...' : 'Guardar cambios' }}
        </button>
        <a routerLink="/admin/productos">Cancelar</a>
      </div>
    </form>
  `,
})
export class ProductoEditar implements OnInit {
  readonly id = input.required<string>();
  private readonly servicio = inject(ProductoService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.servicio
      .obtener(Number(this.id()))
      .pipe(
        finalize(() => this.cargando.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (p) => this.form.patchValue(p), // GET -> llenar el formulario
        error: (err) => this.error.set(mensajeError(err)),
      });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    this.servicio
      .actualizar(Number(this.id()), this.form.getRawValue())
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/admin/productos']), // PUT 200
        error: (err) => this.error.set(mensajeError(err)),      // 400, 403, 404...
      });
  }
}
