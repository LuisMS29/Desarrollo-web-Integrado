import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
})
export class Login {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit(): Promise<void> {
    if (!this.username.trim() || !this.password.trim()) return;
    this.loading = true;
    this.error = '';
    try {
      const user = await this.auth.login(this.username, this.password);
      if (user.perfilCompleto === false && (user.rol === 'DOCENTE' || user.rol === 'ESTUDIANTE')) {
        this.router.navigate([`/${user.rol.toLowerCase()}/completar-perfil`]);
      } else {
        this.router.navigate([`/${user.rol.toLowerCase()}`]);
      }
    } catch (err: any) {
      this.error = err.friendlyMessage || 'Credenciales inválidas.';
    } finally {
      this.loading = false;
    }
  }
}
