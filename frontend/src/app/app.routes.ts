import { Routes } from '@angular/router';
import { authGuard, adminGuard, docenteGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'estudiantes',
    loadComponent: () => import('./components/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent),
    canActivate: [docenteGuard]
  },
  {
    path: 'docentes',
    loadComponent: () => import('./components/docentes/docentes.component').then(m => m.DocentesComponent),
    canActivate: [docenteGuard]
  },
  {
    path: 'cursos',
    loadComponent: () => import('./components/cursos/cursos.component').then(m => m.CursosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notas',
    loadComponent: () => import('./components/notas/notas.component').then(m => m.NotasComponent),
    canActivate: [docenteGuard]
  },
  {
    path: 'asistencia',
    loadComponent: () => import('./components/asistencia/asistencia.component').then(m => m.AsistenciaComponent),
    canActivate: [docenteGuard]
  },
  {
    path: 'comunicados',
    loadComponent: () => import('./components/comunicados/comunicados.component').then(m => m.ComunicadosComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
