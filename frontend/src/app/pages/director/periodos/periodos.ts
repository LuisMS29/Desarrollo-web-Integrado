import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('T')[0].split(' ')[0].split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

@Component({
  selector: 'app-director-periodos',
  templateUrl: './periodos.html',
  standalone: false,
})
export class DirectorPeriodos {
  title = 'Períodos académicos';
  subtitle = 'Períodos académicos del colegio.';
  idKey = 'idPeriodo';
  emptyForm = { nombre: '', anio: new Date().getFullYear(), fechaInicio: '', fechaFin: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'anio', label: 'Año',
      render: (r) => `<span class="fw-semibold">${r.anio || '—'}</span>`
    },
    {
      key: 'fechaInicio', label: 'Fecha inicio',
      render: (r) => r.fechaInicio
        ? `<span><i class="bi bi-calendar3 me-1 text-ink-muted"></i>${formatDate(r.fechaInicio)}</span>`
        : '<span class="text-ink-muted fst-italic">—</span>'
    },
    {
      key: 'fechaFin', label: 'Fecha fin',
      render: (r) => r.fechaFin
        ? `<span><i class="bi bi-calendar3 me-1 text-ink-muted"></i>${formatDate(r.fechaFin)}</span>`
        : '<span class="text-ink-muted fst-italic">—</span>'
    },
    {
      key: 'activo', label: 'Estado',
      render: (r) => r.activo
        ? '<span class="entity-table-badge entity-table-badge-success"><i class="bi bi-check-circle-fill me-1"></i>Activo</span>'
        : '<span class="entity-table-badge entity-table-badge-gray"><i class="bi bi-x-circle-fill me-1"></i>Inactivo</span>'
    },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'anio', label: 'Año', type: 'number', required: true },
    { key: 'fechaInicio', label: 'Fecha inicio', type: 'date', required: true },
    { key: 'fechaFin', label: 'Fecha fin', type: 'date', required: true },
  ];
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre...';
  searchFields = ['nombre'];
  sortOptions = [{ key: 'anio', label: 'Año' }, { key: 'nombre', label: 'Nombre' }];
  defaultSort = 'anio';

  constructor(public api: ApiService) {}
}
