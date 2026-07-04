import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-docente-mis-cursos',
  templateUrl: './mis-cursos.html',
  standalone: false,
})
export class DocenteMisCursos implements OnInit {
  cursos: any[] = [];
  horariosPorCurso: any = {};
  loading = true;
  loadingHorarios = true;
  dias = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user?.idPerfil) {
      this.api.docentePanel.listarMisCursos(user.idPerfil).subscribe({
        next: (data: any) => {
          this.cursos = data;
          this.loading = false;
          this.loadHorarios(data);
        },
        error: () => this.loading = false
      });
    } else {
      this.loading = false;
    }
  }

  private loadHorarios(cursos: any[]): void {
    if (cursos.length === 0) { this.loadingHorarios = false; return; }
    Promise.allSettled(cursos.map((c: any) => new Promise(res => this.api.horariosListarPorCurso(c.idCurso).subscribe({ next: (d: any) => res(d), error: () => res([]) }))))
      .then(results => {
        const map: any = {};
        results.forEach((r: any, idx) => { map[cursos[idx].idCurso] = r.status === 'fulfilled' ? r.value : []; });
        this.horariosPorCurso = map;
        this.loadingHorarios = false;
      });
  }
}
