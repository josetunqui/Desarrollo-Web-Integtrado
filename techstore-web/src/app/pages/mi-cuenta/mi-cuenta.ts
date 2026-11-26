import { Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Perfil } from '../../core/models/auth.model';
import { mensajeError } from '../../core/utils/mensaje-error';

@Component({
  selector: 'app-mi-cuenta',
  template: `
    <h1>Mi cuenta</h1>
    @if (perfil.isLoading()) {
      <p class="cargando">Consultando /api/perfil ...</p>
    } @else if (error()) {
      <div class="alerta error">{{ error() }}</div>
    } @else if (perfil.hasValue()) {
      <div class="tarjeta">
        <p><b>Usuario:</b> {{ perfil.value().usuario }}</p>
        <p><b>Rol:</b> {{ perfil.value().rol }}</p>
        <div class="alerta ok">{{ perfil.value().mensaje }}</div>
      </div>
    }
  `,
})
export class MiCuenta {
  // El interceptor agrega el token automáticamente: aquí no se escribe ningún header
  protected readonly perfil = httpResource<Perfil>(() => `${environment.apiUrl}/perfil`);
  protected readonly error = computed(() =>
    this.perfil.error() ? mensajeError(this.perfil.error()) : ''
  );
}
