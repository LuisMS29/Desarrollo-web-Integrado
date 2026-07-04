import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

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

  showForm = false;
  form = { username: '', email: '', password: '', rol: 'ESTUDIANTE' };
  formErrors: any = {};
  saving = false;
  alertMessage = '';
  alertTitle = '';

  roles = ['ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE'];

  constructor(private api: ApiService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.usuarios.listar().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.friendlyMessage || 'No se pudo cargar.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let result = [...this.usuarios];
    const term = this.search.trim().toLowerCase();
    if (term) {
      result = result.filter(u => u.username?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term));
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

  validateForm(): boolean {
    const errs: any = {};
    if (!this.form.username.trim() || this.form.username.trim().length < 3) errs.username = 'Mínimo 3 caracteres.';
    if (!/^\S+@\S+\.\S+$/.test(this.form.email)) errs.email = 'Email inválido.';
    if (!this.form.password || this.form.password.length < 6) errs.password = 'Mínimo 6 caracteres.';
    this.formErrors = errs;
    return Object.keys(errs).length === 0;
  }

  handleCreate(): void {
    if (!this.validateForm()) return;
    this.saving = true;
    this.api.auth.register(this.form).subscribe({
      next: () => {
        this.toast.success('Usuario creado.');
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

  toggleActivo(usuario: any): void {
    const obs = usuario.activo ? this.api.usuarios.desactivar(usuario.idUsuario) : this.api.usuarios.activar(usuario.idUsuario);
    obs.subscribe({
      next: () => {
        this.toast.success(`Usuario "${usuario.username}" ${usuario.activo ? 'desactivado' : 'activado'}.`);
        this.load();
      },
      error: (err: any) => {
        this.alertTitle = 'Error';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Error al cambiar estado.';
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
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Error al eliminar.';
        this.cdr.detectChanges();
      }
    });
  }
}
