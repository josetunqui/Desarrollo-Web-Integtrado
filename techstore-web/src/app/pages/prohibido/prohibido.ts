import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-prohibido',
  imports: [RouterLink],
  template: `
    <div class="tarjeta" style="text-align:center; max-width:520px; margin:30px auto;">
      <h1>403 · Acceso denegado</h1>
      <p>Tu usuario no tiene el rol necesario para esta sección.</p>
      <a routerLink="/catalogo" class="btn-rojo" style="display:inline-block; text-decoration:none; margin-top:12px;">
        Volver al catálogo
      </a>
    </div>
  `,
})
export class Prohibido {}
