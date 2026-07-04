import { useEffect, useMemo, useState } from "react";
import { usuariosApi } from "../../api/usuariosApi";
import { authApi } from "../../api/authApi";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useToast } from "../../context/ToastContext";

const ROLES = ["ADMIN", "DIRECTOR", "DOCENTE", "ESTUDIANTE"];

const EMPTY_FORM = { username: "", email: "", password: "", rol: "ESTUDIANTE" };

export default function Usuarios() {
  const { notifySuccess, notifyError } = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [rolFilter, setRolFilter] = useState("TODOS");
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const loadUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await usuariosApi.listar();
      setUsuarios(data);
    } catch (err) {
      setError(err.friendlyMessage || "No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const filtered = useMemo(() => {
    let result = usuarios.filter((u) => {
      const matchesRol = rolFilter === "TODOS" || u.rol === rolFilter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);
      return matchesRol && matchesSearch;
    });
    if (sortField) {
      result.sort((a, b) => {
        const va = String(a[sortField] || "").toLowerCase();
        const vb = String(b[sortField] || "").toLowerCase();
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return result;
  }, [usuarios, search, rolFilter, sortField, sortDir]);

  const handleToggleActivo = async (usuario) => {
    try {
      if (usuario.activo) {
        await usuariosApi.desactivar(usuario.idUsuario);
        notifySuccess(`Usuario "${usuario.username}" desactivado.`);
      } else {
        await usuariosApi.activar(usuario.idUsuario);
        notifySuccess(`Usuario "${usuario.username}" activado.`);
      }
      loadUsuarios();
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo cambiar el estado.");
    }
  };

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.username.trim() || form.username.trim().length < 3) {
      errs.username = "El usuario debe tener al menos 3 caracteres.";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Ingresa un email válido.";
    }
    if (!form.password || form.password.length < 6) {
      errs.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await authApi.register(form);
      notifySuccess(`Usuario "${form.username}" creado correctamente.`);
      setShowForm(false);
      loadUsuarios();
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo crear el usuario.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (usuario) => {
    try {
      await usuariosApi.eliminar(usuario.idUsuario);
      notifySuccess(`Usuario "${usuario.username}" eliminado.`);
      loadUsuarios();
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo eliminar el usuario.");
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="font-display fw-bold h3 mb-1">Usuarios y roles</h1>
          <p className="text-secondary mb-0">
            Crea cuentas de acceso y controla su estado. El rol determina qué partes del sistema puede usar cada persona.
          </p>
        </div>
        <button className="btn btn-accent" onClick={openCreateForm}>
          + Nuevo usuario
        </button>
      </div>

      <div className="ie-card p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por usuario o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={rolFilter} onChange={(e) => setRolFilter(e.target.value)}>
              <option value="TODOS">Todos los roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <select className="form-select" value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="">Ordenar por</option>
                <option value="username">Usuario</option>
                <option value="email">Email</option>
                <option value="rol">Rol</option>
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
        <LoadingState label="Cargando usuarios..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadUsuarios} />
      ) : (
        <div className="ie-card">
          <div className="table-responsive">
            <table className="table ie-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-secondary py-4">
                      No se encontraron usuarios con esos filtros.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => (
                  <tr key={u.idUsuario}>
                    <td className="text-mono text-secondary">{u.idUsuario}</td>
                    <td className="fw-semibold">{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge-rol ${u.rol}`}>{u.rol}</span></td>
                    <td>
                      {u.activo ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">Activo</span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Inactivo</span>
                      )}
                    </td>
                    <td className="small text-secondary">
                      {u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleString("es-PE") : "—"}
                    </td>
                    <td className="text-end">
                      <div className="form-check form-switch d-inline-block me-2" style={{ paddingLeft: 0, verticalAlign: "middle" }}>
                        <input
                          type="checkbox"
                          className="form-check-input ie-toggle"
                          role="switch"
                          checked={!!u.activo}
                          onChange={() => handleToggleActivo(u)}
                          title={u.activo ? "Desactivar" : "Activar"}
                        />
                      </div>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleCreate}>
                  <div className="modal-header">
                    <h5 className="modal-title font-display">Nuevo usuario</h5>
                    <button type="button" className="btn-close" onClick={() => setShowForm(false)} disabled={saving} />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Usuario</label>
                      <input
                        className={`form-control ${formErrors.username ? "is-invalid" : ""}`}
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        disabled={saving}
                      />
                      {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Email</label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        disabled={saving}
                      />
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Contraseña</label>
                      <input
                        type="password"
                        className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        disabled={saving}
                      />
                      {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                    </div>
                    <div className="mb-1">
                      <label className="form-label small fw-semibold">Rol</label>
                      <select
                        className="form-select"
                        value={form.rol}
                        onChange={(e) => setForm({ ...form, rol: e.target.value })}
                        disabled={saving}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)} disabled={saving}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? "Guardando..." : "Crear usuario"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </div>
  );
}
