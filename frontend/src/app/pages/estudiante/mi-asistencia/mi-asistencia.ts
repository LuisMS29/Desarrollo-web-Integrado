import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-mi-asistencia',
  templateUrl: './mi-asistencia.html',
  standalone: false,
})
export class EstudianteMiAsistencia implements OnInit {
  estudiante: any = null;
  asistencias: any[] = [];
  loading = true;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.estudiante = data;
        if (data?.idEstudiante) {
          this.api.estudiantePanel.listarMisMatriculas(data.idEstudiante).subscribe({
            next: (matriculas: any) => {
              const activas = (matriculas || []).filter((m: any) => m.estado === 'ACTIVO');
              if (activas.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
              this.cargarAsistencias(activas);
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

  private cargarAsistencias(matriculas: any[]): void {
    let pendientes = matriculas.length;
    for (const m of matriculas) {
      this.api.asistencias.listarPorMatricula(m.idMatricula).subscribe({
        next: (data: any) => {
          for (const a of (data || [])) {
            this.asistencias.push({ ...a, curso: m.curso });
          }
          pendientes--;
          if (pendientes <= 0) { this.loading = false; this.cdr.detectChanges(); }
        },
        error: () => {
          pendientes--;
          if (pendientes <= 0) { this.loading = false; this.cdr.detectChanges(); }
        }
      });
    }
  }

  get porcentaje(): number {
    if (this.asistencias.length === 0) return 0;
    const presentes = this.asistencias.filter(a => a.presente).length;
    return Math.round((presentes / this.asistencias.length) * 100);
  }

  get presentes(): number {
    return this.asistencias.filter(a => a.presente).length;
  }

  get ausentes(): number {
    return this.asistencias.filter(a => !a.presente).length;
  }

  get agrupadasPorCurso(): any[] {
    const map: any = {};
    for (const a of this.asistencias) {
      const key = a.curso?.idCurso || 0;
      if (!map[key]) map[key] = { curso: a.curso, asistencias: [] };
      map[key].asistencias.push(a);
    }
    return Object.values(map);
  }

  presentesCount(asistencias: any[]): number {
    return asistencias.filter((x: any) => x.presente).length;
  }
}
