import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-notificaciones-dropdown',
  templateUrl: './notificaciones-dropdown.html',
  standalone: false,
})
export class NotificacionesDropdown implements OnInit, OnDestroy {
  notificaciones: any[] = [];
  noLeidas = 0;
  open = false;
  private interval: any;

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.load();
    this.interval = setInterval(() => this.load(), 30000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private load(): void {
    const user = this.auth.user();
    if (!user) return;
    this.api.notificaciones.listarNoLeidas(user.idUsuario).subscribe({
      next: (data: any) => { this.noLeidas = data.length || 0; },
    });
    this.api.notificaciones.listarPorUsuario(user.idUsuario).subscribe({
      next: (data: any) => { this.notificaciones = data; },
    });
  }

  toggle(): void {
    this.open = !this.open;
  }

  marcarLeida(id: number): void {
    this.api.notificaciones.marcarLeida(id).subscribe(() => {
      this.load();
    });
  }
}
