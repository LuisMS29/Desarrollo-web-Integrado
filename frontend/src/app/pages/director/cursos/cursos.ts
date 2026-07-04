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
    { key: 'asignatura', label: 'Asignatura', render: (r) => r.asignatura?.nombre ?? '—' },
    { key: 'grado', label: 'Grado', render: (r) => r.grado?.nombre ?? '—' },
    { key: 'seccion', label: 'Sección', render: (r) => r.seccion?.nombre ?? '—' },
    { key: 'docente', label: 'Docente', render: (r) => r.docente ? `${r.docente.nombres || ''} ${r.docente.apellidos || ''}`.trim() || r.docente.codigoDocente : '—' },
    { key: 'periodoAcademico', label: 'Período', render: (r) => r.periodoAcademico?.nombre ?? '—' },
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

  constructor(public api: ApiService) {}
}
