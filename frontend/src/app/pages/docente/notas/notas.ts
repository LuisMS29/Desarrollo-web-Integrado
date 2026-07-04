import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-docente-notas',
  templateUrl: './notas.html',
  standalone: false,
})
export class DocenteNotas implements OnInit {
  curso: any = null;
  matriculas: any[] = [];
  evaluaciones: any[] = [];
  notas: any = {};
  loading = true;
  savingCell: string | null = null;

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
      periodo: this.api.periodoActivo.obtener(),
    }).subscribe({
      next: ({ matriculas, periodo }: any) => {
        this.matriculas = (matriculas || []).filter((m: any) => m.estado === 'ACTIVO');
        if (periodo?.idPeriodo) {
          this.api.evaluacionesListarPorPeriodo(periodo.idPeriodo).subscribe({
            next: (evaluaciones: any) => {
              this.evaluaciones = evaluaciones || [];
              this.cargarNotasExistentes();
            },
            error: () => { this.loading = false; this.cdr.detectChanges(); }
          });
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  cargarNotasExistentes(): void {
    if (this.matriculas.length === 0 || this.evaluaciones.length === 0) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    const observables = this.matriculas.map(m =>
      this.api.notas.listarPorMatricula(m.idMatricula)
    );
    forkJoin(observables).subscribe({
      next: (results: any) => {
        for (let i = 0; i < results.length; i++) {
          const m = this.matriculas[i];
          const notasList = results[i] || [];
          for (const e of this.evaluaciones) {
            const nota = notasList.find((n: any) => n.evaluacionPeriodo?.idEvaluacion === e.idEvaluacion);
            if (nota) {
              this.notas[`${m.idMatricula}_${e.idEvaluacion}`] = {
                valor: nota.valor,
                observacion: nota.observacion || '',
                idNota: nota.idNota,
                matriculaId: m.idMatricula,
                evaluacionId: e.idEvaluacion
              };
            }
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  getValor(matriculaId: number, evaluacionId: number): string {
    return this.notas[`${matriculaId}_${evaluacionId}`]?.valor ?? '';
  }

  getObservacion(matriculaId: number, evaluacionId: number): string {
    return this.notas[`${matriculaId}_${evaluacionId}`]?.observacion ?? '';
  }

  setValor(matriculaId: number, evaluacionId: number, valor: string): void {
    if (valor === '') {
      this.notas[`${matriculaId}_${evaluacionId}`] = {
        ...(this.notas[`${matriculaId}_${evaluacionId}`] || {}),
        valor,
        matriculaId,
        evaluacionId
      };
      return;
    }
    const num = Number(valor);
    if (isNaN(num) || num < 0 || num > 20) {
      this.toast.warning('La nota debe estar entre 0 y 20.');
      return;
    }
    this.notas[`${matriculaId}_${evaluacionId}`] = {
      ...(this.notas[`${matriculaId}_${evaluacionId}`] || {}),
      valor,
      matriculaId,
      evaluacionId
    };
  }

  setObservacion(matriculaId: number, evaluacionId: number, observacion: string): void {
    this.notas[`${matriculaId}_${evaluacionId}`] = {
      ...(this.notas[`${matriculaId}_${evaluacionId}`] || {}),
      observacion,
      matriculaId,
      evaluacionId
    };
  }

  guardarNota(matriculaId: number, evaluacionId: number): void {
    const entry = this.notas[`${matriculaId}_${evaluacionId}`];
    if (!entry || entry.valor === '' || entry.valor === undefined) return;
    const num = Number(entry.valor);
    if (isNaN(num) || num < 0 || num > 20) {
      this.toast.warning('La nota debe estar entre 0 y 20.');
      return;
    }
    const cellKey = `${matriculaId}_${evaluacionId}`;
    this.savingCell = cellKey;
    const payload = {
      matricula: { idMatricula: matriculaId },
      evaluacionPeriodo: { idEvaluacion: evaluacionId },
      valor: Number(entry.valor),
      observacion: entry.observacion || '',
    };
    if (entry.idNota) {
      this.api.notas.actualizar(entry.idNota, payload).subscribe({
        next: () => { this.savingCell = null; this.cdr.detectChanges(); this.toast.success('Nota actualizada.'); },
        error: (err: any) => { this.savingCell = null; this.cdr.detectChanges(); this.toast.error(err.friendlyMessage || 'Error al guardar.'); }
      });
    } else {
      this.api.notas.crear(payload).subscribe({
        next: (res: any) => {
          this.notas[cellKey].idNota = res.idNota;
          this.savingCell = null;
          this.cdr.detectChanges();
          this.toast.success('Nota guardada.');
        },
        error: (err: any) => { this.savingCell = null; this.cdr.detectChanges(); this.toast.error(err.friendlyMessage || 'Error al guardar.'); }
      });
    }
  }

  isSaving(matriculaId: number, evaluacionId: number): boolean {
    return this.savingCell === `${matriculaId}_${evaluacionId}`;
  }

  tieneCambios(): boolean { return false; }
}
