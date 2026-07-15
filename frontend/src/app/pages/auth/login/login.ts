import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
})
export class Login implements OnInit {
  username = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;
  sessionExpired = false;

  badges = [
    { icon: 'bi-shield-check', label: 'Gestión académica segura' },
    { icon: 'bi-bar-chart-line', label: 'Notas y reportes en línea' },
    { icon: 'bi-book', label: 'Asistencia digitalizada' },
    { icon: 'bi-people', label: 'Comunicación entre roles' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['expired'] === '1') this.sessionExpired = true;
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Ingresa tu usuario y tu contraseña.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    try {
      const user = await this.auth.login(this.username, this.password);
      if (user.perfilCompleto === false && (user.rol === 'DOCENTE' || user.rol === 'ESTUDIANTE')) {
        this.router.navigate([`/${user.rol.toLowerCase()}/completar-perfil`]);
      } else {
        this.router.navigate([`/${user.rol.toLowerCase()}`]);
      }
    } catch (err: any) {
      if (err.error?.message) {
        this.error = err.error.message;
      } else if (err.name === 'HttpErrorResponse' && err.status === 0) {
        this.error = 'No se puede conectar con el servidor. Verifica tu conexión.';
      } else {
        this.error = 'Usuario o contraseña incorrectos.';
      }
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
