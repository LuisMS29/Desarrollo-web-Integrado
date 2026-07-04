import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EstudianteDashboard } from './dashboard/dashboard';
import { EstudianteMisCursos } from './mis-cursos/mis-cursos';
import { EstudianteComunicados } from './comunicados/comunicados';

const routes: Routes = [
  { path: '', component: EstudianteDashboard },
  { path: 'cursos', component: EstudianteMisCursos },
  { path: 'comunicados', component: EstudianteComunicados },
];

@NgModule({
  declarations: [EstudianteDashboard, EstudianteMisCursos, EstudianteComunicados],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class EstudianteModule { }
