import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest, Usuario } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'intranet_token';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem(this.tokenKey);
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  getProfile(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/profile`);
  }

  saveToken(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(response));
    this.currentUserSubject.next(response);
  }

  getToken(): string | null {
    const stored = localStorage.getItem(this.tokenKey);
    return stored ? JSON.parse(stored).token : null;
  }

  getRol(): string | null {
    const stored = localStorage.getItem(this.tokenKey);
    return stored ? JSON.parse(stored).rol : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRol() === 'ADMIN';
  }

  isDirector(): boolean {
    return this.getRol() === 'DIRECTOR';
  }

  isDocente(): boolean {
    return this.getRol() === 'DOCENTE';
  }

  isEstudiante(): boolean {
    return this.getRol() === 'ESTUDIANTE';
  }
}
