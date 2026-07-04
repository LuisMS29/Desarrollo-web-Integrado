import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  standalone: false,
})
export class AdminLayout {
  sections = [
    {
      title: 'General',
      items: [{ label: 'Panel principal', route: '/admin', icon: '📊', end: true }],
    },
    {
      title: 'Cuentas',
      items: [{ label: 'Usuarios y roles', route: '/admin/usuarios', icon: '👥' }],
    },
    {
      title: 'Personas',
      items: [
        { label: 'Docentes', route: '/admin/docentes', icon: '👨‍🏫' },
        { label: 'Estudiantes', route: '/admin/estudiantes', icon: '👨‍🎓' },
      ],
    },
    {
      title: 'Estructura académica',
      items: [
        { label: 'Grados', route: '/admin/grados', icon: '📚' },
        { label: 'Secciones', route: '/admin/secciones', icon: '🏫' },
        { label: 'Asignaturas', route: '/admin/asignaturas', icon: '📝' },
        { label: 'Cursos', route: '/admin/cursos', icon: '📖' },
        { label: 'Períodos académicos', route: '/admin/periodos', icon: '📅' },
      ],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/admin/comunicados', icon: '📢' }],
    },
  ];
  sidebarOpen = false;
  constructor(public auth: AuthService) {}
}
