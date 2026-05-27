import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <h1>🏫 Intranet Escolar</h1>
          <p>Sistema de Gestión Administrativa y Académica</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="username">👤 Usuario</label>
            <input 
              type="text" 
              id="username"
              class="form-control"
              [(ngModel)]="credentials.username" 
              name="username" 
              required
              placeholder="Ingrese su usuario">
          </div>

          <div class="form-group">
            <label for="password">🔒 Contraseña</label>
            <input 
              type="password" 
              id="password"
              class="form-control"
              [(ngModel)]="credentials.password" 
              name="password" 
              required
              placeholder="Ingrese su contraseña">
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
            {{ loading ? '⏳ Ingresando...' : '🔑 Ingresar al Sistema' }}
          </button>
        </form>

        <div *ngIf="error" class="alert alert-danger">
          ⚠️ {{ error }}
        </div>

        <div class="login-footer">
          <p><strong>Usuarios de prueba:</strong></p>
          <p>admin / 123456 (ADMIN)</p>
          <p>director / 123456 (DIRECTOR)</p>
          <p>juanperez / 123456 (DOCENTE)</p>
          <p>luiscastillo / 123456 (ESTUDIANTE)</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px;
      width: 100%;
      max-width: 420px;
    }
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .login-header h1 {
      color: #1976d2;
      font-size: 28px;
      margin-bottom: 8px;
    }
    .login-header p {
      color: #666;
      font-size: 14px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #444;
      font-size: 14px;
    }
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 15px;
      transition: border-color 0.3s;
    }
    .form-control:focus {
      outline: none;
      border-color: #1976d2;
    }
    .btn-block {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      margin-top: 10px;
    }
    .btn-block:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .alert {
      margin-top: 15px;
      padding: 12px;
      border-radius: 8px;
    }
    .login-footer {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 13px;
      color: #888;
    }
    .login-footer p {
      margin: 4px 0;
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  error: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 401 
          ? 'Usuario o contraseña incorrectos' 
          : 'Error al conectar con el servidor';
      }
    });
  }
}
