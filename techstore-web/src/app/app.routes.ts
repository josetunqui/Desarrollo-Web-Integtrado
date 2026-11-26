import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolGuard } from './core/guards/rol.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio),
    title: 'TechStore | Inicio',
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
    title: 'TechStore | Catálogo',
  },
  {
    path: 'productos/:id',
    loadComponent: () => import('./pages/producto-detalle/producto-detalle').then((m) => m.ProductoDetalle),
    title: 'TechStore | Detalle de producto',
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./pages/producto-detalle/producto-detalle').then((m) => m.ProductoDetalle),
    title: 'TechStore | Detalle de producto',
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.Carrito),
    title: 'TechStore | Carrito',
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro-cliente/registro-cliente').then((m) => m.RegistroCliente),
    title: 'TechStore | Registro de cliente',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'TechStore | Iniciar sesión',
  },
  {
    path: 'mi-cuenta',
    canActivate: [authGuard], // solo usuarios autenticados
    loadComponent: () => import('./pages/mi-cuenta/mi-cuenta').then((m) => m.MiCuenta),
    title: 'TechStore | Mi cuenta',
  },
  {
    path: 'admin',
    redirectTo: 'admin/productos',
    pathMatch: 'full',
  },
  {
    path: 'admin/productos',
    canActivate: [authGuard, rolGuard], // autenticado + ROLE_ADMIN
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () => import('./pages/admin-productos/admin-productos').then((m) => m.AdminProductos),
    title: 'TechStore | Administrar productos',
  },
  {
    path: 'admin/productos/:id/editar',
    canActivate: [authGuard, rolGuard], // Reto 3: editar producto solo ROLE_ADMIN
    data: { roles: ['ROLE_ADMIN'] },
    loadComponent: () => import('./pages/producto-editar/producto-editar').then((m) => m.ProductoEditar),
    title: 'TechStore | Editar producto',
  },
  {
    path: 'prohibido',
    loadComponent: () => import('./pages/prohibido/prohibido').then((m) => m.Prohibido),
    title: 'TechStore | Acceso denegado',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/no-encontrado/no-encontrado').then((m) => m.NoEncontrado),
    title: 'TechStore | Página no encontrada',
  },
];
