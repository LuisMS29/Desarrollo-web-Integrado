import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useDocenteData } from "../../context/DocenteDataContext";
import { useToast } from "../../context/ToastContext";
import { matriculasApi, asistenciasApi, horariosApi, periodoActivoApi } from "../../api/crudApi";

const ESTADOS = [
  { value: "PRESENTE", label: "P", color: "success" },
  { value: "TARDANZA", label: "T", color: "warning" },
  { value: "AUSENTE", label: "A", color: "danger" },
  { value: "JUSTIFICADO", label: "J", color: "info" },
];

const DIAS_NOMBRE = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function generarFechasClase(diaSemana, inicio, fin) {
  const fechas = [];
  let current = new Date(inicio);
  const end = new Date(fin);
  while (current <= end) {
    if (current.getDay() === diaSemana) {
      fechas.push(current.toISOString().slice(0, 10));
    }
    current.setDate(current.getDate() + 1);
  }
  return fechas;
}

function agruparPorMes(fechas) {
  const grupos = {};
  fechas.forEach((f) => {
    const mes = f.slice(0, 7);
    if (!grupos[mes]) grupos[mes] = [];
    grupos[mes].push(f);
  });
  return grupos;
}

export default function Asistencia() {
  const { cursoId } = useParams();
  const { cursos, loading: loadingCurso } = useDocenteData();
  const { notifySuccess, notifyError } = useToast();

  const curso = useMemo(
    () => cursos.find((c) => String(c.idCurso) === String(cursoId)),
    [cursos, cursoId]
  );

  const [matriculas, setMatriculas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [periodo, setPeriodo] = useState(null);
  const [registros, setRegistros] = useState({});
  const [fechasClase, setFechasClase] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [savingCell, setSavingCell] = useState(null);

  useEffect(() => {
    if (!curso) return;
    let mounted = true;

    async function load() {
      setLoadingData(true);
      setError("");
      try {
        const [{ data: matriculasData }, { data: horariosData }, { data: periodoData }] = await Promise.all([
          matriculasApi.listarPorCurso(curso.idCurso),
          horariosApi.listarPorCurso(curso.idCurso),
          periodoActivoApi.obtener(),
        ]);
        if (!mounted) return;

        const activas = matriculasData
          .filter((m) => m.estado === "ACTIVO")
          .sort((a, b) => `${a.estudiante?.apellidos}`.localeCompare(`${b.estudiante?.apellidos}`));

        const inicio = periodoData.fechaInicio || "2026-03-01";
        const fin = periodoData.fechaFin || "2026-12-18";

        const dias = [...new Set(horariosData.map((h) => h.diaSemana))].sort();
        let todasFechas = [];
        dias.forEach((d) => {
          todasFechas = todasFechas.concat(generarFechasClase(d, inicio, fin));
        });
        todasFechas.sort();

        const results = await Promise.all(
          activas.map((m) => asistenciasApi.listarPorMatricula(m.idMatricula))
        );
        if (!mounted) return;

        const map = {};
        activas.forEach((m, idx) => {
          map[m.idMatricula] = results[idx].data || [];
        });

        setMatriculas(activas);
        setHorarios(horariosData);
        setPeriodo(periodoData);
        setFechasClase(todasFechas);
        setRegistros(map);

        if (todasFechas.length > 0) {
          const hoy = new Date().toISOString().slice(0, 7);
          const primerMes = todasFechas.find((f) => f.slice(0, 7) >= hoy)?.slice(0, 7) || todasFechas[0].slice(0, 7);
          setMesSeleccionado(primerMes);
        }
      } catch (err) {
        setError(err.friendlyMessage || "No se pudo cargar la información.");
      } finally {
        if (mounted) setLoadingData(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [curso]);

  const registroEnFecha = useCallback(
    (matriculaId, fecha) =>
      (registros[matriculaId] || []).find((a) => a.fecha === fecha),
    [registros]
  );

  const marcarEstado = async (matriculaId, fecha, estado) => {
    setSavingCell(`${matriculaId}-${fecha}`);
    const existente = registroEnFecha(matriculaId, fecha);
    try {
      let guardado;
      if (existente) {
        const { data } = await asistenciasApi.actualizar(existente.idAsistencia, {
          matricula: { idMatricula: matriculaId },
          fecha,
          estado,
        });
        guardado = data;
      } else {
        const { data } = await asistenciasApi.crear({
          matricula: { idMatricula: matriculaId },
          fecha,
          estado,
        });
        guardado = data;
      }
      setRegistros((prev) => {
        const lista = prev[matriculaId] || [];
        const sinEsta = lista.filter((a) => a.fecha !== fecha);
        return { ...prev, [matriculaId]: [...sinEsta, guardado] };
      });
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo registrar la asistencia.");
    } finally {
      setSavingCell(null);
    }
  };

  const marcarTodos = async (fecha, estado) => {
    for (const m of matriculas) {
      const existente = registroEnFecha(m.idMatricula, fecha);
      if (existente?.estado === estado) continue;
      await marcarEstado(m.idMatricula, fecha, estado);
    }
    notifySuccess(`Todos marcados como ${ESTADOS.find((e) => e.value === estado)?.label}`);
  };

  const mesesDisponibles = useMemo(() => {
    return Object.keys(agruparPorMes(fechasClase)).sort();
  }, [fechasClase]);

  const fechasDelMes = useMemo(() => {
    if (!mesSeleccionado) return [];
    const grupos = agruparPorMes(fechasClase);
    return grupos[mesSeleccionado] || [];
  }, [fechasClase, mesSeleccionado]);

  if (loadingCurso) return <LoadingState label="Cargando curso..." />;
  if (!curso) return <ErrorState message="No tienes acceso a este curso o no existe." />;

  return (
    <div>
      <div className="mb-4">
        <Link to="/docente/cursos" className="small text-decoration-none">&larr; Volver a mis cursos</Link>
        <h1 className="font-display fw-bold h3 mb-1 mt-2">Asistencia · {curso.asignatura?.nombre}</h1>
        <p className="text-secondary mb-0">
          {curso.grado?.nombre}{curso.seccion?.nombre} · {curso.periodoAcademico?.nombre} ({curso.periodoAcademico?.anio})
        </p>
      </div>

      {periodo && (
        <div className="ie-card p-3 mb-3">
          <div className="row g-2 align-items-center">
            <div className="col-auto">
              <label className="small fw-semibold me-2">Período:</label>
              <span className="small">{periodo.fechaInicio} al {periodo.fechaFin}</span>
            </div>
            <div className="col-auto">
              <span className="text-secondary mx-2">|</span>
              <label className="small fw-semibold me-2">Días de clase:</label>
              {horarios.map((h) => (
                <span key={h.idHorario} className="badge bg-secondary me-1">
                  {DIAS_NOMBRE[h.diaSemana]} {h.horaInicio?.slice(0, 5)}-{h.horaFin?.slice(0, 5)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {loadingData ? (
        <LoadingState label="Cargando asistencia..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : fechasClase.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">
            No se encontraron fechas de clase. Verifica que el curso tenga horarios asignados y un período académico activo.
          </p>
        </div>
      ) : (
        <div>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <label className="small fw-semibold mb-0">Mes:</label>
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: 160 }}
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
            >
              {mesesDisponibles.map((m) => (
                <option key={m} value={m}>
                  {new Date(m + "-01").toLocaleDateString("es-PE", { year: "numeric", month: "long" })}
                </option>
              ))}
            </select>
            <span className="text-secondary small ms-2">
              {fechasDelMes.length} día(s) de clase en este mes
            </span>
          </div>

          {matriculas.length === 0 ? (
            <div className="ie-card p-4 text-center py-5">
              <p className="text-secondary mb-0">Aún no hay estudiantes matriculados en este curso.</p>
            </div>
          ) : (
            <div className="ie-card">
              <div className="table-responsive">
                <table className="table ie-table mb-0" style={{ fontSize: "0.85rem" }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: 160, position: "sticky", left: 0, background: "var(--ie-bg)" }}>
                        Estudiante
                      </th>
                      {fechasDelMes.map((f) => (
                        <th key={f} className="text-center" style={{ minWidth: 60 }}>
                          <div className="small">{new Date(f + "T12:00:00").toLocaleDateString("es-PE", { weekday: "short" })}</div>
                          <div>{f.slice(8, 10)}</div>
                          <button
                            className="btn btn-sm btn-outline-secondary mt-1 py-0 px-1"
                            style={{ fontSize: "0.65rem" }}
                            onClick={() => marcarTodos(f, "PRESENTE")}
                            title="Marcar todos presente"
                          >
                            ✅
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matriculas.map((m) => (
                      <tr key={m.idMatricula}>
                        <td style={{ position: "sticky", left: 0, background: "var(--ie-bg)" }}>
                          {m.estudiante?.nombres} {m.estudiante?.apellidos}
                        </td>
                        {fechasDelMes.map((f) => {
                          const reg = registroEnFecha(m.idMatricula, f);
                          const cellKey = `${m.idMatricula}-${f}`;
                          const isSaving = savingCell === cellKey;
                          return (
                            <td key={f} className="text-center p-1">
                              <div className="dropdown">
                                <button
                                  className={`btn btn-sm ${reg ? `btn-${ESTADOS.find((e) => e.value === reg.estado)?.color}` : "btn-outline-secondary"} py-0 px-1`}
                                  style={{ fontSize: "0.75rem", minWidth: 28 }}
                                  disabled={isSaving}
                                  data-bs-toggle="dropdown"
                                >
                                  {isSaving ? (
                                    <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                                  ) : reg ? (
                                    ESTADOS.find((e) => e.value === reg.estado)?.label
                                  ) : (
                                    "?"
                                  )}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: "auto" }}>
                                  {ESTADOS.map((op) => (
                                    <li key={op.value}>
                                      <button
                                        className="dropdown-item small"
                                        onClick={() => marcarEstado(m.idMatricula, f, op.value)}
                                      >
                                        <span className={`badge bg-${op.color} me-1`}>{op.label}</span> {op.label}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="d-flex gap-3 mt-3">
            {ESTADOS.map((op) => (
              <span key={op.value} className="small">
                <span className={`badge bg-${op.color} me-1`}>{op.label}</span> {op.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}