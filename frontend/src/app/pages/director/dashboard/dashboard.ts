import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

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
  greeting = 'Bienvenido';
  greetingIcon = 'bi-hand-wave';

  auth = inject(AuthService);

  statConfig = [
    { key: 'docentes', label: 'Docentes', accent: '#2f7ea6', icon: 'bi-person-video3', link: '/director/docentes' },
    { key: 'estudiantes', label: 'Estudiantes', accent: '#10b981', icon: 'bi-mortarboard', link: '/director/estudiantes' },
    { key: 'cursos', label: 'Cursos activos', accent: '#f59e0b', icon: 'bi-book', link: '/director/cursos' },
    { key: 'matriculas', label: 'Matrículas', accent: '#1e293b', icon: 'bi-card-checklist', link: '/director/matriculas' },
    { key: 'comunicados', label: 'Comunicados', accent: '#7a4e9e', icon: 'bi-megaphone', link: '/director/comunicados' },
  ];

  quickActions = [
    {
      route: '/director/cursos',
      icon: 'bi-journal-bookmark-fill',
      title: 'Organizar cursos',
      desc: 'Asigna docentes, grado, sección y período',
      gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    },
    {
      route: '/director/matriculas',
      icon: 'bi-person-plus-fill',
      title: 'Matricular estudiantes',
      desc: 'Inscribe alumnos en los cursos disponibles',
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    },
    {
      route: '/director/horarios',
      icon: 'bi-calendar-week-fill',
      title: 'Definir horarios',
      desc: 'Día, hora y aula de cada curso',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      route: '/director/comunicados',
      icon: 'bi-megaphone-fill',
      title: 'Publicar comunicado',
      desc: 'Notifica a toda la comunidad escolar',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
  ];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const h = new Date().getHours();
    if (h < 12) { this.greeting = 'Buenos días'; this.greetingIcon = 'bi-sunrise'; }
    else if (h < 18) { this.greeting = 'Buenas tardes'; this.greetingIcon = 'bi-sun'; }
    else { this.greeting = 'Buenas noches'; this.greetingIcon = 'bi-moon-stars'; }
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    const requests = [
      { key: 'docentes', call: this.api.docentes.listar() },
      { key: 'estudiantes', call: this.api.estudiantes.listar() },
      { key: 'cursos', call: this.api.cursos.listar() },
      { key: 'matriculas', call: this.api.matriculas.listar() },
      { key: 'comunicados', call: this.api.comunicados.listar() },
    ];

    Promise.all([
      Promise.allSettled(requests.map(r => r.call.toPromise ? r.call.toPromise() : new Promise(res => r.call.subscribe({ next: res, error: res })))),
      new Promise(res => this.api.periodoActivo.obtener().subscribe({ next: (d: any) => res(d), error: () => res(null) })),
    ]).then(([results, periodo]: any[]) => {
      const nextCounts: any = {};
      const failed: string[] = [];
      results.forEach((res: any, idx: number) => {
        const key = requests[idx].key;
        if (res.status === 'fulfilled') {
          const data = res.value;
          nextCounts[key] = Array.isArray(data) ? data.length : 0;
        } else {
          nextCounts[key] = null;
          failed.push(key);
        }
      });
      this.counts = nextCounts;
      this.failedResources = failed;
      this.periodoActivo = periodo;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  maxCount(): number {
    return Math.max(1, ...this.statConfig.map(s => this.counts[s.key] || 0));
  }
}
