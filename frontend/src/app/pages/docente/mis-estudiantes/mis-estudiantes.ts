import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-docente-mis-estudiantes',
  templateUrl: './mis-estudiantes.html',
  standalone: false,
})
export class DocenteMisEstudiantes implements OnInit {
  filas: any[] = [];
  filtered: any[] = [];
  loading = true;
  error = '';
  search = '';
  cursoFilter = 'TODOS';
  sortField = 'apellidos';
  sortDir: 'asc' | 'desc' = 'asc';
  cursos: any[] = [];

  cursoGradients: string[] = [
    'linear-gradient(135deg, #0284c7, #38bdf8)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #f43f5e, #fb7185)',
    'linear-gradient(135deg, #14b8a6, #5eead4)',
  ];

  cursoColors: string[] = [
    '#0284c7', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#14b8a6',
  ];

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  get totalEstudiantes(): number {
    return this.filas.length;
  }

  get promPorCurso(): number {
    return this.cursos.length > 0 ? Math.round(this.filas.length / this.cursos.length) : 0;
  }

  getCursoIndex(curso: any): number {
    return this.cursos.findIndex(c => c.idCurso === curso?.idCurso);
  }

  getCursoGradient(curso: any): string {
    const idx = this.getCursoIndex(curso);
    return this.cursoGradients[Math.max(0, idx) % this.cursoGradients.length];
  }

  getBadgeBg(curso: any): string {
    const idx = this.getCursoIndex(curso);
    const color = this.cursoColors[Math.max(0, idx) % this.cursoColors.length];
    return `${color}18`;
  }

  getBadgeColor(curso: any): string {
    const idx = this.getCursoIndex(curso);
    return this.cursoColors[Math.max(0, idx) % this.cursoColors.length];
  }

  getAvatarColor(nombres: string, apellidos: string): string {
    const colors = [
      'linear-gradient(135deg, #0284c7, #38bdf8)',
      'linear-gradient(135deg, #10b981, #34d399)',
      'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      'linear-gradient(135deg, #f59e0b, #fbbf24)',
      'linear-gradient(135deg, #f43f5e, #fb7185)',
      'linear-gradient(135deg, #14b8a6, #5eead4)',
      'linear-gradient(135deg, #ec4899, #f472b6)',
      'linear-gradient(135deg, #6366f1, #818cf8)',
    ];
    const seed = ((nombres?.charCodeAt(0) || 65) * 7 + (apellidos?.charCodeAt(0) || 65) * 13) % colors.length;
    return colors[Math.abs(seed)];
  }

  getIniciales(nombres: string, apellidos: string): string {
    return ((nombres?.charAt(0) || '?') + (apellidos?.charAt(0) || '')).toUpperCase();
  }

  private loadData(): void {
    const user = this.auth.user();
    if (!user?.idPerfil) { this.loading = false; this.cdr.detectChanges(); return; }

    this.api.docentePanel.listarMisCursos(user.idPerfil).subscribe({
      next: (cursos: any) => {
        this.cursos = cursos;
        if (cursos.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
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
          const consolidado: any[] = [];
          results.forEach((r: any, idx) => {
            const curso = cursos[idx];
            (r.status === 'fulfilled' ? r.value || [] : [])
              .filter((m: any) => m.estado === 'ACTIVO')
              .forEach((m: any) => {
                consolidado.push({ idMatricula: m.idMatricula, estudiante: m.estudiante, curso });
              });
          });
          this.filas = consolidado;
          this.applyFilter();
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  applyFilter(): void {
    let result = [...this.filas];
    const term = this.search.trim().toLowerCase();
    if (term) {
      result = result.filter(f =>
        `${f.estudiante?.nombres} ${f.estudiante?.apellidos} ${f.estudiante?.codigoEstudiante}`
          .toLowerCase().includes(term)
      );
    }
    if (this.cursoFilter !== 'TODOS') {
      result = result.filter(f => f.curso.idCurso === Number(this.cursoFilter));
    }
    if (this.sortField === 'apellidos') {
      result.sort((a, b) => {
        const va = `${a.estudiante?.apellidos || ''} ${a.estudiante?.nombres || ''}`.toLowerCase();
        const vb = `${b.estudiante?.apellidos || ''} ${b.estudiante?.nombres || ''}`.toLowerCase();
        return this.sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    } else if (this.sortField === 'curso') {
      result.sort((a, b) => {
        const va = `${a.curso?.asignatura?.nombre || ''}`.toLowerCase();
        const vb = `${b.curso?.asignatura?.nombre || ''}`.toLowerCase();
        return this.sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    this.filtered = result;
  }
}
