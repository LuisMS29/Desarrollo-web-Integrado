import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-director-cursos',
  templateUrl: './cursos.html',
  standalone: false,
})
export class DirectorCursos {
  title = 'Cursos';
  subtitle = 'Asocia una asignatura con un grado, sección, período y docente.';
  idKey = 'idCurso';
  emptyForm = { asignatura: '', grado: '', seccion: '', periodoAcademico: '', docente: '' };
  columns: ColumnConfig[] = [
    {
      key: 'asignatura', label: 'Asignatura',
      render: (r) => {
        const grado = r.grado?.nombre || '';
        const color = this.getGradeColor(grado);
        return `<div class="d-flex align-items-center gap-2">
          <span class="entity-table-icon" style="background:${color}18;color:${color};border-color:${color}30;">
            <i class="bi bi-book"></i>
          </span>
          <div>
            <div class="fw-semibold" style="font-size:0.9rem;">${r.asignatura?.nombre || '—'}</div>
          </div>
        </div>`;
      }
    },
    {
      key: 'grado', label: 'Grado / Sección',
      render: (r) => `<div class="d-flex align-items-center gap-1 flex-wrap">
        <span class="fw-medium">${r.grado?.nombre || '—'}</span>
        <span class="text-ink-muted" style="font-size:0.75rem;">/</span>
        <span>${r.seccion?.nombre || '—'}</span>
      </div>`
    },
    {
      key: 'docente', label: 'Docente',
      render: (r) => {
        if (!r.docente) return '<span class="text-ink-muted fst-italic">Sin asignar</span>';
        const initials = ((r.docente.nombres || '')[0] + (r.docente.apellidos || '')[0]).toUpperCase() || '?';
        const name = `${r.docente.nombres || ''} ${r.docente.apellidos || ''}`.trim() || r.docente.codigoDocente;
        return `<div class="d-flex align-items-center gap-2">
          <span class="entity-table-avatar" style="background:linear-gradient(135deg,#0284c7,#38bdf8);">${initials}</span>
          <span>${name}</span>
        </div>`;
      }
    },
    {
      key: 'periodoAcademico', label: 'Período',
      render: (r) => r.periodoAcademico
        ? `<span class="entity-table-badge entity-table-badge-gray">
            <i class="bi bi-calendar3 me-1"></i>${r.periodoAcademico.nombre || ''}
           </span>`
        : '<span class="text-ink-muted fst-italic">—</span>'
    },
  ];
  fields: FieldConfig[] = [
    { key: 'asignatura', label: 'Asignatura', type: 'relation', required: true, relation: { idKey: 'idAsignatura', labelFn: (o) => o.nombre } },
    { key: 'grado', label: 'Grado', type: 'relation', required: true, relation: { idKey: 'idGrado', labelFn: (o) => o.nombre } },
    { key: 'seccion', label: 'Sección', type: 'relation', required: true, relation: { idKey: 'idSeccion', labelFn: (o) => o.nombre } },
    { key: 'periodoAcademico', label: 'Período académico', type: 'relation', required: true, relation: { idKey: 'idPeriodo', labelFn: (o) => `${o.nombre} (${o.anio})` } },
    { key: 'docente', label: 'Docente', type: 'relation', required: true, relation: { idKey: 'idDocente', labelFn: (o) => `${o.nombres || ''} ${o.apellidos || ''}`.trim() || o.codigoDocente } },
  ];
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por asignatura, grado o docente...';
  searchFields = ['asignatura.nombre', 'grado.nombre', 'docente.nombres', 'docente.apellidos'];
  sortOptions = [{ key: 'asignatura.nombre', label: 'Asignatura' }, { key: 'grado.nombre', label: 'Grado' }];
  defaultSort = 'asignatura.nombre';
  relationLoaders = {
    asignatura: () => this.api.asignaturas.listar(),
    grado: () => this.api.grados.listar(),
    seccion: () => this.api.secciones.listar(),
    periodoAcademico: () => this.api.periodos.listar(),
    docente: () => this.api.docentes.listar(),
  };

  gradeColors: Record<string, string> = {
    '1°': '#10b981',
    '2°': '#0ea5e9',
    '3°': '#8b5cf6',
    '4°': '#f59e0b',
    '5°': '#f43f5e',
  };

  getGradeColor(grado: string): string {
    for (const [key, color] of Object.entries(this.gradeColors)) {
      if (grado?.startsWith(key)) return color;
    }
    return '#64748b';
  }

  constructor(public api: ApiService) {}
}
