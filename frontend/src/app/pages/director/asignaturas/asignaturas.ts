import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig, CardConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-asignaturas',
  templateUrl: './asignaturas.html',
  standalone: false,
})
export class DirectorAsignaturas {
  title = 'Asignaturas';
  subtitle = 'Asignaturas disponibles en el colegio.';
  idKey = 'idAsignatura';
  emptyForm = { nombre: '', descripcion: '' };
  columns: ColumnConfig[] = [
    {
      key: 'nombre', label: 'Asignatura',
      render: (row) => {
        const initials = (row.nombre || '?').charAt(0).toUpperCase();
        return `<div class="d-flex align-items-center gap-2">
          <span class="entity-table-icon" style="background:#0ea5e918;color:#0ea5e9;border-color:#0ea5e930;">
            <i class="bi bi-pencil-square"></i>
          </span>
          <span class="fw-semibold" style="font-size:0.9rem;">${row.nombre || '—'}</span>
        </div>`;
      }
    },
    { key: 'descripcion', label: 'Descripción', render: (row) => row.descripcion || '<span class="text-ink-muted fst-italic">Sin descripción</span>' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea' },
  ];
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre o descripción...';
  searchFields = ['nombre', 'descripcion'];

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
