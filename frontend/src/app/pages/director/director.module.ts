import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DirectorDashboard } from './dashboard/dashboard';
import { DirectorDocentes } from './docentes/docentes';
import { DirectorEstudiantes } from './estudiantes/estudiantes';
import { DirectorCursos } from './cursos/cursos';
import { DirectorComunicados } from './comunicados/comunicados';

const routes: Routes = [
  { path: '', component: DirectorDashboard },
  { path: 'docentes', component: DirectorDocentes },
  { path: 'estudiantes', component: DirectorEstudiantes },
  { path: 'cursos', component: DirectorCursos },
  { path: 'comunicados', component: DirectorComunicados },
];

@NgModule({
  declarations: [DirectorDashboard, DirectorDocentes, DirectorEstudiantes, DirectorCursos, DirectorComunicados],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class DirectorModule { }
