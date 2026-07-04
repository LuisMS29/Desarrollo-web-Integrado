import RoleSidebarLayout from "./RoleSidebarLayout";

const NAV_SECTIONS = [
  { title: "General", items: [{ to: "/director", label: "Panel principal", end: true }] },
  {
    title: "Personas",
    items: [
      { to: "/director/docentes", label: "Docentes" },
      { to: "/director/estudiantes", label: "Estudiantes" },
    ],
  },
  {
    title: "Estructura académica",
    items: [
      { to: "/director/grados", label: "Grados" },
      { to: "/director/secciones", label: "Secciones" },
      { to: "/director/asignaturas", label: "Asignaturas" },
      { to: "/director/cursos", label: "Cursos" },
      { to: "/director/horarios", label: "Horarios" },
      { to: "/director/periodos", label: "Períodos académicos" },
      { to: "/director/evaluaciones", label: "Períodos de evaluación" },
    ],
  },
  {
    title: "Matrícula",
    items: [{ to: "/director/matriculas", label: "Matrículas" }],
  },
  {
    title: "Comunicación",
    items: [{ to: "/director/comunicados", label: "Comunicados" }],
  },
];

export default function DirectorLayout() {
  return <RoleSidebarLayout brandSub="Panel de Dirección" navSections={NAV_SECTIONS} />;
}
