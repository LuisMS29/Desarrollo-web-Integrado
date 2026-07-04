import EntityCrudPage from "../../components/EntityCrudPage";
import { asignaturasApi } from "../../api/crudApi";

export default function Asignaturas() {
  return (
    <EntityCrudPage
      title="Asignaturas"
      subtitle="Materias que se dictan en el colegio (ej. Matemática, Comunicación)."
      api={asignaturasApi}
      idKey="idAsignatura"
      emptyForm={{ nombre: "", descripcion: "" }}
      columns={[
        { key: "nombre", label: "Nombre" },
        { key: "descripcion", label: "Descripción" },
      ]}
      fields={[
        { key: "nombre", label: "Nombre", type: "text", required: true },
        { key: "descripcion", label: "Descripción", type: "textarea" },
      ]}
    />
  );
}
