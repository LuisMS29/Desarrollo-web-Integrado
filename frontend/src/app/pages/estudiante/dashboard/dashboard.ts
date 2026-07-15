import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  comunicados: any[] = [];
  comunicadosRecientes: any[] = [];
  loading = true;
  greeting = 'Bienvenido';
  greetingIcon = 'bi-hand-wave';
  greetingQuote = 'Cada día es una nueva oportunidad para aprender algo nuevo.';

  auth = inject(AuthService);

  statConfig = [
    {
      key: 'cursos', label: 'Cursos matriculados', accent: '#059669', icon: 'bi-bookmark-check-fill',
      link: '/estudiante/cursos', getValue: () => this.activas.length,
    },
    {
      key: 'evaluaciones', label: 'Evaluaciones', accent: '#0284c7', icon: 'bi-clipboard-data-fill',
      link: '/estudiante/notas', getValue: () => this.activas.length * 4,
    },
    {
      key: 'asistencia', label: 'Horas semanales', accent: '#7c3aed', icon: 'bi-calendar-check-fill',
      link: '/estudiante/asistencia', getValue: () => this.activas.length * 4,
    },
    {
      key: 'comunicados', label: 'Comunicados', accent: '#f59e0b', icon: 'bi-megaphone-fill',
      link: '/estudiante/comunicados', getValue: () => this.comunicados.length,
    },
  ];



  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const h = new Date().getHours();
    if (h < 12) {
      this.greeting = 'Buenos días';
      this.greetingIcon = 'bi-sunrise';
      this.greetingQuote = 'Que tengas un brillante día de clases. ✨';
    } else if (h < 18) {
      this.greeting = 'Buenas tardes';
      this.greetingIcon = 'bi-sun';
      this.greetingQuote = 'Sigue adelante, ya casi terminas la jornada. 💪';
    } else {
      this.greeting = 'Buenas noches';
      this.greetingIcon = 'bi-moon-stars';
      this.greetingQuote = 'Descansa y recarga energías para mañana. 🌙';
    }

    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        this.estudiante = data;
        if (data?.idEstudiante) {
          this.api.estudiantePanel.listarMisMatriculas(data.idEstudiante).subscribe({
            next: (mat: any) => {
              this.matriculas = mat || [];
              this.loading = false;
              this.cdr.detectChanges();
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

    // Cargar comunicados recientes
    this.api.comunicados.listar().subscribe({
      next: (data: any) => {
        const hoy = new Date().toISOString().slice(0, 10);
        const filtrados = (data || [])
          .filter((c: any) => {
            if (c.dirigidoA === 'TODOS' || c.dirigidoA === 'ESTUDIANTE') return true;
            return false;
          })
          .filter((c: any) => !c.fechaExpiracion || c.fechaExpiracion >= hoy)
          .sort((a: any, b: any) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
        this.comunicados = filtrados;
        this.comunicadosRecientes = filtrados.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: () => {}
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

  private cursoIcons = ['bi-book', 'bi-calculator', 'bi-globe2', 'bi-flask', 'bi-pencil-square', 'bi-music-note-beamed', 'bi-palette', 'bi-activity'];

  get cursosList(): any[] {
    return this.activas.map((m: any, idx: number) => ({
      id: m.idMatricula,
      nombre: m.curso?.asignatura?.nombre || '—',
      grado: m.curso?.grado?.nombre || '',
      seccion: m.curso?.seccion?.nombre || '',
      docente: m.curso?.docente?.nombres + ' ' + m.curso?.docente?.apellidos || '—',
      horario: m.curso?.horarios?.[0] || null,
      icono: this.cursoIcons[idx % this.cursoIcons.length],
    }));
  }

  maxGrado(): number {
    return Math.max(1, ...this.grados.map(g => g.count));
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const parts = dateStr.split('T')[0].split(' ')[0].split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${parts[2]} ${months[parseInt(parts[1])-1] || parts[1]} ${parts[0]}`;
  }

  getInitials(): string {
    const name = this.estudiante?.nombres || this.auth.user()?.username || 'E';
    return name.charAt(0).toUpperCase();
  }
}
