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
      items: [{ label: 'Panel principal', route: '/admin', icon: 'bi bi-speedometer2', end: true }],
    },
    {
      title: 'Cuentas',
      items: [{ label: 'Usuarios y roles', route: '/admin/usuarios', icon: 'bi bi-people' }],
    },
    {
      title: 'Personas',
      items: [
        { label: 'Docentes', route: '/admin/docentes', icon: 'bi bi-person-video3' },
        { label: 'Estudiantes', route: '/admin/estudiantes', icon: 'bi bi-mortarboard' },
      ],
    },
    {
      title: 'Estructura académica',
      items: [
        { label: 'Grados', route: '/admin/grados', icon: 'bi bi-book' },
        { label: 'Secciones', route: '/admin/secciones', icon: 'bi bi-building' },
        { label: 'Asignaturas', route: '/admin/asignaturas', icon: 'bi bi-pencil-square' },
        { label: 'Cursos', route: '/admin/cursos', icon: 'bi bi-journal-text' },
        { label: 'Períodos académicos', route: '/admin/periodos', icon: 'bi bi-calendar-event' },
      ],
    },
    {
      title: 'Comunicación',
      items: [{ label: 'Comunicados', route: '/admin/comunicados', icon: 'bi bi-megaphone' }],
    },
    {
      title: 'Cuenta',
      items: [{ label: 'Mi perfil', route: '/admin/perfil', icon: 'bi bi-person-circle' }],
    },
  ];
  sidebarOpen = false;
  fotoErrored = false;
  profileOpen = false;

  fotoError(): void {
    this.fotoErrored = true;
    this.auth.clearFotoUrl();
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
  }

  closeProfile(): void {
    this.profileOpen = false;
  }

  constructor(public auth: AuthService) {}
}
