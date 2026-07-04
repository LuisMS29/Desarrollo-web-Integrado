import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_SECTIONS = [
  {
    title: "General",
    items: [{ to: "/admin", label: "Panel principal", end: true }],
  },
  {
    title: "Cuentas",
    items: [{ to: "/admin/usuarios", label: "Usuarios y roles" }],
  },
  {
    title: "Personas",
    items: [
      { to: "/admin/docentes", label: "Docentes" },
      { to: "/admin/estudiantes", label: "Estudiantes" },
    ],
  },
  {
    title: "Estructura académica",
    items: [
      { to: "/admin/grados", label: "Grados" },
      { to: "/admin/secciones", label: "Secciones" },
      { to: "/admin/asignaturas", label: "Asignaturas" },
      { to: "/admin/cursos", label: "Cursos" },
      { to: "/admin/periodos", label: "Períodos académicos" },
    ],
  },
  {
    title: "Comunicación",
    items: [{ to: "/admin/comunicados", label: "Comunicados" }],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ie-shell">
      <aside className={`ie-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="ie-sidebar-brand">
          <img src="/logo.svg" alt="Logo" style={{ height: 48, width: 48, borderRadius: 12 }} />
          <div>
            <div className="name">Intranet Escolar</div>
            <div className="sub">Panel de Administración</div>
          </div>
        </div>

        <nav className="ie-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="ie-nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="ie-sidebar-footer">
          <div className="text-white fw-semibold">{user?.username}</div>
          <div className="mb-2">
            <span className="badge-rol ADMIN">{user?.rol}</span>
          </div>
          <button className="btn btn-sm btn-outline-light w-100" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="ie-main">
        <header className="ie-topbar">
          <button
            className="btn btn-sm btn-outline-secondary d-md-none"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            Menú
          </button>
          <div className="fw-semibold text-secondary d-none d-md-block">
            Bienvenido, {user?.username}
          </div>
          <span className="badge-rol ADMIN">{user?.rol}</span>
        </header>

        <main className="ie-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
