import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useDocenteData } from "../../context/DocenteDataContext";
import { horariosApi } from "../../api/crudApi";

const DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function MisCursos() {
  const { cursos, loading, error, reload } = useDocenteData();
  const [horariosPorCurso, setHorariosPorCurso] = useState({});
  const [loadingHorarios, setLoadingHorarios] = useState(true);

  useEffect(() => {
    if (cursos.length === 0) {
      setLoadingHorarios(false);
      return;
    }
    let mounted = true;
    Promise.allSettled(cursos.map((c) => horariosApi.listarPorCurso(c.idCurso))).then((results) => {
      if (!mounted) return;
      const map = {};
      results.forEach((res, idx) => {
        map[cursos[idx].idCurso] = res.status === "fulfilled" ? res.value.data : [];
      });
      setHorariosPorCurso(map);
      setLoadingHorarios(false);
    });
    return () => {
      mounted = false;
    };
  }, [cursos]);

  if (loading) return <LoadingState label="Cargando tus cursos..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Mis cursos</h1>
        <p className="text-secondary mb-0">Cursos que tienes asignados en el período académico vigente.</p>
      </div>

      {cursos.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">Todavía no tienes cursos asignados.</p>
        </div>
      ) : (
        <div className="row g-3">
          {cursos.map((c) => (
            <div className="col-md-6 col-xl-4" key={c.idCurso}>
              <div className="ie-card p-3 h-100 d-flex flex-column">
                <div className="mb-2">
                  <span className="badge-rol DOCENTE mb-2 d-inline-block">
                    {c.grado?.nombre ?? "—"}{c.seccion?.nombre ?? ""}
                  </span>
                  <h3 className="font-display h6 fw-bold mb-0">{c.asignatura?.nombre ?? "—"}</h3>
                  <div className="small text-secondary">
                    {c.periodoAcademico ? `${c.periodoAcademico.nombre} (${c.periodoAcademico.anio})` : "—"}
                  </div>
                </div>

                <div className="small text-secondary mb-3 flex-grow-1">
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

                <div className="d-flex gap-2">
                  <Link className="btn btn-sm btn-primary flex-fill" to={`/docente/cursos/${c.idCurso}/notas`}>
                    Notas
                  </Link>
                  <Link className="btn btn-sm btn-outline-primary flex-fill" to={`/docente/cursos/${c.idCurso}/asistencia`}>
                    Asistencia
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
