import { Component, OnInit } from '@angular/core';
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
  form = { codigoDocente: '', nombres: '', apellidos: '', dni: '', especialidad: '', telefono: '', email: '' };
  saving = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.api.docentePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        if (data) {
          this.form.codigoDocente = data.codigoDocente || '';
          this.form.nombres = data.nombres || '';
          this.form.apellidos = data.apellidos || '';
          this.form.dni = data.dni || '';
          this.form.especialidad = data.especialidad || '';
          this.form.telefono = data.telefono || '';
          this.form.email = data.email || '';
        }
      },
    });
  }

  onSubmit(): void {
    if (!this.form.nombres.trim() || !this.form.apellidos.trim()) return;
    this.saving = true;
    this.api.docentePanel.actualizarMiPerfil(this.form).subscribe({
      next: async () => {
        this.toast.success('Perfil completado correctamente.');
        await this.auth.refreshProfile();
        this.router.navigate(['/docente']);
        this.saving = false;
      },
      error: (err: any) => {
        this.toast.error(err.friendlyMessage || 'Error al guardar.');
        this.saving = false;
      }
    });
  }
}
