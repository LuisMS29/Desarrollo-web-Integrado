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
  emptyForm = { nombre: '', periodoAcademico: '', descripcion: '', fecha: '', peso: '', tipo: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'periodoAcademico', label: 'Período', render: (r) => r.periodoAcademico?.nombre ?? '—' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'peso', label: 'Peso' },
    { key: 'tipo', label: 'Tipo' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'periodoAcademico', label: 'Período académico', type: 'relation', required: true, relation: { idKey: 'idPeriodo', labelFn: (o) => `${o.nombre} (${o.anio})` } },
    { key: 'descripcion', label: 'Descripción', type: 'textarea' },
    { key: 'fecha', label: 'Fecha', type: 'date' },
    { key: 'peso', label: 'Peso', type: 'number' },
    { key: 'tipo', label: 'Tipo', type: 'select', options: [{ value: 'PRACTICA', label: 'Práctica' }, { value: 'EXAMEN', label: 'Examen' }, { value: 'PROYECTO', label: 'Proyecto' }] },
  ];
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre...';
  searchFields = ['nombre'];

  constructor(public api: ApiService) {}
}
