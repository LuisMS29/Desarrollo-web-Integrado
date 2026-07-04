import { useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useEstudianteData } from "../../context/EstudianteDataContext";
import { notasApi } from "../../api/crudApi";

export default function MisNotas() {
  const { matriculas, loading: loadingMatriculas, error: errorMatriculas } = useEstudianteData();
  const [notasPorMatricula, setNotasPorMatricula] = useState({});
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
          matriculas.map((m) => notasApi.listarPorMatricula(m.idMatricula))
        );
        if (!mounted) return;
        const map = {};
        matriculas.forEach((m, idx) => {
          map[m.idMatricula] = [...(results[idx].data || [])].sort(
            (a, b) => a.evaluacionPeriodo.orden - b.evaluacionPeriodo.orden
          );
        });
        setNotasPorMatricula(map);
      } catch (err) {
        setError(err.friendlyMessage || "No se pudieron cargar tus notas.");
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
        <h1 className="font-display fw-bold h3 mb-1">Mis notas</h1>
        <p className="text-secondary mb-0">Calificaciones registradas por tus docentes, por bimestre/trimestre.</p>
      </div>

      {loading ? (
        <LoadingState label="Cargando notas..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : matriculas.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">Aún no tienes cursos matriculados.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {matriculas.map((m) => {
            const notas = notasPorMatricula[m.idMatricula] || [];
            const valores = notas.filter((n) => n.valor !== null && n.valor !== undefined);
            const promedio = valores.length
              ? (valores.reduce((acc, n) => acc + Number(n.valor), 0) / valores.length).toFixed(1)
              : null;

            return (
              <div className="ie-card p-4" key={m.idMatricula}>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <h3 className="font-display h6 fw-bold mb-0">{m.curso.asignatura?.nombre}</h3>
                  {promedio && (
                    <span className="badge text-bg-light border">Promedio: {promedio}</span>
                  )}
                </div>
                {notas.length === 0 ? (
                  <p className="text-secondary small mb-0">Todavía no hay notas registradas en este curso.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table ie-table mb-0">
                      <thead>
                        <tr>
                          <th>Período de evaluación</th>
                          <th className="text-center">Nota</th>
                          <th>Observación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notas.map((n) => (
                          <tr key={n.idNota}>
                            <td>{n.evaluacionPeriodo?.nombre}</td>
                            <td className="text-center fw-semibold">
                              {n.valor !== null && n.valor !== undefined ? n.valor : "—"}
                            </td>
                            <td className="text-secondary">{n.observacion || "—"}</td>
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
