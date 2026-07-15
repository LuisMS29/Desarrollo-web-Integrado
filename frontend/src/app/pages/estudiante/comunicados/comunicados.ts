import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ComunicadosFeed } from '../../../shared/components/comunicados-feed/comunicados-feed';

@Component({
  selector: 'app-estudiante-comunicados',
  templateUrl: './comunicados.html',
  standalone: false,
})
export class EstudianteComunicados implements OnInit {
  @ViewChild(ComunicadosFeed) feed!: ComunicadosFeed;

  cursosIds: number[] = [];
  totalComunicados = 0;
  noLeidos = 0;
  leidosCount = 0;
  paraTi = 0;
  loading = true;
  search = '';
  private leidosSet = new Set<number>();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user?.idPerfil) {
      this.api.estudiantePanel.listarMisMatriculas(user.idPerfil).subscribe({
        next: (matriculas: any) => {
          const ids = new Set<number>();
          for (const m of (matriculas || [])) {
            if (m.curso?.idCurso && m.estado === 'ACTIVO') ids.add(m.curso.idCurso);
          }
          this.cursosIds = Array.from(ids);
          this.cargarDatos();
        },
        error: () => {
          this.cargarDatos();
        }
      });
    } else {
      this.cargarDatos();
    }
  }

  private cargarDatos(): void {
    // Load leídos first, then comunicados
    this.api.comunicados.listarLeidos().subscribe({
      next: (ids: number[]) => {
        this.leidosSet = new Set(ids || []);
        this.cargarComunicados();
      },
      error: () => this.cargarComunicados(),
    });
  }

  private cargarComunicados(): void {
    this.api.comunicados.listar().subscribe({
      next: (data: any) => {
        const hoy = new Date().toISOString().slice(0, 10);
        const visibles = (data || [])
          .filter((c: any) => this.isVisible(c))
          .filter((c: any) => !c.fechaExpiracion || c.fechaExpiracion >= hoy);

        this.totalComunicados = visibles.length;
        this.leidosCount = visibles.filter((c: any) => this.leidosSet.has(c.idComunicado)).length;
        this.noLeidos = this.totalComunicados - this.leidosCount;
        this.paraTi = visibles.filter((c: any) => c.dirigidoA === 'ESTUDIANTE' || c.dirigidoA === 'TODOS').length;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    if (this.feed) {
      this.feed.search = this.search;
      this.feed.applyFilter();
    }
  }

  private isVisible(c: any): boolean {
    if (c.dirigidoA === 'TODOS') return true;
    if (c.dirigidoA === 'ESTUDIANTE') return true;
    if (c.dirigidoA === 'CURSO' && c.curso?.idCurso && this.cursosIds.length > 0) {
      return this.cursosIds.includes(c.curso.idCurso);
    }
    return false;
  }
}
