import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-docente-comunicados',
  templateUrl: './comunicados.html',
  standalone: false,
})
export class DocenteComunicados implements OnInit {
  showForm = false;
  editingComunicado: any = null;
  form: any = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '', cursoId: null };
  saving = false;
  refreshKey = 0;

  cursos: any[] = [];
  cursosIds: number[] = [];
  loadingCursos = false;

  // Mis comunicados
  misComunicados: any[] = [];
  loadingMisComunicados = false;
  misComunicadosError = '';
  deleteTarget: any = null;
  deleting = false;

  dirigidoA = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'DOCENTE', label: 'Solo docentes' },
    { value: 'CURSO', label: 'Estudiantes de mi curso' },
  ];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.auth.user();
    if (user?.idPerfil) {
      this.loadingCursos = true;
      this.api.docentePanel.listarMisCursos(user.idPerfil).subscribe({
        next: (data: any) => {
          this.cursos = data || [];
          this.cursosIds = this.cursos.map((c: any) => c.idCurso);
          this.loadingCursos = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadingCursos = false;
          this.cdr.detectChanges();
        }
      });
    }
    this.cargarMisComunicados();
  }

  onDirigidoAChange(): void {
    if (this.form.dirigidoA !== 'CURSO') {
      this.form.cursoId = null;
    }
  }

  get isEditing(): boolean {
    return this.editingComunicado !== null;
  }

  get formTitle(): string {
    return this.isEditing ? 'Editar comunicado' : 'Redactar comunicado';
  }

  get formSubtitle(): string {
    return this.isEditing
      ? 'Modifica los campos y guarda los cambios.'
      : 'Completa los campos para publicar un nuevo aviso';
  }

  get formBtnLabel(): string {
    return this.isEditing ? 'Guardar cambios' : 'Publicar';
  }

  handleSubmit(): void {
    if (!this.form.titulo.trim() || !this.form.contenido.trim()) return;
    if (this.form.dirigidoA === 'CURSO' && !this.form.cursoId) {
      this.toast.warning('Selecciona un curso para dirigir el comunicado.');
      return;
    }
    this.saving = true;
    const payload: any = {
      titulo: this.form.titulo,
      contenido: this.form.contenido,
      dirigidoA: this.form.dirigidoA,
      fechaExpiracion: this.form.fechaExpiracion || null,
    };
    if (this.form.dirigidoA === 'CURSO') {
      payload.cursoId = this.form.cursoId;
    }

    const obs = this.isEditing
      ? this.api.comunicados.actualizarDocente(this.editingComunicado.idComunicado, payload)
      : this.api.comunicados.crear(payload);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEditing ? 'Comunicado actualizado.' : 'Comunicado publicado.');
        this.form = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '', cursoId: null };
        this.editingComunicado = null;
        this.showForm = false;
        this.refreshKey++;
        this.cargarMisComunicados();
        this.saving = false;
      },
      error: (err: any) => {
        this.toast.error(err.friendlyMessage || 'No se pudo guardar.');
        this.saving = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingComunicado = null;
      this.form = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '', cursoId: null };
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingComunicado = null;
    this.form = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '', cursoId: null };
  }

  editar(com: any): void {
    this.editingComunicado = com;
    this.form = {
      titulo: com.titulo || '',
      contenido: com.contenido || '',
      dirigidoA: com.dirigidoA || 'TODOS',
      fechaExpiracion: com.fechaExpiracion || '',
      cursoId: com.curso?.idCurso || null,
    };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmDelete(com: any): void {
    this.deleteTarget = com;
  }

  handleDelete(): void {
    if (!this.deleteTarget) return;
    this.deleting = true;
    this.api.comunicados.eliminarDocente(this.deleteTarget.idComunicado).subscribe({
      next: () => {
        this.toast.success('Comunicado eliminado.');
        this.deleteTarget = null;
        this.cargarMisComunicados();
        this.refreshKey++;
        this.deleting = false;
      },
      error: (err: any) => {
        this.toast.error(err.friendlyMessage || 'No se pudo eliminar.');
        this.deleteTarget = null;
        this.deleting = false;
      }
    });
  }

  cargarMisComunicados(): void {
    this.loadingMisComunicados = true;
    this.misComunicadosError = '';
    this.api.comunicados.listarMisComunicados().subscribe({
      next: (data: any) => {
        this.misComunicados = data || [];
        this.loadingMisComunicados = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.misComunicadosError = err.friendlyMessage || 'No se pudieron cargar tus comunicados.';
        this.loadingMisComunicados = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCursoLabel(curso: any): string {
    if (!curso) return '—';
    const grado = curso.grado?.nombre || '';
    const seccion = curso.seccion?.nombre || '';
    const asignatura = curso.asignatura?.nombre || '';
    return `${asignatura} - ${grado}${seccion}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const parts = dateStr.split('T')[0].split(' ')[0].split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
}
