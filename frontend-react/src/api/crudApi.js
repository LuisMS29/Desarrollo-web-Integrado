import axiosClient from "./axiosClient";

/**
 * Crea un pequeño cliente CRUD para una entidad del backend.
 * Los paths del backend no son 100% uniformes (list vs create vs delete
 * viven bajo distintos prefijos de rol), así que se configuran explícitos.
 */
export function makeCrudApi({ listPath, createPath, updatePath, deletePath }) {
  return {
    listar: () => axiosClient.get(listPath),
    crear: (data) => axiosClient.post(createPath, data),
    actualizar: (id, data) => axiosClient.put(`${updatePath}/${id}`, data),
    eliminar: (id) => axiosClient.delete(`${deletePath}/${id}`),
  };
}

export const gradosApi = makeCrudApi({
  listPath: "/grado/listar",
  createPath: "/director/grados",
  updatePath: "/director/grados",
  deletePath: "/admin/grados",
});

export const seccionesApi = makeCrudApi({
  listPath: "/seccion/listar",
  createPath: "/director/secciones",
  updatePath: "/director/secciones",
  deletePath: "/admin/secciones",
});

export const asignaturasApi = makeCrudApi({
  listPath: "/asignatura/listar",
  createPath: "/director/asignaturas",
  updatePath: "/director/asignaturas",
  deletePath: "/admin/asignaturas",
});

export const cursosApi = makeCrudApi({
  listPath: "/curso/listar",
  createPath: "/director/cursos",
  updatePath: "/director/cursos",
  deletePath: "/admin/cursos",
});

export const periodosApi = makeCrudApi({
  listPath: "/periodo/listar",
  createPath: "/director/periodos",
  updatePath: "/director/periodos",
  deletePath: "/admin/periodos",
});

export const docentesApi = makeCrudApi({
  listPath: "/docente/listar",
  createPath: "/director/docentes",
  updatePath: "/director/docentes",
  deletePath: "/admin/docentes",
});

export const estudiantesApi = makeCrudApi({
  listPath: "/estudiante/listar",
  createPath: "/docente/estudiantes",
  updatePath: "/docente/estudiantes",
  deletePath: "/admin/estudiantes",
});

export const comunicadosApi = makeCrudApi({
  listPath: "/comunicado/listar",
  createPath: "/director/comunicados",
  updatePath: "/director/comunicados",
  deletePath: "/admin/comunicados",
});

export const evaluacionesApi = makeCrudApi({
  listPath: "/evaluacion/listar",
  createPath: "/director/evaluaciones",
  updatePath: "/director/evaluaciones",
  deletePath: "/admin/evaluaciones",
});
evaluacionesApi.listarPorPeriodo = (periodoId) =>
  axiosClient.get(`/periodo/${periodoId}/evaluaciones`);

export const horariosApi = makeCrudApi({
  listPath: "/horario/listar",
  createPath: "/director/horarios",
  updatePath: "/director/horarios",
  deletePath: "/admin/horarios",
});
horariosApi.listarPorCurso = (cursoId) => axiosClient.get(`/curso/${cursoId}/horarios`);

export const matriculasApi = makeCrudApi({
  listPath: "/matricula/listar",
  createPath: "/director/matriculas",
  updatePath: "/director/matriculas",
  deletePath: "/admin/matriculas",
});
matriculasApi.listarPorEstudiante = (estudianteId) =>
  axiosClient.get(`/estudiante/${estudianteId}/matriculas`);
matriculasApi.listarPorCurso = (cursoId) => axiosClient.get(`/curso/${cursoId}/matriculas`);

/**
 * Notas y asistencias no siguen el patrón CRUD genérico: se registran por
 * matrícula (alumno + curso), así que exponen sus propios métodos.
 */
export const notasApi = {
  listarPorMatricula: (matriculaId) => axiosClient.get(`/estudiante/${matriculaId}/notas`),
  crear: (data) => axiosClient.post("/docente/notas", data),
  actualizar: (id, data) => axiosClient.put(`/docente/notas/${id}`, data),
  eliminar: (id) => axiosClient.delete(`/admin/notas/${id}`),
};

export const asistenciasApi = {
  listarPorMatricula: (matriculaId) => axiosClient.get(`/estudiante/${matriculaId}/asistencias`),
  crear: (data) => axiosClient.post("/docente/asistencias", data),
  actualizar: (id, data) => axiosClient.put(`/docente/asistencias/${id}`, data),
  eliminar: (id) => axiosClient.delete(`/admin/asistencias/${id}`),
};

export const notificacionesApi = {
  listarPorUsuario: (usuarioId) => axiosClient.get(`/usuario/${usuarioId}/notificaciones`),
  listarNoLeidas: (usuarioId) => axiosClient.get(`/usuario/${usuarioId}/notificaciones/no-leidas`),
  crear: (data) => axiosClient.post("/notificaciones", data),
  marcarLeida: (id) => axiosClient.put(`/notificaciones/${id}/leer`),
  eliminar: (id) => axiosClient.delete(`/notificaciones/${id}`),
};

export const periodoActivoApi = {
  obtener: () => axiosClient.get("/periodo/activo"),
};
