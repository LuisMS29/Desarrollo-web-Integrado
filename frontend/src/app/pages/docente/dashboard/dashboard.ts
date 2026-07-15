import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-docente-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
})
export class DocenteDashboard implements OnInit {
  docente: any = null;
  cursos: any[] = [];
  estudiantesPorCurso: any[] = [];
  loading = true;
  loadingEst = true;
  greeting = 'Bienvenido';
  greetingIcon = 'bi-hand-wave';

  auth = inject(AuthService);

  gradeColors: Record<string, string> = {
    '1°': '#10b981',
    '2°': '#0ea5e9',
    '3°': '#8b5cf6',
    '4°': '#f59e0b',
    '5°': '#f43f5e',
  };

  getGradeColor(grado: string): string {
    for (const [key, color] of Object.entries(this.gradeColors)) {
      if (grado?.startsWith(key)) return color;
    }
    return '#64748b';
  }

  get promedioPorCurso(): number {
    return this.cursos.length > 0 ? Math.round(this.totalEstudiantes() / this.cursos.length) : 0;
  }

  quickActions = [
    {
      route: '/docente/cursos',
      icon: 'bi-journal-bookmark-fill',
      title: 'Ver mis cursos',
      desc: 'Consulta el detalle y horario de cada curso',
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    },
    {
      route: '/docente/estudiantes',
      icon: 'bi-people-fill',
      title: 'Mis estudiantes',
      desc: 'Lista consolidada de alumnos a tu cargo',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      route: '/docente/comunicados',
      icon: 'bi-megaphone-fill',
      title: 'Comunicados',
      desc: 'Avisos institucionales dirigidos a docentes',
      gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    },
  ];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const h = new Date().getHours();
    if (h < 12) { this.greeting = 'Buenos días'; this.greetingIcon = 'bi-sunrise'; }
    else if (h < 18) { this.greeting = 'Buenas tardes'; this.greetingIcon = 'bi-sun'; }
    else { this.greeting = 'Buenas noches'; this.greetingIcon = 'bi-moon-stars'; }

    this.api.docentePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.docente = data;
        if (data?.idDocente) {
          this.api.docentePanel.listarMisCursos(data.idDocente).subscribe({
            next: (cursos: any) => {
              this.cursos = cursos;
              this.loading = false;
              this.cdr.detectChanges();
              this.loadEstudiantes(cursos);
            },
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

  private loadEstudiantes(cursos: any[]): void {
    if (cursos.length === 0) { this.loadingEst = false; this.cdr.detectChanges(); return; }
    Promise.allSettled(cursos.map((c: any) => new Promise(res => this.api.matriculasListarPorCurso(c.idCurso).subscribe({ next: (d: any) => res(d), error: () => res([]) }))))
      .then(results => {
        this.estudiantesPorCurso = results.map((r: any, idx) => ({
          curso: cursos[idx],
          count: r.status === 'fulfilled' ? (r.value || []).filter((m: any) => m.estado === 'ACTIVO').length : 0,
        }));
        this.loadingEst = false;
        this.cdr.detectChanges();
      });
  }

  totalEstudiantes(): number {
    return this.estudiantesPorCurso.reduce((s, e) => s + e.count, 0);
  }

  maxEst(): number {
    return Math.max(1, ...this.estudiantesPorCurso.map((e: any) => e.count));
  }

  getSubjectIconStyle(grado: string): Record<string, string> {
    const c = this.getGradeColor(grado);
    return {
      'background': `${c}18`,
      'color': c,
      'border-color': `${c}30`,
    };
  }
}
