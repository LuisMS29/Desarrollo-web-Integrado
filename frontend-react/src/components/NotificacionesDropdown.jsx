import { useCallback, useEffect, useRef, useState } from "react";
import { notificacionesApi } from "../api/crudApi";
import { useToast } from "../context/ToastContext";

export default function NotificacionesDropdown({ usuarioId }) {
  const { notifyError } = useToast();
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cargar = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const { data } = await notificacionesApi.listarNoLeidas(usuarioId);
      setNotificaciones(data || []);
    } catch {
      setNotificaciones([]);
    }
  }, [usuarioId]);

  useEffect(() => {
    cargar();
    const interval = setInterval(cargar, 30000);
    return () => clearInterval(interval);
  }, [cargar]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const marcarLeida = async (id) => {
    try {
      await notificacionesApi.marcarLeida(id);
      setNotificaciones((prev) => prev.filter((n) => n.idNotificacion !== id));
    } catch {
      notifyError("No se pudo actualizar la notificación.");
    }
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        className="btn position-relative"
        onClick={() => setOpen((p) => !p)}
        title="Notificaciones"
        style={{ border: "none", background: "none", fontSize: "1.2rem" }}
      >
        🔔
        {notificaciones.length > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem" }}
          >
            {notificaciones.length > 99 ? "99+" : notificaciones.length}
          </span>
        )}
      </button>

      {open && (
        <div
          className="position-absolute end-0 mt-2 shadow rounded"
          style={{
            width: 340,
            maxHeight: 420,
            overflowY: "auto",
            background: "var(--ie-card-bg)",
            border: "1px solid var(--ie-line)",
            zIndex: 9999,
          }}
        >
          <div className="p-3 border-bottom fw-semibold small">
            Notificaciones
            {notificaciones.length > 0 && (
              <span className="text-secondary fw-normal ms-1">({notificaciones.length} sin leer)</span>
            )}
          </div>

          {notificaciones.length === 0 ? (
            <div className="p-4 text-center text-secondary small">No tienes notificaciones pendientes.</div>
          ) : (
            notificaciones.map((n) => (
              <div
                key={n.idNotificacion}
                className="p-3 border-bottom"
                style={{ cursor: "pointer" }}
                onClick={() => marcarLeida(n.idNotificacion)}
              >
                <div className="small mb-1" style={{ whiteSpace: "pre-line" }}>{n.mensaje}</div>
                <div className="small text-secondary">
                  {n.fechaEnvio ? new Date(n.fechaEnvio).toLocaleString("es-PE") : ""}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}