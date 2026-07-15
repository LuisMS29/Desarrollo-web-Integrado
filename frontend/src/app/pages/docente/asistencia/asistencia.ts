import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

const ESTADOS = ['PRESENTE', 'TARDANZA', 'AUSENTE', 'JUSTIFICADO'] as const;

@Component({
  selector: 'app-docente-asistencia',
  templateUrl: './asistencia.html',
  standalone: false,
})
export class DocenteAsistencia implements OnInit {
  curso: any = null;
  matriculas: any[] = [];
  horarios: any[] = [];
  periodo: any = null;
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  asistencias: any = {};
  asistenciaIds: any = {};
  diasDelMes: number[] = [];
  loading = true;
  savingCell: string | null = null;
  openMenuCell: string | null = null;
  estados = ESTADOS;

  diasNombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  studentColors = [
    '#0284c7', '#10b981', '#8b5cf6', '#f59e0b',
    '#f43f5e', '#14b8a6', '#ec4899', '#6366f1',
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
    if (cursoId) this.loadData(cursoId);
    else { this.loading = false; this.cdr.detectChanges(); }
  }

  get monthLabel(): string {
    return this.mesesNombres[this.selectedMonth] || '';
  }

  get resumenMes(): Record<string, number> {
    const total: Record<string, number> = { PRESENTE: 0, TARDANZA: 0, AUSENTE: 0, JUSTIFICADO: 0 };
    for (const m of this.matriculas) {
      for (const d of this.diasDelMes) {
        const estado = this.getEstado(m.idMatricula, d);
        if (estado && total.hasOwnProperty(estado)) total[estado]++;
      }
    }
    return total;
  }

  getStudentColor(index: number): string {
    return this.studentColors[index % this.studentColors.length];
  }

  getDiaColor(diaSemana: number): { bg: string; text: string } {
    const colors = [
      { bg: '#eff6ff', text: '#1d4ed8' },
      { bg: '#f0fdf4', text: '#15803d' },
      { bg: '#fefce8', text: '#a16207' },
      { bg: '#fef2f2', text: '#b91c1c' },
      { bg: '#faf5ff', text: '#7c3aed' },
      { bg: '#f8fafc', text: '#475569' },
    ];
    return colors[Math.min(diaSemana - 1, colors.length - 1)] ?? colors[0];
  }

  esFinSemana(dia: number): boolean {
    const d = new Date(this.selectedYear, this.selectedMonth, dia).getDay();
    return d === 0 || d === 6;
  }

  getDiaSemanaAbrev(dia: number): string {
    const d = new Date(this.selectedYear, this.selectedMonth, dia).getDay();
    return this.diasNombres[d] || '';
  }

  irAHoy(): void {
    const now = new Date();
    this.selectedMonth = now.getMonth();
    this.selectedYear = now.getFullYear();
    this.generarDias();
    const cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
    if (cursoId) {
      this.asistencias = {};
      this.asistenciaIds = {};
      this.cargarAsistenciasExistentes(cursoId);
    }
  }

  getStudentResumen(matriculaId: number): Record<string, number> {
    const total: Record<string, number> = { PRESENTE: 0, TARDANZA: 0, AUSENTE: 0, JUSTIFICADO: 0 };
    for (const d of this.diasDelMes) {
      const estado = this.getEstado(matriculaId, d);
      if (estado && total.hasOwnProperty(estado)) {
        total[estado]++;
      }
    }
    return total;
  }

