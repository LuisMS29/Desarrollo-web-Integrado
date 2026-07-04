import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-onboarding-docente',
  templateUrl: './onboarding-docente.html',
  standalone: false,
})
export class OnboardingDocente implements OnInit {
  form = { nombres: '', apellidos: '', dni: '', especialidad: '', telefono: '', email: '' };
  codigoGenerado = '';
  saving = false;
  errorMsg = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.api.docentePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        if (data) {
          this.codigoGenerado = data.codigoDocente || '';
          this.form.nombres = data.nombres || '';
          this.form.apellidos = data.apellidos || '';
          this.form.dni = data.dni || '';
          this.form.especialidad = data.especialidad || '';
          this.form.telefono = data.telefono || '';
          this.form.email = data.email || '';
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'No se pudo cargar tu perfil.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.form.nombres.trim() || !this.form.apellidos.trim() || !this.form.dni.trim()) {
      this.errorMsg = 'Los campos Nombres, Apellidos y DNI son obligatorios.';
      this.cdr.detectChanges();
      return;
    }
    this.saving = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    const payload = {
      nombres: this.form.nombres,
      apellidos: this.form.apellidos,
      dni: this.form.dni,
      ...(this.form.especialidad ? { especialidad: this.form.especialidad } : {}),
      ...(this.form.telefono ? { telefono: this.form.telefono } : {}),
      ...(this.form.email ? { email: this.form.email } : {}),
    };

    this.api.docentePanel.actualizarMiPerfil(payload).subscribe({
      next: () => {
        this.toast.success('Perfil completado exitosamente.');
        this.auth.refreshProfile().then(() => {
          this.router.navigate(['/docente']);
        }).catch(() => {
          this.router.navigate(['/docente']);
        });
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'No se pudo guardar tu perfil.';
        this.saving = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.saving = false;
      }
    });
  }
}
