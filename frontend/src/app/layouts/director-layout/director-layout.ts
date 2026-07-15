import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-director-layout',
  templateUrl: './director-layout.html',
  standalone: false,
})
export class DirectorLayout {
  sections = [
    {
      title: 'General',
      items: [{ label: 'Inicio', route: '/director', icon: 'bi bi-speedometer2', end: true }],
    },
    {
      title: 'Personas',
      items: [
        { label: 'Docentes', route: '/director/docentes', icon: 'bi bi-person-video3' },
        { label: 'Estudiantes', route: '/director/estudiantes', icon: 'bi bi-mortarboard' },
      ],
    },
    {
      title: 'Estructura académica',
      items: [
        { label: 'Grados', route: '/director/grados', icon: 'bi bi-book' },
        { label: 'Secciones', route: '/director/secciones', icon: 'bi bi-building' },
        { label: 'Asignaturas', route: '/director/asignaturas', icon: 'bi bi-pencil-square' },
        { label: 'Cursos', route: '/director/cursos', icon: 'bi bi-journal-text' },
        { label: 'Horarios', route: '/director/horarios', icon: 'bi bi-clock' },
        { label: 'Períodos académicos', route: '/director/periodos', icon: 'bi bi-calendar-event' },
        { label: 'Períodos de evaluación', route: '/director/evaluaciones', icon: 'bi bi-clipboard-data' },
      ],
    },
    {
      title: 'Matrícula',
      items: [{ label: 'Matrículas', route: '/director/matriculas', icon: 'bi bi-card-checklist' }],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/director/comunicados', icon: 'bi bi-megaphone' }],
    },
    {
      title: 'Cuenta',
      items: [{ label: 'Mi perfil', route: '/director/perfil', icon: 'bi bi-person-circle' }],
    },
  ];
  sidebarOpen = false;
  sidebarCollapsed = false;
  constructor(public auth: AuthService) { }
}
