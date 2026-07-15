import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-comunicados-feed',
  templateUrl: './comunicados-feed.html',
  standalone: false,
})
export class ComunicadosFeed implements OnChanges {
  @Input() rolActual = '';
  @Input() key = 0;
  @Input() cursosIds: number[] = [];
  comunicados: any[] = [];
  filtered: any[] = [];
  loading = true;
  error = '';
  search = '';
  leidos: Set<number> = new Set();

  comColors = [
    'linear-gradient(135deg, #7c3aed, #a855f7)',
    'linear-gradient(135deg, #0284c7, #38bdf8)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #f43f5e, #fb7185)',
  ];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolActual'] || changes['key'] || changes['cursosIds']) {
      this.load();
    }
  }

  private cargarLeidos(): void {
    this.api.comunicados.listarLeidos().subscribe({
      next: (ids: number[]) => {
        this.leidos = new Set(ids || []);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  estaLeido(id: number): boolean {
    return this.leidos.has(id);
  }

  load(): void {
    this.loading = true;
    this.cargarLeidos();
    this.api.comunicados.listar().subscribe({
      next: (data: any) => {
        const hoy = new Date().toISOString().slice(0, 10);
        this.comunicados = data
          .filter((c: any) => this.isVisible(c))
          .filter((c: any) => !c.fechaExpiracion || c.fechaExpiracion >= hoy)
          .sort((a: any, b: any) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.friendlyMessage || 'No se pudieron cargar los comunicados.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private isVisible(c: any): boolean {
    // TODOS lo ven
    if (c.dirigidoA === 'TODOS') return true;
    // Coincide con el rol del usuario
    if (c.dirigidoA === this.rolActual) return true;
    // CURSO: solo visible si el usuario es estudiante y está en ese curso
    if (c.dirigidoA === 'CURSO' && c.curso?.idCurso && this.cursosIds.length > 0) {
      return this.cursosIds.includes(c.curso.idCurso);
    }
    return false;
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();
    this.filtered = !term ? this.comunicados : this.comunicados.filter(
      (c) => c.titulo?.toLowerCase().includes(term) || c.contenido?.toLowerCase().includes(term)
    );
  }

  marcarLeido(c: any): void {
    if (!this.estaLeido(c.idComunicado)) {
      this.api.comunicados.marcarLeido(c.idComunicado).subscribe({
        next: () => {
          this.leidos.add(c.idComunicado);
          this.cdr.detectChanges();
        },
        error: () => {},
      });
    }
  }

  getComColor(titulo: string): string {
    let hash = 0;
    for (let i = 0; i < (titulo || '').length; i++) {
      hash = titulo.charCodeAt(i) + ((hash << 5) - hash);
    }
    return this.comColors[Math.abs(hash) % this.comColors.length];
  }

  dirigidoALabel(c: any): string {
    if (c.dirigidoA === 'CURSO' && c.curso) {
      const g = c.curso.grado?.nombre || '';
      const s = c.curso.seccion?.nombre || '';
      const a = c.curso.asignatura?.nombre || '';
      return a ? `${a} - ${g}${s}` : `Curso`;
    }
    switch (c.dirigidoA) {
      case 'TODOS': return 'Todos';
      case 'DOCENTE': return 'Docentes';
      case 'ESTUDIANTE': return 'Estudiantes';
      case 'DIRECTOR': return 'Directores';
      default: return c.dirigidoA?.charAt(0) + c.dirigidoA?.slice(1).toLowerCase() || '—';
    }
  }
}
