import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../services/estudiante.service';
import { Estudiante } from '../../models/estudiante.model';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>👨‍🎓 Gestión de Estudiantes</h1>
      </div>

      <div class="card" *ngIf="loading">
        <div class="loading">⏳ Cargando estudiantes...</div>
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
              <th>DNI</th>
              <th>Fecha Nac.</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let est of estudiantes">
              <td>{{ est.codigoEstudiante }}</td>
              <td>{{ est.nombres }}</td>
              <td>{{ est.apellidos }}</td>
              <td>{{ est.dni }}</td>
              <td>{{ est.fechaNacimiento | date:'dd/MM/yyyy' }}</td>
              <td>{{ est.telefono || '-' }}</td>
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
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  loading = true;
  error = '';

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.estudianteService.listar().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar estudiantes';
        this.loading = false;
      }
    });
  }
}
