import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-mis-cursos',
  templateUrl: './mis-cursos.html',
  standalone: false,
})
export class EstudianteMisCursos implements OnInit {
  cursos: any[] = [];
  loading = true;

  get distinctGrados(): number {
    return new Set(this.cursos.map((c: any) => c.grado)).size;
  }

  private cursoIcons = ['bi-book', 'bi-calculator', 'bi-globe2', 'bi-flask', 'bi-pencil-square', 'bi-music-note-beamed', 'bi-palette2', 'bi-activity'];
  private cursoAccents = ['#059669', '#0284c7', '#7c3aed', '#f59e0b', '#ef4444', '#10b981', '#e11d48', '#0891b2'];

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user?.idPerfil) {
      this.api.estudiantePanel.listarMisMatriculas(user.idPerfil).subscribe({
        next: (data: any) => {
          const activas = (data || []).filter((m: any) => m.estado === 'ACTIVO');
          this.cursos = activas.map((m: any, idx: number) => {
            const accent = this.cursoAccents[idx % this.cursoAccents.length];
            return {
              id: m.idMatricula,
              nombre: m.curso?.asignatura?.nombre || '—',
              grado: m.curso?.grado?.nombre || '',
              seccion: m.curso?.seccion?.nombre || '',
              docente: m.curso?.docente
                ? `${m.curso.docente.nombres} ${m.curso.docente.apellidos}`
                : '—',
              horarios: m.curso?.horarios || [],
              icono: this.cursoIcons[idx % this.cursoIcons.length],
              accent,
              label: `${m.curso?.grado?.nombre || ''}${m.curso?.seccion?.nombre || ''}` || '—',
            };
          });
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => { this.loading = false; this.cdr.detectChanges(); }
      });
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
