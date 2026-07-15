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
  comunicados: any[] = [];
  loading = true;
  greeting = 'Bienvenido';
  greetingIcon = 'bi-hand-wave';

  auth = inject(AuthService);

  cursoGradients = [
    'linear-gradient(135deg, #0284c7, #38bdf8)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #f43f5e, #fb7185)',
    'linear-gradient(135deg, #14b8a6, #5eead4)',
  ];

  cursoBarColors = [
    '#0284c7',
    '#10b981',
    '#8b5cf6',
    '#f59e0b',
    '#f43f5e',
    '#14b8a6',
  ];

  cursoBarLightColors = [
    '#38bdf8',
    '#34d399',
    '#a78bfa',
    '#fbbf24',
    '#fb7185',
    '#5eead4',
  ];

  get promedioPorCurso(): number {
    return this.cursos.length > 0 ? Math.round(this.totalEstudiantes() / this.cursos.length) : 0;
  }

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const h = new Date().getHours();
    if (h < 12) { this.greeting = 'Buenos días'; this.greetingIcon = 'bi-sunrise'; }
    else if (h < 18) { this.greeting = 'Buenas tardes'; this.greetingIcon = 'bi-sun'; }
    else { this.greeting = 'Buenas noches'; this.greetingIcon = 'bi-moon-stars'; }

    this.loadComunicados();
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

  private loadComunicados(): void {
    this.api.comunicados.listar().subscribe({
      next: (data: any) => {
        this.comunicados = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  private loadEstudiantes(cursos: any[]): void {
    if (cursos.length === 0) { this.cdr.detectChanges(); return; }
    Promise.allSettled(
      cursos.map((c: any) =>
        new Promise(res =>
          this.api.matriculasListarPorCurso(c.idCurso).subscribe({
            next: (d: any) => res(d),
            error: () => res([]),
          })
        )
      )
    ).then(results => {
      this.estudiantesPorCurso = results.map((r: any, idx) => ({
        curso: cursos[idx],
        count: r.status === 'fulfilled' ? (r.value || []).filter((m: any) => m.estado === 'ACTIVO').length : 0,
      }));
      this.cdr.detectChanges();
    });
  }

  totalEstudiantes(): number {
    return this.estudiantesPorCurso.reduce((s, e) => s + e.count, 0);
  }

  maxEst(): number {
    return Math.max(1, ...this.estudiantesPorCurso.map((e: any) => e.count));
  }

  getComColor(titulo: string): string {
    const colors = ['#7c3aed', '#0284c7', '#10b981', '#f59e0b'];
    let hash = 0;
    for (let i = 0; i < (titulo || '').length; i++) {
      hash = titulo.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getComColorLight(titulo: string): string {
    const colors = ['#a855f7', '#38bdf8', '#34d399', '#fbbf24'];
    let hash = 0;
    for (let i = 0; i < (titulo || '').length; i++) {
      hash = titulo.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
}
