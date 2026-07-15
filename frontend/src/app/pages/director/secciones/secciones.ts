import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig, CardConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-secciones',
  templateUrl: './secciones.html',
  standalone: false,
})
export class DirectorSecciones {
  title = 'Secciones';
  subtitle = 'Secciones de cada grado.';
  idKey = 'idSeccion';
  emptyForm = { nombre: '' };
  columns: ColumnConfig[] = [
    {
      key: 'nombre', label: 'Sección',
      render: (row) => `<span class="entity-table-badge entity-table-badge-purple"><i class="bi bi-columns-gap me-1"></i>${row.nombre || '—'}</span>`
    },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
  ];
  canDelete = false;

  cardConfig: CardConfig = {
    icon: 'bi-columns-gap',
    color: '#0891b2',
    fields: [
      {
        key: 'nombre', label: 'Sección',
        render: (r: any) => {
          return `<span style="font-weight:700;font-size:1.2rem;color:var(--ie-primary-dark);letter-spacing:-0.02em;">${r.nombre || '—'}</span>`;
        },
      },
      {
        key: 'idSeccion', label: 'Código',
        render: (r: any) => {
          return `<span style="display:inline-flex;align-items:center;gap:0.3rem;font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--ie-ink-muted);">
            <i class="bi bi-hash" style="font-size:0.6rem;color:var(--ie-ink-soft);"></i>
            SEC-${String(r.idSeccion || '—').padStart(3, '0')}
          </span>`;
        },
      },
    ],
  };

  constructor(public api: ApiService) {}
}
