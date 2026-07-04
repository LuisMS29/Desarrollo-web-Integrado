import {
  gradosApi,
  seccionesApi,
  asignaturasApi,
  cursosApi,
  periodosApi,
  docentesApi,
  estudiantesApi,
  comunicadosApi,
  matriculasApi,
  evaluacionesApi,
  horariosApi,
} from "../../api/crudApi";
import { usuariosApi } from "../../api/usuariosApi";

const NIVEL_OPTIONS = [{ value: "PRIMARIA", label: "Primaria" }];

const DIRIGIDO_A_OPTIONS = [
  { value: "TODOS", label: "Todos" },
  { value: "DOCENTE", label: "Docentes" },
  { value: "ESTUDIANTE", label: "Estudiantes" },
  { value: "DIRECTOR", label: "Dirección" },
  { value: "ADMIN", label: "Administración" },
];

const MATRICULA_ESTADO_OPTIONS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "RETIRADO", label: "Retirado" },
];

const DIAS_SEMANA = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
];

export const gradosConfig = {
  title: "Grados",
  subtitle: "Niveles y grados que ofrece el colegio.",
  api: gradosApi,
  idKey: "idGrado",
  emptyForm: { nombre: "", nivel: "PRIMARIA", orden: "" },
  columns: [
    { key: "nombre", label: "Nombre" },
    { key: "nivel", label: "Nivel" },
    { key: "orden", label: "Orden" },
  ],
  fields: [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "nivel", label: "Nivel", type: "select", required: true, options: NIVEL_OPTIONS },
    { key: "orden", label: "Orden", type: "number", required: true },
  ],
};

export const seccionesConfig = {
  title: "Secciones",
  subtitle: "Secciones disponibles (A, B, C...).",
  api: seccionesApi,
  idKey: "idSeccion",
  emptyForm: { nombre: "" },
  columns: [{ key: "nombre", label: "Nombre" }],
  fields: [{ key: "nombre", label: "Nombre", type: "text", required: true }],
};

export const asignaturasConfig = {
  title: "Asignaturas",
  subtitle: "Catálogo de asignaturas del plan de estudios.",
  api: asignaturasApi,
  idKey: "idAsignatura",
  emptyForm: { nombre: "", descripcion: "" },
  columns: [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
  ],
  fields: [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "descripcion", label: "Descripción", type: "textarea" },
  ],
};

export const periodosConfig = {
  title: "Períodos académicos",
  subtitle: "Años y períodos lectivos del colegio.",
  api: periodosApi,
  idKey: "idPeriodo",
  emptyForm: { anio: "", nombre: "", fechaInicio: "", fechaFin: "", activo: false },
  columns: [
    { key: "nombre", label: "Nombre" },
    { key: "anio", label: "Año" },
    { key: "fechaInicio", label: "Inicio" },
    { key: "fechaFin", label: "Fin" },
    { key: "activo", label: "Activo", render: (r) => (r.activo ? "Sí" : "No") },
  ],
  fields: [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "anio", label: "Año", type: "number", required: true },
    { key: "fechaInicio", label: "Fecha de inicio", type: "date" },
    { key: "fechaFin", label: "Fecha de fin", type: "date" },
    { key: "activo", label: "Período activo", type: "boolean" },
  ],
};

export const docentesConfig = {
  title: "Docentes",
  subtitle: "Personal docente registrado en el colegio.",
  api: docentesApi,
  idKey: "idDocente",
  emptyForm: {
    codigoDocente: "",
    nombres: "",
    apellidos: "",
    dni: "",
    especialidad: "",
    telefono: "",
    email: "",
  },
  columns: [
    { key: "codigoDocente", label: "Código" },
    { key: "nombres", label: "Nombres", render: (row) => row.nombres || "—" },
    { key: "apellidos", label: "Apellidos", render: (row) => row.apellidos || "—" },
    { key: "especialidad", label: "Especialidad" },
    { key: "email", label: "Email" },
    {
      key: "perfilCompleto",
      label: "Perfil",
      render: (row) =>
        row.perfilCompleto ? (
          <span className="badge bg-success-subtle text-success border border-success-subtle">Completo</span>
        ) : (
          <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Incompleto</span>
        ),
    },
  ],
  fields: [
    { key: "codigoDocente", label: "Código de docente", type: "text", required: true },
    { key: "nombres", label: "Nombres", type: "text", required: true },
    { key: "apellidos", label: "Apellidos", type: "text", required: true },
    { key: "dni", label: "DNI", type: "text" },
    { key: "especialidad", label: "Especialidad", type: "text" },
    { key: "telefono", label: "Teléfono", type: "text" },
    { key: "email", label: "Email", type: "text" },
  ],
  searchable: true,
  searchPlaceholder: "Buscar por nombre, apellido o código...",
  searchFields: ["nombres", "apellidos", "codigoDocente"],
  sortOptions: [
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos" },
    { key: "especialidad", label: "Especialidad" },
  ],
  defaultSort: "apellidos",
};

