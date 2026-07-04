import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-secciones',
  templateUrl: './secciones.html',
  standalone: false,
})
export class AdminSecciones {
  title = 'Secciones';
  subtitle = 'Gestión de secciones.';
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

  constructor(public api: ApiService) {}
}
