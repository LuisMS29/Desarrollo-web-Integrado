import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const API_BASE_URL = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  auth!: any;
  usuarios!: any;
  grados!: any;
  secciones!: any;
  asignaturas!: any;
  cursos!: any;
  periodos!: any;
  docentes!: any;
  estudiantes!: any;
  comunicados!: any;
  evaluaciones!: any;
  horarios!: any;
  matriculas!: any;
  notas!: any;
  asistencias!: any;
  notificaciones!: any;
  docentePanel!: any;
  estudiantePanel!: any;
  periodoActivo!: any;

  evaluacionesListarPorPeriodo!: (periodoId: number) => any;
  horariosListarPorCurso!: (cursoId: number) => any;
  matriculasListarPorCurso!: (cursoId: number) => any;
  matriculasListarPorEstudiante!: (estudianteId: number) => any;

  constructor(private http: HttpClient) {
    const api = (path: string) => `${API_BASE_URL}${path}`;

    this.auth = {
      login: (username: string, password: string) => this.http.post<any>(api('/auth/login'), { username, password }),
      register: (payload: any) => this.http.post<any>(api('/auth/register'), payload),
      getProfile: () => this.http.get<any>(api('/auth/profile')),
      actualizarPerfil: (data: any) => this.http.put(api('/auth/profile'), data),
      subirFoto: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(api('/auth/foto'), formData);
      },
      eliminarFoto: () => this.http.delete<any>(api('/auth/foto')),
      cambiarPassword: (data: { currentPassword: string; newPassword: string }) =>
        this.http.put<any>(api('/auth/password'), data),
    };

    this.usuarios = {
      listar: () => this.http.get<any[]>(api('/admin/usuarios')),
      obtener: (id: number) => this.http.get<any>(api(`/admin/usuarios/${id}`)),
      actualizar: (id: number, data: any) => this.http.put(api(`/admin/usuarios/${id}`), data),
      activar: (id: number) => this.http.put(api(`/admin/usuarios/${id}/activar`), {}),
      desactivar: (id: number) => this.http.put(api(`/admin/usuarios/${id}/desactivar`), {}),
      eliminar: (id: number) => this.http.delete(api(`/admin/usuarios/${id}`)),
      subirFoto: (id: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(api(`/admin/usuarios/${id}/foto`), formData);
      },
      eliminarFoto: (id: number) => this.http.delete<any>(api(`/admin/usuarios/${id}/foto`)),
    };

    const crud = (paths: { listPath: string; createPath: string; updatePath: string; deletePath: string }) => ({
      listar: () => this.http.get(api(paths.listPath)),
      obtener: (id: number) => this.http.get(`${api(paths.listPath.replace('/listar', ''))}/${id}`),
      crear: (data: any) => this.http.post(api(paths.createPath), data),
      actualizar: (id: number, data: any) => this.http.put(`${api(paths.updatePath)}/${id}`, data),
      eliminar: (id: number) => this.http.delete(`${api(paths.deletePath)}/${id}`),
    });

    this.grados = crud({ listPath: '/grado/listar', createPath: '/director/grados', updatePath: '/director/grados', deletePath: '/admin/grados' });
    this.secciones = crud({ listPath: '/seccion/listar', createPath: '/director/secciones', updatePath: '/director/secciones', deletePath: '/admin/secciones' });
    this.asignaturas = crud({ listPath: '/asignatura/listar', createPath: '/director/asignaturas', updatePath: '/director/asignaturas', deletePath: '/admin/asignaturas' });
    this.cursos = crud({ listPath: '/curso/listar', createPath: '/director/cursos', updatePath: '/director/cursos', deletePath: '/admin/cursos' });
    this.periodos = crud({ listPath: '/periodo/listar', createPath: '/director/periodos', updatePath: '/director/periodos', deletePath: '/admin/periodos' });
    this.docentes = crud({ listPath: '/docente/listar', createPath: '/director/docentes', updatePath: '/director/docentes', deletePath: '/admin/docentes' });
    this.estudiantes = crud({ listPath: '/estudiante/listar', createPath: '/docente/estudiantes', updatePath: '/docente/estudiantes', deletePath: '/admin/estudiantes' });
    this.comunicados = crud({ listPath: '/comunicado/listar', createPath: '/director/comunicados', updatePath: '/director/comunicados', deletePath: '/admin/comunicados' });
    this.evaluaciones = crud({ listPath: '/evaluacion/listar', createPath: '/director/evaluaciones', updatePath: '/director/evaluaciones', deletePath: '/admin/evaluaciones' });
    this.horarios = crud({ listPath: '/horario/listar', createPath: '/director/horarios', updatePath: '/director/horarios', deletePath: '/admin/horarios' });
    this.matriculas = crud({ listPath: '/matricula/listar', createPath: '/director/matriculas', updatePath: '/director/matriculas', deletePath: '/admin/matriculas' });

    this.evaluacionesListarPorPeriodo = (periodoId: number) => this.http.get<any[]>(api(`/periodo/${periodoId}/evaluaciones`));
    this.horariosListarPorCurso = (cursoId: number) => this.http.get<any[]>(api(`/curso/${cursoId}/horarios`));
    this.matriculasListarPorCurso = (cursoId: number) => this.http.get<any[]>(api(`/curso/${cursoId}/matriculas`));
    this.matriculasListarPorEstudiante = (estudianteId: number) => this.http.get<any[]>(api(`/estudiante/${estudianteId}/matriculas`));

    this.notas = {
      listarPorMatricula: (matriculaId: number) => this.http.get<any[]>(api(`/estudiante/${matriculaId}/notas`)),
      crear: (data: any) => this.http.post(api('/docente/notas'), data),
      actualizar: (id: number, data: any) => this.http.put(`${api('/docente/notas')}/${id}`, data),
      eliminar: (id: number) => this.http.delete(`${api('/admin/notas')}/${id}`),
    };

    this.asistencias = {
      listarPorMatricula: (matriculaId: number) => this.http.get<any[]>(api(`/estudiante/${matriculaId}/asistencias`)),
      crear: (data: any) => this.http.post(api('/docente/asistencias'), data),
      actualizar: (id: number, data: any) => this.http.put(`${api('/docente/asistencias')}/${id}`, data),
      eliminar: (id: number) => this.http.delete(`${api('/admin/asistencias')}/${id}`),
    };

    this.notificaciones = {
      listarPorUsuario: (usuarioId: number) => this.http.get<any[]>(api(`/usuario/${usuarioId}/notificaciones`)),
      listarNoLeidas: (usuarioId: number) => this.http.get<any[]>(api(`/usuario/${usuarioId}/notificaciones/no-leidas`)),
      crear: (data: any) => this.http.post(api('/notificaciones'), data),
      marcarLeida: (id: number) => this.http.put(`${api('/notificaciones')}/${id}/leer`, {}),
      eliminar: (id: number) => this.http.delete(`${api('/notificaciones')}/${id}`),
    };

    this.docentePanel = {
      obtenerMiFicha: () => this.http.get<any>(api('/docente/me')),
      listarMisCursos: (docenteId: number) => this.http.get<any[]>(api(`/docente/${docenteId}/cursos`)),
      actualizarMiPerfil: (data: any) => this.http.put(api('/docente/me'), data),
    };

    this.estudiantePanel = {
      obtenerMiFicha: () => this.http.get<any>(api('/estudiante/me')),
      listarMisMatriculas: (estudianteId: number) => this.http.get<any[]>(api(`/estudiante/${estudianteId}/matriculas`)),
      actualizarMiPerfil: (data: any) => this.http.put(api('/estudiante/me'), data),
    };

    this.periodoActivo = {
      obtener: () => this.http.get<any>(api('/periodo/activo')),
    };
  }
}
