import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminDashboard } from './dashboard/dashboard';
import { AdminUsuarios } from './usuarios/usuarios';

const routes: Routes = [
  { path: '', component: AdminDashboard },
  { path: 'usuarios', component: AdminUsuarios },
];

@NgModule({
  declarations: [AdminDashboard, AdminUsuarios],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), SharedModule],
})
export class AdminModule { }
