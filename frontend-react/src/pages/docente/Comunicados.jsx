import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { comunicadosApi } from "../../api/crudApi";
import ComunicadosFeed from "../../components/ComunicadosFeed";

const DIRIGIDO_A = [
  { value: "TODOS", label: "Todos" },
  { value: "DOCENTE", label: "Solo docentes" },
];

export default function Comunicados() {
  const { notifySuccess, notifyError } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", contenido: "", dirigidoA: "TODOS", fechaExpiracion: "" });
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenido.trim()) return;
    setSaving(true);
    try {
      await comunicadosApi.crear({
        titulo: form.titulo,
        contenido: form.contenido,
        dirigidoA: form.dirigidoA,
        fechaExpiracion: form.fechaExpiracion || null,
      });
      notifySuccess("Comunicado publicado.");
      setForm({ titulo: "", contenido: "", dirigidoA: "TODOS", fechaExpiracion: "" });
      setShowForm(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo publicar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="font-display fw-bold h3 mb-1">Comunicados</h1>
          <p className="text-secondary mb-0">Avisos institucionales.</p>
        </div>
        <button className="btn ie-btn-primary" onClick={() => setShowForm((p) => !p)}>
          {showForm ? "Cancelar" : "Nuevo comunicado"}
        </button>
      </div>

      {showForm && (
        <div className="ie-card p-4 mb-4">
          <h2 className="font-display fw-semibold h5 mb-3">Nuevo comunicado</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Título</label>
              <input
                className="form-control"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Contenido</label>
              <textarea
                className="form-control"
                name="contenido"
                rows={4}
                value={form.contenido}
                onChange={handleChange}
                required
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-sm-4">
                <label className="form-label small fw-semibold">Dirigido a</label>
                <select className="form-select" name="dirigidoA" value={form.dirigidoA} onChange={handleChange}>
                  {DIRIGIDO_A.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-4">
                <label className="form-label small fw-semibold">Fecha de expiración (opcional)</label>
                <input
                  className="form-control"
                  type="date"
                  name="fechaExpiracion"
                  value={form.fechaExpiracion}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="btn ie-btn-primary" disabled={saving}>
              {saving ? "Publicando..." : "Publicar"}
            </button>
          </form>
        </div>
      )}

      <ComunicadosFeed key={refreshKey} rolActual="DOCENTE" />
    </div>
  );
}