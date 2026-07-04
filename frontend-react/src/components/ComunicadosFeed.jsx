import { useEffect, useMemo, useState } from "react";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { comunicadosApi } from "../api/crudApi";

export default function ComunicadosFeed({ rolActual }) {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await comunicadosApi.listar();
      const hoy = new Date().toISOString().slice(0, 10);
      const visibles = data
        .filter((c) => c.dirigidoA === "TODOS" || c.dirigidoA === rolActual)
        .filter((c) => !c.fechaExpiracion || c.fechaExpiracion >= hoy)
        .sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
      setComunicados(visibles);
    } catch (err) {
      setError(err.friendlyMessage || "No se pudieron cargar los comunicados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return comunicados;
    return comunicados.filter(
      (c) =>
        c.titulo?.toLowerCase().includes(term) ||
        c.contenido?.toLowerCase().includes(term)
    );
  }, [comunicados, search]);

  if (loading) return <LoadingState label="Cargando comunicados..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="ie-card p-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar comunicados..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="ie-card p-4 text-center py-5">
          <p className="text-secondary mb-0">
            {search ? "No hay comunicados que coincidan con la búsqueda." : "No hay comunicados vigentes por el momento."}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((c) => (
            <div className="ie-card p-4" key={c.idComunicado}>
              <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                <h3 className="font-display h6 fw-bold mb-0">{c.titulo}</h3>
                <span className="badge text-bg-light border small text-nowrap">
                  {c.fechaPublicacion ? new Date(c.fechaPublicacion).toLocaleDateString("es-PE") : ""}
                </span>
              </div>
              <p className="mb-2" style={{ whiteSpace: "pre-line" }}>{c.contenido}</p>
              <div className="small text-secondary">
                Dirigido a: {c.dirigidoA} {c.usuarioAutor?.username ? `· Publicado por ${c.usuarioAutor.username}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
