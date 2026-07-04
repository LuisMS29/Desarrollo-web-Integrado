import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useEstudianteData } from "../../context/EstudianteDataContext";

export default function EstudianteDashboard() {
  const { estudiante, matriculas, loading, error, reload } = useEstudianteData();

  if (loading) return <LoadingState label="Cargando tu información..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const activas = matriculas.filter((m) => m.estado === "ACTIVO");
  const agrupadas = {};
  activas.forEach((m) => {
    const curso = m.curso;
    if (curso) {
      const key = curso.grado?.nombre || "—";
      agrupadas[key] = (agrupadas[key] || 0) + 1;
    }
  });
  const grados = Object.entries(agrupadas);
  const maxGrado = Math.max(1, ...grados.map(([, c]) => c));

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">
          Hola, {estudiante?.nombres} {estudiante?.apellidos}
        </h1>
        <p className="text-secondary mb-0">Código {estudiante?.codigoEstudiante}</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="ie-stat-card h-100">
            <div className="accent-bar" style={{ background: "var(--ie-success)" }} />
            <div className="label">Cursos matriculados</div>
            <div className="value">{activas.length}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="ie-stat-card h-100">
            <div className="accent-bar" style={{ background: "var(--ie-accent)" }} />
            <div className="label">Grados distintos</div>
            <div className="value">{grados.length}</div>
          </div>
        </div>
      </div>

      {grados.length > 0 && (
        <div className="ie-card p-4 mb-4">
          <h2 className="font-display h5 fw-bold mb-3">Cursos por grado</h2>
          <div className="d-flex flex-column gap-3">
            {grados.map(([grado, count], i) => (
              <div key={grado}>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold">{grado}</span>
                  <span className="text-secondary">{count} curso{count !== 1 ? "s" : ""}</span>
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${(count / maxGrado) * 100}%`,
                      background: "var(--ie-success)",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ie-card p-4">
        <h2 className="font-display h5 fw-bold mb-3">Accesos rápidos</h2>
        <div className="row g-3">
          <QuickLink to="/estudiante/cursos" title="Mis cursos" desc="Revisa tus cursos, docentes y horarios." />
          <QuickLink to="/estudiante/notas" title="Mis notas" desc="Consulta tus calificaciones por bimestre." />
          <QuickLink to="/estudiante/asistencia" title="Mi asistencia" desc="Verifica tu porcentaje de asistencia." />
          <QuickLink to="/estudiante/comunicados" title="Comunicados" desc="Avisos del colegio dirigidos a estudiantes." />
        </div>
      </div>
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
