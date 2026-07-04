import RoleSidebarLayout from "./RoleSidebarLayout";
import { DocenteDataProvider } from "../context/DocenteDataContext";

const NAV_SECTIONS = [
  { title: "General", items: [{ to: "/docente", label: "Panel principal", end: true }] },
  {
    title: "Mi trabajo",
    items: [
      { to: "/docente/cursos", label: "Mis cursos" },
      { to: "/docente/horario", label: "Mi horario" },
      { to: "/docente/estudiantes", label: "Mis estudiantes" },
    ],
  },
  {
    title: "Comunicación",
    items: [{ to: "/docente/comunicados", label: "Comunicados" }],
  },
];

export default function DocenteLayout() {
  return (
    <DocenteDataProvider>
      <RoleSidebarLayout brandSub="Panel del Docente" navSections={NAV_SECTIONS} />
    </DocenteDataProvider>
  );
}
