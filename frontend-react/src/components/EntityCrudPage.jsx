import { useEffect, useMemo, useState } from "react";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "../context/ToastContext";

/**
 * Página CRUD genérica para catálogos del backend (grados, secciones,
 * asignaturas, cursos, períodos, docentes, estudiantes, comunicados...).
 *
 * fields[]: { key, label, type: 'text'|'number'|'textarea'|'date'|'boolean'|'select'|'relation',
 *             options?, relation?: { optionsLoader, idKey, labelFn }, required? }
 * columns[]: { key, label, render?(row) }
 */
export default function EntityCrudPage({
  title,
  subtitle,
  api,
  idKey,
  columns,
  fields,
  emptyForm,
  buildPayload,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  extraActions,
  searchable,
  searchPlaceholder,
  searchFields,
  filters: filterConfigs,
  sortOptions,
  defaultSort,
}) {
  const { notifySuccess, notifyError } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [relationOptions, setRelationOptions] = useState({});
  const [relationsLoading, setRelationsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [sortField, setSortField] = useState(defaultSort || "");
  const [sortDir, setSortDir] = useState("asc");

  const relationFields = useMemo(
    () => fields.filter((f) => f.type === "relation"),
    [fields]
  );

  const getField = (obj, path) => {
    if (!path.includes(".")) return obj[path];
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : ""), obj);
  };

  const filtered = useMemo(() => {
    let result = [...rows];
    const term = search.trim().toLowerCase();
    if (term && searchFields && searchFields.length > 0) {
      result = result.filter((row) =>
        searchFields.some((k) => String(getField(row, k) || "").toLowerCase().includes(term))
      );
    }
    if (filterConfigs) {
      filterConfigs.forEach((fc) => {
        const val = filterValues[fc.key];
        if (val && val !== "TODOS") {
          result = result.filter((row) => String(row[fc.key] || "") === val);
        }
      });
    }
    if (sortField) {
      result.sort((a, b) => {
        const va = String(getField(a, sortField) || "").toLowerCase();
        const vb = String(getField(b, sortField) || "").toLowerCase();
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return result;
  }, [rows, search, searchFields, filterConfigs, filterValues, sortField, sortDir]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.listar();
      setRows(data);
    } catch (err) {
      setError(err.friendlyMessage || "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  const loadRelations = async () => {
    if (relationFields.length === 0) {
      setRelationsLoading(false);
      return;
    }
    setRelationsLoading(true);
    try {
      const entries = await Promise.all(
        relationFields.map(async (f) => {
          const { data } = await f.relation.optionsLoader();
          return [f.key, data];
        })
      );
      setRelationOptions(Object.fromEntries(entries));
    } catch (err) {
      notifyError("No se pudieron cargar algunas listas relacionadas.");
    } finally {
      setRelationsLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadRelations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingRow(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    const next = { ...emptyForm };
    fields.forEach((f) => {
      if (f.type === "relation") {
        next[f.key] = row[f.key]?.[f.relation.idKey] ?? "";
      } else {
        next[f.key] = row[f.key] ?? (f.type === "boolean" ? false : "");
      }
    });
    setForm(next);
    setFormError("");
    setShowForm(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field.key]: value }));
  };

  const validate = () => {
    for (const f of fields) {
      if (f.required && (form[f.key] === "" || form[f.key] === null || form[f.key] === undefined)) {
        setFormError(`El campo "${f.label}" es obligatorio.`);
        return false;
      }
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = buildPayload ? buildPayload(form, fields) : defaultBuildPayload(form, fields);
      if (editingRow) {
        await api.actualizar(editingRow[idKey], payload);
        notifySuccess("Registro actualizado correctamente.");
      } else {
        await api.crear(payload);
        notifySuccess("Registro creado correctamente.");
      }
      setShowForm(false);
      load();
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo guardar el registro.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.eliminar(deleteTarget[idKey]);
      notifySuccess("Registro eliminado.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo eliminar el registro.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="font-display fw-bold h3 mb-1">{title}</h1>
          {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
        </div>
        {canCreate && (
          <button className="btn btn-accent" onClick={openCreate} disabled={relationsLoading}>
            + Nuevo registro
          </button>
        )}
      </div>

      {(searchable || filterConfigs || sortOptions) && (
        <div className="ie-card p-3 mb-3">
          <div className="row g-2 align-items-end">
            {searchable && (
              <div className={filterConfigs || sortOptions ? "col-md-4" : "col-md-6"}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={searchPlaceholder || "Buscar..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            {filterConfigs && filterConfigs.map((fc) => (
              <div className="col-md-3" key={fc.key}>
                <select
                  className="form-select"
                  value={filterValues[fc.key] || "TODOS"}
                  onChange={(e) => setFilterValues((prev) => ({ ...prev, [fc.key]: e.target.value }))}
                >
                  <option value="TODOS">{fc.label || fc.key}</option>
                  {fc.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
            {sortOptions && (
              <div className="col-md-3">
                <div className="input-group">
                  <select className="form-select" value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="">Ordenar por</option>
                    {sortOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
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
            )}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="ie-card">
          <div className="table-responsive">
            <table className="table ie-table mb-0">
              <thead>
                <tr>
  {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                  {(canEdit || canDelete || extraActions) && <th className="text-end">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center text-secondary py-4">
                      {canCreate
                        ? "Aún no hay registros. Crea el primero con el botón superior."
                        : "Aún no hay registros."}
                    </td>
                  </tr>
                )}
                {filtered.map((row) => (
                  <tr key={row[idKey]}>
                    {columns.map((c) => (
                      <td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? "—")}</td>
                    ))}
                    {(canEdit || canDelete || extraActions) && (
                      <td className="text-end">
                        {extraActions && extraActions(row)}
                        {canEdit && (
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(row)}>
                            Editar
                          </button>
                        )}
                        {canDelete && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(row)}>
                            Eliminar
                          </button>
                        )}
                      </td>
                    )}
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
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title font-display">
                      {editingRow ? "Editar registro" : "Nuevo registro"}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowForm(false)} disabled={saving} />
                  </div>
                  <div className="modal-body">
                    {formError && <div className="alert alert-danger py-2 small">{formError}</div>}
                    {relationsLoading && relationFields.length > 0 ? (
                      <LoadingState label="Cargando listas relacionadas..." />
                    ) : (
                      fields.map((f) => (
                        <div className="mb-3" key={f.key}>
                          <label className="form-label small fw-semibold">
                            {f.label} {f.required && <span className="text-danger">*</span>}
                          </label>
                          <FieldInput
                            field={f}
                            value={form[f.key]}
                            onChange={(v) => handleChange(f, v)}
                            disabled={saving}
                            relationOptions={relationOptions[f.key]}
                          />
                        </div>
                      ))
                    )}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)} disabled={saving}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving || relationsLoading}>
                      {saving ? "Guardando..." : editingRow ? "Guardar cambios" : "Crear"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}

      <ConfirmModal
        show={!!deleteTarget}
        title="Eliminar registro"
        message="Esta acción no se puede deshacer. ¿Deseas eliminar este registro?"
        confirmLabel="Eliminar"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function FieldInput({ field, value, onChange, disabled, relationOptions }) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="form-control"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }
  if (field.type === "boolean") {
    return (
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        <option value="" disabled>Selecciona una opción</option>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  if (field.type === "relation") {
    return (
      <select
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>Selecciona una opción</option>
        {(relationOptions || []).map((opt) => (
          <option key={opt[field.relation.idKey]} value={opt[field.relation.idKey]}>
            {field.relation.labelFn(opt)}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={
        field.type === "number"
          ? "number"
          : field.type === "date"
          ? "date"
          : field.type === "time"
          ? "time"
          : "text"
      }
      className="form-control"
      value={value}
      onChange={(e) => onChange(field.type === "number" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
      disabled={disabled}
    />
  );
}

function defaultBuildPayload(form, fields) {
  const payload = {};
  fields.forEach((f) => {
    if (f.type === "relation") {
      payload[f.key] = form[f.key] ? { [f.relation.idKey]: Number(form[f.key]) } : null;
    } else if (f.type === "number") {
      payload[f.key] = form[f.key] === "" ? null : Number(form[f.key]);
    } else {
      payload[f.key] = form[f.key];
    }
  });
  return payload;
}
