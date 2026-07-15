import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DirectorDashboard } from './dashboard/dashboard';
import { DirectorDocentes } from './docentes/docentes';
import { DirectorEstudiantes } from './estudiantes/estudiantes';
import { DirectorGrados } from './grados/grados';
import { DirectorSecciones } from './secciones/secciones';
import { DirectorAsignaturas } from './asignaturas/asignaturas';
import { DirectorCursos } from './cursos/cursos';
import { DirectorHorarios } from './horarios/horarios';
import { DirectorPeriodos } from './periodos/periodos';
import { DirectorEvaluaciones } from './evaluaciones/evaluaciones';
import { DirectorMatriculas } from './matriculas/matriculas';
import { DirectorComunicados } from './comunicados/comunicados';
import { DirectorPerfil } from './perfil/perfil';

const routes: Routes = [
  { path: '', component: DirectorDashboard },
  { path: 'docentes', component: DirectorDocentes },
  { path: 'estudiantes', component: DirectorEstudiantes },
  { path: 'grados', component: DirectorGrados },
  { path: 'secciones', component: DirectorSecciones },
  { path: 'asignaturas', component: DirectorAsignaturas },
  { path: 'cursos', component: DirectorCursos },
  { path: 'horarios', component: DirectorHorarios },
  { path: 'periodos', component: DirectorPeriodos },
  { path: 'evaluaciones', component: DirectorEvaluaciones },
  { path: 'matriculas', component: DirectorMatriculas },
  { path: 'comunicados', component: DirectorComunicados },
  { path: 'perfil', component: DirectorPerfil },
];

@NgModule({
  declarations: [DirectorDashboard, DirectorDocentes, DirectorEstudiantes, DirectorGrados, DirectorSecciones, DirectorAsignaturas, DirectorCursos, DirectorHorarios, DirectorPeriodos, DirectorEvaluaciones, DirectorMatriculas, DirectorComunicados, DirectorPerfil],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class DirectorModule { }
