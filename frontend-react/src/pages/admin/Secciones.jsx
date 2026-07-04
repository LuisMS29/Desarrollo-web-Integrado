import EntityCrudPage from "../../components/EntityCrudPage";
import { seccionesApi } from "../../api/crudApi";

export default function Secciones() {
  return (
    <EntityCrudPage
      title="Secciones"
      subtitle="Secciones dentro de cada grado (ej. A, B, C)."
      api={seccionesApi}
      idKey="idSeccion"
      emptyForm={{ nombre: "" }}
      columns={[{ key: "nombre", label: "Nombre" }]}
      fields={[{ key: "nombre", label: "Nombre (una letra)", type: "text", required: true }]}
    />
  );
}
