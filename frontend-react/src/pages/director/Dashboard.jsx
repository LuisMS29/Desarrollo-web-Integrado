import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  docentesApi,
  estudiantesApi,
  cursosApi,
  comunicadosApi,
  matriculasApi,
  periodosApi,
} from "../../api/crudApi";
import LoadingState from "../../components/LoadingState";

const STAT_CONFIG = [
  { key: "docentes", label: "Docentes", accent: "#2f7ea6", link: "/director/docentes" },
  { key: "estudiantes", label: "Estudiantes", accent: "var(--ie-success)", link: "/director/estudiantes" },
  { key: "cursos", label: "Cursos", accent: "var(--ie-accent)", link: "/director/cursos" },
  { key: "matriculas", label: "Matrículas", accent: "var(--ie-primary)", link: "/director/matriculas" },
  { key: "comunicados", label: "Comunicados", accent: "#7a4e9e", link: "/director/comunicados" },
];

const COLORS = [ "#2f7ea6", "var(--ie-success)", "var(--ie-accent)", "var(--ie-primary)", "#7a4e9e"];

export default function DirectorDashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [periodoActivo, setPeriodoActivo] = useState(null);
  const [failedResources, setFailedResources] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadCounts() {
      const requests = [
        { key: "docentes", call: docentesApi.listar },
        { key: "estudiantes", call: estudiantesApi.listar },
        { key: "cursos", call: cursosApi.listar },
        { key: "matriculas", call: matriculasApi.listar },
        { key: "comunicados", call: comunicadosApi.listar },
      ];

      const [results, periodoResult] = await Promise.all([
        Promise.allSettled(requests.map((r) => r.call())),
        periodosApi.listar().catch(() => ({ data: [] })),
      ]);
      if (!mounted) return;

      const nextCounts = {};
      const failed = [];
      results.forEach((res, idx) => {
        const key = requests[idx].key;
        if (res.status === "fulfilled") {
          nextCounts[key] = Array.isArray(res.value.data) ? res.value.data.length : 0;
        } else {
          nextCounts[key] = null;
          failed.push(key);
        }
      });

      setCounts(nextCounts);
      setFailedResources(failed);
      setPeriodoActivo((periodoResult.data || []).find((p) => p.activo) || null);
      setLoading(false);
    }

    loadCounts();
    return () => {
      mounted = false;
    };
  }, []);

  const statEntries = STAT_CONFIG.map((s) => ({
    ...s,
    count: counts[s.key],
    max: Math.max(1, ...STAT_CONFIG.map((x) => counts[x.key] || 0)),
  }));

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Panel de Dirección</h1>
        <p className="text-secondary mb-0">
          Gestión académica: cursos, matrículas, docentes y comunicados institucionales.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Cargando indicadores..." />
      ) : (
        <>
          {periodoActivo && (
            <div className="alert alert-success small d-flex align-items-center justify-content-between">
              <span>
                Período académico activo: <strong>{periodoActivo.nombre} ({periodoActivo.anio})</strong>
              </span>
              <Link to="/director/periodos" className="btn btn-sm btn-outline-success">
                Ver períodos
              </Link>
            </div>
          )}

          {failedResources.length > 0 && (
            <div className="alert alert-warning small">
              No se pudieron cargar algunos indicadores ({failedResources.join(", ")}). Verifica que el backend esté disponible.
            </div>
          )}

          <div className="row g-3 mb-4">
            {STAT_CONFIG.map((stat) => (
              <div className="col-6 col-lg-3" key={stat.key}>
                <Link to={stat.link} className="text-decoration-none">
                  <div className="ie-stat-card h-100">
                    <div className="accent-bar" style={{ background: stat.accent }} />
                    <div className="label">{stat.label}</div>
                    <div className="value">{counts[stat.key] === null ? "—" : counts[stat.key]}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="ie-card p-4 mb-4">
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

          <div className="ie-card p-4">
            <h2 className="font-display h5 fw-bold mb-3">Accesos rápidos</h2>
            <div className="row g-3">
              <QuickLink to="/director/cursos" title="Organizar cursos" desc="Asigna docentes, grado, sección y período a cada curso." />
              <QuickLink to="/director/matriculas" title="Matricular estudiantes" desc="Inscribe alumnos en los cursos del período vigente." />
              <QuickLink to="/director/horarios" title="Definir horarios" desc="Día, hora y aula de cada curso." />
              <QuickLink to="/director/comunicados" title="Publicar comunicado" desc="Notifica a toda la comunidad escolar." />
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
