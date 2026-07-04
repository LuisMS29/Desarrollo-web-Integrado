import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-docentes',
  templateUrl: './docentes.html',
  standalone: false,
})
export class AdminDocentes {
  title = 'Docentes';
  subtitle = 'Personal docente registrado en el colegio.';
  idKey = 'idDocente';
  emptyForm = { codigoDocente: '', nombres: '', apellidos: '', dni: '', especialidad: '', telefono: '', email: '' };
  columns: ColumnConfig[] = [
    { key: 'codigoDocente', label: 'Código' },
    { key: 'nombres', label: 'Nombres', render: (row) => row.nombres || '—' },
    { key: 'apellidos', label: 'Apellidos', render: (row) => row.apellidos || '—' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'email', label: 'Email' },
    { key: 'perfilCompleto', label: 'Perfil', render: (row) => row.perfilCompleto ? 'Completo' : 'Incompleto' },
  ];
  fields: FieldConfig[] = [
    { key: 'codigoDocente', label: 'Código de docente', type: 'text', required: true },
    { key: 'nombres', label: 'Nombres', type: 'text', required: true },
    { key: 'apellidos', label: 'Apellidos', type: 'text', required: true },
    { key: 'dni', label: 'DNI', type: 'text' },
    { key: 'especialidad', label: 'Especialidad', type: 'text' },
    { key: 'telefono', label: 'Teléfono', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
  ];
  canCreate = false;
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre, apellido o código...';
  searchFields = ['nombres', 'apellidos', 'codigoDocente'];
  sortOptions = [{ key: 'nombres', label: 'Nombres' }, { key: 'apellidos', label: 'Apellidos' }, { key: 'especialidad', label: 'Especialidad' }];
  defaultSort = 'apellidos';

  constructor(public api: ApiService) {}
}
