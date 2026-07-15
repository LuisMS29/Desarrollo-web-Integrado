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
      items: [{ label: 'Panel principal', route: '/docente', icon: 'bi bi-speedometer2', end: true }],
    },
    {
      title: 'Mi trabajo',
      items: [
        { label: 'Mis cursos', route: '/docente/cursos', icon: 'bi bi-journal-text' },
        { label: 'Mi horario', route: '/docente/horario', icon: 'bi bi-clock' },
        { label: 'Mis estudiantes', route: '/docente/estudiantes', icon: 'bi bi-mortarboard' },
      ],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/docente/comunicados', icon: 'bi bi-megaphone' }],
    },
    {
      title: 'Cuenta',
      items: [{ label: 'Mi perfil', route: '/docente/perfil', icon: 'bi bi-person-circle' }],
    },
  ];
  sidebarOpen = false;
  constructor(public auth: AuthService) {}
}
