import { Component } from '@angular/core';

@Component({
  selector: 'app-docente-layout',
  templateUrl: './docente-layout.html',
  standalone: false,
})
export class DocenteLayout {
  navItems = [
    { label: 'Dashboard', route: '/docente', icon: '📊' },
    { label: 'Mis cursos', route: '/docente/cursos', icon: '📖' },
    { label: 'Mis estudiantes', route: '/docente/estudiantes', icon: '👨‍🎓' },
    { label: 'Mi horario', route: '/docente/horario', icon: '🕐' },
    { label: 'Comunicados', route: '/docente/comunicados', icon: '📢' },
  ];
  sidebarOpen = false;
}
