import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-layout',
  templateUrl: './estudiante-layout.html',
  standalone: false,
})
export class EstudianteLayout {
  sections = [
    {
      title: 'General',
      items: [{ label: 'Panel principal', route: '/estudiante', icon: 'bi bi-speedometer2', end: true }],
    },
    {
      title: 'Mi progreso',
      items: [
        { label: 'Mis cursos', route: '/estudiante/cursos', icon: 'bi bi-journal-text' },
        { label: 'Mi horario', route: '/estudiante/horario', icon: 'bi bi-clock' },
        { label: 'Mis notas', route: '/estudiante/notas', icon: 'bi bi-clipboard-data' },
        { label: 'Mi asistencia', route: '/estudiante/asistencia', icon: 'bi bi-check-circle' },
      ],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/estudiante/comunicados', icon: 'bi bi-megaphone' }],
    },
    {
      title: 'Cuenta',
      items: [{ label: 'Mi perfil', route: '/estudiante/perfil', icon: 'bi bi-person-circle' }],
    },
  ];
  sidebarOpen = false;
  constructor(public auth: AuthService) {}
}
