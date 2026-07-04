import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { docentePanelApi } from "../../api/rolePanelApi";

const ROLE_HOME = {
  ADMIN: "/admin",
  DIRECTOR: "/director",
  DOCENTE: "/docente",
  ESTUDIANTE: "/estudiante",
};

export default function OnboardingDocente() {
  const { user, refreshProfile } = useAuth();
  const { notifySuccess, notifyError } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "", apellidos: "", dni: "", especialidad: "", telefono: "", email: "",
  });
  const [saving, setSaving] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (user?.perfilCompleto) {
      navigate(ROLE_HOME[user.rol] || "/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 250);
    const t3 = setTimeout(() => setPhase(3), 450);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.dni.trim()) {
      notifyError("Los campos Nombres, Apellidos y DNI son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      await docentePanelApi.actualizarMiPerfil(form);
      notifySuccess("Perfil completado exitosamente.");
      await refreshProfile();
      navigate(ROLE_HOME[user.rol] || "/", { replace: true });
    } catch (err) {
      notifyError(err.friendlyMessage || "No se pudo guardar tu perfil.");
    } finally {
      setSaving(false);
    }
  };

  const fadeUp = (show, delay = "0s") => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}`,
  });

  return (
    <div style={{ fontFamily: "Inter, sans-serif", position: "relative", width: "100vw", height: "100dvh", overflow: "hidden", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1a1a2e 100%)" }}>

      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", height: "100dvh", overflow: "hidden" }}>
        <div className="d-none d-md-flex flex-column align-items-center justify-content-center"
          style={{ height: "100%", padding: "clamp(24px, 4vw, 48px) clamp(24px, 5vw, 72px)", gap: "clamp(18px, 2.5vw, 36px)" }}
        >
          <div style={{ ...fadeUp(phase >= 1), textAlign: "center", maxWidth: 480 }}>
            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
              <img src="/logo.svg" alt="Logo" style={{ height: 48, width: 48, borderRadius: 10 }} />
              <span className="font-display fw-bold text-white" style={{ fontSize: "1.2rem" }}>Intranet Escolar</span>
            </div>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(1.6rem, 2.8vw, 2.8rem)", color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
              Completa tu perfil
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "clamp(0.8rem, 1vw, 1.05rem)", lineHeight: 1.85 }}>
              Antes de entrar al panel, necesitamos algunos datos tuyos para completar tu registro como docente.
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center"
          style={{ height: "100%", padding: "clamp(20px, 3vw, 40px)", overflow: "auto" }}
        >
          <div style={{
            width: "100%", maxWidth: "420px",
            background: "rgba(255,255,255,0.92)", borderRadius: "24px",
            padding: "clamp(24px, 2.5vh, 40px) clamp(24px, 2.5vw, 36px)",
            backdropFilter: "blur(12px)", boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
            ...fadeUp(phase >= 1),
          }}>
            <h2 className="font-display fw-bold" style={{ fontSize: "1.2rem", marginBottom: 4 }}>Datos del docente</h2>
            <p className="text-secondary mb-4" style={{ fontSize: "0.85rem" }}>Todos los campos marcados con * son obligatorios.</p>

            <form onSubmit={handleSubmit} noValidate>
              {[
                { key: "nombres", label: "Nombres *", placeholder: "Ej. Juan Carlos" },
                { key: "apellidos", label: "Apellidos *", placeholder: "Ej. Pérez García" },
                { key: "dni", label: "DNI *", placeholder: "8 dígitos", maxLength: 8 },
              ].map((f, i) => (
                <div key={f.key} style={{ ...fadeUp(phase >= 2, `${i * 0.06}s`), marginBottom: 14 }}>
                  <label className="form-label">{f.label}</label>
                  <input type="text" className="form-control" value={form[f.key]} onChange={handleChange(f.key)} disabled={saving} placeholder={f.placeholder} maxLength={f.maxLength} />
                </div>
              ))}

              {[
                { key: "especialidad", label: "Especialidad", placeholder: "Ej. Matemática" },
                { key: "telefono", label: "Teléfono", placeholder: "Ej. 987654321" },
                { key: "email", label: "Email", placeholder: "Ej. jperez@colegio.edu.pe", type: "email" },
              ].map((f, i) => (
                <div key={f.key} style={{ ...fadeUp(phase >= 3, `${i * 0.06}s`), marginBottom: 14 }}>
                  <label className="form-label">{f.label}</label>
                  <input type={f.type || "text"} className="form-control" value={form[f.key]} onChange={handleChange(f.key)} disabled={saving} placeholder={f.placeholder} />
                </div>
              ))}

              <div style={{ ...fadeUp(phase >= 3, "0.18s"), marginTop: 20 }}>
                <button type="submit" disabled={saving} style={{
                  width: "100%", padding: "12px", borderRadius: "12px", border: "none",
                  background: saving ? "#94a3b8" : "linear-gradient(90deg, #f59e0b, #d97706)",
                  color: "#1c1608", fontWeight: 700, fontSize: "1rem",
                  cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s ease",
                }}>
                  {saving ? "Guardando..." : "Completar perfil"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}