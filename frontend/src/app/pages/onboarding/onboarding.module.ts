import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingDocente } from './onboarding-docente/onboarding-docente';
import { OnboardingEstudiante } from './onboarding-estudiante/onboarding-estudiante';

const routes: Routes = [
  { path: 'docente/completar-perfil', component: OnboardingDocente },
  { path: 'estudiante/completar-perfil', component: OnboardingEstudiante },
];

@NgModule({
  declarations: [OnboardingDocente, OnboardingEstudiante],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class OnboardingModule { }
