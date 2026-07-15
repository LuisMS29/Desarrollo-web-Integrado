import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-docentes',
  templateUrl: './docentes.html',
  standalone: false,
})
export class DirectorDocentes {
  title = 'Docentes';
  subtitle = 'Personal docente registrado en el colegio.';
  idKey = 'idDocente';
  emptyForm = { codigoDocente: '', nombres: '', apellidos: '', dni: '', especialidad: '', telefono: '', email: '' };
  columns: ColumnConfig[] = [
    { key: 'codigoDocente', label: 'Código' },
    {
      key: 'nombres', label: 'Docente',
      render: (row) => {
        const initials = ((row.nombres || '')[0] + (row.apellidos || '')[0]).toUpperCase() || '?';
        const name = `${row.nombres || ''} ${row.apellidos || ''}`.trim() || row.codigoDocente;
        return `<div class="d-flex align-items-center gap-2">
          <span class="entity-table-avatar" style="background:linear-gradient(135deg,#2f7ea6,#5fa3c9);">${initials}</span>
          <div>
            <div class="fw-semibold" style="font-size:0.9rem;">${name}</div>
            ${row.email ? `<div class="entity-table-meta">${row.email}</div>` : ''}
          </div>
        </div>`;
      }
    },
    { key: 'especialidad', label: 'Especialidad', render: (row) => row.especialidad || '<span class="text-ink-muted fst-italic">—</span>' },
    {
      key: 'perfilCompleto', label: 'Perfil',
      render: (row) => row.perfilCompleto
        ? '<span class="entity-table-badge entity-table-badge-success"><i class="bi bi-check-circle-fill me-1"></i>Completo</span>'
        : '<span class="entity-table-badge entity-table-badge-warning"><i class="bi bi-exclamation-circle-fill me-1"></i>Incompleto</span>'
    },
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
  canDelete = true;
  canView = true;
  searchable = true;
  searchPlaceholder = 'Buscar por nombre, apellido o código...';
  searchFields = ['nombres', 'apellidos', 'codigoDocente'];
  sortOptions = [{ key: 'nombres', label: 'Nombres' }, { key: 'apellidos', label: 'Apellidos' }, { key: 'especialidad', label: 'Especialidad' }];
  defaultSort = 'apellidos';

  constructor(public api: ApiService) {}
}
