import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig, CardConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-grados',
  templateUrl: './grados.html',
  standalone: false,
})
export class AdminGrados {
  title = 'Grados';
  subtitle = 'Gestión de grados académicos.';
  headerIcon = 'bi-ladder';
  idKey = 'idGrado';
  emptyForm = { nombre: '', nivel: '' };

  nivelColors: Record<string, string> = {
    'PRIMARIA': '#8b5cf6',
    'SECUNDARIA': '#0ea5e9',
  };
  nivelIcons: Record<string, string> = {
    'PRIMARIA': 'bi-backpack',
    'SECUNDARIA': 'bi-mortarboard-fill',
  };

  getCardColor(row: any): string {
    return this.nivelColors[row.nivel] || '#64748b';
  }

  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'nivel', label: 'Nivel' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'nivel', label: 'Nivel', type: 'select', required: true, options: [
      { value: 'PRIMARIA', label: 'Primaria' },
      { value: 'SECUNDARIA', label: 'Secundaria' },
    ]},
  ];
  canCreate = true;
  canDelete = true;
  searchable = false;
  sortOptions = [{ key: 'nombre', label: 'Nombre' }];
  defaultSort = 'nombre';

  cardConfig: CardConfig = {
    icon: 'bi-ladder',
    color: '#8b5cf6',
    fields: [
      {
        key: 'nombre', label: 'Grado',
        render: (r: any) => {
          const color = this.nivelColors[r.nivel] || '#64748b';
          return `<span style="font-weight:700;font-size:1.15rem;color:var(--ie-primary-dark);letter-spacing:-0.02em;">${r.nombre || '—'}</span>`;
        },
      },
      {
        key: 'nivel', label: 'Nivel',
        render: (r: any) => {
          if (!r.nivel) return '<span class="text-ink-muted">—</span>';
          const color = this.nivelColors[r.nivel];
          const label = r.nivel === 'PRIMARIA' ? 'Primaria' : 'Secundaria';
          const icon = this.nivelIcons[r.nivel] || 'bi-book';
          return `<span style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.25em 0.8em;border-radius:999px;font-size:0.72rem;font-weight:600;background:${color}16;color:${color};border:1px solid ${color}22;">
            <i class="bi ${icon}" style="font-size:0.65rem;"></i>
            ${label}
          </span>`;
        },
      },
    ],
  };

  constructor(public api: ApiService) {}
}