export const estudiantesConfig = {
  title: "Estudiantes",
  subtitle: "Alumnado registrado en el colegio.",
  api: estudiantesApi,
  idKey: "idEstudiante",
  emptyForm: {
    codigoEstudiante: "",
    nombres: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
  },
  columns: [
    { key: "codigoEstudiante", label: "Código" },
    { key: "nombres", label: "Nombres", render: (row) => row.nombres || "—" },
    { key: "apellidos", label: "Apellidos", render: (row) => row.apellidos || "—" },
    { key: "dni", label: "DNI", render: (row) => row.dni || "—" },
    {
      key: "perfilCompleto",
      label: "Perfil",
      render: (row) =>
        row.perfilCompleto ? (
          <span className="badge bg-success-subtle text-success border border-success-subtle">Completo</span>
        ) : (
          <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Incompleto</span>
        ),
    },
  ],
  fields: [
    { key: "codigoEstudiante", label: "Código de estudiante", type: "text", required: true },
    { key: "nombres", label: "Nombres", type: "text", required: true },
    { key: "apellidos", label: "Apellidos", type: "text", required: true },
    { key: "dni", label: "DNI", type: "text" },
    { key: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
    { key: "direccion", label: "Dirección", type: "text" },
    { key: "telefono", label: "Teléfono", type: "text" },
  ],
  searchable: true,
  searchPlaceholder: "Buscar por nombre, apellido o código...",
  searchFields: ["nombres", "apellidos", "codigoEstudiante"],
  sortOptions: [
    { key: "nombres", label: "Nombres" },
    { key: "apellidos", label: "Apellidos" },
  ],
  defaultSort: "apellidos",
};

export const cursosConfig = {
  title: "Cursos",
  subtitle: "Asocia una asignatura con un grado, sección, período y docente.",
  api: cursosApi,
  idKey: "idCurso",
  emptyForm: { asignatura: "", grado: "", seccion: "", periodoAcademico: "", docente: "" },
  columns: [
    { key: "asignatura", label: "Asignatura", render: (r) => r.asignatura?.nombre ?? "—" },
    { key: "grado", label: "Grado", render: (r) => r.grado?.nombre ?? "—" },
    { key: "seccion", label: "Sección", render: (r) => r.seccion?.nombre ?? "—" },
    {
      key: "docente",
      label: "Docente",
      render: (r) => (r.docente ? `${r.docente.nombres || ""} ${r.docente.apellidos || ""}`.trim() || r.docente.codigoDocente : "—"),
    },
    { key: "periodoAcademico", label: "Período", render: (r) => r.periodoAcademico?.nombre ?? "—" },
  ],
  searchable: true,
  searchPlaceholder: "Buscar por asignatura, grado o docente...",
  searchFields: ["asignatura.nombre", "grado.nombre", "docente.nombres", "docente.apellidos"],
  sortOptions: [
    { key: "asignatura.nombre", label: "Asignatura" },
    { key: "grado.nombre", label: "Grado" },
  ],
  defaultSort: "asignatura.nombre",
  fields: [
    {
      key: "asignatura",
      label: "Asignatura",
      type: "relation",
      required: true,
      relation: { optionsLoader: asignaturasApi.listar, idKey: "idAsignatura", labelFn: (o) => o.nombre },
    },
    {
      key: "grado",
      label: "Grado",
      type: "relation",
      required: true,
      relation: { optionsLoader: gradosApi.listar, idKey: "idGrado", labelFn: (o) => o.nombre },
    },
    {
      key: "seccion",
      label: "Sección",
      type: "relation",
      required: true,
      relation: { optionsLoader: seccionesApi.listar, idKey: "idSeccion", labelFn: (o) => o.nombre },
    },
    {
      key: "periodoAcademico",
      label: "Período académico",
      type: "relation",
      required: true,
      relation: { optionsLoader: periodosApi.listar, idKey: "idPeriodo", labelFn: (o) => `${o.nombre} (${o.anio})` },
    },
    {
      key: "docente",
      label: "Docente",
      type: "relation",
      required: true,
      relation: { optionsLoader: docentesApi.listar, idKey: "idDocente", labelFn: (o) => `${o.nombres || ""} ${o.apellidos || ""}`.trim() || o.codigoDocente },
    },
  ],
};

export const comunicadosConfig = () => ({
  title: "Comunicados",
  subtitle: "Publica avisos dirigidos a toda la comunidad escolar o a un rol específico.",
  api: comunicadosApi,
  idKey: "idComunicado",
  emptyForm: {
    titulo: "",
    contenido: "",
    dirigidoA: "TODOS",
    fechaExpiracion: "",
  },
  columns: [
    { key: "titulo", label: "Título" },
    { key: "dirigidoA", label: "Dirigido a" },
    {
      key: "fechaPublicacion",
      label: "Publicado",
      render: (r) => (r.fechaPublicacion ? new Date(r.fechaPublicacion).toLocaleDateString("es-PE") : "—"),
    },
    { key: "fechaExpiracion", label: "Expira" },
  ],
  fields: [
    { key: "titulo", label: "Título", type: "text", required: true },
    { key: "contenido", label: "Contenido", type: "textarea", required: true },
    { key: "dirigidoA", label: "Dirigido a", type: "select", required: true, options: DIRIGIDO_A_OPTIONS },
    { key: "fechaExpiracion", label: "Fecha de expiración", type: "date" },
  ],
  searchable: true,
  searchPlaceholder: "Buscar por título o contenido...",
  searchFields: ["titulo", "contenido"],
  filters: [
    { key: "dirigidoA", label: "Dirigido a", options: DIRIGIDO_A_OPTIONS },
  ],
  sortOptions: [
    { key: "fechaPublicacion", label: "Fecha" },
    { key: "titulo", label: "Título" },
  ],
  defaultSort: "fechaPublicacion",
});

export const matriculasConfig = {
  title: "Matrículas",
  subtitle: "Inscribe estudiantes en los cursos del período vigente.",
  api: matriculasApi,
  idKey: "idMatricula",
  emptyForm: { estudiante: "", curso: "", fechaMatricula: "", estado: "ACTIVO" },
  columns: [
    {
      key: "estudiante",
      label: "Estudiante",
      render: (r) => (r.estudiante ? `${r.estudiante.nombres || ""} ${r.estudiante.apellidos || ""}`.trim() || r.estudiante.codigoEstudiante : "—"),
    },
    {
      key: "curso",
      label: "Curso",
      render: (r) =>
        r.curso
          ? `${r.curso.asignatura?.nombre ?? ""} · ${r.curso.grado?.nombre ?? ""}${r.curso.seccion?.nombre ?? ""}`
          : "—",
    },
    { key: "fechaMatricula", label: "Fecha" },
    { key: "estado", label: "Estado" },
  ],
  searchable: true,
  searchPlaceholder: "Buscar por estudiante o curso...",
  searchFields: ["estudiante.nombres", "estudiante.apellidos", "estudiante.codigoEstudiante", "curso.asignatura.nombre"],
  filters: [
    { key: "estado", label: "Estado", options: MATRICULA_ESTADO_OPTIONS },
  ],
  sortOptions: [
    { key: "fechaMatricula", label: "Fecha" },
    { key: "estudiante.apellidos", label: "Estudiante" },
    { key: "estado", label: "Estado" },
  ],
  defaultSort: "fechaMatricula",
  fields: [
    {
      key: "estudiante",
      label: "Estudiante",
      type: "relation",
      required: true,
      relation: { optionsLoader: estudiantesApi.listar, idKey: "idEstudiante", labelFn: (o) => `${o.nombres || ""} ${o.apellidos || ""}`.trim() || o.codigoEstudiante },
    },
    {
      key: "curso",
      label: "Curso",
      type: "relation",
      required: true,
      relation: {
        optionsLoader: cursosApi.listar,
        idKey: "idCurso",
        labelFn: (o) => `${o.asignatura?.nombre ?? ""} · ${o.grado?.nombre ?? ""}${o.seccion?.nombre ?? ""}`,
      },
    },
    { key: "fechaMatricula", label: "Fecha de matrícula", type: "date", required: true },
    { key: "estado", label: "Estado", type: "select", required: true, options: MATRICULA_ESTADO_OPTIONS },
  ],
};

export const evaluacionesConfig = {
  title: "Períodos de evaluación",
  subtitle: "Bimestres/trimestres en los que se registran notas dentro de un período académico.",
  api: evaluacionesApi,
  idKey: "idEvaluacion",
  emptyForm: { nombre: "", orden: "", periodoAcademico: "" },
  columns: [
    { key: "nombre", label: "Nombre" },
    { key: "orden", label: "Orden" },
    { key: "periodoAcademico", label: "Período académico", render: (r) => r.periodoAcademico?.nombre ?? "—" },
  ],
  fields: [
    { key: "nombre", label: "Nombre", type: "text", required: true },
    { key: "orden", label: "Orden", type: "number", required: true },
    {
      key: "periodoAcademico",
      label: "Período académico",
      type: "relation",
      required: true,
      relation: { optionsLoader: periodosApi.listar, idKey: "idPeriodo", labelFn: (o) => `${o.nombre} (${o.anio})` },
    },
  ],
};

export const horariosConfig = {
  title: "Horarios de curso",
  subtitle: "Día, hora y aula asignados a cada curso.",
  api: horariosApi,
  idKey: "idHorario",
  emptyForm: { curso: "", diaSemana: "", horaInicio: "", horaFin: "", aula: "" },
  columns: [
    {
      key: "curso",
      label: "Curso",
      render: (r) =>
        r.curso
          ? `${r.curso.asignatura?.nombre ?? ""} · ${r.curso.grado?.nombre ?? ""}${r.curso.seccion?.nombre ?? ""}`
          : "—",
    },
    {
      key: "diaSemana",
      label: "Día",
      render: (r) => DIAS_SEMANA.find((d) => Number(d.value) === r.diaSemana)?.label ?? r.diaSemana,
    },
    { key: "horaInicio", label: "Inicio" },
    { key: "horaFin", label: "Fin" },
    { key: "aula", label: "Aula" },
  ],
  searchable: true,
  searchPlaceholder: "Buscar por curso o aula...",
  searchFields: ["curso.asignatura.nombre", "aula"],
  sortOptions: [
    { key: "diaSemana", label: "Día" },
    { key: "horaInicio", label: "Hora inicio" },
    { key: "curso.asignatura.nombre", label: "Curso" },
  ],
  defaultSort: "diaSemana",
  fields: [
    {
      key: "curso",
      label: "Curso",
      type: "relation",
      required: true,
      relation: {
        optionsLoader: cursosApi.listar,
        idKey: "idCurso",
        labelFn: (o) => `${o.asignatura?.nombre ?? ""} · ${o.grado?.nombre ?? ""}${o.seccion?.nombre ?? ""}`,
      },
    },
    { key: "diaSemana", label: "Día de la semana", type: "select", required: true, options: DIAS_SEMANA },
    { key: "horaInicio", label: "Hora de inicio", type: "time", required: true },
    { key: "horaFin", label: "Hora de fin", type: "time", required: true },
    { key: "aula", label: "Aula", type: "text" },
  ],
  buildPayload: (form, fields) => {
    const payload = {};
    fields.forEach((f) => {
      if (f.key === "curso") {
        payload.curso = form.curso ? { idCurso: Number(form.curso) } : null;
      } else if (f.key === "diaSemana") {
        payload.diaSemana = form.diaSemana === "" ? null : Number(form.diaSemana);
      } else {
        payload[f.key] = form[f.key];
      }
    });
    return payload;
  },
};
