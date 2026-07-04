import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-asignaturas',
  templateUrl: './asignaturas.html',
  standalone: false,
})
export class AdminAsignaturas {
  title = 'Asignaturas';
  subtitle = 'Gestión de asignaturas del plan de estudios.';
  idKey = 'idAsignatura';
  emptyForm = { nombre: '', descripcion: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea' },
  ];
  canCreate = true;
  canDelete = true;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre o descripción...';
  searchFields = ['nombre', 'descripcion'];
  sortOptions = [{ key: 'nombre', label: 'Nombre' }];
  defaultSort = 'nombre';

  constructor(public api: ApiService) {}
}
