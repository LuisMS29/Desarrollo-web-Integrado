import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-buzon-dropdown',
  templateUrl: './buzon-dropdown.html',
  styles: ['.buzon-item{cursor:pointer;transition:background 0.1s}.buzon-item:hover{background:var(--ie-hover)}'],
  standalone: false,
})
export class BuzonDropdown implements OnInit, OnDestroy {
  comunicados: any[] = [];
  total = 0;
  noLeidos = 0;
  open = false;
  leidos: Set<number> = new Set();
  cursosIds: number[] = [];
  private todosFiltrados: any[] = [];
  private interval: any;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCursosIds();
    this.cargarLeidos();
    this.interval = setInterval(() => {
      this.cargarTodo();
      this.cargarLeidos();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private cargarCursosIds(): void {
    const user = this.auth.user();
    if (!user) return;

    if (user.rol === 'DOCENTE' && user.idPerfil) {
      this.api.docentePanel.listarMisCursos(user.idPerfil).subscribe({
        next: (cursos: any) => {
          this.cursosIds = (cursos || []).map((c: any) => c.idCurso);
          this.cargarTodo();
          this.cdr.detectChanges();
        },
        error: () => {},
      });
    } else if (user.rol === 'ESTUDIANTE' && user.idPerfil) {
      this.api.estudiantePanel.listarMisMatriculas(user.idPerfil).subscribe({
        next: (matriculas: any) => {
          const ids = new Set<number>();
          for (const m of (matriculas || [])) {
            if (m.curso?.idCurso && m.estado === 'ACTIVO') ids.add(m.curso.idCurso);
          }
          this.cursosIds = Array.from(ids);
          this.cargarTodo();
          this.cdr.detectChanges();
        },
        error: () => {},
      });
    } else {
      this.cargarTodo();
    }
  }

  private cargarLeidos(): void {
    this.api.comunicados.listarLeidos().subscribe({
      next: (ids: number[]) => {
        this.leidos = new Set(ids || []);
        this.actualizarContador();
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  private actualizarContador(): void {
    this.total = this.todosFiltrados.length;
    this.noLeidos = this.todosFiltrados.filter(c => !this.leidos.has(c.idComunicado)).length;
  }

  estaLeido(id: number): boolean {
    return this.leidos.has(id);
  }

  private esVisible(c: any): boolean {
    if (c.dirigidoA === 'TODOS') return true;
    if (c.dirigidoA === this.auth.user()?.rol) return true;
    if (c.dirigidoA === 'CURSO' && c.curso?.idCurso && this.cursosIds.length > 0) {
      return this.cursosIds.includes(c.curso.idCurso);
    }
    return false;
  }

  private cargarTodo(): void {
    const user = this.auth.user();
    if (!user) return;
    this.api.comunicados.listar().subscribe({
      next: (data: any) => {
        const hoy = new Date().toISOString().slice(0, 10);
        this.todosFiltrados = data
          .filter((c: any) => this.esVisible(c))
          .filter((c: any) => !c.fechaExpiracion || c.fechaExpiracion >= hoy)
          .sort((a: any, b: any) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
        this.comunicados = this.todosFiltrados.slice(0, 5);
        this.actualizarContador();
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  toggle(): void {
    this.open = !this.open;
    if (this.open) {
      // Refresh leídos when opening to get latest count
      this.cargarLeidos();
    }
  }

  irAComunicados(): void {
    this.open = false;
    const rol = this.auth.user()?.rol?.toLowerCase() || 'admin';
    this.router.navigate([`/${rol}/comunicados`]);
  }

  marcarLeido(c: any): void {
    if (!this.estaLeido(c.idComunicado)) {
      this.api.comunicados.marcarLeido(c.idComunicado).subscribe({
        next: () => {
          this.leidos.add(c.idComunicado);
          this.actualizarContador();
          this.cdr.detectChanges();
        },
        error: () => {},
      });
    }
  }

  onClickComunicado(c: any): void {
    this.marcarLeido(c);
    this.irAComunicados();
  }
}
