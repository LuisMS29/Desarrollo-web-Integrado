import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EstudianteDashboard } from './dashboard/dashboard';
import { EstudianteMisCursos } from './mis-cursos/mis-cursos';
import { EstudianteComunicados } from './comunicados/comunicados';
import { EstudianteMiHorario } from './mi-horario/mi-horario';
import { EstudianteMisNotas } from './mis-notas/mis-notas';
import { EstudianteMiAsistencia } from './mi-asistencia/mi-asistencia';
import { EstudiantePerfil } from './perfil/perfil';

const routes: Routes = [
  { path: '', component: EstudianteDashboard },
  { path: 'cursos', component: EstudianteMisCursos },
  { path: 'horario', component: EstudianteMiHorario },
  { path: 'notas', component: EstudianteMisNotas },
  { path: 'asistencia', component: EstudianteMiAsistencia },
  { path: 'comunicados', component: EstudianteComunicados },
  { path: 'perfil', component: EstudiantePerfil },
];

@NgModule({
  declarations: [EstudianteDashboard, EstudianteMisCursos, EstudianteComunicados, EstudianteMiHorario, EstudianteMisNotas, EstudianteMiAsistencia, EstudiantePerfil],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class EstudianteModule { }
