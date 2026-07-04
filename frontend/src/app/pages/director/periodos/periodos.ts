import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

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
    { key: 'anio', label: 'Año' },
    { key: 'fechaInicio', label: 'Fecha inicio' },
    { key: 'fechaFin', label: 'Fecha fin' },
    { key: 'activo', label: 'Activo', render: (r) => r.activo ? 'Sí' : 'No' },
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
