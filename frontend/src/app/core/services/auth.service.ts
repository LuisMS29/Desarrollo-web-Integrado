import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface User {
  username: string;
  rol: string;
  token: string;
  perfilCompleto: boolean;
  idPerfil: number | null;
  idUsuario: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(this.readStoredUser());
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  loading = signal(false);

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem('ie_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  async login(username: string, password: string): Promise<User> {
    this.loading.set(true);
    try {
      const data: any = await this.api.auth.login(username, password).toPromise();
      const loggedUser: User = {
        username: data.username,
        rol: data.rol,
        token: data.token,
        perfilCompleto: data.perfilCompleto,
        idPerfil: data.idPerfil,
        idUsuario: data.idUsuario,
      };
      localStorage.setItem('ie_token', data.token);
      localStorage.setItem('ie_user', JSON.stringify(loggedUser));
      this.userSignal.set(loggedUser);
      return loggedUser;
    } finally {
      this.loading.set(false);
    }
  }

  async refreshProfile(): Promise<User | null> {
    try {
      const stored = this.readStoredUser();
      if (!stored) return null;
      const data: any = await this.api.auth.getProfile().toPromise();
      const updated = { ...stored, perfilCompleto: data.perfilCompleto, idPerfil: data.idPerfil, idUsuario: data.idUsuario };
      localStorage.setItem('ie_user', JSON.stringify(updated));
      this.userSignal.set(updated);
      return updated;
    } catch {
      return this.readStoredUser();
    }
  }

  logout(): void {
    localStorage.removeItem('ie_token');
    localStorage.removeItem('ie_user');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }
}
