import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useDocenteData } from "../../context/DocenteDataContext";
import { matriculasApi } from "../../api/crudApi";

const COLORS = ["var(--ie-primary)", "#2f7ea6", "var(--ie-success)", "var(--ie-accent)", "#7a4e9e", "#d97706"];

export default function DocenteDashboard() {
  const { docente, cursos, loading, error, reload } = useDocenteData();
  const [estudiantesPorCurso, setEstudiantesPorCurso] = useState([]);
  const [loadingEst, setLoadingEst] = useState(true);

  useEffect(() => {
    if (cursos.length === 0) {
      setEstudiantesPorCurso([]);
      setLoadingEst(false);
      return;
    }
    let mounted = true;
    Promise.allSettled(cursos.map((c) => matriculasApi.listarPorCurso(c.idCurso))).then((results) => {
      if (!mounted) return;
      const data = results.map((res, idx) => ({
        curso: cursos[idx],
        count: res.status === "fulfilled" ? (res.value.data || []).filter((m) => m.estado === "ACTIVO").length : 0,
      }));
      setEstudiantesPorCurso(data);
      setLoadingEst(false);
    });
    return () => { mounted = false; };
  }, [cursos]);

  if (loading) return <LoadingState label="Cargando tu información..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const totalEstudiantes = estudiantesPorCurso.reduce((s, e) => s + e.count, 0);
  const maxEst = Math.max(1, ...estudiantesPorCurso.map((e) => e.count));

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">
          Hola, {docente?.nombres} {docente?.apellidos}
        </h1>
        <p className="text-secondary mb-0">
          {docente?.especialidad ? `Especialidad: ${docente.especialidad} · ` : ""}
          Código {docente?.codigoDocente}
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="ie-stat-card h-100">
            <div className="accent-bar" style={{ background: "var(--ie-primary)" }} />
            <div className="label">Cursos a cargo</div>
            <div className="value">{cursos.length}</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="ie-stat-card h-100">
            <div className="accent-bar" style={{ background: "var(--ie-success)" }} />
            <div className="label">Estudiantes</div>
            <div className="value">{totalEstudiantes}</div>
          </div>
        </div>
      </div>

      {estudiantesPorCurso.length > 0 && (
        <div className="ie-card p-4 mb-4">
          <h2 className="font-display h5 fw-bold mb-3">Estudiantes por curso</h2>
          <div className="d-flex flex-column gap-3">
            {estudiantesPorCurso.map((e, i) => (
              <div key={e.curso.idCurso}>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="fw-semibold">{e.curso.asignatura?.nombre} · {e.curso.grado?.nombre}{e.curso.seccion?.nombre}</span>
                  <span className="text-secondary">{e.count}</span>
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${(e.count / maxEst) * 100}%`,
                      background: COLORS[i % COLORS.length],
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ie-card p-4 mb-4">
        <h2 className="font-display h5 fw-bold mb-3">Mis cursos</h2>
        {cursos.length === 0 ? (
          <p className="text-secondary mb-0">
            Aún no tienes cursos asignados. Comunícate con Dirección para que te asignen uno.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table ie-table mb-0">
              <thead>
                <tr>
                  <th>Asignatura</th>
                  <th>Grado / Sección</th>
                  <th>Período</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((c) => (
                  <tr key={c.idCurso}>
                    <td>{c.asignatura?.nombre ?? "—"}</td>
                    <td>
                      {c.grado?.nombre ?? "—"}{c.seccion?.nombre ?? ""}
                    </td>
                    <td>{c.periodoAcademico ? `${c.periodoAcademico.nombre} (${c.periodoAcademico.anio})` : "—"}</td>
                    <td className="text-end">
                      <Link className="btn btn-sm btn-outline-primary me-2" to={`/docente/cursos/${c.idCurso}/notas`}>
                        Notas
                      </Link>
                      <Link className="btn btn-sm btn-outline-primary" to={`/docente/cursos/${c.idCurso}/asistencia`}>
                        Asistencia
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="ie-card p-4">
        <h2 className="font-display h5 fw-bold mb-3">Accesos rápidos</h2>
        <div className="row g-3">
          <QuickLink to="/docente/cursos" title="Ver mis cursos" desc="Consulta el detalle y horario de cada curso." />
          <QuickLink to="/docente/estudiantes" title="Mis estudiantes" desc="Lista consolidada de alumnos a tu cargo." />
          <QuickLink to="/docente/comunicados" title="Comunicados" desc="Avisos institucionales dirigidos a docentes." />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, title, desc }) {
  return (
    <div className="col-md-6 col-lg-4">
      <Link to={to} className="text-decoration-none">
        <div className="border rounded-3 p-3 h-100" style={{ borderColor: "var(--ie-line)" }}>
          <div className="fw-semibold text-dark mb-1">{title}</div>
          <div className="small text-secondary">{desc}</div>
        </div>
      </Link>
    </div>
  );
}
