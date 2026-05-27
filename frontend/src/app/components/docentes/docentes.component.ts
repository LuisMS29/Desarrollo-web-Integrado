import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../../services/docente.service';
import { Docente } from '../../models/docente.model';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>👨‍🏫 Gestión de Docentes</h1>
      </div>

      <div class="card" *ngIf="loading">
        <div class="loading">⏳ Cargando docentes...</div>
      </div>

      <div class="card" *ngIf="error">
        <div class="alert alert-danger">⚠️ {{ error }}</div>
      </div>

      <div class="card" *ngIf="!loading && !error">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doc of docentes">
              <td>{{ doc.codigoDocente }}</td>
              <td>{{ doc.nombres }}</td>
              <td>{{ doc.apellidos }}</td>
              <td>{{ doc.especialidad || '-' }}</td>
              <td>{{ doc.telefono || '-' }}</td>
              <td>{{ doc.email || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 30px; }
    .header { margin-bottom: 24px; }
    .header h1 { color: #333; font-size: 28px; }
    .card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .loading { text-align: center; padding: 40px; color: #666; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #1976d2; color: white; padding: 14px; text-align: left; font-size: 13px; text-transform: uppercase; }
    .table td { padding: 14px; border-bottom: 1px solid #eee; font-size: 14px; }
    .table tr:hover { background: #f8f9fa; }
  `]
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
  loading = true;
  error = '';

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    this.docenteService.listar().subscribe({
      next: (data) => {
        this.docentes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar docentes';
        this.loading = false;
      }
    });
  }
}
