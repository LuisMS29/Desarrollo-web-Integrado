import RoleSidebarLayout from "./RoleSidebarLayout";
import { EstudianteDataProvider } from "../context/EstudianteDataContext";

const NAV_SECTIONS = [
  { title: "General", items: [{ to: "/estudiante", label: "Panel principal", end: true }] },
  {
    title: "Mi progreso",
    items: [
      { to: "/estudiante/cursos", label: "Mis cursos" },
      { to: "/estudiante/horario", label: "Mi horario" },
      { to: "/estudiante/notas", label: "Mis notas" },
      { to: "/estudiante/asistencia", label: "Mi asistencia" },
    ],
  },
  {
    title: "Comunicación",
    items: [
      { to: "/estudiante/comunicados", label: "Comunicados" },
    ],
  },
];

export default function EstudianteLayout() {
  return (
    <EstudianteDataProvider>
      <RoleSidebarLayout brandSub="Panel del Estudiante" navSections={NAV_SECTIONS} />
    </EstudianteDataProvider>
  );
}
