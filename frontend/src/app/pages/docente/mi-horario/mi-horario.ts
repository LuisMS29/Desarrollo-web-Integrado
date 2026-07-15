import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  diaActivo: number | null = null;

  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  diasAbrev = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diaIcons = ['bi-sun', 'bi-sun', 'bi-sun', 'bi-cloud-sun', 'bi-sun', 'bi-sun', 'bi-moon-stars'];
  diaGradients = [
    'linear-gradient(135deg, #f43f5e, #fb7185)',
    'linear-gradient(135deg, #0284c7, #38bdf8)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #14b8a6, #5eead4)',
    'linear-gradient(135deg, #6366f1, #818cf8)',
  ];

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  get todayDay(): number {
    return new Date().getDay();
  }

  get totalCursos(): number {
    const set = new Set(this.horarios.map(h => h.curso?.idCurso));
    return set.size;
  }

  get totalHorasSemana(): number {
    let totalMin = 0;
    for (const h of this.horarios) {
      if (h.horaInicio && h.horaFin) {
        const [h1, m1] = h.horaInicio.split(':').map(Number);
        const [h2, m2] = h.horaFin.split(':').map(Number);
        totalMin += (h2 * 60 + m2) - (h1 * 60 + m1);
      }
    }
    return Math.round(totalMin / 60);
  }

  get diasConClases(): number {
    const dias = new Set(this.horarios.map(h => h.diaSemana));
    return dias.size;
  }

  getDiaGradient(dia: number): string {
    return this.diaGradients[dia] || this.diaGradients[0];
  }

  getDiaIcon(dia: number): string {
    return this.diaIcons[dia] || 'bi-calendar';
  }

  setDiaActivo(dia: number | null): void {
    this.diaActivo = dia;
  }

  loadData(): void {
    this.api.docentePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.docente = data;
        if (data?.idDocente) {
          this.api.docentePanel.listarMisCursos(data.idDocente).subscribe({
            next: (cursos: any) => {
              if (cursos.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
              Promise.allSettled(
                cursos.map((c: any) =>
                  new Promise(res =>
                    this.api.horariosListarPorCurso(c.idCurso).subscribe({
                      next: (d: any) => res({ curso: c, horarios: d }),
                      error: () => res({ curso: c, horarios: [] }),
                    })
                  )
                )
              ).then((results: any) => {
                this.horarios = [];
                for (const r of results) {
                  if (r.status === 'fulfilled') {
                    for (const h of (r.value.horarios || [])) {
                      this.horarios.push({ ...h, curso: r.value.curso });
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
    return this.horarios
      .filter(h => h.diaSemana === dia)
      .sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));
  }

  get diaColumns(): number[] {
    return [1, 2, 3, 4, 5, 6];
  }
}
