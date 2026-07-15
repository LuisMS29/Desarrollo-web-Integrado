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
    {
      key: 'nombres', label: 'Estudiante',
      render: (row) => {
        const initials = ((row.nombres || '')[0] + (row.apellidos || '')[0]).toUpperCase() || '?';
        const name = `${row.nombres || ''} ${row.apellidos || ''}`.trim() || row.codigoEstudiante;
        return `<div class="d-flex align-items-center gap-2">
          <span class="entity-table-avatar" style="background:linear-gradient(135deg,#10b981,#34d399);">${initials}</span>
          <div>
            <div class="fw-semibold" style="font-size:0.9rem;">${name}</div>
          </div>
        </div>`;
      }
    },
    { key: 'dni', label: 'DNI', render: (row) => row.dni || '<span class="text-ink-muted fst-italic">—</span>' },
    {
      key: 'perfilCompleto', label: 'Perfil',
      render: (row) => row.perfilCompleto
        ? '<span class="entity-table-badge entity-table-badge-success"><i class="bi bi-check-circle-fill me-1"></i>Completo</span>'
        : '<span class="entity-table-badge entity-table-badge-warning"><i class="bi bi-exclamation-circle-fill me-1"></i>Incompleto</span>'
    },
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
  canDelete = true;
  canView = true;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre, apellido o código...';
  searchFields = ['nombres', 'apellidos', 'codigoEstudiante'];
  sortOptions = [{ key: 'nombres', label: 'Nombres' }, { key: 'apellidos', label: 'Apellidos' }];
  defaultSort = 'apellidos';

  constructor(public api: ApiService) {}
}
