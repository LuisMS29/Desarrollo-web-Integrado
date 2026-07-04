import { useEffect, useMemo, useState } from "react";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useDocenteData } from "../../context/DocenteDataContext";
import { matriculasApi } from "../../api/crudApi";

export default function MisEstudiantes() {
  const { cursos, loading: loadingCursos, error: errorCursos } = useDocenteData();
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [cursoFilter, setCursoFilter] = useState("TODOS");
  const [sortField, setSortField] = useState("apellidos");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    if (cursos.length === 0) {
      setLoading(false);
      return;
    }
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const results = await Promise.all(cursos.map((c) => matriculasApi.listarPorCurso(c.idCurso)));
        if (!mounted) return;

        const consolidado = [];
        results.forEach((res, idx) => {
          const curso = cursos[idx];
          (res.data || [])
            .filter((m) => m.estado === "ACTIVO")
            .forEach((m) => {
              consolidado.push({
                idMatricula: m.idMatricula,
                estudiante: m.estudiante,
                curso,
              });
            });
        });
        setFilas(consolidado);
      } catch (err) {
        setError(err.friendlyMessage || "No se pudo cargar la lista de estudiantes.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [cursos]);

  const filtered = useMemo(() => {
    let result = [...filas];
    const term = search.trim().toLowerCase();
    if (term) {
      result = result.filter((f) =>
        `${f.estudiante?.nombres} ${f.estudiante?.apellidos} ${f.estudiante?.codigoEstudiante}`
          .toLowerCase()
          .includes(term)
      );
    }
    if (cursoFilter !== "TODOS") {
      result = result.filter((f) => f.curso.idCurso === Number(cursoFilter));
    }
    if (sortField === "apellidos") {
      result.sort((a, b) => {
        const va = `${a.estudiante?.apellidos || ""} ${a.estudiante?.nombres || ""}`.toLowerCase();
        const vb = `${b.estudiante?.apellidos || ""} ${b.estudiante?.nombres || ""}`.toLowerCase();
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    } else if (sortField === "curso") {
      result.sort((a, b) => {
        const va = `${a.curso?.asignatura?.nombre || ""}`.toLowerCase();
        const vb = `${b.curso?.asignatura?.nombre || ""}`.toLowerCase();
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return result;
  }, [filas, search, cursoFilter, sortField, sortDir]);

  if (loadingCursos) return <LoadingState label="Cargando..." />;
  if (errorCursos) return <ErrorState message={errorCursos} />;

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display fw-bold h3 mb-1">Mis estudiantes</h1>
        <p className="text-secondary mb-0">Alumnos matriculados en los cursos que tienes a tu cargo.</p>
      </div>

      <div className="ie-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, apellido o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={cursoFilter} onChange={(e) => setCursoFilter(e.target.value)}>
              <option value="TODOS">Todos los cursos</option>
              {cursos.map((c) => (
                <option key={c.idCurso} value={c.idCurso}>{c.asignatura?.nombre} · {c.grado?.nombre}{c.seccion?.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <select className="form-select" value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="apellidos">Apellidos / Nombre</option>
                <option value="curso">Curso</option>
              </select>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                title={sortDir === "asc" ? "A-Z" : "Z-A"}
              >
                {sortDir === "asc" ? "A-Z ↑" : "Z-A ↓"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Cargando estudiantes..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : filtered.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">No se encontraron estudiantes con esos filtros.</p>
        </div>
      ) : (
        <div className="ie-card">
          <div className="table-responsive">
            <table className="table ie-table mb-0">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Curso</th>
                  <th>Grado / Sección</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={`${f.idMatricula}-${f.curso.idCurso}`}>
                    <td>{f.estudiante?.codigoEstudiante ?? "—"}</td>
                    <td>{f.estudiante?.nombres}</td>
                    <td>{f.estudiante?.apellidos}</td>
                    <td>{f.curso.asignatura?.nombre}</td>
                    <td>{f.curso.grado?.nombre}{f.curso.seccion?.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
