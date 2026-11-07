import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CarritoService } from '../../services/carrito-service';
import { AuthService } from '../../services/auth-service';
import { FavoritosService } from '../../services/favoritos-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected carrito = inject(CarritoService);
  protected auth = inject(AuthService);
  protected favs = inject(FavoritosService);
  private router = inject(Router);

  salir(): void {
    this.auth.salir();
    this.router.navigate(['/inicio']);
  }
}
