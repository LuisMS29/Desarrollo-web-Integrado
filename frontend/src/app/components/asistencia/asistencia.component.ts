import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>📋 Control de Asistencia</h1>
      </div>

      <div class="card">
        <div class="info-section">
          <h3>📝 Registro Diario</h3>
          <p>Esta sección permite registrar y consultar la asistencia diaria de los estudiantes.</p>
          <p><strong>Estados disponibles:</strong></p>
          <ul>
            <li>✅ <strong>PRESENTE</strong> - El estudiante asistió a clase</li>
            <li>❌ <strong>AUSENTE</strong> - El estudiante no asistió</li>
            <li>⏰ <strong>TARDANZA</strong> - El estudiante llegó tarde</li>
            <li>📄 <strong>JUSTIFICADO</strong> - Ausencia con justificación</li>
          </ul>
        </div>

        <div class="stats-section">
          <h3>📊 Estadísticas de Asistencia</h3>
          <div class="stat-grid">
            <div class="stat-box presente">
              <span class="stat-number">85%</span>
              <span class="stat-label">Asistencia Promedio</span>
            </div>
            <div class="stat-box ausente">
              <span class="stat-number">8%</span>
              <span class="stat-label">Inasistencias</span>
            </div>
            <div class="stat-box tarde">
              <span class="stat-number">5%</span>
              <span class="stat-label">Tardanzas</span>
            </div>
            <div class="stat-box justificado">
              <span class="stat-number">2%</span>
              <span class="stat-label">Justificados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 30px; }
    .header { margin-bottom: 24px; }
    .header h1 { color: #333; font-size: 28px; }
    .card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .info-section { margin-bottom: 30px; }
    .info-section h3 { color: #1976d2; margin-bottom: 12px; }
    .info-section p { color: #555; line-height: 1.6; margin-bottom: 10px; }
    .info-section ul { list-style: none; padding: 0; }
    .info-section li { padding: 8px 0; color: #444; }
    .stats-section h3 { color: #1976d2; margin-bottom: 20px; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .stat-box { padding: 24px; border-radius: 12px; text-align: center; color: white; }
    .stat-box.presente { background: linear-gradient(135deg, #43a047, #2e7d32); }
    .stat-box.ausente { background: linear-gradient(135deg, #e53935, #c62828); }
    .stat-box.tarde { background: linear-gradient(135deg, #fb8c00, #ef6c00); }
    .stat-box.justificado { background: linear-gradient(135deg, #8e24aa, #6a1b9a); }
    .stat-number { display: block; font-size: 36px; font-weight: bold; margin-bottom: 8px; }
    .stat-label { font-size: 14px; opacity: 0.9; }
  `]
})
export class AsistenciaComponent implements OnInit {
  ngOnInit(): void {}
}
