import EntityCrudPage from "../../components/EntityCrudPage";
import { cursosApi, gradosApi, seccionesApi, asignaturasApi, periodosApi, docentesApi } from "../../api/crudApi";

export default function Cursos() {
  return (
    <EntityCrudPage
      title="Cursos"
      subtitle="Asocia una asignatura con un grado, sección, período y docente."
      api={cursosApi}
      idKey="idCurso"
      emptyForm={{ asignatura: "", grado: "", seccion: "", periodoAcademico: "", docente: "" }}
      columns={[
        { key: "asignatura", label: "Asignatura", render: (r) => r.asignatura?.nombre ?? "—" },
        { key: "grado", label: "Grado", render: (r) => r.grado?.nombre ?? "—" },
        { key: "seccion", label: "Sección", render: (r) => r.seccion?.nombre ?? "—" },
        { key: "docente", label: "Docente", render: (r) => (r.docente ? `${r.docente.nombres} ${r.docente.apellidos}` : "—") },
        { key: "periodoAcademico", label: "Período", render: (r) => r.periodoAcademico?.nombre ?? "—" },
      ]}
      fields={[
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
          relation: { optionsLoader: docentesApi.listar, idKey: "idDocente", labelFn: (o) => `${o.nombres} ${o.apellidos}` },
        },
      ]}
    />
  );
}
