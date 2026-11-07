import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Catalogo } from './pages/catalogo/catalogo';
import { ProductoDetalle } from './pages/producto-detalle/producto-detalle';
import { Carrito } from './pages/carrito/carrito';
import { RegistroCliente } from './pages/registro-cliente/registro-cliente';
import { Login } from './pages/login/login';
import { NoEncontrado } from './pages/no-encontrado/no-encontrado';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio, title: 'TechStore | Inicio' },
  { path: 'catalogo', component: Catalogo, title: 'TechStore | Catálogo' },
  { path: 'productos/:id', component: ProductoDetalle, title: 'TechStore | Detalle' },
  { path: 'carrito', component: Carrito, title: 'TechStore | Carrito' },
  { path: 'registro', component: RegistroCliente, title: 'TechStore | Registro de cliente' },
  { path: 'login', component: Login, title: 'TechStore | Ingresar' },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    title: 'TechStore | Administración',
  },
  { path: '**', component: NoEncontrado, title: 'TechStore | Página no encontrada' },
];
