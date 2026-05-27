import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotaService } from '../../services/nota.service';
import { Nota } from '../../models/nota.model';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>📝 Registro de Notas</h1>
      </div>

      <div class="card" *ngIf="loading">
        <div class="loading">⏳ Cargando notas...</div>
      </div>

      <div class="card" *ngIf="error">
        <div class="alert alert-danger">⚠️ {{ error }}</div>
      </div>

      <div class="card" *ngIf="!loading && !error">
        <table class="table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Curso</th>
              <th>Evaluación</th>
              <th>Nota</th>
              <th>Observación</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let nota of notas">
              <td>{{ nota.matricula?.estudiante?.nombres }} {{ nota.matricula?.estudiante?.apellidos }}</td>
              <td>{{ nota.matricula?.curso?.asignatura?.nombre }}</td>
              <td>{{ nota.evaluacionPeriodo?.nombre }}</td>
              <td><strong [class.nota-alta]="nota.valor >= 16" [class.nota-baja]="nota.valor < 11">{{ nota.valor }}</strong></td>
              <td>{{ nota.observacion || '-' }}</td>
              <td>{{ nota.fechaRegistro | date:'dd/MM/yyyy HH:mm' }}</td>
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
    .nota-alta { color: #2e7d32; }
    .nota-baja { color: #c62828; }
  `]
})
export class NotasComponent implements OnInit {
  notas: Nota[] = [];
  loading = true;
  error = '';

  constructor(private notaService: NotaService) {}

  ngOnInit(): void {
    this.cargarNotas();
  }

  cargarNotas(): void {
    this.notaService.listar().subscribe({
      next: (data) => {
        this.notas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar notas';
        this.loading = false;
      }
    });
  }
}
