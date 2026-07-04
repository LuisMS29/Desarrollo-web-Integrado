import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-estudiantes',
  templateUrl: './estudiantes.html',
  standalone: false,
})
export class DirectorEstudiantes {
  title = 'Estudiantes';
  subtitle = 'Alumnado registrado en el colegio.';
  idKey = 'idEstudiante';
  emptyForm = { codigoEstudiante: '', nombres: '', apellidos: '', dni: '', fechaNacimiento: '', direccion: '', telefono: '' };
  columns: ColumnConfig[] = [
    { key: 'codigoEstudiante', label: 'Código' },
    { key: 'nombres', label: 'Nombres', render: (row) => row.nombres || '—' },
    { key: 'apellidos', label: 'Apellidos', render: (row) => row.apellidos || '—' },
    { key: 'dni', label: 'DNI', render: (row) => row.dni || '—' },
    { key: 'perfilCompleto', label: 'Perfil', render: (row) => row.perfilCompleto ? 'Completo' : 'Incompleto' },
  ];
  fields: FieldConfig[] = [
    { key: 'codigoEstudiante', label: 'Código de estudiante', type: 'text', required: true },
    { key: 'nombres', label: 'Nombres', type: 'text', required: true },
    { key: 'apellidos', label: 'Apellidos', type: 'text', required: true },
    { key: 'dni', label: 'DNI', type: 'text' },
    { key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
    { key: 'direccion', label: 'Dirección', type: 'text' },
    { key: 'telefono', label: 'Teléfono', type: 'text' },
  ];
  canCreate = false;
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre, apellido o código...';
  searchFields = ['nombres', 'apellidos', 'codigoEstudiante'];
  sortOptions = [{ key: 'nombres', label: 'Nombres' }, { key: 'apellidos', label: 'Apellidos' }];
  defaultSort = 'apellidos';

  constructor(public api: ApiService) {}
}
