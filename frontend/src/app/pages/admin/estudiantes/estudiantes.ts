import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-estudiantes',
  templateUrl: './estudiantes.html',
  standalone: false,
})
export class AdminEstudiantes {
  title = 'Estudiantes';
  subtitle = 'Alumnado registrado en el colegio.';
  headerIcon = 'bi-mortarboard';
  idKey = 'idEstudiante';
  emptyForm = { codigoEstudiante: '', nombres: '', apellidos: '', dni: '', fechaNacimiento: '', direccion: '', telefono: '' };
  columns: ColumnConfig[] = [
    {
      key: 'estudiante', label: 'Estudiante',
      render: (row) => {
        const inicial = ((row.nombres || '')[0] || '') + ((row.apellidos || '')[0] || '');
        const nombre = `${row.nombres || ''} ${row.apellidos || ''}`.trim() || '—';
        return `<div class="d-flex align-items-center gap-2">
          <span class="users-avatar" style="width:30px;height:30px;font-size:0.65rem;background:linear-gradient(135deg,#059669,#34d399);">${inicial.toUpperCase() || '?'}</span>
          <span style="font-weight:600;">${nombre}</span>
        </div>`;
      },
    },
    { key: 'codigoEstudiante', label: 'Código', render: (row) => `<span class="text-mono" style="font-size:0.82rem;">${row.codigoEstudiante || '—'}</span>` },
    { key: 'dni', label: 'DNI', render: (row) => row.dni ? `<span class="text-mono">${row.dni}</span>` : '<span class="text-ink-muted">—</span>' },
    {
      key: 'contacto', label: 'Contacto',
      render: (row) => {
        let html = '<div class="d-flex flex-column gap-1" style="font-size:0.8rem;">';
        if (row.telefono) html += `<span><i class="bi bi-telephone me-1" style="color:var(--ie-ink-muted);font-size:0.7rem;"></i>${row.telefono}</span>`;
        if (row.direccion) html += `<span><i class="bi bi-geo-alt me-1" style="color:var(--ie-ink-muted);font-size:0.7rem;"></i>${row.direccion}</span>`;
        if (!row.telefono && !row.direccion) html += '<span class="text-ink-muted">—</span>';
        html += '</div>';
        return html;
      },
    },
    {
      key: 'perfilCompleto', label: 'Perfil',
      render: (row) => row.perfilCompleto
        ? '<span class="table-badge table-badge-active"><i class="bi bi-check-circle-fill me-1"></i>Completo</span>'
        : '<span class="table-badge table-badge-inactive"><i class="bi bi-exclamation-circle-fill me-1"></i>Incompleto</span>',
    },
  ];
  fields: FieldConfig[] = [
    { key: 'codigoEstudiante', label: 'Código de estudiante', type: 'text', required: true },
    { key: 'nombres', label: 'Nombres', type: 'text', required: true },
    { key: 'apellidos', label: 'Apellidos', type: 'text', required: true },
    { key: 'dni', label: 'DNI', type: 'text' },
    { key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
    { key: 'direccion', label: 'Dirección', type: 'textarea' },
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
