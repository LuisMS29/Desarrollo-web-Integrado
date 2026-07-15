import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { NotificacionesPanelService } from './notificaciones-panel.service';

@Component({
  selector: 'app-notificaciones-dropdown',
  templateUrl: './notificaciones-dropdown.html',
  standalone: false,
})
export class NotificacionesDropdown implements OnInit, OnDestroy {
  noLeidas = 0;
  private interval: any;
  private retryTimeout: any;
  private retryCount = 0;
  private readonly MAX_RETRIES = 5;
  private loading = false;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    public panel: NotificacionesPanelService,
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.interval = setInterval(() => this.cargar(), 10000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
    this.limpiarRetry();
  }

  toggle(): void {
    this.panel.toggle();
    this.loading = false;
    this.limpiarRetry();
    this.cargar();
  }

  private limpiarRetry(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  private cargar(): void {
    if (this.loading) return;
    this.limpiarRetry();

    const user = this.auth.user();
    if (!user) {
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        this.retryTimeout = setTimeout(() => this.cargar(), 500);
      }
      return;
    }

    this.retryCount = 0;
    this.loading = true;

    this.api.notificaciones.listarNoLeidas(user.idUsuario).subscribe({
      next: (data: any[]) => {
        const count = data?.length || 0;
        this.noLeidas = count;
        this.panel.noLeidas.set(count);
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        if (this.retryCount < this.MAX_RETRIES) {
          this.retryCount++;
          this.retryTimeout = setTimeout(() => this.cargar(), 3000);
        }
      },
      complete: () => { this.loading = false; },
    });
  }
}
