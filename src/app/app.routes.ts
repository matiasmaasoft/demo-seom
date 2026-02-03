import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
  {
    path: 'socio',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/socio/dashboard-socio/dashboard-socio.component').then((m) => m.DashboardSocioComponent) },
      { path: 'solicitar', loadComponent: () => import('./features/socio/solicitar-consumo/solicitar-consumo.component').then((m) => m.SolicitarConsumoComponent) },
      { path: 'pagar/:id', loadComponent: () => import('./features/socio/pagar-qr/pagar-qr.component').then((m) => m.PagarQrComponent) },
      { path: 'comprobante/:id', loadComponent: () => import('./features/socio/comprobante/comprobante.component').then((m) => m.ComprobanteComponent) },
    ],
  },
  {
    path: 'comercio',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/comercio/dashboard-comercio/dashboard-comercio.component').then((m) => m.DashboardComercioComponent) },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
