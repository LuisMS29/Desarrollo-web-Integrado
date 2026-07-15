import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService, API_BASE_URL } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

const BACKEND_HOST = API_BASE_URL.replace(/\/api$/, '');

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './usuarios.html',
  standalone: false,
})
export class AdminUsuarios implements OnInit {
  usuarios: any[] = [];
  filtered: any[] = [];
  loading = true;
  error = '';

  search = '';
  rolFilter = 'TODOS';
  sortField = '';
  sortDir: 'asc' | 'desc' = 'asc';

  // ── Create form ──
  showForm = false;
  form = { username: '', email: '', password: '', rol: 'ESTUDIANTE' };
  formErrors: any = {};
  formError = '';
  saving = false;
  showPassword = false;

  // ── Edit form ──
  showEditForm = false;
  editingUser: any = null;
  editForm = { username: '', email: '', rol: 'ESTUDIANTE' };
  editFormErrors: any = {};
  editFormError = '';
  savingEdit = false;

  // ── Foto management ──
  uploadingFoto = false;
  editPreviewUrl: string | null = null;
  detailFotos: Record<number, string | null> = {};

  // ── Detail modal ──
  showDetail = false;
  detailUser: any = null;

  // ── Lightbox ──
  lightboxUrl: string | null = null;

  // ── Shared ──
  alertMessage = '';
  alertTitle = '';
  roles = ['ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE'];

  constructor(private api: ApiService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  normalizeFotoUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return BACKEND_HOST + url;
  }

  ngOnInit(): void {
    this.load();
  }

  // ── Computed stats ──

  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  get activos(): number {
    return this.usuarios.filter(u => u.activo).length;
  }

  get inactivos(): number {
    return this.usuarios.filter(u => !u.activo).length;
  }

  get activosFiltrados(): number {
    return this.filtered.filter(u => u.activo).length;
  }

  get passwordStrength(): number {
    const pwd = this.form.password || '';
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 15;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
    if (/\d/.test(pwd)) score += 20;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 20;
    return Math.min(100, score);
  }

