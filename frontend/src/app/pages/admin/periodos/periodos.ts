import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-periodos',
  templateUrl: './periodos.html',
  standalone: false,
})
export class AdminPeriodos {
  title = 'Períodos académicos';
  subtitle = 'Gestión de períodos o ciclos escolares.';
  headerIcon = 'bi-calendar-event';
  idKey = 'idPeriodo';
  emptyForm = { nombre: '', anio: new Date().getFullYear(), fechaInicio: '', fechaFin: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'anio', label: 'Año' },
    { key: 'fechaInicio', label: 'Inicio' },
    { key: 'fechaFin', label: 'Fin' },
    { key: 'activo', label: 'Activo', render: (row) => row.activo ? 'Sí' : 'No' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'anio', label: 'Año', type: 'number', required: true },
    { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true },
    { key: 'fechaFin', label: 'Fecha de fin', type: 'date', required: true },
  ];
  canCreate = true;
  canDelete = true;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre...';
  searchFields = ['nombre'];
  sortOptions = [{ key: 'anio', label: 'Año' }, { key: 'nombre', label: 'Nombre' }];
  defaultSort = 'anio';

  constructor(public api: ApiService) {}
}
