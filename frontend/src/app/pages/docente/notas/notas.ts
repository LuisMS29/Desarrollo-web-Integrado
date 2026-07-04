import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
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

  loadData(cursoId: number): void {
    this.loading = true;
    this.api.cursos.obtener(cursoId).subscribe({
      next: (data: any) => {
        this.curso = data;
      }
    });
    this.api.matriculasListarPorCurso(cursoId).subscribe({
      next: (data: any) => {
        this.matriculas = (data || []).filter((m: any) => m.estado === 'ACTIVO');
      }
    });
    this.api.periodoActivo.obtener().subscribe({
      next: (periodo: any) => {
        if (periodo?.idPeriodo) {
          this.api.evaluacionesListarPorPeriodo(periodo.idPeriodo).subscribe({
            next: (evaluaciones: any) => {
              this.evaluaciones = evaluaciones || [];
              this.cargarNotasExistentes(cursoId);
            },
            error: () => { this.loading = false; }
          });
        } else {
          this.loading = false;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  cargarNotasExistentes(cursoId: number): void {
    if (this.matriculas.length === 0 || this.evaluaciones.length === 0) {
      this.loading = false;
      return;
    }
    let pendientes = this.matriculas.length * this.evaluaciones.length;
    for (const m of this.matriculas) {
      for (const e of this.evaluaciones) {
        this.api.notas.listarPorMatricula(m.idMatricula).subscribe({
          next: (notas: any) => {
            const nota = (notas || []).find((n: any) => n.evaluacion?.idEvaluacion === e.idEvaluacion);
            if (nota) {
              this.notas[`${m.idMatricula}_${e.idEvaluacion}`] = {
                valor: nota.valor,
                idNota: nota.idNota,
                matriculaId: m.idMatricula,
                evaluacionId: e.idEvaluacion
              };
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
  }

  getValue(matriculaId: number, evaluacionId: number): string {
    return this.notas[`${matriculaId}_${evaluacionId}`]?.valor ?? '';
  }

  setValue(matriculaId: number, evaluacionId: number, valor: string): void {
    this.notas[`${matriculaId}_${evaluacionId}`] = { ...this.notas[`${matriculaId}_${evaluacionId}`], valor, matriculaId, evaluacionId };
  }

  guardarNota(matriculaId: number, evaluacionId: number): void {
    const entry = this.notas[`${matriculaId}_${evaluacionId}`];
    if (!entry || entry.valor === '' || entry.valor === undefined) return;
    this.saving = true;
    const payload = { matricula: { idMatricula: matriculaId }, evaluacion: { idEvaluacion: evaluacionId }, valor: Number(entry.valor) };
    if (entry.idNota) {
      this.api.notas.actualizar(entry.idNota, payload).subscribe({
        next: () => { this.saving = false; this.toast.success('Nota actualizada.'); },
        error: (err: any) => { this.saving = false; this.toast.error(err.friendlyMessage || 'Error al guardar.'); }
      });
    } else {
      this.api.notas.crear(payload).subscribe({
        next: (res: any) => {
          this.notas[`${matriculaId}_${evaluacionId}`].idNota = res.idNota;
          this.saving = false;
          this.toast.success('Nota guardada.');
        },
        error: (err: any) => { this.saving = false; this.toast.error(err.friendlyMessage || 'Error al guardar.'); }
      });
    }
  }

  tieneCambios(): boolean { return false; }
}
