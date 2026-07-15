import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-mis-notas',
  templateUrl: './mis-notas.html',
  standalone: false,
})
export class EstudianteMisNotas implements OnInit {
  estudiante: any = null;
  matriculas: any[] = [];
  cursos: any[] = [];
  filteredCursos: any[] = [];
  notasPorCurso: any = {};
  loading = true;
  selectedMatriculaId: number | null = null;
  search = '';

  private cursoIcons = ['bi-book', 'bi-calculator', 'bi-globe2', 'bi-flask', 'bi-pencil-square', 'bi-music-note-beamed', 'bi-palette2', 'bi-activity'];
  private cursoAccents = ['#059669', '#0284c7', '#7c3aed', '#f59e0b', '#ef4444', '#10b981', '#e11d48', '#0891b2'];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['matriculaId']) {
        this.selectedMatriculaId = Number(params['matriculaId']);
      }
      this.loadData();
    });
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();
    if (!term) {
      this.filteredCursos = [...this.cursos];
    } else {
      this.filteredCursos = this.cursos.filter(c =>
        c.nombre?.toLowerCase().includes(term)
      );
    }
  }

  loadData(): void {
    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.estudiante = data;
        if (data?.idEstudiante) {
          this.api.estudiantePanel.listarMisMatriculas(data.idEstudiante).subscribe({
            next: (matriculas: any) => {
              this.matriculas = (matriculas || []).filter((m: any) => m.estado === 'ACTIVO');
              this.cursos = this.matriculas.map((m: any, idx: number) => ({
                id: m.idMatricula,
                nombre: m.curso?.asignatura?.nombre || '—',
                grado: m.curso?.grado?.nombre || '',
                seccion: m.curso?.seccion?.nombre || '',
                docente: m.curso?.docente
                  ? `${m.curso.docente.nombres} ${m.curso.docente.apellidos}`
                  : '—',
                icono: this.cursoIcons[idx % this.cursoIcons.length],
                accent: this.cursoAccents[idx % this.cursoAccents.length],
                label: `${m.curso?.grado?.nombre || ''}${m.curso?.seccion?.nombre || ''}` || '—',
              }));
              this.cargarNotas();
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

  private cargarNotas(): void {
    if (this.matriculas.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
    let pendientes = this.matriculas.length;
    for (const m of this.matriculas) {
      this.api.notas.listarPorMatricula(m.idMatricula).subscribe({
        next: (notas: any) => {
          this.notasPorCurso[m.idMatricula] = notas || [];
          pendientes--;
          if (pendientes <= 0) { this.afterLoad(); }
        },
        error: () => {
          this.notasPorCurso[m.idMatricula] = [];
          pendientes--;
          if (pendientes <= 0) { this.afterLoad(); }
        }
      });
    }
  }

  private afterLoad(): void {
    this.loading = false;
    this.applyFilter();
    this.cdr.detectChanges();
    if (this.selectedMatriculaId) {
      setTimeout(() => {
        const el = document.getElementById('notas-curso-' + this.selectedMatriculaId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('mis-curso-highlight');
        }
      }, 300);
    }
  }

  getNotas(matriculaId: number): any[] {
    return this.notasPorCurso[matriculaId] || [];
  }

  promedio(matriculaId: number): number {
    const notas = this.getNotas(matriculaId).filter((n: any) => n.valor != null);
    if (notas.length === 0) return 0;
    return notas.reduce((s: number, n: any) => s + Number(n.valor), 0) / notas.length;
  }

  getNotaColor(valor: number): string {
    if (valor >= 14) return '#059669';
    if (valor >= 11) return '#f59e0b';
    return '#ef4444';
  }

  getNotaBg(valor: number): string {
    if (valor >= 14) return 'rgba(5,150,105,0.1)';
    if (valor >= 11) return 'rgba(245,158,11,0.1)';
    return 'rgba(239,68,68,0.1)';
  }

  getNotaLabel(valor: number): string {
    if (valor >= 18) return 'Excelente';
    if (valor >= 14) return 'Aprobado';
    if (valor >= 11) return 'En observación';
    return 'Desaprobado';
  }

  get promedioGlobal(): number {
    const promedios = this.matriculas
      .map(m => this.promedio(m.idMatricula))
      .filter(p => p > 0);
    if (promedios.length === 0) return 0;
    return promedios.reduce((s, p) => s + p, 0) / promedios.length;
  }

  get distinctCursos(): number {
    return this.cursos.length;
  }

  get totalEvaluaciones(): number {
    return this.matriculas.reduce((s, m) => s + this.getNotas(m.idMatricula).length, 0);
  }

  get totalAprobados(): number {
    return this.matriculas.filter(m => this.promedio(m.idMatricula) >= 14).length;
  }
}
