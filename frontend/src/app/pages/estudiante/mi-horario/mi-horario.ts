import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-mi-horario',
  templateUrl: './mi-horario.html',
  standalone: false,
})
export class EstudianteMiHorario implements OnInit {
  matriculas: any[] = [];
  horarios: any[] = [];
  loading = true;
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const user = this.auth.user();
    if (!user?.idPerfil) { this.loading = false; return; }

    this.api.estudiantePanel.listarMisMatriculas(user.idPerfil).subscribe({
      next: (data: any) => {
        this.matriculas = (data || []).filter((m: any) => m.estado === 'ACTIVO');
        if (this.matriculas.length === 0) { this.loading = false; return; }
        Promise.allSettled(this.matriculas.map((m: any) => new Promise(res => this.api.horariosListarPorCurso(m.curso.idCurso).subscribe({ next: (d: any) => res({ matricula: m, horarios: d }), error: () => res({ matricula: m, horarios: [] }) }))))
          .then((results: any) => {
            this.horarios = [];
            for (const r of results) {
              if (r.status === 'fulfilled') {
                for (const h of (r.value.horarios || [])) {
                  this.horarios.push({ ...h, curso: r.value.matricula.curso });
                }
              }
            }
            this.loading = false;
          });
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
