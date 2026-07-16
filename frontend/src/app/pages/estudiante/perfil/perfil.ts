import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-estudiante-perfil',
  templateUrl: './perfil.html',
  standalone: false,
})
export class EstudiantePerfil implements OnInit {
  form = { nombres: '', apellidos: '', dni: '', fechaNacimiento: '', direccion: '', telefono: '' };
  codigoEstudiante = '';
  saving = false;
  uploading = false;
  errorMsg = '';
  previewUrl: string | null = null;
  fotoPreviewOpen = false;
  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  showPassword = { current: false, new: false, confirm: false };
  changingPassword = false;

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    this.previewUrl = user?.fotoUrl || null;

    this.api.estudiantePanel.obtenerMiFicha().subscribe({
      next: (data: any) => {
        if (data) {
          this.codigoEstudiante = data.codigoEstudiante || '';
          this.form.nombres = data.nombres || '';
          this.form.apellidos = data.apellidos || '';
          this.form.dni = data.dni || '';
          this.form.fechaNacimiento = data.fechaNacimiento || '';
          this.form.direccion = data.direccion || '';
          this.form.telefono = data.telefono || '';
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'No se pudo cargar tu perfil.';
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    this.auth.clearFotoUrl();

    this.uploading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.api.auth.subirFoto(file).subscribe({
      next: (res: any) => {
        this.toast.success('Foto de perfil actualizada.');
        this.auth.refreshProfile();
        this.uploading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'Error al subir la foto.';
        this.uploading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cambiarPassword(): void {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) { this.errorMsg = 'Todos los campos son obligatorios.'; return; }
    if (newPassword.length < 6) { this.errorMsg = 'La nueva contraseña debe tener al menos 6 caracteres.'; return; }
    if (newPassword !== confirmPassword) { this.errorMsg = 'Las contraseñas nuevas no coinciden.'; return; }
    this.changingPassword = true;
    this.errorMsg = '';
    this.api.auth.cambiarPassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.toast.success('Contraseña actualizada exitosamente.');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.changingPassword = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'Error al cambiar la contraseña.';
        this.changingPassword = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFotoError(): void {
    this.previewUrl = null;
    this.auth.clearFotoUrl();
  }

  openFotoPreview(): void {
    this.fotoPreviewOpen = true;
  }

  closeFotoPreview(): void {
    this.fotoPreviewOpen = false;
  }

  triggerFileInput(): void {
    const input = document.getElementById('fotoInput') as HTMLInputElement;
    input?.click();
  }

  eliminarFoto(): void {
    if (!confirm('¿Estás seguro de eliminar tu foto de perfil?')) return;

    this.previewUrl = null;
    this.auth.clearFotoUrl();

    this.api.auth.eliminarFoto().subscribe({
      next: () => {
        this.toast.success('Foto de perfil eliminada.');
        this.auth.refreshProfile().then(() => this.auth.clearFotoUrl());
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'Error al eliminar la foto.';
        this.cdr.detectChanges();
      },
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
      ...(this.form.fechaNacimiento ? { fechaNacimiento: this.form.fechaNacimiento } : {}),
      ...(this.form.direccion ? { direccion: this.form.direccion } : {}),
      ...(this.form.telefono ? { telefono: this.form.telefono } : {}),
    };

    this.api.estudiantePanel.actualizarMiPerfil(payload).subscribe({
      next: () => {
        this.toast.success('Perfil actualizado exitosamente.');
        this.auth.refreshProfile();
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'No se pudo guardar tu perfil.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }
}
