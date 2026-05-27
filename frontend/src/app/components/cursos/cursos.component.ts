import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models/curso.model';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>📚 Cursos del Periodo Activo</h1>
      </div>

      <div class="card" *ngIf="loading">
        <div class="loading">⏳ Cargando cursos...</div>
      </div>

      <div class="card" *ngIf="error">
        <div class="alert alert-danger">⚠️ {{ error }}</div>
      </div>

      <div class="card" *ngIf="!loading && !error">
        <table class="table">
          <thead>
            <tr>
              <th>Asignatura</th>
              <th>Grado</th>
              <th>Sección</th>
              <th>Periodo</th>
              <th>Docente</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let curso of cursos">
              <td>{{ curso.asignatura?.nombre }}</td>
              <td>{{ curso.grado?.nombre }}</td>
              <td>{{ curso.seccion?.nombre }}</td>
              <td>{{ curso.periodoAcademico?.nombre }}</td>
              <td>{{ curso.docente?.nombres }} {{ curso.docente?.apellidos }}</td>
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
export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  loading = true;
  error = '';

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.cursoService.listarActivos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar cursos';
        this.loading = false;
      }
    });
  }
}
