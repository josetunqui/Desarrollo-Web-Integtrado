import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  camposIgualesValidator,
  celularPeruValidator,
  dniValidator,
  rucValidator,
} from '../../validators/peru-validators';
import { ClienteRequest, ClienteResponse, ErrorResponse } from '../../models/cliente';
import { ClienteService } from '../../services/cliente-service';

@Component({
  selector: 'app-registro-cliente',
  imports: [ReactiveFormsModule],
  templateUrl: './registro-cliente.html',
  styleUrl: './registro-cliente.scss',
})
export class RegistroCliente {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly clienteService = inject(ClienteService);

  // 1. Modelo del formulario reactivo
  protected readonly form = this.fb.group(
    {
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dni: ['', [Validators.required, dniValidator]],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, celularPeruValidator]],
      tipoComprobante: this.fb.control<'BOLETA' | 'FACTURA'>('BOLETA'),
      ruc: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue],
    },
    { validators: camposIgualesValidator('password', 'confirmarPassword') }
  );

  // 2. Estado de la pantalla con signals
  protected readonly enviando = signal(false);
  protected readonly clienteRegistrado = signal<ClienteResponse | null>(null);
  protected readonly mensajeGeneral = signal<string | null>(null);

  constructor() {
    // 3. Validación condicional: el RUC solo es obligatorio si es FACTURA
    this.form.controls.tipoComprobante.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((tipo) => {
        const ruc = this.form.controls.ruc;
        if (tipo === 'FACTURA') {
          ruc.setValidators([Validators.required, rucValidator]);
        } else {
          ruc.clearValidators();
          ruc.setValue('');
        }
        ruc.updateValueAndValidity();
      });
  }

  // 4. Mostrar error si el campo es inválido y fue tocado
  protected mostrarError(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  // 5. Traductor de errores a mensajes claros en español
  protected mensajeError(campo: string): string {
    const errores = this.form.get(campo)?.errors;
    if (!errores) return '';
    if (errores['servidor']) return errores['servidor'];
    if (errores['required']) {
      return campo === 'aceptaTerminos'
        ? 'Debes aceptar los términos y condiciones.'
        : 'Este campo es obligatorio.';
    }
    if (errores['minlength']) {
      return `Debe tener al menos ${errores['minlength'].requiredLength} caracteres.`;
    }
    if (errores['maxlength']) {
      return `Debe tener como máximo ${errores['maxlength'].requiredLength} caracteres.`;
    }
    if (errores['email']) return 'Ingresa un correo válido, por ejemplo: ana@correo.com';
    if (errores['dniInvalido']) return 'El DNI debe tener exactamente 8 dígitos.';
    if (errores['celularInvalido']) return 'El celular debe tener 9 dígitos y empezar con 9.';
    if (errores['rucInvalido']) return 'El RUC debe tener 11 dígitos y empezar con 10 o 20.';
    return 'El valor ingresado no es válido.';
  }

  // 6. Validación cruzada de contraseñas
  protected passwordsNoCoinciden(): boolean {
    return (
      this.form.hasError('passwordsNoCoinciden') &&
      this.form.controls.confirmarPassword.touched
    );
  }

  // 7. Envío del formulario
  protected registrar(): void {
    this.mensajeGeneral.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmarPassword, ...datos } = this.form.getRawValue();
    this.enviando.set(true);

    this.clienteService.registrar(datos as ClienteRequest).subscribe({
      next: (cliente) => {
        this.enviando.set(false);
        this.clienteRegistrado.set(cliente);
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        this.mostrarErroresDelServidor(err);
      },
    });
  }

  // 8. Manejo de errores HTTP: mapeo de errores del backend en cada campo
  private mostrarErroresDelServidor(err: HttpErrorResponse): void {
    if (err.status === 0) {
      this.mensajeGeneral.set('No se pudo conectar con el servidor. Verifica que la API esté encendida.');
      return;
    }

    const cuerpo = err.error as ErrorResponse | null;
    const errores = cuerpo?.errores ?? {};
    const sinCampo: string[] = [];

    for (const [campo, mensaje] of Object.entries(errores)) {
      const control = this.form.get(campo);
      if (control) {
        control.setErrors({ servidor: mensaje });
        control.markAsTouched();
      } else {
        sinCampo.push(mensaje);
      }
    }

    this.mensajeGeneral.set(
      [cuerpo?.mensaje ?? 'Ocurrió un error inesperado.', ...sinCampo].join(' ')
    );
  }

  protected nuevoRegistro(): void {
    this.clienteRegistrado.set(null);
  }
}

