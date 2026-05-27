import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="welcome-card">
        <h1>👋 Bienvenido, {{ usuario?.username || 'Usuario' }}</h1>
        <p class="rol-badge">Rol: <strong>{{ usuario?.rol }}</strong></p>
        <p class="fecha">{{ fechaActual | date:'fullDate' }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" *ngIf="authService.isAdmin() || authService.isDirector()">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-info">
            <h3>Gestión de Docentes</h3>
            <p>Administrar personal docente</p>
          </div>
        </div>
        <div class="stat-card" *ngIf="!authService.isEstudiante()">
          <div class="stat-icon">👨‍🎓</div>
          <div class="stat-info">
            <h3>Gestión de Estudiantes</h3>
            <p>Administrar estudiantes matriculados</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <h3>Cursos y Asignaturas</h3>
            <p>Ver cursos del periodo activo</p>
          </div>
        </div>
        <div class="stat-card" *ngIf="!authService.isEstudiante()">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <h3>Registro de Notas</h3>
            <p>Calificaciones y evaluaciones</p>
          </div>
        </div>
        <div class="stat-card" *ngIf="!authService.isEstudiante()">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>Control de Asistencia</h3>
            <p>Registro diario de asistencia</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📢</div>
          <div class="stat-info">
            <h3>Comunicados</h3>
            <p>Anuncios institucionales</p>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h2>📊 Estado del Sistema</h2>
        <p>✅ Backend Spring Boot conectado a MySQL</p>
        <p>✅ Autenticación JWT activa</p>
        <p>✅ 15 tablas en base de datos</p>
        <p>✅ Roles: ADMIN, DIRECTOR, DOCENTE, ESTUDIANTE</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px;
    }
    .welcome-card {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 30px;
      border-radius: 16px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(25, 118, 210, 0.3);
    }
    .welcome-card h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .rol-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      margin-top: 10px;
    }
    .fecha {
      margin-top: 10px;
      opacity: 0.9;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .stat-icon {
      font-size: 40px;
    }
    .stat-info h3 {
      font-size: 16px;
      color: #333;
      margin-bottom: 4px;
    }
    .stat-info p {
      font-size: 13px;
      color: #888;
    }
    .info-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .info-card h2 {
      color: #333;
      margin-bottom: 16px;
      font-size: 20px;
    }
    .info-card p {
      color: #666;
      margin: 8px 0;
      font-size: 14px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;
  fechaActual = new Date();

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.usuario = user;
      },
      error: () => {
        this.authService.logout();
      }
    });
  }
}
