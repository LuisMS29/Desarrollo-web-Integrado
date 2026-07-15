import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('T')[0].split(' ')[0].split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

@Component({
  selector: 'app-director-matriculas',
  templateUrl: './matriculas.html',
  standalone: false,
})
export class DirectorMatriculas {
  title = 'Matrículas';
  subtitle = 'Matrículas de estudiantes.';
  idKey = 'idMatricula';
  emptyForm = { estudiante: '', curso: '', fechaMatricula: '', estado: 'ACTIVO' };
  columns: ColumnConfig[] = [
    {
      key: 'estudiante', label: 'Estudiante',
      render: (r) => {
        if (!r.estudiante) return '<span class="text-ink-muted fst-italic">—</span>';
        const initials = ((r.estudiante.nombres || '')[0] + (r.estudiante.apellidos || '')[0]).toUpperCase() || '?';
        const name = `${r.estudiante.nombres || ''} ${r.estudiante.apellidos || ''}`.trim() || r.estudiante.codigoEstudiante;
        return `<div class="d-flex align-items-center gap-2">
          <span class="entity-table-avatar" style="background:linear-gradient(135deg,#10b981,#34d399);">${initials}</span>
          <div>
            <div class="fw-semibold" style="font-size:0.9rem;">${name}</div>
            <div class="entity-table-meta">${r.estudiante.codigoEstudiante || ''}</div>
          </div>
        </div>`;
      }
    },
    {
      key: 'curso', label: 'Curso',
      render: (r) => {
        if (!r.curso) return '<span class="text-ink-muted fst-italic">—</span>';
        return `<div>
          <div class="fw-semibold" style="font-size:0.85rem;">${r.curso.asignatura?.nombre || ''}</div>
          <div class="entity-table-meta">${r.curso.grado?.nombre || ''} ${r.curso.seccion?.nombre || ''}</div>
        </div>`;
      }
    },
    {
      key: 'fechaMatricula', label: 'Fecha',
      render: (r) => r.fechaMatricula
        ? `<span><i class="bi bi-calendar-check me-1 text-ink-muted"></i>${formatDate(r.fechaMatricula)}</span>`
        : '<span class="text-ink-muted fst-italic">—</span>'
    },
    {
      key: 'estado', label: 'Estado',
      render: (r) => r.estado === 'ACTIVO'
        ? '<span class="entity-table-badge entity-table-badge-success"><i class="bi bi-check-circle-fill me-1"></i>Activo</span>'
        : '<span class="entity-table-badge entity-table-badge-danger"><i class="bi bi-x-circle-fill me-1"></i>Retirado</span>'
    },
  ];
  fields: FieldConfig[] = [
    { key: 'estudiante', label: 'Estudiante', type: 'relation', required: true, relation: { idKey: 'idEstudiante', labelFn: (o) => `${o.nombres || ''} ${o.apellidos || ''}`.trim() || o.codigoEstudiante } },
    { key: 'curso', label: 'Curso', type: 'relation', required: true, relation: { idKey: 'idCurso', labelFn: (o) => `${o.asignatura?.nombre || ''} - ${o.grado?.nombre || ''} ${o.seccion?.nombre || ''}` } },
    { key: 'fechaMatricula', label: 'Fecha matrícula', type: 'date', required: true },
    { key: 'estado', label: 'Estado', type: 'select', required: true, options: [{ value: 'ACTIVO', label: 'Activo' }, { value: 'RETIRADO', label: 'Retirado' }] },
  ];
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por estudiante o curso...';
  searchFields = ['estudiante.nombres', 'estudiante.apellidos', 'curso.asignatura.nombre'];
  relationLoaders = {
    estudiante: () => this.api.estudiantes.listar(),
    curso: () => this.api.cursos.listar(),
  };

  constructor(public api: ApiService) {}
}
