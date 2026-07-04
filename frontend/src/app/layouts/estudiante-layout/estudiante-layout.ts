import { Component } from '@angular/core';

@Component({
  selector: 'app-estudiante-layout',
  templateUrl: './estudiante-layout.html',
  standalone: false,
})
export class EstudianteLayout {
  navItems = [
    { label: 'Dashboard', route: '/estudiante', icon: '📊' },
    { label: 'Mis cursos', route: '/estudiante/cursos', icon: '📖' },
    { label: 'Mi horario', route: '/estudiante/horario', icon: '🕐' },
    { label: 'Mis notas', route: '/estudiante/notas', icon: '📋' },
    { label: 'Mi asistencia', route: '/estudiante/asistencia', icon: '✅' },
    { label: 'Comunicados', route: '/estudiante/comunicados', icon: '📢' },
  ];
  sidebarOpen = false;
}
