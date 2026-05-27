export interface Nota {
  idNota: number;
  matricula: {
    idMatricula: number;
    estudiante: {
      nombres: string;
      apellidos: string;
    };
    curso: {
      asignatura: {
        nombre: string;
      };
    };
  };
  evaluacionPeriodo: {
    idEvaluacion: number;
    nombre: string;
  };
  valor: number;
  observacion: string;
  fechaRegistro: string;
}
