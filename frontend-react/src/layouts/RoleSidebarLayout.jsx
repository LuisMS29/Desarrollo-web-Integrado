import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificacionesDropdown from "../components/NotificacionesDropdown";

/**
 * Sidebar reutilizable con la misma identidad visual del panel Admin.
 * Cada rol define sus propias secciones de navegación y las pasa por props.
 */
export default function RoleSidebarLayout({ brandSub, navSections }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ie-shell">
      <aside className={`ie-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="ie-sidebar-brand">
          <img src="/logo.svg" alt="Logo" style={{ height: 48, width: 48, borderRadius: 12 }} />
          <div>
            <div className="name">Intranet Escolar</div>
            <div className="sub">{brandSub}</div>
          </div>
        </div>

        <nav className="ie-nav">
          {navSections.map((section) => (
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
            <span className={`badge-rol ${user?.rol}`}>{user?.rol}</span>
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
          <NotificacionesDropdown usuarioId={user?.idUsuario} />
          <span className={`badge-rol ${user?.rol}`}>{user?.rol}</span>
        </header>

        <main className="ie-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