  loadData(cursoId: number): void {
    this.loading = true;
    const user = this.auth.user();
    if (!user?.idPerfil) { this.loading = false; this.cdr.detectChanges(); return; }
    this.api.docentePanel.obtenerMiFicha().subscribe({
      next: (docente: any) => {
        if (!docente?.idDocente) { this.loading = false; this.cdr.detectChanges(); return; }
        this.api.docentePanel.listarMisCursos(docente.idDocente).subscribe({
          next: (cursos: any) => {
            const curso = (cursos || []).find((c: any) => c.idCurso === cursoId);
            this.curso = curso;
            this.cargarDatosCurso(cursoId);
          },
          error: () => { this.loading = false; this.cdr.detectChanges(); }
        });
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  private cargarDatosCurso(cursoId: number): void {
    forkJoin({
      matriculas: this.api.matriculasListarPorCurso(cursoId),
      horarios: this.api.horariosListarPorCurso(cursoId),
      periodo: this.api.periodoActivo.obtener(),
    }).subscribe({
      next: ({ matriculas, horarios, periodo }: any) => {
        this.matriculas = (matriculas || []).filter((m: any) => m.estado === 'ACTIVO');
        this.horarios = horarios || [];
        this.periodo = periodo;
        this.generarDias();
        this.cargarAsistenciasExistentes(cursoId);
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  generarDias(): void {
    this.diasDelMes = [];
    if (this.horarios.length > 0 && this.periodo?.fechaInicio && this.periodo?.fechaFin) {
      const diasClase = new Set(this.horarios.map((h: any) => h.diaSemana));
      const inicio = new Date(this.periodo.fechaInicio);
      const fin = new Date(this.periodo.fechaFin);
      const current = new Date(inicio);
      while (current <= fin) {
        if (diasClase.has(current.getDay()) &&
            current.getMonth() === this.selectedMonth &&
            current.getFullYear() === this.selectedYear) {
          this.diasDelMes.push(current.getDate());
        }
        current.setDate(current.getDate() + 1);
      }
    } else {
      const total = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
      for (let d = 1; d <= total; d++) {
        const diaSemana = new Date(this.selectedYear, this.selectedMonth, d).getDay();
        if (diaSemana !== 0) this.diasDelMes.push(d);
      }
    }
  }

  cargarAsistenciasExistentes(cursoId: number): void {
    if (this.matriculas.length === 0) { this.loading = false; this.cdr.detectChanges(); return; }
    const observables = this.matriculas.map(m =>
      this.api.asistencias.listarPorMatricula(m.idMatricula)
    );
    forkJoin(observables).subscribe({
      next: (results: any) => {
        for (let i = 0; i < results.length; i++) {
          const m = this.matriculas[i];
          for (const a of (results[i] || [])) {
            const parts = a.fecha.split('-');
            if (parts.length === 3) {
              const ano = parseInt(parts[0]);
              const mes = parseInt(parts[1]) - 1;
              const dia = parseInt(parts[2]);
              if (mes === this.selectedMonth && ano === this.selectedYear) {
                const key = `${m.idMatricula}_${dia}`;
                this.asistencias[key] = a.estado;
                this.asistenciaIds[key] = a.idAsistencia;
              }
            }
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  cambiarMes(delta: number): void {
    this.selectedMonth += delta;
    if (this.selectedMonth < 0) { this.selectedMonth = 11; this.selectedYear--; }
    if (this.selectedMonth > 11) { this.selectedMonth = 0; this.selectedYear++; }
    this.generarDias();
    const cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));
    if (cursoId) {
      this.asistencias = {};
      this.asistenciaIds = {};
      this.cargarAsistenciasExistentes(cursoId);
    }
  }

  toggleMenu(matriculaId: number, dia: number): void {
    const key = `${matriculaId}_${dia}`;
    this.openMenuCell = this.openMenuCell === key ? null : key;
  }

  getEstado(matriculaId: number, dia: number): string {
    return this.asistencias[`${matriculaId}_${dia}`] || '';
  }

  setEstado(matriculaId: number, dia: number, estado: string): void {
    this.openMenuCell = null;
    const key = `${matriculaId}_${dia}`;
    this.asistencias[key] = estado;
    const fechaStr = `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    this.savingCell = key;
    const payload = {
      matricula: { idMatricula: matriculaId },
      fecha: fechaStr,
      estado,
    };
    const idExistente = this.asistenciaIds[key];
    if (idExistente) {
      this.api.asistencias.actualizar(idExistente, payload).subscribe({
        next: () => { this.savingCell = null; this.cdr.detectChanges(); },
        error: (err: any) => {
          this.asistencias[key] = '';
          this.savingCell = null;
          this.cdr.detectChanges();
          this.toast.error(err.friendlyMessage || 'Error al guardar asistencia.');
        }
      });
    } else {
      this.api.asistencias.crear(payload).subscribe({
        next: (res: any) => {
          this.asistenciaIds[key] = res.idAsistencia;
          this.savingCell = null;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.asistencias[key] = '';
          this.savingCell = null;
          this.cdr.detectChanges();
          this.toast.error(err.friendlyMessage || 'Error al guardar asistencia.');
        }
      });
    }
  }

  getBadgeLabel(estado: string): string {
    switch (estado) {
      case 'PRESENTE': return 'P';
      case 'TARDANZA': return 'T';
      case 'AUSENTE': return 'A';
      case 'JUSTIFICADO': return 'J';
      default: return '?';
    }
  }

  isSaving(matriculaId: number, dia: number): boolean {
    return this.savingCell === `${matriculaId}_${dia}`;
  }

  marcarTodos(dia: number, estado: string): void {
    this.openMenuCell = null;
    const fechaStr = `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    for (const m of this.matriculas) {
      const key = `${m.idMatricula}_${dia}`;
      this.asistencias[key] = estado;
      const payload = {
        matricula: { idMatricula: m.idMatricula },
        fecha: fechaStr,
        estado,
      };
      const idExistente = this.asistenciaIds[key];
      if (idExistente) {
        this.api.asistencias.actualizar(idExistente, payload).subscribe();
      } else {
        this.api.asistencias.crear(payload).subscribe({
          next: (res: any) => { this.asistenciaIds[key] = res.idAsistencia; }
        });
      }
    }
    this.cdr.detectChanges();
  }
}
