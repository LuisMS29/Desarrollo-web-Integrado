import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-docente-layout',
  templateUrl: './docente-layout.html',
  standalone: false,
})
export class DocenteLayout {
  sections = [
    {
      title: 'General',
      items: [{ label: 'Panel principal', route: '/docente', icon: '📊', end: true }],
    },
    {
      title: 'Mi trabajo',
      items: [
        { label: 'Mis cursos', route: '/docente/cursos', icon: '📖' },
        { label: 'Mi horario', route: '/docente/horario', icon: '🕐' },
        { label: 'Mis estudiantes', route: '/docente/estudiantes', icon: '👨‍🎓' },
      ],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/docente/comunicados', icon: '📢' }],
    },
  ];
  sidebarOpen = false;
  constructor(public auth: AuthService) {}
}
