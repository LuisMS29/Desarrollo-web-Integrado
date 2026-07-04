import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
})
export class AdminDashboard implements OnInit {
  loading = true;
  counts: any = {};
  roleCounts: { rol: string; count: number }[] = [];
  totalRoles = 0;
  failedResources: string[] = [];

  statConfig = [
    { key: 'usuarios', label: 'Usuarios registrados', accent: 'var(--ie-primary)', link: '/admin/usuarios' },
    { key: 'docentes', label: 'Docentes', accent: '#2f7ea6', link: '/admin/docentes' },
    { key: 'estudiantes', label: 'Estudiantes', accent: 'var(--ie-success)', link: '/admin/estudiantes' },
    { key: 'cursos', label: 'Cursos activos', accent: 'var(--ie-accent)', link: '/admin/cursos' },
    { key: 'comunicados', label: 'Comunicados', accent: '#7a4e9e', link: '/admin/comunicados' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
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
      });
  }

  maxCount(): number {
    return Math.max(1, ...this.statConfig.map(s => this.counts[s.key] || 0));
  }
}
