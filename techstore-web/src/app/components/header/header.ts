import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../services/carrito-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly carrito = inject(CarritoService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/catalogo']);
  }
}
