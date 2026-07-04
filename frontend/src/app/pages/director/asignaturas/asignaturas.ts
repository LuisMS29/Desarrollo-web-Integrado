import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-asignaturas',
  templateUrl: './asignaturas.html',
  standalone: false,
})
export class DirectorAsignaturas {
  title = 'Asignaturas';
  subtitle = 'Asignaturas disponibles en el colegio.';
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
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre o descripción...';
  searchFields = ['nombre', 'descripcion'];

  constructor(public api: ApiService) {}
}
