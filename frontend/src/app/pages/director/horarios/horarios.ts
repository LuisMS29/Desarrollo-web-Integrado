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
  columns: ColumnConfig[] = [
    { key: 'curso', label: 'Curso', render: (r) => r.curso?.asignatura?.nombre ?? '—' },
    { key: 'diaSemana', label: 'Día' },
    { key: 'horaInicio', label: 'Hora inicio' },
    { key: 'horaFin', label: 'Hora fin' },
    { key: 'aula', label: 'Aula' },
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
