import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig, CardConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-asignaturas',
  templateUrl: './asignaturas.html',
  standalone: false,
})
export class AdminAsignaturas {
  title = 'Asignaturas';
  subtitle = 'Gestión de asignaturas del plan de estudios.';
  headerIcon = 'bi-book';
  idKey = 'idAsignatura';
  emptyForm = { nombre: '', descripcion: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea' },
  ];
  canCreate = true;
  canDelete = true;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre o descripción...';
  searchFields = ['nombre', 'descripcion'];
  sortOptions = [{ key: 'nombre', label: 'Nombre' }];
  defaultSort = 'nombre';
  cardConfig: CardConfig = {
    icon: 'bi-book',
    color: '#0284c7',
    fields: [
      {
        key: 'nombre', label: 'Asignatura',
        render: (r: any) => {
          return `<span style="font-weight:700;font-size:1.1rem;color:var(--ie-primary-dark);letter-spacing:-0.02em;">${r.nombre || '—'}</span>`;
        },
      },
      {
        key: 'descripcion', label: 'Descripción',
        render: (r: any) => {
          if (!r.descripcion) {
            return `<span style="font-size:0.82rem;color:var(--ie-ink-muted);font-style:italic;">Sin descripción</span>`;
          }
          return `<span style="font-size:0.82rem;color:var(--ie-ink-soft);line-height:1.5;display:block;">${r.descripcion}</span>`;
        },
      },
      {
        key: 'idAsignatura', label: '',
        render: (r: any) => {
          return `<span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.68rem;color:var(--ie-ink-muted);font-family:'JetBrains Mono',monospace;">
            <i class="bi bi-tag" style="font-size:0.6rem;color:var(--ie-ink-soft);"></i>
            ID-${String(r.idAsignatura || '—').padStart(3, '0')}
          </span>`;
        },
      },
    ],
  };

  constructor(public api: ApiService) {}
}
