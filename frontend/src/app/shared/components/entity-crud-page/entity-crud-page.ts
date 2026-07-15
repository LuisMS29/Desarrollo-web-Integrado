import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (row: any) => string;
}

export interface CardConfig {
  icon?: string;
  color?: string;
  fields: { key: string; label: string; render?: (row: any) => string }[];
}

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'date' | 'boolean' | 'select' | 'relation';
  required?: boolean;
  options?: { value: string; label: string }[];
  relation?: { idKey: string; labelFn: (opt: any) => string };
}

@Component({
  selector: 'app-entity-crud-page',
  templateUrl: './entity-crud-page.html',
  standalone: false,
})
export class EntityCrudPage implements OnInit {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() headerIcon = '';
  @Input() api!: any;
  @Input() idKey = 'id';
  @Input() columns: ColumnConfig[] = [];
  @Input() fields: FieldConfig[] = [];
  @Input() emptyForm: any = {};
  @Input() buildPayload?: (form: any, fields: FieldConfig[]) => any;
  @Input() canCreate = true;
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input() canView = true;
  @Input() searchable = false;
  @Input() searchPlaceholder = 'Buscar...';
  @Input() searchFields: string[] = [];
  @Input() sortOptions: { key: string; label: string }[] = [];
  @Input() defaultSort = '';
  @Input() relationLoaders?: { [key: string]: () => any };
  @Input() viewMode: 'table' | 'cards' = 'table';
  @Input() cardConfig?: CardConfig;
  @Input()  cardColorRender?: (row: any) => string;
  @Input() accentColor = 'var(--ie-accent)';
  @Input() entityLabel = 'registro';
  @Input() rowCountLabel = '';
  @Input() colorGradient = 'linear-gradient(135deg, var(--ie-accent), var(--ie-accent-dark))';
  @Input() showRowNumber = false;
  /** Custom delete function override. If provided, used instead of api.eliminar */
  @Input() deleteFn?: (id: number) => any;

  rows: any[] = [];
  filtered: any[] = [];
  loading = true;
  error = '';

  search = '';
  sortField = '';
  sortDir: 'asc' | 'desc' = 'asc';

  showForm = false;
  editingRow: any = null;
  form: any = {};
  saving = false;
  formError = '';
  relationOptions: any = {};
  relationsLoading = false;

  showViewModal = false;
  viewingRow: any = null;

  deleteTarget: any = null;
  deleteLoading = false;
  alertMessage = '';
  alertTitle = '';

  constructor(private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sortField = this.defaultSort;
    this.load();
    this.loadRelations();
  }

  private loadRelations(): void {
    if (!this.relationLoaders) return;
    this.relationsLoading = true;
    const keys = Object.keys(this.relationLoaders);
    let pending = keys.length;
    for (const key of keys) {
      this.relationLoaders[key]().subscribe({
        next: (data: any) => {
          this.relationOptions[key] = data || [];
          pending--;
          if (pending <= 0) this.relationsLoading = false;
        },
        error: () => {
          this.relationOptions[key] = [];
          pending--;
          if (pending <= 0) this.relationsLoading = false;
        }
      });
    }
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.listar().subscribe({
      next: (data: any) => {
        this.rows = data;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.friendlyMessage || 'No se pudo cargar la información.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private getField(obj: any, path: string): any {
    if (!path.includes('.')) return obj[path];
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : ''), obj);
  }

  applyFilter(): void {
    let result = [...this.rows];
    const term = this.search.trim().toLowerCase();
    if (term && this.searchFields.length > 0) {
      result = result.filter(row => this.searchFields.some(k => String(this.getField(row, k) || '').toLowerCase().includes(term)));
    }
    if (this.sortField) {
      result.sort((a, b) => {
        const va = String(this.getField(a, this.sortField) || '').toLowerCase();
        const vb = String(this.getField(b, this.sortField) || '').toLowerCase();
        return this.sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    this.filtered = result;
  }

  openCreate(): void {
    this.editingRow = null;
    this.form = { ...this.emptyForm };
    this.formError = '';
    this.showForm = true;
  }

  openEdit(row: any): void {
    this.editingRow = row;
    this.form = { ...this.emptyForm };
    for (const f of this.fields) {
      if (f.type === 'relation') {
        this.form[f.key] = row[f.key]?.[f.relation!.idKey] ?? '';
      } else {
        this.form[f.key] = row[f.key] ?? (f.type === 'boolean' ? false : '');
      }
    }
    this.formError = '';
    this.showForm = true;
  }

  handleChange(field: FieldConfig, value: any): void {
    this.form[field.key] = value;
  }

  validate(): boolean {
    for (const f of this.fields) {
      if (f.required && (this.form[f.key] === '' || this.form[f.key] === null || this.form[f.key] === undefined)) {
        this.formError = `El campo "${f.label}" es obligatorio.`;
        return false;
      }
    }
    this.formError = '';
    return true;
  }

  handleSubmit(): void {
    if (!this.validate()) return;
    this.saving = true;
    const payload = this.buildPayload ? this.buildPayload(this.form, this.fields) : this.defaultBuildPayload(this.form, this.fields);
    const obs = this.editingRow ? this.api.actualizar(this.editingRow[this.idKey], payload) : this.api.crear(payload);
    obs.subscribe({
      next: () => {
        this.toast.success(this.editingRow ? 'Registro actualizado.' : 'Registro creado.');
        this.showForm = false;
        this.load();
        this.saving = false;
      },
      error: (err: any) => {
        this.alertTitle = 'No se pudo guardar';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Ocurrió un error al intentar guardar.';
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFieldDisplay(field: FieldConfig, row: any): string {
    if (field.type === 'select' && field.options) {
      const val = row[field.key];
      const opt = field.options.find(o => o.value === val);
      return opt?.label ?? val ?? '—';
    }
    if (field.type === 'relation' && field.relation) {
      const val = row[field.key];
      return val ? field.relation.labelFn(val) : '—';
    }
    return row[field.key] ?? '—';
  }

  openView(row: any): void {
    this.viewingRow = row;
    this.showViewModal = true;
  }

  confirmDelete(row: any): void {
    this.deleteTarget = row;
  }

  handleDelete(): void {
    if (!this.deleteTarget) return;
    this.deleteLoading = true;
    const id = this.deleteTarget[this.idKey];
    const obs = this.deleteFn ? this.deleteFn(id) : this.api.eliminar(id);
    obs.subscribe({
      next: () => {
        this.toast.success('Registro eliminado.');
        this.deleteTarget = null;
        this.load();
        this.deleteLoading = false;
      },
      error: (err: any) => {
        this.alertTitle = 'No se pudo eliminar';
        this.alertMessage = err.error?.message || err.friendlyMessage || 'Ocurrió un error al intentar eliminar.';
        this.deleteTarget = null;
        this.deleteLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCardAccent(row: any): string {
    if (this.cardColorRender) {
      return this.cardColorRender(row);
    }
    return this.cardConfig?.color || 'var(--ie-accent)';
  }

  private defaultBuildPayload(form: any, fields: FieldConfig[]): any {
    const payload: any = {};
    for (const f of fields) {
      if (f.type === 'relation') {
        payload[f.key] = form[f.key] ? { [f.relation!.idKey]: Number(form[f.key]) } : null;
      } else if (f.type === 'number') {
        payload[f.key] = form[f.key] === '' ? null : Number(form[f.key]);
      } else {
        payload[f.key] = form[f.key];
      }
    }
    return payload;
  }
}
