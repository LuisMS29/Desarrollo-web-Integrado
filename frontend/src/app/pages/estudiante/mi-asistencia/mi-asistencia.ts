import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-estudiante-mi-asistencia',
  templateUrl: './mi-asistencia.html',
  standalone: false,
})
export class EstudianteMiAsistencia implements OnInit {
  asistencias: any[] = [];
  cursos: any[] = [];
  loading = true;
  selectedMatriculaId: number | null = null;
  search = '';
  filteredAgrupadas: any[] = [];

  private cursoIcons = ['bi-book', 'bi-calculator', 'bi-globe2', 'bi-flask', 'bi-pencil-square', 'bi-music-note-beamed', 'bi-palette2', 'bi-activity'];
  private cursoAccents = ['#059669', '#0284c7', '#7c3aed', '#f59e0b', '#ef4444', '#10b981', '#e11d48', '#0891b2'];

  constructor(
    private api: ApiService,
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

  loadData(): void {
    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        if (data?.idEstudiante) {
          this.api.estudiantePanel.listarMisMatriculas(data.idEstudiante).subscribe({
            next: (matriculas: any) => {
              const activas = (matriculas || []).filter((m: any) => m.estado === 'ACTIVO');
              this.cursos = activas.map((m: any, idx: number) => ({
                id: m.idMatricula,
                cursoId: m.curso?.idCurso,
                nombre: m.curso?.asignatura?.nombre || '—',
                grado: m.curso?.grado?.nombre || '',
                seccion: m.curso?.seccion?.nombre || '',
                docente: m.curso?.docente
                  ? `${m.curso.docente.nombres} ${m.curso.docente.apellidos}`
                  : '—',
                icono: this.cursoIcons[idx % this.cursoIcons.length],
                accent: this.cursoAccents[idx % this.cursoAccents.length],
                label: `${m.curso?.grado?.nombre || ''}${m.curso?.seccion?.nombre || ''}` || '—',
                matriculaId: m.idMatricula,
              }));
              if (activas.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
              this.cargarAsistencias(activas);
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

  private cargarAsistencias(matriculas: any[]): void {
    let pendientes = matriculas.length;
    for (const m of matriculas) {
      this.api.asistencias.listarPorMatricula(m.idMatricula).subscribe({
        next: (data: any) => {
          for (const a of (data || [])) {
            this.asistencias.push({ ...a, curso: m.curso, matriculaId: m.idMatricula });
          }
          pendientes--;
          if (pendientes <= 0) {
            this.asistencias.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            this.afterLoad();
          }
        },
        error: () => {
          pendientes--;
          if (pendientes <= 0) {
            this.asistencias.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            this.afterLoad();
          }
        }
      });
    }
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();
    const all = this.agrupadasPorCurso;
    if (!term) {
      this.filteredAgrupadas = all;
    } else {
      this.filteredAgrupadas = all.filter(g =>
        g.curso?.asignatura?.nombre?.toLowerCase().includes(term)
      );
    }
  }

  private afterLoad(): void {
    this.loading = false;
    this.applyFilter();
    this.cdr.detectChanges();
    if (this.selectedMatriculaId) {
      setTimeout(() => {
        const el = document.getElementById('asistencia-curso-' + this.selectedMatriculaId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('mis-curso-highlight');
        }
      }, 300);
    }
  }

  get totalAsistencias(): number { return this.asistencias.length; }
  get presentes(): number { return this.asistencias.filter(a => a.estado === 'PRESENTE').length; }
  get ausentes(): number { return this.asistencias.filter(a => a.estado === 'AUSENTE').length; }
  get tardanzas(): number { return this.asistencias.filter(a => a.estado === 'TARDANZA').length; }
  get justificados(): number { return this.asistencias.filter(a => a.estado === 'JUSTIFICADO').length; }

  get porcentaje(): number {
    if (this.asistencias.length === 0) return 0;
    return Math.round((this.presentes / this.asistencias.length) * 100);
  }

  get estadoGeneral(): string {
    if (this.porcentaje >= 90) return 'Excelente';
    if (this.porcentaje >= 80) return 'Buena';
    if (this.porcentaje >= 70) return 'Regular';
    return 'Preocupante';
  }

  get estadoColor(): string {
    if (this.porcentaje >= 90) return '#059669';
    if (this.porcentaje >= 80) return '#0284c7';
    if (this.porcentaje >= 70) return '#f59e0b';
    return '#ef4444';
  }

  get agrupadasPorCurso(): any[] {
    const map: any = {};
    for (const a of this.asistencias) {
      const key = a.curso?.idCurso || a.matriculaId || 0;
      if (!map[key]) {
        const cursoInfo = this.cursos.find(c => c.matriculaId === a.matriculaId || c.cursoId === a.curso?.idCurso);
        map[key] = { curso: a.curso, asistencias: [], cursoInfo };
      }
      map[key].asistencias.push(a);
    }
    return Object.values(map);
  }

  presentesCount(asistencias: any[]): number {
    return asistencias.filter((x: any) => x.estado === 'PRESENTE').length;
  }

  pctCurso(asistencias: any[]): number {
    if (asistencias.length === 0) return 0;
    return Math.round((this.presentesCount(asistencias) / asistencias.length) * 100);
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'PRESENTE': return 'bi-check-circle-fill';
      case 'TARDANZA': return 'bi-exclamation-circle-fill';
      case 'JUSTIFICADO': return 'bi-question-circle-fill';
      default: return 'bi-x-circle-fill';
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'PRESENTE': return '#059669';
      case 'TARDANZA': return '#f59e0b';
      case 'JUSTIFICADO': return '#0284c7';
      default: return '#ef4444';
    }
  }

  getEstadoBg(estado: string): string {
    switch (estado) {
      case 'PRESENTE': return 'rgba(5,150,105,0.1)';
      case 'TARDANZA': return 'rgba(245,158,11,0.1)';
      case 'JUSTIFICADO': return 'rgba(2,132,199,0.1)';
      default: return 'rgba(239,68,68,0.1)';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PRESENTE': return 'Presente';
      case 'TARDANZA': return 'Tardanza';
      case 'JUSTIFICADO': return 'Justificado';
      default: return 'Ausente';
    }
  }
}
