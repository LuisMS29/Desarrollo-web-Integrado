import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
})
export class EstudianteDashboard implements OnInit {
  estudiante: any = null;
  matriculas: any[] = [];
  loading = true;
  greeting = 'Bienvenido';
  greetingIcon = 'bi-hand-wave';

  auth = inject(AuthService);

  quickActions = [
    {
      route: '/estudiante/cursos',
      icon: 'bi-journal-bookmark-fill',
      title: 'Mis cursos',
      desc: 'Revisa tus cursos, docentes y horarios',
      gradient: 'linear-gradient(135deg, #059669, #34d399)',
    },
    {
      route: '/estudiante/notas',
      icon: 'bi-clipboard-data-fill',
      title: 'Mis notas',
      desc: 'Consulta tus calificaciones por bimestre',
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    },
    {
      route: '/estudiante/asistencia',
      icon: 'bi-calendar-check-fill',
      title: 'Mi asistencia',
      desc: 'Verifica tu porcentaje de asistencia',
      gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    },
    {
      route: '/estudiante/comunicados',
      icon: 'bi-megaphone-fill',
      title: 'Comunicados',
      desc: 'Avisos del colegio dirigidos a estudiantes',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
  ];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const h = new Date().getHours();
    if (h < 12) { this.greeting = 'Buenos días'; this.greetingIcon = 'bi-sunrise'; }
    else if (h < 18) { this.greeting = 'Buenas tardes'; this.greetingIcon = 'bi-sun'; }
    else { this.greeting = 'Buenas noches'; this.greetingIcon = 'bi-moon-stars'; }

    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.estudiante = data;
        if (data?.idEstudiante) {
          this.api.estudiantePanel.listarMisMatriculas(data.idEstudiante).subscribe({
            next: (mat: any) => { this.matriculas = mat; this.loading = false; this.cdr.detectChanges(); },
            error: () => { this.loading = false; this.cdr.detectChanges(); }
          });
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  get activas(): any[] {
    return this.matriculas.filter((m: any) => m.estado === 'ACTIVO');
  }

  get grados(): { grado: string; count: number }[] {
    const agrupadas: any = {};
    this.activas.forEach((m: any) => {
      const key = m.curso?.grado?.nombre || '—';
      agrupadas[key] = (agrupadas[key] || 0) + 1;
    });
    return Object.entries(agrupadas).map(([grado, count]) => ({ grado, count: count as number }));
  }

  maxGrado(): number {
    return Math.max(1, ...this.grados.map(g => g.count));
  }
}
