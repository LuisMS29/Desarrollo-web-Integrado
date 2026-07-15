import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig, CardConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

@Component({
  selector: 'app-admin-comunicados',
  templateUrl: './comunicados.html',
  standalone: false,
})
export class AdminComunicados {
  title = 'Comunicados';
  subtitle = 'Publica avisos dirigidos a toda la comunidad escolar o a un rol específico.';
  headerIcon = 'bi-megaphone';
  idKey = 'idComunicado';
  emptyForm = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '' };

  roleColors: Record<string, string> = {
    TODOS: '#1e293b',
    DOCENTE: '#0284c7',
    ESTUDIANTE: '#059669',
    DIRECTOR: '#7c3aed',
  };

  roleIcons: Record<string, string> = {
    TODOS: 'bi-globe2',
    DOCENTE: 'bi-person-video3',
    ESTUDIANTE: 'bi-mortarboard',
    DIRECTOR: 'bi-person-badge',
  };

  columns: ColumnConfig[] = [
    { key: 'titulo', label: 'Título' },
    { key: 'dirigidoA', label: 'Dirigido a' },
    { key: 'fechaPublicacion', label: 'Publicado', render: (r) => r.fechaPublicacion ? new Date(r.fechaPublicacion).toLocaleDateString('es-PE') : '—' },
    { key: 'fechaExpiracion', label: 'Expira' },
  ];
  fields: FieldConfig[] = [
    { key: 'titulo', label: 'Título', type: 'text', required: true },
    { key: 'contenido', label: 'Contenido', type: 'textarea', required: true },
    {
      key: 'dirigidoA', label: 'Dirigido a', type: 'select', required: true, options: [
        { value: 'TODOS', label: 'Todos' },
        { value: 'DOCENTE', label: 'Docentes' },
        { value: 'ESTUDIANTE', label: 'Estudiantes' },
        { value: 'DIRECTOR', label: 'Dirección' },
      ]
    },
    { key: 'fechaExpiracion', label: 'Fecha de expiración', type: 'date' },
  ];
  canCreate = true;
  canDelete = true;
  searchable = true;
  searchPlaceholder = 'Buscar por título o contenido...';
  searchFields = ['titulo', 'contenido'];
  sortOptions = [{ key: 'fechaPublicacion', label: 'Fecha' }, { key: 'titulo', label: 'Título' }];
  defaultSort = 'fechaPublicacion';

  cardConfig: CardConfig = {
    icon: 'bi-megaphone',
    color: '#f59e0b',
    fields: [
      {
        key: 'titulo', label: 'Título',
        render: (r: any) => {
          return `<span style="font-weight:700;font-size:1rem;color:var(--ie-primary-dark);letter-spacing:-0.01em;">${r.titulo || '—'}</span>`;
        },
      },
      {
        key: 'contenido', label: 'Contenido',
        render: (r: any) => {
          const text = r.contenido || '';
          const preview = text.length > 120 ? text.slice(0, 120) + '...' : text;
          return `<span style="font-size:0.82rem;color:var(--ie-ink-soft);line-height:1.5;display:block;">${preview}</span>`;
        },
      },
      {
        key: 'dirigidoA', label: 'Dirigido a',
        render: (r: any) => {
          const target = r.dirigidoA || 'TODOS';
          const color = this.roleColors[target] || '#64748b';
          const icon = this.roleIcons[target] || 'bi-people';
          const label = target === 'TODOS' ? 'Todos' : target.charAt(0) + target.slice(1).toLowerCase();
          return `<span style="display:inline-flex;align-items:center;gap:0.35rem;padding:0.2em 0.7em;border-radius:999px;font-size:0.7rem;font-weight:600;background:${color}14;color:${color};border:1px solid ${color}22;">
            <i class="bi ${icon}" style="font-size:0.6rem;"></i>
            ${label}
          </span>`;
        },
      },
      {
        key: 'fechaPublicacion', label: 'Publicado',
        render: (r: any) => {
          const date = r.fechaPublicacion ? new Date(r.fechaPublicacion).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
          return `<span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.72rem;color:var(--ie-ink-muted);font-family:'JetBrains Mono',monospace;">
            <i class="bi bi-calendar3" style="font-size:0.65rem;"></i>
            ${date}
          </span>`;
        },
      },
    ],
  };

  constructor(public api: ApiService) { }
}
