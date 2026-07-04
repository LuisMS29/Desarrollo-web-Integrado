import { useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useEstudianteData } from "../../context/EstudianteDataContext";
import { asistenciasApi } from "../../api/crudApi";

const ESTADO_LABEL = {
  PRESENTE: "Presente",
  TARDANZA: "Tardanza",
  AUSENTE: "Ausente",
  JUSTIFICADO: "Justificado",
};

export default function MiAsistencia() {
  const { matriculas, loading: loadingMatriculas, error: errorMatriculas } = useEstudianteData();
  const [asistenciasPorMatricula, setAsistenciasPorMatricula] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (matriculas.length === 0) {
      setLoading(false);
      return;
    }
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const results = await Promise.all(
          matriculas.map((m) => asistenciasApi.listarPorMatricula(m.idMatricula))
        );
        if (!mounted) return;
        const map = {};
        matriculas.forEach((m, idx) => {
          map[m.idMatricula] = [...(results[idx].data || [])].sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
          );
        });
        setAsistenciasPorMatricula(map);
      } catch (err) {
        setError(err.friendlyMessage || "No se pudo cargar tu asistencia.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [matriculas]);

  if (loadingMatriculas) return <LoadingState label="Cargando..." />;
  if (errorMatriculas) return <ErrorState message={errorMatriculas} />;

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Mi asistencia</h1>
        <p className="text-secondary mb-0">Registro de asistencia diaria por curso.</p>
      </div>

      {loading ? (
        <LoadingState label="Cargando asistencia..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : matriculas.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">Aún no tienes cursos matriculados.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {matriculas.map((m) => {
            const registros = asistenciasPorMatricula[m.idMatricula] || [];
            const total = registros.length;
            const presentes = registros.filter((r) => r.estado === "PRESENTE").length;
            const porcentaje = total ? Math.round((presentes / total) * 100) : null;

            return (
              <div className="ie-card p-4" key={m.idMatricula}>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <h3 className="font-display h6 fw-bold mb-0">{m.curso.asignatura?.nombre}</h3>
                  {porcentaje !== null && (
                    <span className="badge text-bg-light border">{porcentaje}% de asistencia</span>
                  )}
                </div>
                {registros.length === 0 ? (
                  <p className="text-secondary small mb-0">Todavía no hay registros de asistencia en este curso.</p>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: 260, overflowY: "auto" }}>
                    <table className="table ie-table mb-0">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registros.map((r) => (
                          <tr key={r.idAsistencia}>
                            <td>{new Date(r.fecha).toLocaleDateString("es-PE")}</td>
                            <td>{ESTADO_LABEL[r.estado] ?? r.estado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
