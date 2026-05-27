import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" *ngIf="authService.isAuthenticated()">
      <div class="navbar-brand">🏫 Intranet Escolar</div>
      <ul class="navbar-nav">
        <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
        <li><a routerLink="/estudiantes" routerLinkActive="active" *ngIf="!authService.isEstudiante()">Estudiantes</a></li>
        <li><a routerLink="/docentes" routerLinkActive="active" *ngIf="authService.isAdmin() || authService.isDirector()">Docentes</a></li>
        <li><a routerLink="/cursos" routerLinkActive="active">Cursos</a></li>
        <li><a routerLink="/notas" routerLinkActive="active" *ngIf="!authService.isEstudiante()">Notas</a></li>
        <li><a routerLink="/asistencia" routerLinkActive="active" *ngIf="!authService.isEstudiante()">Asistencia</a></li>
        <li><a routerLink="/comunicados" routerLinkActive="active">Comunicados</a></li>
        <li><a href="#" (click)="logout()">🚪 Cerrar Sesión ({{authService.getRol()}})</a></li>
      </ul>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .navbar-brand {
      color: white;
      font-size: 22px;
      font-weight: bold;
    }
    .navbar-nav {
      display: flex;
      list-style: none;
      gap: 25px;
      margin: 0;
      padding: 0;
    }
    .navbar-nav a {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.3s;
    }
    .navbar-nav a:hover, .navbar-nav a.active {
      color: white;
      background-color: rgba(255,255,255,0.15);
    }
    main {
      min-height: calc(100vh - 60px);
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
