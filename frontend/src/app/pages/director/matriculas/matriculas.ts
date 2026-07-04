import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

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
    { key: 'estudiante', label: 'Estudiante', render: (r) => r.estudiante ? `${r.estudiante.nombres || ''} ${r.estudiante.apellidos || ''}`.trim() : '—' },
    { key: 'curso', label: 'Curso', render: (r) => r.curso?.asignatura?.nombre ?? '—' },
    { key: 'fechaMatricula', label: 'Fecha matrícula' },
    { key: 'estado', label: 'Estado' },
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

  constructor(public api: ApiService) {}
}
