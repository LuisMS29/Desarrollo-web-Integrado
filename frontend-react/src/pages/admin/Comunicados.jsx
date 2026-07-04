import EntityCrudPage from "../../components/EntityCrudPage";
import { comunicadosApi } from "../../api/crudApi";

const DIRIGIDO_A_OPTIONS = [
  { value: "TODOS", label: "Todos" },
  { value: "DOCENTE", label: "Docentes" },
  { value: "ESTUDIANTE", label: "Estudiantes" },
  { value: "DIRECTOR", label: "Dirección" },
  { value: "ADMIN", label: "Administración" },
];

export default function Comunicados() {
  return (
    <EntityCrudPage
      title="Comunicados"
      subtitle="Publica avisos dirigidos a toda la comunidad escolar o a un rol específico."
      api={comunicadosApi}
      idKey="idComunicado"
      emptyForm={{ titulo: "", contenido: "", dirigidoA: "TODOS", fechaExpiracion: "" }}
      columns={[
        { key: "titulo", label: "Título" },
        { key: "dirigidoA", label: "Dirigido a" },
        {
          key: "fechaPublicacion",
          label: "Publicado",
          render: (r) => (r.fechaPublicacion ? new Date(r.fechaPublicacion).toLocaleDateString("es-PE") : "—"),
        },
        { key: "fechaExpiracion", label: "Expira" },
      ]}
      fields={[
        { key: "titulo", label: "Título", type: "text", required: true },
        { key: "contenido", label: "Contenido", type: "textarea", required: true },
        { key: "dirigidoA", label: "Dirigido a", type: "select", required: true, options: DIRIGIDO_A_OPTIONS },
        { key: "fechaExpiracion", label: "Fecha de expiración", type: "date" },
      ]}
    />
  );
}