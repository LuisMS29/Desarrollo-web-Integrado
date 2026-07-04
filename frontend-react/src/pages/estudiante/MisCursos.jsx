import { useEffect, useState } from "react";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useEstudianteData } from "../../context/EstudianteDataContext";
import { horariosApi } from "../../api/crudApi";

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function MisCursos() {
  const { matriculas, loading, error, reload } = useEstudianteData();
  const [horariosPorCurso, setHorariosPorCurso] = useState({});
  const [loadingHorarios, setLoadingHorarios] = useState(true);

  useEffect(() => {
    if (matriculas.length === 0) {
      setLoadingHorarios(false);
      return;
    }
    let mounted = true;
    Promise.allSettled(matriculas.map((m) => horariosApi.listarPorCurso(m.curso.idCurso))).then((results) => {
      if (!mounted) return;
      const map = {};
      results.forEach((res, idx) => {
        map[matriculas[idx].curso.idCurso] = res.status === "fulfilled" ? res.value.data : [];
      });
      setHorariosPorCurso(map);
      setLoadingHorarios(false);
    });
    return () => {
      mounted = false;
    };
  }, [matriculas]);

  if (loading) return <LoadingState label="Cargando tus cursos..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Mis cursos</h1>
        <p className="text-secondary mb-0">Cursos en los que estás matriculado este período.</p>
      </div>

      {matriculas.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">Aún no tienes cursos matriculados.</p>
        </div>
      ) : (
        <div className="row g-3">
          {matriculas.map((m) => {
            const c = m.curso;
            return (
              <div className="col-md-6 col-xl-4" key={m.idMatricula}>
                <div className="ie-card p-3 h-100 d-flex flex-column">
                  <div className="mb-2">
                    <span className="badge-rol ESTUDIANTE mb-2 d-inline-block">
                      {c.grado?.nombre ?? "—"}{c.seccion?.nombre ?? ""}
                    </span>
                    <h3 className="font-display h6 fw-bold mb-0">{c.asignatura?.nombre ?? "—"}</h3>
                    <div className="small text-secondary">
                      Docente: {c.docente ? `${c.docente.nombres} ${c.docente.apellidos}` : "—"}
                    </div>
                  </div>
                  <div className="small text-secondary flex-grow-1">
                    {loadingHorarios ? (
                      "Cargando horario..."
                    ) : (horariosPorCurso[c.idCurso] || []).length === 0 ? (
                      "Sin horario asignado."
                    ) : (
                      <ul className="mb-0 ps-3">
                        {(horariosPorCurso[c.idCurso] || []).map((h) => (
                          <li key={h.idHorario}>
                            {DIAS[h.diaSemana] ?? h.diaSemana} · {h.horaInicio}–{h.horaFin}
                            {h.aula ? ` · Aula ${h.aula}` : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
