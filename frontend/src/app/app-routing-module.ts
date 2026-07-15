import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { Login } from './pages/auth/login/login';
import { OnboardingDocente } from './pages/onboarding/onboarding-docente/onboarding-docente';
import { OnboardingEstudiante } from './pages/onboarding/onboarding-estudiante/onboarding-estudiante';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { DirectorLayout } from './layouts/director-layout/director-layout';
import { DocenteLayout } from './layouts/docente-layout/docente-layout';
import { EstudianteLayout } from './layouts/estudiante-layout/estudiante-layout';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'docente/completar-perfil', component: OnboardingDocente },
  { path: 'estudiante/completar-perfil', component: OnboardingEstudiante },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { allowedRoles: ['ADMIN'] },
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'director',
    component: DirectorLayout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { allowedRoles: ['DIRECTOR'] },
    loadChildren: () => import('./pages/director/director.module').then(m => m.DirectorModule),
  },
  {
    path: 'docente',
    component: DocenteLayout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { allowedRoles: ['DOCENTE'] },
    loadChildren: () => import('./pages/docente/docente.module').then(m => m.DocenteModule),
  },
  {
    path: 'estudiante',
    component: EstudianteLayout,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { allowedRoles: ['ESTUDIANTE'] },
    loadChildren: () => import('./pages/estudiante/estudiante.module').then(m => m.EstudianteModule),
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
