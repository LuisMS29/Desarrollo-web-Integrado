import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-comunicados',
  templateUrl: './comunicados.html',
  standalone: false,
})
export class AdminComunicados {
  title = 'Comunicados';
  subtitle = 'Publica avisos dirigidos a toda la comunidad escolar o a un rol específico.';
  idKey = 'idComunicado';
  emptyForm = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '' };
  columns: ColumnConfig[] = [
    { key: 'titulo', label: 'Título' },
    { key: 'dirigidoA', label: 'Dirigido a' },
    { key: 'fechaPublicacion', label: 'Publicado', render: (r) => r.fechaPublicacion ? new Date(r.fechaPublicacion).toLocaleDateString('es-PE') : '—' },
    { key: 'fechaExpiracion', label: 'Expira' },
  ];
  fields: FieldConfig[] = [
    { key: 'titulo', label: 'Título', type: 'text', required: true },
    { key: 'contenido', label: 'Contenido', type: 'textarea', required: true },
    { key: 'dirigidoA', label: 'Dirigido a', type: 'select', required: true, options: [
      { value: 'TODOS', label: 'Todos' },
      { value: 'DOCENTE', label: 'Docentes' },
      { value: 'ESTUDIANTE', label: 'Estudiantes' },
      { value: 'DIRECTOR', label: 'Dirección' },
      { value: 'ADMIN', label: 'Administración' },
    ]},
    { key: 'fechaExpiracion', label: 'Fecha de expiración', type: 'date' },
  ];
  canCreate = true;
  canDelete = true;
  searchable = true;
  searchPlaceholder = 'Buscar por título o contenido...';
  searchFields = ['titulo', 'contenido'];
  sortOptions = [{ key: 'fechaPublicacion', label: 'Fecha' }, { key: 'titulo', label: 'Título' }];
  defaultSort = 'fechaPublicacion';

  constructor(public api: ApiService) {}
}
