import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-docente-mis-cursos',
  templateUrl: './mis-cursos.html',
  standalone: false,
})
export class DocenteMisCursos implements OnInit {
  cursos: any[] = [];
  filteredCursos: any[] = [];
  horariosPorCurso: any = {};
  estudiantesPorCurso: Record<number, number> = {};
  loading = true;
  loadingHorarios = true;

  searchQuery = '';
  activeFilter = 'todos';
  gradosDisponibles: string[] = [];

  totalEstudiantes = 0;
  cursosConHorario = 0;
  maxEstudiantes = 0;

  dias = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  cursoGradients = [
    'linear-gradient(135deg, #0284c7, #38bdf8)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #f43f5e, #fb7185)',
    'linear-gradient(135deg, #14b8a6, #5eead4)',
  ];

  cursoIcons = [
    'bi-book',
    'bi-calculator',
    'bi-globe',
    'bi-flask',
    'bi-palette',
    'bi-music-note',
  ];

  cursoBarColors = [
    '#0284c7',
    '#10b981',
    '#8b5cf6',
    '#f59e0b',
    '#f43f5e',
    '#14b8a6',
  ];

  private searchTimeout: any;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    clearTimeout(this.searchTimeout);
  }

  ngOnInit(): void {
    const user = this.auth.user();
    if (user?.idPerfil) {
      this.api.docentePanel.listarMisCursos(user.idPerfil).subscribe({
        next: (data: any) => {
          this.cursos = data;
          this.filteredCursos = [...data];
          this.extractGrados(data);
          this.loading = false;
          this.cdr.detectChanges();
          this.loadHorarios(data);
          this.loadEstudiantes(data);
        },
        error: () => { this.loading = false; this.cdr.detectChanges(); }
      });
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private extractGrados(cursos: any[]): void {
    const set = new Set<string>();
    for (const c of cursos) {
      const g = c.grado?.nombre;
      if (g) set.add(g);
    }
    this.gradosDisponibles = Array.from(set).sort();
  }

  setFilter(grado: string): void {
    this.activeFilter = grado;
    this.applyFilters();
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.applyFilters(), 200);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    const q = (this.searchQuery || '').toLowerCase().trim();
    this.filteredCursos = this.cursos.filter(c => {
      if (this.activeFilter !== 'todos' && c.grado?.nombre !== this.activeFilter) return false;
      if (q && !(c.asignatura?.nombre || '').toLowerCase().includes(q)) return false;
      return true;
    });
    this.cdr.detectChanges();
  }

  getGradoCount(grado: string): number {
    return this.cursos.filter(c => c.grado?.nombre === grado).length;
  }

  getIconBg(index: number): string {
    const colors = ['#0284c722', '#10b98122', '#8b5cf622', '#f59e0b22', '#f43f5e22', '#14b8a622'];
    return colors[index % colors.length];
  }

  getIconColor(index: number): string {
    return this.cursoBarColors[index % this.cursoBarColors.length];
  }

  getBadgeBg(index: number): string {
    return this.getIconBg(index);
  }

  getDiaColor(diaSemana: number): { bg: string; text: string } {
    const colors = [
      { bg: '#eff6ff', text: '#1d4ed8' },
      { bg: '#f0fdf4', text: '#15803d' },
      { bg: '#fefce8', text: '#a16207' },
      { bg: '#fef2f2', text: '#b91c1c' },
      { bg: '#faf5ff', text: '#7c3aed' },
      { bg: '#f8fafc', text: '#475569' },
    ];
    return colors[Math.min(diaSemana - 1, colors.length - 1)] ?? colors[0];
  }

  private loadHorarios(cursos: any[]): void {
    if (cursos.length === 0) { this.loadingHorarios = false; this.cdr.detectChanges(); return; }
    Promise.allSettled(
      cursos.map((c: any) =>
        new Promise(res => this.api.horariosListarPorCurso(c.idCurso).subscribe({
          next: (d: any) => res(d),
          error: () => res([]),
        }))
      )
    ).then(results => {
      const map: any = {};
      let conHorario = 0;
      results.forEach((r: any, idx) => {
        const horarios = r.status === 'fulfilled' ? r.value : [];
        map[cursos[idx].idCurso] = horarios;
        if (horarios.length > 0) conHorario++;
      });
      this.horariosPorCurso = map;
      this.cursosConHorario = conHorario;
      this.loadingHorarios = false;
      this.cdr.detectChanges();
    });
  }

  private loadEstudiantes(cursos: any[]): void {
    if (cursos.length === 0) return;
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
      const map: Record<number, number> = {};
      let total = 0;
      let max = 0;
      results.forEach((r: any, idx) => {
        const count = r.status === 'fulfilled'
          ? (r.value || []).filter((m: any) => m.estado === 'ACTIVO').length
          : 0;
        map[cursos[idx].idCurso] = count;
        total += count;
        if (count > max) max = count;
      });
      this.estudiantesPorCurso = map;
      this.totalEstudiantes = total;
      this.maxEstudiantes = max;
      this.cdr.detectChanges();
    });
  }
}
