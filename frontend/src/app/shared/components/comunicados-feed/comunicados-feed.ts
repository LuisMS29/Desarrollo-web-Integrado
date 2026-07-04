import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-comunicados-feed',
  templateUrl: './comunicados-feed.html',
  standalone: false,
})
export class ComunicadosFeed implements OnChanges {
  @Input() rolActual = '';
  @Input() key = 0;
  comunicados: any[] = [];
  filtered: any[] = [];
  loading = true;
  error = '';
  search = '';

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolActual'] || changes['key']) {
      this.load();
    }
  }

  load(): void {
    this.loading = true;
    this.api.comunicados.listar().subscribe({
      next: (data: any) => {
        const hoy = new Date().toISOString().slice(0, 10);
        this.comunicados = data
          .filter((c: any) => c.dirigidoA === 'TODOS' || c.dirigidoA === this.rolActual)
          .filter((c: any) => !c.fechaExpiracion || c.fechaExpiracion >= hoy)
          .sort((a: any, b: any) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
        this.applyFilter();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.friendlyMessage || 'No se pudieron cargar los comunicados.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();
    this.filtered = !term ? this.comunicados : this.comunicados.filter(
      (c) => c.titulo?.toLowerCase().includes(term) || c.contenido?.toLowerCase().includes(term)
    );
  }
}
