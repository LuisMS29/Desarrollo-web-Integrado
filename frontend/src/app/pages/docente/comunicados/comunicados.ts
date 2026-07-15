import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-docente-comunicados',
  templateUrl: './comunicados.html',
  standalone: false,
})
export class DocenteComunicados {
  showForm = false;
  form = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '' };
  saving = false;
  refreshKey = 0;

  dirigidoA = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'DOCENTE', label: 'Solo docentes' },
  ];

  constructor(private api: ApiService, private toast: ToastService) {}

  handleSubmit(): void {
    if (!this.form.titulo.trim() || !this.form.contenido.trim()) return;
    this.saving = true;
    this.api.comunicados.crear({
      titulo: this.form.titulo,
      contenido: this.form.contenido,
      dirigidoA: this.form.dirigidoA,
      fechaExpiracion: this.form.fechaExpiracion || null,
    }).subscribe({
      next: () => {
        this.toast.success('Comunicado publicado.');
        this.form = { titulo: '', contenido: '', dirigidoA: 'TODOS', fechaExpiracion: '' };
        this.showForm = false;
        this.refreshKey++;
        this.saving = false;
      },
      error: (err: any) => {
        this.toast.error(err.friendlyMessage || 'No se pudo publicar.');
        this.saving = false;
      }
    });
  }
}
