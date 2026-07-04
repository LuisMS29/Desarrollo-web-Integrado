import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-secciones',
  templateUrl: './secciones.html',
  standalone: false,
})
export class DirectorSecciones {
  title = 'Secciones';
  subtitle = 'Secciones de cada grado.';
  idKey = 'idSeccion';
  emptyForm = { nombre: '' };
  columns: ColumnConfig[] = [
    { key: 'nombre', label: 'Nombre' },
  ];
  fields: FieldConfig[] = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
  ];
  canDelete = false;

  constructor(public api: ApiService) {}
}
