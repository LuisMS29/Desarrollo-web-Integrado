import { Component } from '@angular/core';

@Component({
  selector: 'app-director-layout',
  templateUrl: './director-layout.html',
  standalone: false,
})
export class DirectorLayout {
  navItems = [
    { label: 'Dashboard', route: '/director', icon: '📊' },
    { label: 'Docentes', route: '/director/docentes', icon: '👨‍🏫' },
    { label: 'Estudiantes', route: '/director/estudiantes', icon: '👨‍🎓' },
    { label: 'Grados', route: '/director/grados', icon: '📚' },
    { label: 'Secciones', route: '/director/secciones', icon: '🏫' },
    { label: 'Asignaturas', route: '/director/asignaturas', icon: '📝' },
    { label: 'Cursos', route: '/director/cursos', icon: '📖' },
    { label: 'Horarios', route: '/director/horarios', icon: '🕐' },
    { label: 'Períodos', route: '/director/periodos', icon: '📅' },
    { label: 'Evaluaciones', route: '/director/evaluaciones', icon: '📋' },
    { label: 'Matrículas', route: '/director/matriculas', icon: '📝' },
    { label: 'Comunicados', route: '/director/comunicados', icon: '📢' },
  ];
  sidebarOpen = false;
}
