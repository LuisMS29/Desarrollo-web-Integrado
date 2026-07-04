import EntityCrudPage from "../../components/EntityCrudPage";
import { gradosApi } from "../../api/crudApi";

export default function Grados() {
  return (
    <EntityCrudPage
      title="Grados"
      subtitle="Niveles de grado disponibles en el colegio (ej. 1°, 2°, 3° de primaria)."
      api={gradosApi}
      idKey="idGrado"
      emptyForm={{ nombre: "", nivel: "PRIMARIA", orden: "" }}
      columns={[
        { key: "nombre", label: "Nombre" },
        { key: "nivel", label: "Nivel" },
        { key: "orden", label: "Orden" },
      ]}
      fields={[
        { key: "nombre", label: "Nombre", type: "text", required: true },
        {
          key: "nivel",
          label: "Nivel",
          type: "select",
          required: true,
          options: [{ value: "PRIMARIA", label: "Primaria" }],
        },
        { key: "orden", label: "Orden", type: "number", required: true },
      ]}
    />
  );
}
