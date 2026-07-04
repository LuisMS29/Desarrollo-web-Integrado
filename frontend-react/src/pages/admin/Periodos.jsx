import EntityCrudPage from "../../components/EntityCrudPage";
import { periodosApi } from "../../api/crudApi";

export default function Periodos() {
  return (
    <EntityCrudPage
      title="Períodos académicos"
      subtitle="Años/ciclos escolares. Solo un período debería estar activo a la vez."
      api={periodosApi}
      idKey="idPeriodo"
      emptyForm={{ anio: "", nombre: "", fechaInicio: "", fechaFin: "", activo: false }}
      columns={[
        { key: "anio", label: "Año" },
        { key: "nombre", label: "Nombre" },
        { key: "fechaInicio", label: "Inicio" },
        { key: "fechaFin", label: "Fin" },
        { key: "activo", label: "Activo", render: (r) => (r.activo ? "Sí" : "No") },
      ]}
      fields={[
        { key: "anio", label: "Año", type: "number", required: true },
        { key: "nombre", label: "Nombre", type: "text", required: true },
        { key: "fechaInicio", label: "Fecha de inicio", type: "date" },
        { key: "fechaFin", label: "Fecha de fin", type: "date" },
        { key: "activo", label: "Período activo", type: "boolean" },
      ]}
    />
  );
}
