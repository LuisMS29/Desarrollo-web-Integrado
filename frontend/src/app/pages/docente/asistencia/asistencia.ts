import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-docente-asistencia',
  templateUrl: './asistencia.html',
  standalone: false,
})
export class DocenteAsistencia implements OnInit {
  curso: any = null;
  matriculas: any[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  asistencias: any = {};
  diasDelMes: number[] = [];
  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
    if (cursoId) this.loadData(cursoId);
    else this.loading = false;
  }

  get monthLabel(): string {
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
    return months[this.selectedMonth] || '';
  }

  loadData(cursoId: number): void {
    this.loading = true;
    this.api.cursos.obtener(cursoId).subscribe({
      next: (data: any) => { this.curso = data; }
    });
    this.api.matriculasListarPorCurso(cursoId).subscribe({
      next: (data: any) => {
        this.matriculas = (data || []).filter((m: any) => m.estado === 'ACTIVO');
        this.generarDias();
        this.cargarAsistenciasExistentes(cursoId);
      },
      error: () => { this.loading = false; }
    });
  }

  generarDias(): void {
    const total = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    this.diasDelMes = [];
    for (let d = 1; d <= total; d++) {
      const diaSemana = new Date(this.selectedYear, this.selectedMonth, d).getDay();
      if (diaSemana !== 0) this.diasDelMes.push(d);
    }
  }

  cargarAsistenciasExistentes(cursoId: number): void {
    if (this.matriculas.length === 0) { this.loading = false; return; }
    let pendientes = this.matriculas.length;
    for (const m of this.matriculas) {
      this.api.asistencias.listarPorMatricula(m.idMatricula).subscribe({
        next: (data: any) => {
          for (const a of (data || [])) {
            const fecha = new Date(a.fecha);
            if (fecha.getMonth() === this.selectedMonth && fecha.getFullYear() === this.selectedYear) {
              const key = `${m.idMatricula}_${fecha.getDate()}`;
              this.asistencias[key] = a.presente;
            }
          }
          pendientes--;
          if (pendientes <= 0) this.loading = false;
        },
        error: () => {
          pendientes--;
          if (pendientes <= 0) this.loading = false;
        }
      });
    }
  }

  cambiarMes(delta: number): void {
    this.selectedMonth += delta;
    if (this.selectedMonth < 0) { this.selectedMonth = 11; this.selectedYear--; }
    if (this.selectedMonth > 11) { this.selectedMonth = 0; this.selectedYear++; }
    this.generarDias();
    const cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
    if (cursoId) this.cargarAsistenciasExistentes(cursoId);
  }

  isPresente(matriculaId: number, dia: number): boolean {
    return this.asistencias[`${matriculaId}_${dia}`] === true;
  }

  toggleAsistencia(matriculaId: number, dia: number): void {
    const key = `${matriculaId}_${dia}`;
    const nuevoEstado = !this.isPresente(matriculaId, dia);
    this.asistencias[key] = nuevoEstado;
    this.saving = true;
    const payload = {
      matricula: { idMatricula: matriculaId },
      fecha: `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
      presente: nuevoEstado,
    };
    this.api.asistencias.crear(payload).subscribe({
      next: () => { this.saving = false; },
      error: (err: any) => {
        this.asistencias[key] = !nuevoEstado;
        this.saving = false;
        this.toast.error(err.friendlyMessage || 'Error al guardar asistencia.');
      }
    });
  }

  marcarTodos(dia: number, presente: boolean): void {
    for (const m of this.matriculas) {
      this.asistencias[`${m.idMatricula}_${dia}`] = presente;
      const payload = {
        matricula: { idMatricula: m.idMatricula },
        fecha: `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
        presente,
      };
      this.api.asistencias.crear(payload).subscribe();
    }
  }
}
