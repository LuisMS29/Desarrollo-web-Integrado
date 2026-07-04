import axiosClient from "./axiosClient";

/**
 * Endpoints propios de la sesión de Docente: primero resuelve su ficha
 * (idDocente) a partir del usuario autenticado y luego sus cursos.
 */
export const docentePanelApi = {
  obtenerMiFicha: () => axiosClient.get("/docente/me"),
  listarMisCursos: (docenteId) => axiosClient.get(`/docente/${docenteId}/cursos`),
  actualizarMiPerfil: (data) => axiosClient.put("/docente/me", data),
};

/**
 * Endpoints propios de la sesión de Estudiante: resuelve su ficha
 * (idEstudiante) y desde ahí sus matrículas, notas y asistencia.
 */
export const estudiantePanelApi = {
  obtenerMiFicha: () => axiosClient.get("/estudiante/me"),
  listarMisMatriculas: (estudianteId) => axiosClient.get(`/estudiante/${estudianteId}/matriculas`),
  actualizarMiPerfil: (data) => axiosClient.put("/estudiante/me", data),
};
