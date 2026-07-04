import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useDocenteData } from "../../context/DocenteDataContext";
import { useToast } from "../../context/ToastContext";
import { matriculasApi, evaluacionesApi, notasApi } from "../../api/crudApi";

export default function Notas() {
  const { cursoId } = useParams();
  const { cursos, loading: loadingCurso } = useDocenteData();
  const { notifySuccess, notifyError } = useToast();

  const curso = useMemo(
    () => cursos.find((c) => String(c.idCurso) === String(cursoId)),
    [cursos, cursoId]
  );

  const [matriculas, setMatriculas] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [notas, setNotas] = useState({});
  const [edits, setEdits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingCell, setSavingCell] = useState(null);

  useEffect(() => {
    if (!curso) return;
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [{ data: matriculasData }, { data: evaluacionesData }] = await Promise.all([
          matriculasApi.listarPorCurso(curso.idCurso),
          evaluacionesApi.listarPorPeriodo(curso.periodoAcademico.idPeriodo),
        ]);
        if (!mounted) return;

        const activas = matriculasData
          .filter((m) => m.estado === "ACTIVO")
          .sort((a, b) => `${a.estudiante?.apellidos}`.localeCompare(`${b.estudiante?.apellidos}`));
        const evaluacionesOrdenadas = [...evaluacionesData].sort((a, b) => a.orden - b.orden);

        const notasResults = await Promise.all(
          activas.map((m) => notasApi.listarPorMatricula(m.idMatricula))
        );
        if (!mounted) return;

        const notasMap = {};
        activas.forEach((m, idx) => {
          notasMap[m.idMatricula] = {};
          (notasResults[idx].data || []).forEach((n) => {
            notasMap[m.idMatricula][n.evaluacionPeriodo.idEvaluacion] = n;
          });
        });

        setMatriculas(activas);
        setEvaluaciones(evaluacionesOrdenadas);
        setNotas(notasMap);
        setEdits({});
      } catch (err) {
        setError(err.friendlyMessage || "No se pudo cargar la información de notas.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [curso]);

  const handleChange = (matriculaId, evaluacionId, field, value) => {
    const key = `${matriculaId}-${evaluacionId}`;
    setEdits((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value, touched: true },
    }));
  };

  const guardarNota = async (matriculaId, evaluacionId) => {
    const key = `${matriculaId}-${evaluacionId}`;
    const edit = edits[key];
    if (!edit || !edit.touched) return;

    const valorTexto = edit.valor;
    const observacion = edit.observacion ?? "";
    const valor = valorTexto === "" || valorTexto === undefined ? null : Number(valorTexto);
    if (valor !== null && (Number.isNaN(valor) || valor < 0 || valor > 20)) {
      notifyError("La nota debe ser un número entre 0 y 20.");
      return;
    }

    const notaExistente = notas[matriculaId]?.[evaluacionId];
    setSavingCell(key);
    try {
      let guardada;
      const payload = {
        matricula: { idMatricula: matriculaId },
        evaluacionPeriodo: { idEvaluacion: evaluacionId },
        valor,
        observacion: observacion || null,
      };
      if (notaExistente) {
        const { data } = await notasApi.actualizar(notaExistente.idNota, payload);
        guardada = data;
      } else {
        if (valor === null) return;
        const { data } = await notasApi.crear(payload);
        guardada = data;
      }
      setNotas((prev) => ({
        ...prev,
        [matriculaId]: { ...prev[matriculaId], [evaluacionId]: guardada },
      }));
      setEdits((prev) => ({ ...prev, [key]: { ...prev[key], touched: false } }));
      notifySuccess("Nota guardada.");
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo guardar la nota.");
    } finally {
      setSavingCell(null);
    }
  };

  if (loadingCurso) return <LoadingState label="Cargando curso..." />;
  if (!curso) return <ErrorState message="No tienes acceso a este curso o no existe." />;

  return (
    <div>
      <div className="mb-4">
        <Link to="/docente/cursos" className="small text-decoration-none">&larr; Volver a mis cursos</Link>
        <h1 className="font-display fw-bold h3 mb-1 mt-2">Notas · {curso.asignatura?.nombre}</h1>
        <p className="text-secondary mb-0">
          {curso.grado?.nombre}{curso.seccion?.nombre} · {curso.periodoAcademico?.nombre} ({curso.periodoAcademico?.anio})
        </p>
      </div>

      {loading ? (
        <LoadingState label="Cargando notas..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : evaluaciones.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">
            Este período académico aún no tiene bimestres/trimestres de evaluación configurados.
            Solicita a Dirección que los cree.
          </p>
        </div>
      ) : matriculas.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">Aún no hay estudiantes matriculados en este curso.</p>
        </div>
      ) : (
        <div className="ie-card">
          <div className="table-responsive">
            <table className="table ie-table mb-0">
              <thead>
                <tr>
                  <th style={{ minWidth: 180 }}>Estudiante</th>
                  {evaluaciones.map((ev) => (
                    <th key={ev.idEvaluacion} className="text-center" style={{ minWidth: 220 }}>{ev.nombre}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matriculas.map((m) => (
                  <tr key={m.idMatricula}>
                    <td className="align-middle">{m.estudiante?.nombres} {m.estudiante?.apellidos}</td>
                    {evaluaciones.map((ev) => {
                      const key = `${m.idMatricula}-${ev.idEvaluacion}`;
                      const nota = notas[m.idMatricula]?.[ev.idEvaluacion];
                      const edit = edits[key] || {};
                      const valorActual = edit.touched ? edit.valor : (nota?.valor ?? "");
                      const obsActual = edit.touched ? edit.observacion : (nota?.observacion ?? "");
                      const isSaving = savingCell === key;
                      return (
                        <td key={ev.idEvaluacion} className="align-middle">
                          <div className="d-flex flex-column gap-1">
                            <div className="d-flex gap-1">
                              <input
                                type="number"
                                min={0}
                                max={20}
                                step="0.1"
                                className="form-control form-control-sm text-center"
                                style={{ width: 80 }}
                                value={valorActual}
                                disabled={isSaving}
                                onChange={(e) => handleChange(m.idMatricula, ev.idEvaluacion, "valor", e.target.value)}
                              />
                              <button
                                className="btn btn-sm btn-accent"
                                disabled={isSaving || !edit.touched}
                                onClick={() => guardarNota(m.idMatricula, ev.idEvaluacion)}
                              >
                                {isSaving ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  "Confirmar"
                                )}
                              </button>
                            </div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Observación"
                              value={obsActual}
                              disabled={isSaving}
                              onChange={(e) => handleChange(m.idMatricula, ev.idEvaluacion, "observacion", e.target.value)}
                            />
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
      <p className="text-secondary small mt-3 mb-0">
        Escala vigesimal (0–20). Modifica el valor y/o la observación, luego presiona <strong>Confirmar</strong> para guardar.
      </p>
    </div>
  );
}