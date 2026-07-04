import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-docente-mi-horario',
  templateUrl: './mi-horario.html',
  standalone: false,
})
export class DocenteMiHorario implements OnInit {
  docente: any = null;
  horarios: any[] = [];
  loading = true;
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.docentePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.docente = data;
        if (data?.idDocente) {
          this.api.docentePanel.listarMisCursos(data.idDocente).subscribe({
            next: (cursos: any) => {
              if (cursos.length === 0) { this.loading = false; return; }
              Promise.allSettled(cursos.map((c: any) => new Promise(res => this.api.horariosListarPorCurso(c.idCurso).subscribe({ next: (d: any) => res({ curso: c, horarios: d }), error: () => res({ curso: c, horarios: [] }) }))))
                .then((results: any) => {
                  this.horarios = [];
                  for (const r of results) {
                    if (r.status === 'fulfilled') {
                      for (const h of (r.value.horarios || [])) {
                        this.horarios.push({ ...h, curso: r.value.curso });
                      }
                    }
                  }
                  this.loading = false;
                });
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

  getHorarioForDay(dia: number): any[] {
    return this.horarios.filter(h => h.diaSemana === dia)
      .sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));
  }

  get diaColumns(): number[] {
    return [1, 2, 3, 4, 5, 6];
  }
}
