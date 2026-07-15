import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig, CardConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-secciones',
  templateUrl: './secciones.html',
  standalone: false,
})
export class AdminSecciones {
  title = 'Secciones';
  subtitle = 'Gestión de secciones escolares.';
  headerIcon = 'bi-columns-gap';
  idKey = 'idSeccion';
  emptyForm = { nombre: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
  ];
  canCreate = true;
  canDelete = true;
  searchable = false;
  sortOptions = [{ key: 'nombre', label: 'Nombre' }];
  defaultSort = 'nombre';
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