  // ── Data ──

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.usuarios.listar().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.friendlyMessage || 'No se pudo cargar la lista de usuarios.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let result = [...this.usuarios];
    const term = this.search.trim().toLowerCase();
    if (term) {
      result = result.filter(u =>
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }
    if (this.rolFilter !== 'TODOS') {
      result = result.filter(u => u.rol === this.rolFilter);
    }
    if (this.sortField) {
      result.sort((a, b) => {
        const va = String(a[this.sortField] || '').toLowerCase();
        const vb = String(b[this.sortField] || '').toLowerCase();
        return this.sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    this.filtered = result;
  }

  // ── Form ──

  validateForm(): boolean {
    const errs: any = {};
    this.formError = '';
    if (!this.form.username.trim() || this.form.username.trim().length < 3) {
      errs.username = 'Mínimo 3 caracteres.';
    }
    if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
      errs.email = 'Ingresa un correo válido.';
    }
    if (!this.form.password || this.form.password.length < 6) {
      errs.password = 'Mínimo 6 caracteres.';
    }
    this.formErrors = errs;
    if (Object.keys(errs).length > 0) {
      this.formError = 'Revisa los campos marcados e inténtalo de nuevo.';
    }
    return Object.keys(errs).length === 0;
  }

  handleCreate(): void {
    if (!this.validateForm()) return;
    this.saving = true;
    this.api.auth.register(this.form).subscribe({
      next: () => {
        this.toast.success('Usuario creado correctamente.');
        this.showForm = false;
        this.load();
        this.saving = false;
      },
      error: (err: any) => {
        this.alertTitle = 'No se pudo crear el usuario';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Ocurrió un error al crear el usuario.';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Lightbox ──

  openLightbox(url: string | undefined | null): void {
    if (url) this.lightboxUrl = url;
  }

  closeLightbox(): void {
    this.lightboxUrl = null;
  }

  // ── Actions ──

  toggleActivo(usuario: any): void {
    const obs = usuario.activo
      ? this.api.usuarios.desactivar(usuario.idUsuario)
      : this.api.usuarios.activar(usuario.idUsuario);
    obs.subscribe({
      next: () => {
        this.toast.success(`Usuario "${usuario.username}" ${usuario.activo ? 'desactivado' : 'activado'}.`);
        this.load();
      },
      error: (err: any) => {
        this.alertTitle = 'Error';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Error al cambiar el estado.';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(usuario: any): void {
    this.api.usuarios.eliminar(usuario.idUsuario).subscribe({
      next: () => {
        this.toast.success(`Usuario "${usuario.username}" eliminado.`);
        this.load();
      },
      error: (err: any) => {
        this.alertTitle = 'Error';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Error al eliminar el usuario.';
        this.cdr.detectChanges();
      }
    });
  }

  // ── Detail ──

  openDetail(usuario: any): void {
    this.detailUser = usuario;
    this.showDetail = true;
  }

  // ── Foto helpers ──

  onTableFotoError(usuario: any): void {
    usuario.fotoUrl = null;
  }

  onDetailFotoError(): void {
    if (this.detailUser) {
      this.detailFotos[this.detailUser.idUsuario] = null;
      this.detailUser.fotoUrl = null;
    }
  }

  triggerEditFotoInput(): void {
    const input = document.getElementById('editFotoInput') as HTMLInputElement;
    input?.click();
  }

  onEditFotoSelected(event: any): void {
    const file: File = event.target?.files?.[0];
    if (!file || !this.editingUser) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.editPreviewUrl = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    // Upload
    this.uploadingFoto = true;
    this.cdr.detectChanges();

    this.api.usuarios.subirFoto(this.editingUser.idUsuario, file).subscribe({
      next: (res: any) => {
        this.toast.success('Foto de perfil actualizada.');
        this.editingUser.fotoUrl = res.fotoUrl;
        this.uploadingFoto = false;
        this.load();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.editFormError = err.error?.message || err.friendlyMessage || 'Error al subir la foto.';
        this.uploadingFoto = false;
        this.cdr.detectChanges();
      },
    });
  }

  eliminarFotoUsuario(): void {
    if (!this.editingUser) return;
    if (!confirm('¿Estás seguro de eliminar la foto de perfil de este usuario?')) return;

    this.uploadingFoto = true;
    this.editPreviewUrl = null;
    this.cdr.detectChanges();

    this.api.usuarios.eliminarFoto(this.editingUser.idUsuario).subscribe({
      next: () => {
        this.toast.success('Foto de perfil eliminada.');
        this.editingUser.fotoUrl = null;
        this.editPreviewUrl = null;
        this.uploadingFoto = false;
        this.load();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.editFormError = err.error?.message || err.friendlyMessage || 'Error al eliminar la foto.';
        this.uploadingFoto = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Edit ──

  openEdit(usuario: any): void {
    this.editingUser = usuario;
    this.editForm = {
      username: usuario.username || '',
      email: usuario.email || '',
      rol: usuario.rol || 'ESTUDIANTE'
    };
    this.editFormErrors = {};
    this.editFormError = '';
    this.editPreviewUrl = null;
    this.showEditForm = true;
    this.showDetail = false;
  }

  validateEditForm(): boolean {
    const errs: any = {};
    this.editFormError = '';
    if (!this.editForm.username.trim() || this.editForm.username.trim().length < 3) {
      errs.username = 'Mínimo 3 caracteres.';
    }
    if (!/^\S+@\S+\.\S+$/.test(this.editForm.email)) {
      errs.email = 'Ingresa un correo válido.';
    }
    this.editFormErrors = errs;
    if (Object.keys(errs).length > 0) {
      this.editFormError = 'Revisa los campos marcados e inténtalo de nuevo.';
    }
    return Object.keys(errs).length === 0;
  }

  handleUpdate(): void {
    if (!this.validateEditForm() || !this.editingUser) return;
    this.savingEdit = true;
    this.api.usuarios.actualizar(this.editingUser.idUsuario, {
      username: this.editForm.username,
      email: this.editForm.email,
      rol: this.editForm.rol
    }).subscribe({
      next: () => {
        this.toast.success(`Usuario "${this.editingUser.username}" actualizado.`);
        this.showEditForm = false;
        this.editingUser = null;
        this.editPreviewUrl = null;
        this.load();
        this.savingEdit = false;
      },
      error: (err: any) => {
        this.alertTitle = 'No se pudo actualizar';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Ocurrió un error al actualizar el usuario.';
        this.savingEdit = false;
        this.cdr.detectChanges();
      }
    });
  }
}
