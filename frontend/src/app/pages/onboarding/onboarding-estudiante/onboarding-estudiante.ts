import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-onboarding-estudiante',
  templateUrl: './onboarding-estudiante.html',
  standalone: false,
})
export class OnboardingEstudiante implements OnInit {
  form = { codigoEstudiante: '', nombres: '', apellidos: '', dni: '', fechaNacimiento: '', direccion: '', telefono: '' };
  saving = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        if (data) {
          this.form.codigoEstudiante = data.codigoEstudiante || '';
          this.form.nombres = data.nombres || '';
          this.form.apellidos = data.apellidos || '';
          this.form.dni = data.dni || '';
          this.form.fechaNacimiento = data.fechaNacimiento || '';
          this.form.direccion = data.direccion || '';
          this.form.telefono = data.telefono || '';
        }
      },
    });
  }

  onSubmit(): void {
    if (!this.form.nombres.trim() || !this.form.apellidos.trim()) return;
    this.saving = true;
    this.api.estudiantePanel.actualizarMiPerfil(this.form).subscribe({
      next: async () => {
        this.toast.success('Perfil completado correctamente.');
        await this.auth.refreshProfile();
        this.router.navigate(['/estudiante']);
        this.saving = false;
      },
      error: (err: any) => {
        this.toast.error(err.friendlyMessage || 'Error al guardar.');
        this.saving = false;
      }
    });
  }
}
