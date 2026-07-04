import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
})
export class EstudianteDashboard implements OnInit {
  estudiante: any = null;
  matriculas: any[] = [];
  loading = true;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.estudiante = data;
        if (data?.idEstudiante) {
          this.api.estudiantePanel.listarMisMatriculas(data.idEstudiante).subscribe({
            next: (mat: any) => { this.matriculas = mat; this.loading = false; this.cdr.detectChanges(); },
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

  get activas(): any[] {
    return this.matriculas.filter((m: any) => m.estado === 'ACTIVO');
  }

  get grados(): { grado: string; count: number }[] {
    const agrupadas: any = {};
    this.activas.forEach((m: any) => {
      const key = m.curso?.grado?.nombre || '—';
      agrupadas[key] = (agrupadas[key] || 0) + 1;
    });
    return Object.entries(agrupadas).map(([grado, count]) => ({ grado, count: count as number }));
  }

  maxGrado(): number {
    return Math.max(1, ...this.grados.map(g => g.count));
  }
}
