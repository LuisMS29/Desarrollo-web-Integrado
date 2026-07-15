import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register([DoughnutController, ArcElement, Tooltip, Legend]);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
})
export class AdminDashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('roleChartCanvas') roleChartCanvas!: ElementRef<HTMLCanvasElement>;
  private roleChart: Chart<'doughnut', number[], string> | null = null;

  loading = true;
  counts: any = {};
  roleCounts: { rol: string; count: number }[] = [];
  totalRoles = 0;
  failedResources: string[] = [];
  greeting = 'Bienvenido';
  greetingIcon = 'bi-hand-wave';

  statConfig = [
    { key: 'usuarios', label: 'Usuarios registrados', accent: '#1e293b', icon: 'bi-people', link: '/admin/usuarios' },
    { key: 'docentes', label: 'Docentes', accent: '#2f7ea6', icon: 'bi-person-video3', link: '/admin/docentes' },
    { key: 'estudiantes', label: 'Estudiantes', accent: '#10b981', icon: 'bi-mortarboard', link: '/admin/estudiantes' },
    { key: 'cursos', label: 'Cursos activos', accent: '#f59e0b', icon: 'bi-book', link: '/admin/cursos' },
    { key: 'comunicados', label: 'Comunicados', accent: '#7a4e9e', icon: 'bi-megaphone', link: '/admin/comunicados' },
  ];

  roleIcons: any = {
    ADMIN: 'bi-shield-fill',
    DIRECTOR: 'bi-person-badge',
    DOCENTE: 'bi-person-workspace',
    ESTUDIANTE: 'bi-mortarboard',
  };

  roleColors: any = {
    ADMIN: '#1e293b',
    DIRECTOR: '#7c3aed',
    DOCENTE: '#0284c7',
    ESTUDIANTE: '#059669',
  };

  quickActions = [
    {
      route: '/admin/usuarios',
      icon: 'bi-people',
      title: 'Gestionar usuarios',
      desc: 'Activa, desactiva o elimina cuentas',
      gradient: 'linear-gradient(135deg, #1e293b, #334155)',
    },
    {
      route: '/admin/docentes',
      icon: 'bi-person-video3',
      title: 'Registrar docente',
      desc: 'Alta y edición del personal docente',
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    },
    {
      route: '/admin/grados',
      icon: 'bi-diagram-3',
      title: 'Estructura académica',
      desc: 'Grados, secciones, cursos y períodos',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      route: '/admin/comunicados',
      icon: 'bi-megaphone',
      title: 'Publicar comunicado',
      desc: 'Notifica a toda la comunidad escolar',
      gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    },
  ];

  auth = inject(AuthService);

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const h = new Date().getHours();
    if (h < 12) { this.greeting = 'Buenos días'; this.greetingIcon = 'bi-sunrise'; }
    else if (h < 18) { this.greeting = 'Buenas tardes'; this.greetingIcon = 'bi-sun'; }
    else { this.greeting = 'Buenas noches'; this.greetingIcon = 'bi-moon-stars'; }
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.roleCounts.length > 0) {
      this.renderChart();
    }
  }

  private loadData(): void {
    this.loading = true;
    const requests = [
      { key: 'usuarios', call: this.api.usuarios.listar() },
      { key: 'docentes', call: this.api.docentes.listar() },
      { key: 'estudiantes', call: this.api.estudiantes.listar() },
      { key: 'cursos', call: this.api.cursos.listar() },
      { key: 'comunicados', call: this.api.comunicados.listar() },
    ];

    Promise.allSettled(requests.map(r => r.call.toPromise ? r.call.toPromise() : new Promise(res => r.call.subscribe({ next: res, error: res }))))
      .then(results => {
        const nextCounts: any = {};
        const failed: string[] = [];
        const roles: any = {};

        results.forEach((res: any, idx) => {
          const key = requests[idx].key;
          if (res.status === 'fulfilled') {
            const data = res.value;
            nextCounts[key] = Array.isArray(data) ? data.length : 0;
            if (key === 'usuarios' && Array.isArray(data)) {
              data.forEach((u: any) => {
                roles[u.rol] = (roles[u.rol] || 0) + 1;
              });
            }
          } else {
            nextCounts[key] = null;
            failed.push(key);
          }
        });

        this.counts = nextCounts;
        this.roleCounts = Object.entries(roles).map(([rol, count]) => ({ rol, count: count as number }));
        this.totalRoles = this.roleCounts.reduce((s, r) => s + r.count, 0);
        this.failedResources = failed;
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart());
      });
  }

  ngOnDestroy(): void {
    this.roleChart?.destroy();
  }

  private renderChart(): void {
    if (this.roleCounts.length === 0) return;
    if (!this.roleChartCanvas) return;
    this.roleChart?.destroy();

    const canvas = this.roleChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = this.roleCounts.map(r => this.roleColors[r.rol] || '#94a3b8');

    this.roleChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.roleCounts.map(r => r.rol),
        datasets: [{
          data: this.roleCounts.map(r => r.count),
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 10,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '50%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.92)',
            titleFont: { family: 'Plus Jakarta Sans', weight: 'bold', size: 13 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (ctx: any) => {
                const total = (ctx.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                return ` ${ctx.label}: ${ctx.parsed} usuarios (${pct}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 1000,
        },
      },
    });
  }

  maxCount(): number {
    return Math.max(1, ...this.statConfig.map(s => this.counts[s.key] || 0));
  }
}
