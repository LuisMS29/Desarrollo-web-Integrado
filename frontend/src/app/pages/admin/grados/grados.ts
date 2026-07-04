import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-grados',
  templateUrl: './grados.html',
  standalone: false,
})
export class AdminGrados {
  title = 'Grados';
  subtitle = 'Gestión de grados académicos.';
  idKey = 'idGrado';
  emptyForm = { nombre: '', nivel: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'nivel', label: 'Nivel' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'nivel', label: 'Nivel', type: 'select', required: true, options: [
      { value: 'PRIMARIA', label: 'Primaria' },
      { value: 'SECUNDARIA', label: 'Secundaria' },
    ]},
  ];
  canCreate = true;
  canDelete = true;
  searchable = false;
  sortOptions = [{ key: 'nombre', label: 'Nombre' }];
  defaultSort = 'nombre';

  constructor(public api: ApiService) {}
}
