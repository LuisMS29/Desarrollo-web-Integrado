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
      items: [{ label: 'Panel principal', route: '/estudiante', icon: '📊', end: true }],
    },
    {
      title: 'Mi progreso',
      items: [
        { label: 'Mis cursos', route: '/estudiante/cursos', icon: '📖' },
        { label: 'Mi horario', route: '/estudiante/horario', icon: '🕐' },
        { label: 'Mis notas', route: '/estudiante/notas', icon: '📋' },
        { label: 'Mi asistencia', route: '/estudiante/asistencia', icon: '✅' },
      ],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/estudiante/comunicados', icon: '📢' }],
    },
  ];
  sidebarOpen = false;
  constructor(public auth: AuthService) {}
}
