import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-director-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
})
export class DirectorDashboard implements OnInit {
  loading = true;
  counts: any = {};
  periodoActivo: any = null;
  failedResources: string[] = [];

  statConfig = [
    { key: 'docentes', label: 'Docentes', accent: '#2f7ea6', link: '/director/docentes' },
    { key: 'estudiantes', label: 'Estudiantes', accent: 'var(--ie-success)', link: '/director/estudiantes' },
    { key: 'cursos', label: 'Cursos', accent: 'var(--ie-accent)', link: '/director/cursos' },
    { key: 'matriculas', label: 'Matrículas', accent: 'var(--ie-primary)', link: '/director/matriculas' },
    { key: 'comunicados', label: 'Comunicados', accent: '#7a4e9e', link: '/director/comunicados' },
  ];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    Promise.all([
      new Promise(res => this.api.docentes.listar().subscribe({ next: (d: any) => res(d), error: () => res([]) })),
      new Promise(res => this.api.estudiantes.listar().subscribe({ next: (d: any) => res(d), error: () => res([]) })),
      new Promise(res => this.api.cursos.listar().subscribe({ next: (d: any) => res(d), error: () => res([]) })),
      new Promise(res => this.api.matriculas.listar().subscribe({ next: (d: any) => res(d), error: () => res([]) })),
      new Promise(res => this.api.comunicados.listar().subscribe({ next: (d: any) => res(d), error: () => res([]) })),
      new Promise(res => this.api.periodoActivo.obtener().subscribe({ next: (d: any) => res(d), error: () => res(null) })),
    ]).then(([docentes, estudiantes, cursos, matriculas, comunicados, periodo]: any[]) => {
      this.counts = {
        docentes: Array.isArray(docentes) ? docentes.length : 0,
        estudiantes: Array.isArray(estudiantes) ? estudiantes.length : 0,
        cursos: Array.isArray(cursos) ? cursos.length : 0,
        matriculas: Array.isArray(matriculas) ? matriculas.length : 0,
        comunicados: Array.isArray(comunicados) ? comunicados.length : 0,
      };
      this.periodoActivo = periodo;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  maxCount(): number {
    return Math.max(1, ...this.statConfig.map(s => this.counts[s.key] || 0));
  }
}
