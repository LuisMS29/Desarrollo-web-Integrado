import { ChangeDetectorRef, Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificacionesPanelService } from './notificaciones-panel.service';

@Component({
  selector: 'app-notificaciones-panel',
  template: `
    @if (panel.abierto()) {
      <div class="notif-backdrop" (click)="panel.cerrar()"></div>
      <div class="notif-panel">
        <div class="notif-header">
          <div>
            <strong class="font-display" style="font-size:0.95rem;">
              <i class="bi bi-bell-fill me-2 text-accent"></i>Notificaciones
            </strong>
            @if (noLeidas > 0) {
              <span class="badge bg-danger ms-2" style="font-size:0.6rem;">{{ noLeidas }} sin leer</span>
            }
          </div>
          <button class="notif-close" (click)="panel.cerrar()" title="Cerrar">&times;</button>
        </div>
        <div class="notif-body">
          @if (notificaciones.length === 0) {
            <div class="notif-empty">
              <i class="bi bi-bell-slash"></i>
              <p class="text-ink-soft small mt-2 mb-0">Sin notificaciones.</p>
            </div>
          }
          @for (n of notificaciones; track n.idNotificacion) {
            <div class="notif-item" [class.unread]="!n.leido" (click)="irANotificacion(n)">
              <div class="d-flex align-items-start gap-2">
                <div class="notif-dot" [style.background]="!n.leido ? 'var(--ie-info)' : 'transparent'"></div>
                <div class="min-w-0" style="flex:1">
                  <div class="small fw-semibold" [class.text-dark]="!n.leido" [class.text-ink-soft]="n.leido">{{ n.titulo }}</div>
                  <div class="small text-ink-soft" style="font-size:0.78rem;">{{ n.mensaje }}</div>
                  <div class="d-flex align-items-center gap-2 mt-1">
                    @if (n.tipo === 'SUCCESS') { <i class="bi bi-check-circle-fill text-success" style="font-size:0.6rem;"></i> }
                    @if (n.tipo === 'WARNING') { <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size:0.6rem;"></i> }
                    @if (n.tipo === 'ERROR') { <i class="bi bi-x-circle-fill text-danger" style="font-size:0.6rem;"></i> }
                    @if (n.fechaEnvio) {
                      <span class="small text-ink-soft" style="font-size:0.65rem;margin-left:auto;">
                        <i class="bi bi-clock me-1"></i>{{ n.fechaEnvio | date:'dd MMM HH:mm' }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .notif-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:1050;transition:opacity 0.2s}
    .notif-panel{position:fixed;top:0;right:0;bottom:0;width:400px;max-width:92vw;background:var(--ie-card-bg);z-index:1051;display:flex;flex-direction:column;box-shadow:-4px 0 20px rgba(0,0,0,0.12);animation:slideIn 0.2s ease-out}
    @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
    .notif-header{padding:1rem 1.25rem;border-bottom:1px solid var(--ie-line);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
    .notif-body{flex:1;overflow-y:auto}
    .notif-item{padding:0.875rem 1.25rem;border-bottom:1px solid var(--ie-line);cursor:pointer;transition:background 0.1s}
    .notif-item:hover{background:var(--ie-hover)}
    .notif-item.unread{background:var(--ie-bg-soft)}
    .notif-dot{width:8px;height:8px;border-radius:999px;margin-top:5px;flex-shrink:0}
    .notif-empty{padding:3rem 1.5rem;text-align:center}
    .notif-empty i{font-size:2rem;color:var(--ie-ink-muted)}
    .notif-close{background:none;border:none;color:var(--ie-ink-muted);font-size:1.3rem;padding:0;line-height:1;cursor:pointer}
    .notif-close:hover{color:var(--ie-ink)}
  `],
  standalone: false,
})
export class NotificacionesPanel implements OnInit, OnDestroy {
  notificaciones: any[] = [];
  noLeidas = 0;
  private interval: any;

  /** Rutas genéricas por tipo de referencia */
  private readonly RUTAS: Record<string, string> = {
    comunicado: '/comunicados',
    nota: '/notas',
    docente: '/docentes',
    estudiante: '/estudiantes',
    matricula: '/matriculas',
    grado: '/grados',
    seccion: '/secciones',
    curso: '/cursos',
    horario: '/horario',
    asistencia: '/asistencia',
  };

  /** Rutas específicas por rol, sobreescriben las genéricas */
  private readonly RUTAS_POR_ROL: Record<string, Record<string, string>> = {
    estudiante: {
      matricula: '/cursos',
    },
    docente: {
      matricula: '/cursos',
    },
  };

  /** Fallback por palabras clave en el título cuando no hay referencia */
  private readonly TITLE_KEYWORDS: [RegExp, string][] = [
    [/calificaci[oó]n|nota|notas/i, '/notas'],
    [/asistencia/i, '/asistencia'],
    [/matr[ií]cula/i, '/cursos'],
    [/comunicado|publicado/i, '/comunicados'],
    [/horario/i, '/horario'],
    [/estudiante/i, '/estudiantes'],
    [/docente|profesor/i, '/docentes'],
  ];

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
    public panel: NotificacionesPanelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.interval = setInterval(() => this.load(), 30000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.panel.cerrar();
  }

  private load(): void {
    const user = this.auth.user();
    if (!user) return;
    this.api.notificaciones.listarNoLeidas(user.idUsuario).subscribe({
      next: (data: any) => {
        const count = data?.length || 0;
        this.noLeidas = count;
        this.panel.noLeidas.set(count);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
    this.api.notificaciones.listarPorUsuario(user.idUsuario).subscribe({
      next: (data: any) => { this.notificaciones = data; this.cdr.detectChanges(); },
      error: () => {},
    });
  }

  private obtenerRuta(n: any): string {
    const rol = this.auth.user()?.rol?.toLowerCase() || 'admin';
    const ref = n.referencia;

    // 1. Si hay referencia, buscar ruta específica por rol primero
    if (ref) {
      const rutaPorRol = this.RUTAS_POR_ROL[rol]?.[ref];
      if (rutaPorRol) return rutaPorRol;

      // 2. Luego ruta genérica
      const rutaGenerica = this.RUTAS[ref];
      if (rutaGenerica) return rutaGenerica;
    }

    // 3. Fallback: buscar por palabras clave en el título
    if (n.titulo) {
      for (const [regex, ruta] of this.TITLE_KEYWORDS) {
        if (regex.test(n.titulo)) return ruta;
      }
    }

    // 4. Default final: ir al dashboard del rol (ruta raíz)
    return '';
  }

  irANotificacion(n: any): void {
    const rol = this.auth.user()?.rol?.toLowerCase() || 'admin';
    const ruta = this.obtenerRuta(n);

    if (!n.leido) {
      this.api.notificaciones.marcarLeida(n.idNotificacion).subscribe({
        next: () => this.load(),
        error: () => {},
      });
    }

    this.panel.cerrar();
    this.router.navigate([`/${rol}${ruta}`]);
  }
}
