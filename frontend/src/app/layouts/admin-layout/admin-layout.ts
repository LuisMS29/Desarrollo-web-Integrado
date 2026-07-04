import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  standalone: false,
})
export class AdminLayout {
  navItems = [
    { label: 'Dashboard', route: '/admin', icon: '📊' },
    { label: 'Usuarios', route: '/admin/usuarios', icon: '👥' },
    { label: 'Docentes', route: '/admin/docentes', icon: '👨‍🏫' },
    { label: 'Estudiantes', route: '/admin/estudiantes', icon: '👨‍🎓' },
    { label: 'Grados', route: '/admin/grados', icon: '📚' },
    { label: 'Secciones', route: '/admin/secciones', icon: '🏫' },
    { label: 'Asignaturas', route: '/admin/asignaturas', icon: '📝' },
    { label: 'Cursos', route: '/admin/cursos', icon: '📖' },
    { label: 'Períodos', route: '/admin/periodos', icon: '📅' },
    { label: 'Comunicados', route: '/admin/comunicados', icon: '📢' },
  ];
  sidebarOpen = false;
}
