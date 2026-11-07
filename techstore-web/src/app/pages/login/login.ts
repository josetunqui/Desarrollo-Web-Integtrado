import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Llega desde la URL: /login?volver=/admin
  volver = input<string>();

  username = signal('admin');
  password = signal('admin123');

  ingresar(): void {
    this.auth.ingresar('ADMIN');
    this.router.navigateByUrl(this.volver() ?? '/admin');
  }
}

