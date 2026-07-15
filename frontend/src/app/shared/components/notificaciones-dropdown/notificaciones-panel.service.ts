import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificacionesPanelService {
  readonly abierto = signal(false);
  readonly noLeidas = signal(0);
  abrir() { this.abierto.set(true); }
  cerrar() { this.abierto.set(false); }
  toggle() { this.abierto.update(v => !v); }
}
