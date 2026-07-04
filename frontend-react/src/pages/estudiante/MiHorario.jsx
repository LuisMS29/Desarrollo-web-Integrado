import { useEffect, useMemo, useState } from "react";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useEstudianteData } from "../../context/EstudianteDataContext";
import { horariosApi } from "../../api/crudApi";

const DIAS = [
  { num: 1, label: "Lunes" },
  { num: 2, label: "Martes" },
  { num: 3, label: "Miércoles" },
  { num: 4, label: "Jueves" },
  { num: 5, label: "Viernes" },
  { num: 6, label: "Sábado" },
];

const HORAS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

function toMinutos(h) {
  if (!h) return 0;
  const p = h.split(":");
  return Number(p[0]) * 60 + Number(p[1]);
}

function formatearHora(h) {
  if (!h) return "";
  return h.length > 5 ? h.slice(0, 5) : h;
}

export default function MiHorario() {
  const { matriculas, loading: loadingMatriculas, error, reload } = useEstudianteData();
  const [horarios, setHorarios] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(true);

  useEffect(() => {
    if (!matriculas.length) {
      setLoadingHorarios(false);
      return;
    }
    let mounted = true;

    async function load() {
      setLoadingHorarios(true);
      try {
        const results = await Promise.all(matriculas.map((m) => horariosApi.listarPorCurso(m.curso.idCurso)));
        if (!mounted) return;
        const todos = results.flatMap((res, idx) =>
          (res.data || []).map((h) => ({
            ...h,
            horaInicio: formatearHora(h.horaInicio),
            horaFin: formatearHora(h.horaFin),
            curso: matriculas[idx].curso,
          }))
        );
        setHorarios(todos);
      } catch {
        if (mounted) setHorarios([]);
      } finally {
        if (mounted) setLoadingHorarios(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [matriculas]);

  const grid = useMemo(() => {
    const slots = {};
    HORAS.forEach((h) => { slots[h] = {}; });

    DIAS.forEach((d) => {
      let skipHasta = null;

      HORAS.forEach((hora, idx) => {
        if (skipHasta && idx < skipHasta) {
          slots[hora][d.num] = { skip: true };
          return;
        }
        skipHasta = null;

        const match = horarios.find((h) => h.diaSemana === d.num && h.horaInicio === hora);
        if (match) {
          const inicio = toMinutos(match.horaInicio);
          const fin = toMinutos(match.horaFin);
          const duracionSlots = Math.round((fin - inicio) / 30);
          slots[hora][d.num] = { entry: match, rowspan: duracionSlots };
          if (duracionSlots > 1) skipHasta = idx + duracionSlots;
        } else {
          slots[hora][d.num] = null;
        }
      });
    });

    return slots;
  }, [horarios]);

  if (loadingMatriculas) return <LoadingState label="Cargando tus cursos..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Mi horario</h1>
        <p className="text-secondary mb-0">Horario semanal de tus cursos.</p>
      </div>

      {loadingHorarios ? (
        <LoadingState label="Cargando horarios..." />
      ) : horarios.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">No tienes horarios asignados a tus cursos.</p>
        </div>
      ) : (
        <div className="ie-card">
          <div className="table-responsive">
            <table className="table ie-table mb-0" style={{ fontSize: "0.8rem" }}>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Hora</th>
                  {DIAS.map((d) => (
                    <th key={d.num} className="text-center" style={{ minWidth: 140 }}>{d.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HORAS.map((hora, idx) => {
                  const fila = grid[hora];
                  return (
                    <tr key={hora}>
                      <td className="text-mono text-secondary align-middle" style={{ fontSize: "0.75rem" }}>
                        {hora}
                      </td>
                      {DIAS.map((d) => {
                        const celda = fila?.[d.num];
                        if (!celda) return <td key={d.num} />;
                        if (celda.skip) return null;
                        const e = celda.entry;
                        return (
                          <td
                            key={d.num}
                            rowSpan={celda.rowspan || 1}
                            className="p-2 align-middle"
                            style={{ background: "var(--ie-accent-bg)" }}
                          >
                            <div className="fw-semibold small">{e.curso?.asignatura?.nombre}</div>
                            <div className="small text-secondary">
                              {e.curso?.grado?.nombre}{e.curso?.seccion?.nombre}
                            </div>
                            <div className="small text-muted">
                              {e.horaInicio}-{e.horaFin}
                              {e.aula ? ` · ${e.aula}` : ""}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}