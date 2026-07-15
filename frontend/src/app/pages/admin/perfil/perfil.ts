import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-perfil',
  templateUrl: './perfil.html',
  standalone: false,
})
export class AdminPerfil implements OnInit {
  form = { email: '' };
  saving = false;
  uploading = false;
  errorMsg = '';
  previewUrl: string | null = null;
  fotoPreviewOpen = false;

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user) {
      this.form.email = user.email || '';
      this.previewUrl = user.fotoUrl || null;
    }
    this.cdr.detectChanges();
  }

  onFileSelected(event: any): void {
    const file: File = event.target?.files?.[0];
    if (!file) return;

    // Preview local
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewUrl = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    // Clear old fotoUrl immediately so admin layout doesn't load the stale URL
    this.auth.clearFotoUrl();

    // Upload
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

  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  changingPassword = false;

  cambiarPassword(): void {
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.errorMsg = 'Todos los campos son obligatorios.';
      return;
    }
    if (newPassword.length < 6) {
      this.errorMsg = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (newPassword !== confirmPassword) {
      this.errorMsg = 'Las contraseñas nuevas no coinciden.';
      return;
    }

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

    // Clear optimistically so the image disappears from the layout immediately
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
    this.saving = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.api.auth.actualizarPerfil({ email: this.form.email }).subscribe({
      next: () => {
        this.toast.success('Perfil actualizado exitosamente.');
        this.auth.refreshProfile();
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || err.friendlyMessage || 'No se pudo actualizar el perfil.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }
}
