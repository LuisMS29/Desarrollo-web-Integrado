import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminDashboard } from './dashboard/dashboard';
import { AdminUsuarios } from './usuarios/usuarios';
import { AdminDocentes } from './docentes/docentes';
import { AdminEstudiantes } from './estudiantes/estudiantes';
import { AdminGrados } from './grados/grados';
import { AdminSecciones } from './secciones/secciones';
import { AdminAsignaturas } from './asignaturas/asignaturas';
import { AdminCursos } from './cursos/cursos';
import { AdminPeriodos } from './periodos/periodos';
import { AdminComunicados } from './comunicados/comunicados';
import { AdminPerfil } from './perfil/perfil';

const routes: Routes = [
  { path: '', component: AdminDashboard },
  { path: 'usuarios', component: AdminUsuarios },
  { path: 'docentes', component: AdminDocentes },
  { path: 'estudiantes', component: AdminEstudiantes },
  { path: 'grados', component: AdminGrados },
  { path: 'secciones', component: AdminSecciones },
  { path: 'asignaturas', component: AdminAsignaturas },
  { path: 'cursos', component: AdminCursos },
  { path: 'periodos', component: AdminPeriodos },
  { path: 'comunicados', component: AdminComunicados },
  { path: 'perfil', component: AdminPerfil },
];

@NgModule({
  declarations: [AdminDashboard, AdminUsuarios, AdminDocentes, AdminEstudiantes, AdminGrados, AdminSecciones, AdminAsignaturas, AdminCursos, AdminPeriodos, AdminComunicados, AdminPerfil],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class AdminModule { }
