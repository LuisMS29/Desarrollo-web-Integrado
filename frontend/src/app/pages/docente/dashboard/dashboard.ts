import { Component, OnInit } from '@angular/core';
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
  loading = true;
  loadingEst = true;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.docentePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.docente = data;
        if (data?.idDocente) {
          this.api.docentePanel.listarMisCursos(data.idDocente).subscribe({
            next: (cursos: any) => {
              this.cursos = cursos;
              this.loading = false;
              this.loadEstudiantes(cursos);
            },
            error: () => this.loading = false
          });
        } else {
          this.loading = false;
        }
      },
      error: () => this.loading = false
    });
  }

  private loadEstudiantes(cursos: any[]): void {
    if (cursos.length === 0) { this.loadingEst = false; return; }
    Promise.allSettled(cursos.map((c: any) => new Promise(res => this.api.matriculasListarPorCurso(c.idCurso).subscribe({ next: (d: any) => res(d), error: () => res([]) }))))
      .then(results => {
        this.estudiantesPorCurso = results.map((r: any, idx) => ({
          curso: cursos[idx],
          count: r.status === 'fulfilled' ? (r.value || []).filter((m: any) => m.estado === 'ACTIVO').length : 0,
        }));
        this.loadingEst = false;
      });
  }

  totalEstudiantes(): number {
    return this.estudiantesPorCurso.reduce((s, e) => s + e.count, 0);
  }

  maxEst(): number {
    return Math.max(1, ...this.estudiantesPorCurso.map((e: any) => e.count));
  }
}
