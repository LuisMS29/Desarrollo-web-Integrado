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

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const user = this.auth.user();
    if (!user?.idPerfil) { this.loading = false; this.cdr.detectChanges(); return; }

    this.api.docentePanel.listarMisCursos(user.idPerfil).subscribe({
      next: (cursos: any) => {
        this.cursos = cursos;
        if (cursos.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
        Promise.allSettled(cursos.map((c: any) => new Promise(res => this.api.matriculasListarPorCurso(c.idCurso).subscribe({ next: (d: any) => res(d), error: () => res([]) }))))
          .then(results => {
            const consolidado: any[] = [];
            results.forEach((r: any, idx) => {
              const curso = cursos[idx];
              (r.status === 'fulfilled' ? r.value || [] : []).filter((m: any) => m.estado === 'ACTIVO').forEach((m: any) => {
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
    if (term) result = result.filter(f => `${f.estudiante?.nombres} ${f.estudiante?.apellidos} ${f.estudiante?.codigoEstudiante}`.toLowerCase().includes(term));
    if (this.cursoFilter !== 'TODOS') result = result.filter(f => f.curso.idCurso === Number(this.cursoFilter));
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
