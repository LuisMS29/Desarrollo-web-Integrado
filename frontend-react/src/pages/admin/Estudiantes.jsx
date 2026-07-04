import EntityCrudPage from "../../components/EntityCrudPage";
import { estudiantesApi } from "../../api/crudApi";

export default function Estudiantes() {
  return (
    <EntityCrudPage
      title="Estudiantes"
      subtitle="Alumnado registrado en el colegio."
      api={estudiantesApi}
      idKey="idEstudiante"
      emptyForm={{
        codigoEstudiante: "",
        nombres: "",
        apellidos: "",
        dni: "",
        fechaNacimiento: "",
        direccion: "",
        telefono: "",
      }}
      columns={[
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
      ]}
      canCreate={false}
      fields={[
        { key: "codigoEstudiante", label: "Código de estudiante", type: "text", required: true },
        { key: "nombres", label: "Nombres", type: "text", required: true },
        { key: "apellidos", label: "Apellidos", type: "text", required: true },
        { key: "dni", label: "DNI", type: "text" },
        { key: "fechaNacimiento", label: "Fecha de nacimiento", type: "date" },
        { key: "direccion", label: "Dirección", type: "text" },
        { key: "telefono", label: "Teléfono", type: "text" },
      ]}
      searchable
      searchPlaceholder="Buscar por nombre, apellido o código..."
      searchFields={["nombres", "apellidos", "codigoEstudiante"]}
      sortOptions={[
        { key: "nombres", label: "Nombres" },
        { key: "apellidos", label: "Apellidos" },
      ]}
      defaultSort="apellidos"
    />
  );
}
