import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-cursos',
  templateUrl: './cursos.html',
  standalone: false,
})
export class AdminCursos implements OnInit {
  // ── Data ──
  cursos: any[] = [];
  filtered: any[] = [];
  loading = true;
  error = '';

  // ── Filters ──
  search = '';
  gradoFilter = 'TODOS';
  periodoFilter = 'TODOS';
  gradosDisponibles: string[] = [];
  periodosDisponibles: string[] = [];

  // ── Stats ──
  get totalCursos(): number { return this.cursos.length; }
  get gradosUnicos(): number {
    return new Set(this.cursos.map(c => c.grado?.nombre).filter(Boolean)).size;
  }
  get docentesUnicos(): number {
    return new Set(this.cursos.map(c => c.docente?.idDocente).filter(Boolean)).size;
  }
  get periodosUnicos(): number {
    return new Set(this.cursos.map(c => c.periodoAcademico?.nombre).filter(Boolean)).size;
  }

  // ── Color palette by grado ──
  // 1° verde | 2° celeste | 3° violeta | 4° ámbar | 5° rosa | 6° teal
  gradeColors: Record<string, string> = {
    '1°': '#10b981',
    '2°': '#0ea5e9',
    '3°': '#8b5cf6',
    '4°': '#f59e0b',
    '5°': '#f43f5e',
    '6°': '#14b8a6',
  };

  getGradeColor(grado: string): string {
    for (const [key, color] of Object.entries(this.gradeColors)) {
      if (grado?.startsWith(key)) return color;
    }
    return '#64748b';
  }

  getSubjectIconStyle(grado: string): Record<string, string> {
    const c = this.getGradeColor(grado);
    return {
      'background': `${c}18`,
      'color': c,
      'border-color': `${c}30`,
    };
  }

  getGradeInitials(name: string): string {
    if (!name) return '?';
    return name.replace(/[°º]/, '').trim().substring(0, 2);
  }

  // ── Form modal ──
  showForm = false;
  editingRow: any = null;
  saving = false;
  form: any = {};
  formError = '';
  relationOptions: any = {};
  relationsLoading = false;

  // ── Delete ──
  deleteTarget: any = null;
  deleteLoading = false;

  // ── Alert ──
  alertMessage = '';
  alertTitle = '';

  constructor(
    public api: ApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRelations().then(() => this.load());
  }

  async loadRelations(): Promise<void> {
    this.relationsLoading = true;
    const loaders: Record<string, () => any> = {
      asignatura: () => this.api.asignaturas.listar(),
      grado: () => this.api.grados.listar(),
      seccion: () => this.api.secciones.listar(),
      periodoAcademico: () => this.api.periodos.listar(),
      docente: () => this.api.docentes.listar(),
    };
    const keys = Object.keys(loaders);
    let pending = keys.length;
    return new Promise(resolve => {
      for (const key of keys) {
        loaders[key]().subscribe({
          next: (data: any) => {
            this.relationOptions[key] = data || [];
            pending--;
            if (pending <= 0) { this.relationsLoading = false; resolve(); }
          },
          error: () => {
            this.relationOptions[key] = [];
            pending--;
            if (pending <= 0) { this.relationsLoading = false; resolve(); }
          }
        });
      }
    });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.cursos.listar().subscribe({
      next: (data: any) => {
        this.cursos = data || [];
        this.extractFilters();
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.friendlyMessage || 'No se pudieron cargar los cursos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  extractFilters(): void {
    const grados = new Set<string>();
    const periodos = new Set<string>();
    for (const c of this.cursos) {
      if (c.grado?.nombre) grados.add(c.grado.nombre);
      if (c.periodoAcademico?.nombre) periodos.add(c.periodoAcademico.nombre);
    }
    this.gradosDisponibles = Array.from(grados).sort();
    this.periodosDisponibles = Array.from(periodos).sort();
  }

  applyFilter(): void {
    let result = [...this.cursos];
    const term = this.search.trim().toLowerCase();
    if (term) {
      result = result.filter(c =>
        c.asignatura?.nombre?.toLowerCase().includes(term) ||
        c.grado?.nombre?.toLowerCase().includes(term) ||
        c.docente?.nombres?.toLowerCase().includes(term) ||
        c.docente?.apellidos?.toLowerCase().includes(term)
      );
    }
    if (this.gradoFilter !== 'TODOS') {
      result = result.filter(c => c.grado?.nombre === this.gradoFilter);
    }
    if (this.periodoFilter !== 'TODOS') {
      result = result.filter(c => c.periodoAcademico?.nombre === this.periodoFilter);
    }
    this.filtered = result;
  }

  // ── Form ──

  openCreate(): void {
    this.editingRow = null;
    this.form = { asignatura: '', grado: '', seccion: '', periodoAcademico: '', docente: '' };
    this.formError = '';
    this.showForm = true;
  }

  openEdit(row: any): void {
    this.editingRow = row;
    this.form = {
      asignatura: row.asignatura?.idAsignatura ?? '',
      grado: row.grado?.idGrado ?? '',
      seccion: row.seccion?.idSeccion ?? '',
      periodoAcademico: row.periodoAcademico?.idPeriodo ?? '',
      docente: row.docente?.idDocente ?? '',
    };
    this.formError = '';
    this.showForm = true;
  }

  handleChange(key: string, value: any): void {
    this.form[key] = value;
  }

  validate(): boolean {
    if (!this.form.asignatura) { this.formError = 'Selecciona una asignatura.'; return false; }
    if (!this.form.grado) { this.formError = 'Selecciona un grado.'; return false; }
    if (!this.form.seccion) { this.formError = 'Selecciona una sección.'; return false; }
    if (!this.form.periodoAcademico) { this.formError = 'Selecciona un período.'; return false; }
    if (!this.form.docente) { this.formError = 'Selecciona un docente.'; return false; }
    this.formError = '';
    return true;
  }

  handleSubmit(): void {
    if (!this.validate()) return;
    this.saving = true;
    const idKeyMap: Record<string, string> = {
      asignatura: 'idAsignatura',
      grado: 'idGrado',
      seccion: 'idSeccion',
      periodoAcademico: 'idPeriodo',
      docente: 'idDocente',
    };
    const payload: any = {};
    for (const key of ['asignatura', 'grado', 'seccion', 'periodoAcademico', 'docente']) {
      payload[key] = this.form[key] ? { [idKeyMap[key]]: Number(this.form[key]) } : null;
    }

    const idKey = 'idCurso';
    const obs = this.editingRow
      ? this.api.cursos.actualizar(this.editingRow[idKey], payload)
      : this.api.cursos.crear(payload);

    obs.subscribe({
      next: () => {
        this.toast.success(this.editingRow ? 'Curso actualizado.' : 'Curso creado.');
        this.showForm = false;
        this.load();
        this.saving = false;
      },
      error: (err: any) => {
        this.alertTitle = 'No se pudo guardar';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Error al guardar el curso.';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(row: any): void {
    this.deleteTarget = row;
  }

  handleDelete(): void {
    if (!this.deleteTarget) return;
    this.deleteLoading = true;
    this.api.cursos.eliminar(this.deleteTarget.idCurso).subscribe({
      next: () => {
        this.toast.success('Curso eliminado.');
        this.deleteTarget = null;
        this.load();
        this.deleteLoading = false;
      },
      error: (err: any) => {
        this.alertTitle = 'No se pudo eliminar';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Error al eliminar.';
        this.deleteTarget = null;
        this.deleteLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


}
