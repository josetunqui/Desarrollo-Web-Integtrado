import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { mensajeError } from '../../core/utils/mensaje-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Query params enlazados como inputs (withComponentInputBinding)
  readonly volver = input<string>();
  readonly motivo = input<string>();
  readonly expirado = input<string>();

  protected readonly enviando = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected sesionExpirada(): boolean {
    return this.motivo() === 'sesion' || this.expirado() === 'true';
  }

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl(this.volver() ?? '/catalogo'),
        error: (err) =>
          this.error.set(
            err.status === 401 ? 'Usuario o contraseña incorrectos.' : mensajeError(err)
          ),
      });
  }
}
