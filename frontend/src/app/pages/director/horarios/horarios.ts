import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-horarios',
  templateUrl: './horarios.html',
  standalone: false,
})
export class DirectorHorarios {
  title = 'Horarios';
  subtitle = 'Horarios de los cursos.';
  idKey = 'idHorario';
  emptyForm = { curso: '', diaSemana: '', horaInicio: '', horaFin: '', aula: '' };
  dayColors: Record<string, { bg: string; color: string; label: string }> = {
    '1': { bg: '#dbeafe', color: '#1e40af', label: 'Lunes' },
    '2': { bg: '#d1fae5', color: '#065f46', label: 'Martes' },
    '3': { bg: '#fef3c7', color: '#92400e', label: 'Miércoles' },
    '4': { bg: '#ede9fe', color: '#6d28d9', label: 'Jueves' },
    '5': { bg: '#fce7f3', color: '#9d174d', label: 'Viernes' },
    '6': { bg: '#e0e7ff', color: '#3730a3', label: 'Sábado' },
  };

  columns: ColumnConfig[] = [
    {
      key: 'curso', label: 'Curso',
      render: (r) => {
        const curso = r.curso;
        if (!curso) return '<span class="text-ink-muted fst-italic">—</span>';
        return `<div class="d-flex align-items-center gap-2">
          <span class="entity-table-icon" style="background:#14b8a618;color:#14b8a6;border-color:#14b8a630;">
            <i class="bi bi-book"></i>
          </span>
          <div>
            <div class="fw-semibold" style="font-size:0.85rem;">${curso.asignatura?.nombre || ''}</div>
            <div class="entity-table-meta">${curso.grado?.nombre || ''} ${curso.seccion?.nombre || ''}</div>
          </div>
        </div>`;
      }
    },
    {
      key: 'diaSemana', label: 'Día',
      render: (r) => {
        const day = this.dayColors[r.diaSemana] || { bg: '#f1f5f9', color: '#475569', label: r.diaSemana || '—' };
        return `<span class="entity-table-badge" style="background:${day.bg};color:${day.color};">${day.label}</span>`;
      }
    },
    {
      key: 'horaInicio', label: 'Horario',
      render: (r) => `<span class="fw-medium">${r.horaInicio || '—'} — ${r.horaFin || '—'}</span>`
    },
    {
      key: 'aula', label: 'Aula',
      render: (r) => r.aula
        ? `<span class="entity-table-badge entity-table-badge-gray"><i class="bi bi-door-open me-1"></i>${r.aula}</span>`
        : '<span class="text-ink-muted fst-italic">—</span>'
    },
  ];
  fields: FieldConfig[] = [
    { key: 'curso', label: 'Curso', type: 'relation', required: true, relation: { idKey: 'idCurso', labelFn: (o) => `${o.asignatura?.nombre || ''} - ${o.grado?.nombre || ''}` } },
    { key: 'diaSemana', label: 'Día de semana', type: 'select', required: true, options: [{ value: '1', label: 'Lunes' }, { value: '2', label: 'Martes' }, { value: '3', label: 'Miércoles' }, { value: '4', label: 'Jueves' }, { value: '5', label: 'Viernes' }, { value: '6', label: 'Sábado' }] },
    { key: 'horaInicio', label: 'Hora inicio', type: 'text', required: true },
    { key: 'horaFin', label: 'Hora fin', type: 'text', required: true },
    { key: 'aula', label: 'Aula', type: 'text' },
  ];
  canDelete = false;
  relationLoaders = {
    curso: () => this.api.cursos.listar(),
  };

  constructor(public api: ApiService) {}
}
