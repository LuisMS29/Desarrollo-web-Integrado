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
  headerIcon = 'bi-person-workspace';
  idKey = 'idDocente';
  emptyForm = { codigoDocente: '', nombres: '', apellidos: '', dni: '', especialidad: '', telefono: '', email: '' };
  columns: ColumnConfig[] = [
    {
      key: 'docente', label: 'Docente',
      render: (row) => {
        const inicial = ((row.nombres || '')[0] || '') + ((row.apellidos || '')[0] || '');
        const nombre = `${row.nombres || ''} ${row.apellidos || ''}`.trim() || '—';
        return `<div class="d-flex align-items-center gap-2">
          <span class="users-avatar" style="width:30px;height:30px;font-size:0.65rem;background:linear-gradient(135deg,#0284c7,#38bdf8);">${inicial.toUpperCase() || '?'}</span>
          <span style="font-weight:600;">${nombre}</span>
        </div>`;
      },
    },
    { key: 'codigoDocente', label: 'Código', render: (row) => `<span class="text-mono" style="font-size:0.82rem;">${row.codigoDocente || '—'}</span>` },
    { key: 'especialidad', label: 'Especialidad', render: (row) => row.especialidad ? `<span class="badge-rol DOCENTE" style="font-size:0.6rem;">${row.especialidad}</span>` : '<span class="text-ink-muted">—</span>' },
    {
      key: 'contacto', label: 'Contacto',
      render: (row) => {
        let html = '<div class="d-flex flex-column gap-1" style="font-size:0.8rem;">';
        if (row.email) html += `<span><i class="bi bi-envelope me-1" style="color:var(--ie-ink-muted);font-size:0.7rem;"></i>${row.email}</span>`;
        if (row.telefono) html += `<span><i class="bi bi-telephone me-1" style="color:var(--ie-ink-muted);font-size:0.7rem;"></i>${row.telefono}</span>`;
        if (!row.email && !row.telefono) html += '<span class="text-ink-muted">—</span>';
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
