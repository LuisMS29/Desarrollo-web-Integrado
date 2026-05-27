import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>📢 Comunicados Institucionales</h1>
      </div>

      <div class="comunicados-list">
        <div class="comunicado-card alta">
          <div class="comunicado-header">
            <span class="badge alta">ALTA</span>
            <span class="fecha">15 de mayo de 2026</span>
          </div>
          <h3>Reunión de Padres de Familia</h3>
          <p>Se informa que el día viernes 15 de mayo habrá reunión general para todos los grados de primaria. La asistencia es obligatoria.</p>
          <div class="comunicado-footer">
            <span>👤 Autor: Director</span>
            <span>📌 Dirigido a: TODOS</span>
          </div>
        </div>

        <div class="comunicado-card media">
          <div class="comunicado-header">
            <span class="badge media">MEDIA</span>
            <span class="fecha">10 de mayo de 2026</span>
          </div>
          <h3>Día del Logro - 1°A</h3>
          <p>Los alumnos de 1°A expondrán sus proyectos el próximo lunes. Se invita a los padres a asistir.</p>
          <div class="comunicado-footer">
            <span>👤 Autor: Admin</span>
            <span>📌 Dirigido a: DOCENTE</span>
          </div>
        </div>

        <div class="comunicado-card baja">
          <div class="comunicado-header">
            <span class="badge baja">BAJA</span>
            <span class="fecha">5 de mayo de 2026</span>
          </div>
          <h3>Actividad Deportiva Interescolar</h3>
          <p>Campeonato de fútbol entre secciones. Horario: 2:00 PM - 4:00 PM en el patio principal.</p>
          <div class="comunicado-footer">
            <span>👤 Autor: Prof. García</span>
            <span>📌 Dirigido a: ESTUDIANTE</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 30px; }
    .header { margin-bottom: 24px; }
    .header h1 { color: #333; font-size: 28px; }
    .comunicados-list { display: flex; flex-direction: column; gap: 20px; }
    .comunicado-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid #ccc; }
    .comunicado-card.alta { border-left-color: #e53935; }
    .comunicado-card.media { border-left-color: #fb8c00; }
    .comunicado-card.baja { border-left-color: #43a047; }
    .comunicado-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
    .badge.alta { background: #e53935; }
    .badge.media { background: #fb8c00; }
    .badge.baja { background: #43a047; }
    .fecha { color: #888; font-size: 13px; }
    .comunicado-card h3 { color: #333; margin-bottom: 10px; font-size: 18px; }
    .comunicado-card p { color: #555; line-height: 1.6; }
    .comunicado-footer { margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee; display: flex; gap: 20px; font-size: 13px; color: #888; }
  `]
})
export class ComunicadosComponent implements OnInit {
  ngOnInit(): void {}
}
