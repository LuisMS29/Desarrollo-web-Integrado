import EntityCrudPage from "../../components/EntityCrudPage";
import { docentesApi } from "../../api/crudApi";

export default function Docentes() {
  return (
    <EntityCrudPage
      title="Docentes"
      subtitle="Personal docente registrado en el colegio."
      api={docentesApi}
      idKey="idDocente"
      emptyForm={{
        codigoDocente: "",
        nombres: "",
        apellidos: "",
        dni: "",
        especialidad: "",
        telefono: "",
        email: "",
      }}
      columns={[
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
      ]}
      canCreate={false}
      fields={[
        { key: "codigoDocente", label: "Código de docente", type: "text", required: true },
        { key: "nombres", label: "Nombres", type: "text", required: true },
        { key: "apellidos", label: "Apellidos", type: "text", required: true },
        { key: "dni", label: "DNI", type: "text" },
        { key: "especialidad", label: "Especialidad", type: "text" },
        { key: "telefono", label: "Teléfono", type: "text" },
        { key: "email", label: "Email", type: "text" },
      ]}
      searchable
      searchPlaceholder="Buscar por nombre, apellido o código..."
      searchFields={["nombres", "apellidos", "codigoDocente"]}
      sortOptions={[
        { key: "nombres", label: "Nombres" },
        { key: "apellidos", label: "Apellidos" },
        { key: "especialidad", label: "Especialidad" },
      ]}
      defaultSort="apellidos"
    />
  );
}
