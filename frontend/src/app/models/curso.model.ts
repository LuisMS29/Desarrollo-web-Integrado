export interface Curso {
  idCurso: number;
  asignatura: {
    idAsignatura: number;
    nombre: string;
  };
  grado: {
    idGrado: number;
    nombre: string;
  };
  seccion: {
    idSeccion: number;
    nombre: string;
  };
  periodoAcademico: {
    idPeriodo: number;
    nombre: string;
  };
  docente: {
    idDocente: number;
    nombres: string;
    apellidos: string;
  };
}
