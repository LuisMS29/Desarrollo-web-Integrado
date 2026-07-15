import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-estudiante-mi-horario',
  templateUrl: './mi-horario.html',
  standalone: false,
})
export class EstudianteMiHorario implements OnInit {
  horarios: any[] = [];
  loading = true;

  private cursoIcons = ['bi-book', 'bi-calculator', 'bi-globe2', 'bi-flask', 'bi-pencil-square', 'bi-music-note-beamed', 'bi-palette2', 'bi-activity'];
  private cursoAccents = ['#059669', '#0284c7', '#7c3aed', '#f59e0b', '#ef4444', '#10b981', '#e11d48', '#0891b2'];

  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        if (data?.idEstudiante) {
          this.api.estudiantePanel.listarMisMatriculas(data.idEstudiante).subscribe({
            next: (matriculas: any) => {
              const activas = (matriculas || []).filter((m: any) => m.estado === 'ACTIVO');
              if (activas.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
              Promise.allSettled(activas.map((m: any, idx: number) => new Promise(res =>
                this.api.horariosListarPorCurso(m.curso.idCurso).subscribe({
                  next: (d: any) => res({
                    matricula: m,
                    horarios: d,
                    icono: this.cursoIcons[idx % this.cursoIcons.length],
                    accent: this.cursoAccents[idx % this.cursoAccents.length],
                  }),
                  error: () => res({ matricula: m, horarios: [], icono: this.cursoIcons[idx % this.cursoIcons.length], accent: this.cursoAccents[idx % this.cursoAccents.length] })
                })
              )))
                .then((results: any) => {
                  this.horarios = [];
                  for (const r of results) {
                    if (r.status === 'fulfilled') {
                      for (const h of (r.value.horarios || [])) {
                        this.horarios.push({
                          ...h,
                          curso: r.value.matricula.curso,
                          icono: r.value.icono,
                          accent: r.value.accent,
                        });
                      }
                    }
                  }
                  this.loading = false;
                  this.cdr.detectChanges();
                });
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

  getHorarioForDay(dia: number): any[] {
    return this.horarios.filter(h => h.diaSemana === dia)
      .sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));
  }

  get diaColumns(): number[] {
    return [1, 2, 3, 4, 5, 6];
  }

  get totalCursos(): number {
    return new Set(this.horarios.map((h: any) => h.curso?.idCurso)).size;
  }

  get totalHorarios(): number {
    return this.horarios.length;
  }

  get diasActivos(): number {
    return new Set(this.horarios.map((h: any) => h.diaSemana)).size;
  }

  get horasSemana(): number {
    const minutos = this.horarios.reduce((sum: number, h: any) => {
      if (h.horaInicio && h.horaFin) {
        const [h1, m1] = h.horaInicio.split(':').map(Number);
        const [h2, m2] = h.horaFin.split(':').map(Number);
        return sum + ((h2 * 60 + m2) - (h1 * 60 + m1));
      }
      return sum;
    }, 0);
    return Math.round(minutos / 60);
  }
}
