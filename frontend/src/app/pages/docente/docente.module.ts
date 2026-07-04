import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DocenteDashboard } from './dashboard/dashboard';
import { DocenteMisCursos } from './mis-cursos/mis-cursos';
import { DocenteMisEstudiantes } from './mis-estudiantes/mis-estudiantes';
import { DocenteComunicados } from './comunicados/comunicados';

const routes: Routes = [
  { path: '', component: DocenteDashboard },
  { path: 'cursos', component: DocenteMisCursos },
  { path: 'estudiantes', component: DocenteMisEstudiantes },
  { path: 'comunicados', component: DocenteComunicados },
];

@NgModule({
  declarations: [DocenteDashboard, DocenteMisCursos, DocenteMisEstudiantes, DocenteComunicados],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class DocenteModule { }
