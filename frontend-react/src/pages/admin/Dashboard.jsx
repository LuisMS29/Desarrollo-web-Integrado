import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usuariosApi } from "../../api/usuariosApi";
import { docentesApi, estudiantesApi, cursosApi, comunicadosApi } from "../../api/crudApi";
import LoadingState from "../../components/LoadingState";

const STAT_CONFIG = [
  { key: "usuarios", label: "Usuarios registrados", accent: "var(--ie-primary)", link: "/admin/usuarios" },
  { key: "docentes", label: "Docentes", accent: "#2f7ea6", link: "/admin/docentes" },
  { key: "estudiantes", label: "Estudiantes", accent: "var(--ie-success)", link: "/admin/estudiantes" },
  { key: "cursos", label: "Cursos activos", accent: "var(--ie-accent)", link: "/admin/cursos" },
  { key: "comunicados", label: "Comunicados", accent: "#7a4e9e", link: "/admin/comunicados" },
];

const COLORS = ["var(--ie-primary)", "#2f7ea6", "var(--ie-success)", "var(--ie-accent)", "#7a4e9e", "#d97706"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [roleCounts, setRoleCounts] = useState([]);
  const [failedResources, setFailedResources] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadCounts() {
      const requests = [
        { key: "usuarios", call: usuariosApi.listar },
        { key: "docentes", call: docentesApi.listar },
        { key: "estudiantes", call: estudiantesApi.listar },
        { key: "cursos", call: cursosApi.listar },
        { key: "comunicados", call: comunicadosApi.listar },
      ];

      const results = await Promise.allSettled(requests.map((r) => r.call()));
      if (!mounted) return;

      const nextCounts = {};
      const failed = [];
      const roles = {};
      results.forEach((res, idx) => {
        const key = requests[idx].key;
        if (res.status === "fulfilled") {
          const data = res.value.data;
          nextCounts[key] = Array.isArray(data) ? data.length : 0;
          if (key === "usuarios") {
            data.forEach((u) => {
              roles[u.rol] = (roles[u.rol] || 0) + 1;
            });
          }
        } else {
          nextCounts[key] = null;
          failed.push(key);
        }
      });

      setCounts(nextCounts);
      setRoleCounts(Object.entries(roles).map(([rol, count]) => ({ rol, count })));
      setFailedResources(failed);
      setLoading(false);
    }

    loadCounts();
    return () => { mounted = false; };
  }, []);

  const statEntries = STAT_CONFIG.map((s) => ({
    ...s,
    count: counts[s.key],
    max: Math.max(1, ...STAT_CONFIG.map((x) => counts[x.key] || 0)),
  }));

  const totalRoles = roleCounts.reduce((s, r) => s + r.count, 0);

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Panel principal</h1>
        <p className="text-secondary mb-0">
          Resumen general del sistema. Usa el menú lateral para administrar cada sección.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Cargando indicadores..." />
      ) : (
        <>
          {failedResources.length > 0 && (
            <div className="alert alert-warning small">
              No se pudieron cargar algunos indicadores ({failedResources.join(", ")}).
              Verifica que el backend esté disponible.
            </div>
          )}

          <div className="row g-3 mb-4">
            {STAT_CONFIG.map((stat) => (
              <div className="col-6 col-lg-3" key={stat.key}>
                <Link to={stat.link} className="text-decoration-none">
                  <div className="ie-stat-card h-100">
                    <div className="accent-bar" style={{ background: stat.accent }} />
                    <div className="label">{stat.label}</div>
                    <div className="value">
                      {counts[stat.key] === null ? "—" : counts[stat.key]}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-7">
              <div className="ie-card p-4 h-100">
                <h2 className="font-display h5 fw-bold mb-3">Distribución general</h2>
                <div className="d-flex flex-column gap-3">
                  {statEntries.map((s, i) => (
                    <div key={s.key}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="fw-semibold">{s.label}</span>
                        <span className="text-secondary">{s.count ?? "—"}</span>
                      </div>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{
                            width: s.count != null ? `${(s.count / s.max) * 100}%` : "0%",
                            background: s.accent,
                            animationDelay: `${i * 0.08}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="ie-card p-4 h-100">
                <h2 className="font-display h5 fw-bold mb-3">Usuarios por rol</h2>
                {roleCounts.length === 0 ? (
                  <p className="text-secondary small mb-0">Sin datos.</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {roleCounts.map((r, i) => {
                      const pct = totalRoles > 0 ? (r.count / totalRoles) * 100 : 0;
                      return (
                        <div key={r.rol}>
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="fw-semibold">{r.rol}</span>
                            <span className="text-secondary">{r.count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="chart-bar-track">
                            <div
                              className="chart-bar-fill"
                              style={{
                                width: `${pct}%`,
                                background: COLORS[i % COLORS.length],
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="doughnut-wrapper mt-3">
                      <svg viewBox="0 0 36 36" className="doughnut-svg">
                        {roleCounts.map((r, i) => {
                          const pct = totalRoles > 0 ? r.count / totalRoles : 0;
                          const offset = roleCounts
                            .slice(0, i)
                            .reduce((s, x) => s + (totalRoles > 0 ? x.count / totalRoles : 0), 0);
                          const circumference = 2 * Math.PI * 15.9155;
                          const dashArray = `${pct * circumference} ${(1 - pct) * circumference}`;
                          const dashOffset = -offset * circumference;
                          return (
                            <circle
                              key={r.rol}
                              cx="18" cy="18" r="15.9155"
                              fill="none"
                              stroke={COLORS[i % COLORS.length]}
                              strokeWidth="3"
                              strokeDasharray={dashArray}
                              strokeDashoffset={dashOffset}
                              strokeLinecap="round"
                              className="doughnut-segment"
                            />
                          );
                        })}
                        <text x="18" y="18" textAnchor="middle" dominantBaseline="central" className="doughnut-text">
                          {totalRoles}
                        </text>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ie-card p-4">
            <h2 className="font-display h5 fw-bold mb-3">Accesos rápidos</h2>
            <div className="row g-3">
              <QuickLink to="/admin/usuarios" title="Gestionar usuarios" desc="Activa, desactiva o elimina cuentas por rol." />
              <QuickLink to="/admin/docentes" title="Registrar docente" desc="Alta y edición del personal docente." />
              <QuickLink to="/admin/grados" title="Estructura académica" desc="Grados, secciones, cursos y períodos." />
              <QuickLink to="/admin/comunicados" title="Publicar comunicado" desc="Notifica a toda la comunidad escolar." />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuickLink({ to, title, desc }) {
  return (
    <div className="col-md-6 col-lg-3">
      <Link to={to} className="text-decoration-none">
        <div className="border rounded-3 p-3 h-100" style={{ borderColor: "var(--ie-line)" }}>
          <div className="fw-semibold text-dark mb-1">{title}</div>
          <div className="small text-secondary">{desc}</div>
        </div>
      </Link>
    </div>
  );
}
