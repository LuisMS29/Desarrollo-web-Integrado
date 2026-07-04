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
      items: [{ label: 'Panel principal', route: '/director', icon: '📊', end: true }],
    },
    {
      title: 'Personas',
      items: [
        { label: 'Docentes', route: '/director/docentes', icon: '👨‍🏫' },
        { label: 'Estudiantes', route: '/director/estudiantes', icon: '👨‍🎓' },
      ],
    },
    {
      title: 'Estructura académica',
      items: [
        { label: 'Grados', route: '/director/grados', icon: '📚' },
        { label: 'Secciones', route: '/director/secciones', icon: '🏫' },
        { label: 'Asignaturas', route: '/director/asignaturas', icon: '📝' },
        { label: 'Cursos', route: '/director/cursos', icon: '📖' },
        { label: 'Horarios', route: '/director/horarios', icon: '🕐' },
        { label: 'Períodos académicos', route: '/director/periodos', icon: '📅' },
        { label: 'Períodos de evaluación', route: '/director/evaluaciones', icon: '📋' },
      ],
    },
    {
      title: 'Matrícula',
      items: [{ label: 'Matrículas', route: '/director/matriculas', icon: '📝' }],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/director/comunicados', icon: '📢' }],
    },
  ];
  sidebarOpen = false;
  constructor(public auth: AuthService) {}
}
