import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-mis-notas',
  templateUrl: './mis-notas.html',
  standalone: false,
})
export class EstudianteMisNotas implements OnInit {
  estudiante: any = null;
  matriculas: any[] = [];
  notasPorCurso: any = {};
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
              this.matriculas = (matriculas || []).filter((m: any) => m.estado === 'ACTIVO');
              this.cargarNotas();
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

  private cargarNotas(): void {
    if (this.matriculas.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
    let pendientes = this.matriculas.length;
    for (const m of this.matriculas) {
      this.api.notas.listarPorMatricula(m.idMatricula).subscribe({
        next: (notas: any) => {
          this.notasPorCurso[m.idMatricula] = notas || [];
          pendientes--;
          if (pendientes <= 0) { this.loading = false; this.cdr.detectChanges(); }
        },
        error: () => {
          this.notasPorCurso[m.idMatricula] = [];
          pendientes--;
          if (pendientes <= 0) { this.loading = false; this.cdr.detectChanges(); }
        }
      });
    }
  }

  getNotas(matriculaId: number): any[] {
    return this.notasPorCurso[matriculaId] || [];
  }

  promedio(matriculaId: number): number {
    const notas = this.getNotas(matriculaId).filter((n: any) => n.valor != null);
    if (notas.length === 0) return 0;
    return notas.reduce((s: number, n: any) => s + Number(n.valor), 0) / notas.length;
  }
}
