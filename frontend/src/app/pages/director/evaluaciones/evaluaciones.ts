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
    { key: 'nombre', label: 'Nombre' },
    { key: 'orden', label: 'Orden' },
    { key: 'periodoAcademico', label: 'Período', render: (r) => r.periodoAcademico?.nombre ?? '—' },
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
