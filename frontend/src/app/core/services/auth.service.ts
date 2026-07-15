import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, API_BASE_URL } from './api.service';

export interface User {
  username: string;
  email: string;
  rol: string;
  token: string;
  perfilCompleto: boolean;
  idPerfil: number | null;
  idUsuario: number;
  fotoUrl?: string;
}

/** Backend host extracted from the API base URL */
const BACKEND_HOST = API_BASE_URL.replace(/\/api$/, '');

/** Ensure stored photo URLs are absolute (prepend backend host if relative) */
function normalizeFotoUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Legacy relative URL like /api/uploads/fotos/xxx.png → prepend backend host
  return BACKEND_HOST + url;
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
      const user: User | null = raw ? JSON.parse(raw) : null;
      if (user?.fotoUrl) user.fotoUrl = normalizeFotoUrl(user.fotoUrl);
      return user;
    } catch { return null; }
  }

  async login(username: string, password: string): Promise<User> {
    this.loading.set(true);
    try {
      const data: any = await this.api.auth.login(username, password).toPromise();
      const loggedUser: User = {
        username: data.username,
        email: data.email,
        rol: data.rol,
        token: data.token,
        perfilCompleto: data.perfilCompleto,
        idPerfil: data.idPerfil,
        idUsuario: data.idUsuario,
        fotoUrl: normalizeFotoUrl(data.fotoUrl),
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
      const updated = { ...stored, perfilCompleto: data.perfilCompleto, idPerfil: data.idPerfil, idUsuario: data.idUsuario, fotoUrl: normalizeFotoUrl(data.fotoUrl) };
      localStorage.setItem('ie_user', JSON.stringify(updated));
      this.userSignal.set(updated);
      return updated;
    } catch {
      return this.readStoredUser();
    }
  }

  clearFotoUrl(): void {
    const u = this.userSignal();
    if (u?.fotoUrl) {
      const clean = { ...u, fotoUrl: undefined as string | undefined };
      delete clean.fotoUrl;
      localStorage.setItem('ie_user', JSON.stringify(clean));
      this.userSignal.set(clean);
    }
  }

  logout(): void {
    localStorage.removeItem('ie_token');
    localStorage.removeItem('ie_user');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }
}
