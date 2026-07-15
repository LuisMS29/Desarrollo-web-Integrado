import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';

const routes: Routes = [
  { path: '', component: Login },
];

@NgModule({
  declarations: [Login],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class AuthModule { }
