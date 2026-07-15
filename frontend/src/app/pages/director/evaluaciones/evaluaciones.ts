import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-evaluaciones',
  templateUrl: './evaluaciones.html',
  standalone: false,
})
export class DirectorEvaluaciones {
  title = 'Evaluaciones';
  subtitle = 'Evaluaciones del período académico.';
  idKey = 'idEvaluacion';
  emptyForm = { nombre: '', orden: '', periodoAcademico: '' };
  columns: ColumnConfig[] = [
    {
      key: 'nombre', label: 'Evaluación',
      render: (r) => `<div class="fw-semibold" style="font-size:0.9rem;">${r.nombre || '—'}</div>`
    },
    {
      key: 'orden', label: 'Orden',
      render: (r) => `<span class="entity-table-badge entity-table-badge-gray"><i class="bi bi-hash me-1"></i>${r.orden || '—'}</span>`
    },
    {
      key: 'periodoAcademico', label: 'Período',
      render: (r) => r.periodoAcademico
        ? `<span class="entity-table-badge entity-table-badge-primary"><i class="bi bi-calendar3 me-1"></i>${r.periodoAcademico.nombre || ''}</span>`
        : '<span class="text-ink-muted fst-italic">—</span>'
    },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'orden', label: 'Orden', type: 'number', required: true },
    { key: 'periodoAcademico', label: 'Período académico', type: 'relation', required: true, relation: { idKey: 'idPeriodo', labelFn: (o) => `${o.nombre} (${o.anio})` } },
  ];
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre...';
  searchFields = ['nombre'];
  relationLoaders = {
    periodoAcademico: () => this.api.periodos.listar(),
  };

  constructor(public api: ApiService) {}
}
