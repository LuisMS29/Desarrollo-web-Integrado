import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ColumnConfig, FieldConfig, CardConfig } from '../../../shared/components/entity-crud-page/entity-crud-page';

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('T')[0].split(' ')[0].split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

@Component({
  selector: 'app-director-comunicados',
  templateUrl: './comunicados.html',
  standalone: false,
})
export class DirectorComunicados {
  title = 'Comunicados';
  subtitle = 'Publica avisos dirigidos a toda la comunidad escolar o a un rol específico.';
  idKey = 'idComunicado';
  emptyForm = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '' };

  roleColors: Record<string, string> = {
    TODOS: '#1e293b',
    DOCENTE: '#0284c7',
    ESTUDIANTE: '#059669',
    DIRECTOR: '#7c3aed',
    ADMIN: '#64748b',
  };
  roleIcons: Record<string, string> = {
    TODOS: 'bi-globe2',
    DOCENTE: 'bi-person-video3',
    ESTUDIANTE: 'bi-mortarboard',
    DIRECTOR: 'bi-person-badge',
    ADMIN: 'bi-shield',
  };

  columns: ColumnConfig[] = [
    {
      key: 'titulo', label: 'Título',
      render: (r) => `<div class="fw-semibold" style="font-size:0.9rem;">${r.titulo || '—'}</div>`
    },
    {
      key: 'dirigidoA', label: 'Dirigido a',
      render: (r) => {
        const badgeClass = this.getDirigidoBadge(r.dirigidoA);
        const label = this.getDirigidoLabel(r.dirigidoA);
        return `<span class="${badgeClass}">${label}</span>`;
      }
    },
    {
      key: 'fechaPublicacion', label: 'Publicado',
      render: (r) => r.fechaPublicacion
        ? `<span><i class="bi bi-send me-1 text-ink-muted"></i>${formatDate(r.fechaPublicacion)}</span>`
        : '<span class="text-ink-muted fst-italic">—</span>'
    },
    {
      key: 'fechaExpiracion', label: 'Expira',
      render: (r) => r.fechaExpiracion
        ? `<span class="text-ink-soft"><i class="bi bi-clock me-1 text-ink-muted"></i>${formatDate(r.fechaExpiracion)}</span>`
        : '<span class="text-ink-muted fst-italic">Sin expiración</span>'
    },
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
  canDelete = false;
  searchable = true;
  searchPlaceholder = 'Buscar por título o contenido...';
  searchFields = ['titulo', 'contenido'];
  sortOptions = [{ key: 'fechaPublicacion', label: 'Fecha' }, { key: 'titulo', label: 'Título' }];
  defaultSort = 'fechaPublicacion';

  cardConfig: CardConfig = {
    icon: 'bi-megaphone',
    color: '#7a4e9e',
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
          const date = r.fechaPublicacion ? formatDate(r.fechaPublicacion) : '—';
          return `<span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.72rem;color:var(--ie-ink-muted);font-family:'JetBrains Mono',monospace;">
            <i class="bi bi-calendar3" style="font-size:0.65rem;"></i>
            ${date}
          </span>`;
        },
      },
    ],
  };

  getDirigidoBadge(dirigidoA: string): string {
    const map: Record<string, string> = {
      TODOS: 'entity-table-badge entity-table-badge-amber-bg',
      DOCENTE: 'entity-table-badge entity-table-badge-primary',
      ESTUDIANTE: 'entity-table-badge entity-table-badge-success',
      DIRECTOR: 'entity-table-badge entity-table-badge-purple',
      ADMIN: 'entity-table-badge entity-table-badge-gray',
    };
    return map[dirigidoA] || 'entity-table-badge entity-table-badge-gray';
  }

  getDirigidoLabel(dirigidoA: string): string {
    const map: Record<string, string> = {
      TODOS: '<i class="bi bi-globe me-1"></i>Todos',
      DOCENTE: '<i class="bi bi-person-video3 me-1"></i>Docentes',
      ESTUDIANTE: '<i class="bi bi-mortarboard me-1"></i>Estudiantes',
      DIRECTOR: '<i class="bi bi-person-badge me-1"></i>Dirección',
      ADMIN: '<i class="bi bi-shield me-1"></i>Administración',
    };
    return map[dirigidoA] || dirigidoA;
  }

  constructor(public api: ApiService) {}
}
