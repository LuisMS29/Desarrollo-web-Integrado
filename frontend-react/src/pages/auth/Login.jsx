import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { BiEnvelope, BiLock, BiShow, BiHide, BiArrowBack, BiShield, BiChart, BiBookOpen, BiGroup } from "react-icons/bi";

const ROLE_HOME = {
  ADMIN: "/admin",
  DIRECTOR: "/director",
  DOCENTE: "/docente",
  ESTUDIANTE: "/estudiante",
};

const ONBOARDING = {
  DOCENTE: "/docente/completar-perfil",
  ESTUDIANTE: "/estudiante/completar-perfil",
};

const BADGES = [
  { icon: BiShield, label: "Gestión académica segura" },
  { icon: BiChart, label: "Notas y reportes en línea" },
  { icon: BiBookOpen, label: "Asistencia digitalizada" },
  { icon: BiGroup, label: "Comunicación entre roles" },
];

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const { notifySuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "1") setSessionExpired(true);
  }, [location.search]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 250);
    const t3 = setTimeout(() => setPhase(3), 450);
    const t4 = setTimeout(() => setPhase(4), 620);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.rol) {
      const onboardingPath = ONBOARDING[user.rol];
      if (user.perfilCompleto === false && onboardingPath) {
        navigate(onboardingPath, { replace: true });
      } else {
        const dest = location.state?.from?.pathname || ROLE_HOME[user.rol] || "/";
        navigate(dest, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.state?.from?.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!username.trim() || !password) {
      setErrorMsg("Ingresa tu usuario y tu contraseña.");
      return;
    }
    setSubmitting(true);
    try {
      const loggedUser = await login(username.trim(), password);
      notifySuccess(`Bienvenido, ${loggedUser.username}`);
      navigate(ROLE_HOME[loggedUser.rol] || "/", { replace: true });
    } catch (err) {
      setErrorMsg(err.friendlyMessage || "Usuario o contraseña incorrectos.");
    } finally {
      setSubmitting(false);
    }
  };

  const fadeUp = (show, delay = "0s") => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}`,
  });

  return (
    <div style={{ fontFamily: "Inter, sans-serif", position: "relative", width: "100vw", height: "100dvh", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="clipLeft" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L0.46,0 C0.52,0.12 0.42,0.28 0.50,0.50 C0.56,0.65 0.44,0.82 0.46,1 L0,1 Z" />
          </clipPath>
          <clipPath id="clipRight" clipPathUnits="objectBoundingBox">
            <path d="M0.46,0 C0.52,0.12 0.42,0.28 0.50,0.50 C0.56,0.65 0.44,0.82 0.46,1 L1,1 L1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div style={{ position: "absolute", inset: 0, clipPath: "url(#clipLeft)", zIndex: 0, opacity: 1 }}>
        <img src="/bg-left.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, clipPath: "url(#clipRight)", zIndex: 0, opacity: 1 }}>
        <img src="/bg-right.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </div>

      <img
        src="/salon.avif"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
          objectFit: "fill"
        }}
      />

      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", height: "100dvh", overflow: "hidden" }}>
        {/* LEFT */}
        <div className="d-none d-md-flex flex-column align-items-center justify-content-center"
          style={{ height: "100%", padding: "clamp(24px, 4vw, 48px) clamp(24px, 5vw, 72px) clamp(24px, 4vw, 48px) clamp(20px, 4vw, 52px)", gap: "clamp(18px, 2.5vw, 36px)" }}
        >
          <div style={{ ...fadeUp(phase >= 1), textAlign: "center", maxWidth: 520 }}>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(1.6rem, 2.8vw, 3.2rem)", color: "#fff", lineHeight: 1.15, marginBottom: 0 }}>
              Un solo lugar,
            </h1>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(1.6rem, 2.8vw, 3.2rem)", color: "#f59e0b", lineHeight: 1.15, marginBottom: "clamp(10px, 1.5vw, 20px)" }}>
              toda la vida escolar.
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "clamp(0.8rem, 1vw, 1.05rem)", lineHeight: 1.85, margin: "0 auto" }}>
              Matrículas, notas, asistencia y comunicados en una plataforma
              integrada para administradores, directores, docentes y estudiantes.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1vw, 14px)", width: "100%", maxWidth: 520 }}>
            {BADGES.map((badge, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  padding: "clamp(10px, 1.4vw, 18px) clamp(10px, 1.5vw, 20px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(8px, 1vw, 14px)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  cursor: "default",
                  transition: "all 0.22s ease",
                  opacity: phase >= 2 ? 1 : 0,
                  transform: phase >= 2 ? "translateY(0)" : "translateY(18px)",
                  transitionDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ background: "#f59e0b", borderRadius: "10px", padding: "clamp(6px, 0.8vw, 10px)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <badge.icon style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)", color: "#1c1608" }} />
                </div>
                <span style={{ color: "#e2e8f0", fontSize: "clamp(0.7rem, 0.8vw, 0.86rem)", fontWeight: 600, lineHeight: 1.3 }}>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center justify-content-center"
          style={{ height: "100%", padding: "clamp(20px, 3vw, 40px)", overflow: "hidden" }}
        >
          <div style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.92)", borderRadius: "24px", padding: "clamp(24px, 2.5vh, 40px) clamp(24px, 2.5vw, 36px)", backdropFilter: "blur(12px)", boxShadow: "0 20px 60px rgba(15,23,42,0.12)", ...fadeUp(phase >= 1) }}>
            <div style={{ textAlign: "center", marginBottom: "clamp(12px, 1.8vh, 28px)" }}>
              <img src="/logo.svg" alt="Logo" style={{ width: "clamp(100px, 4.5vh, 72px)", height: "clamp(100px, 4.5vh, 72px)", objectFit: "contain", marginBottom: "clamp(8px, 1vh, 14px)" }} />
              <h2 style={{ fontSize: "clamp(1.2rem, 1.8vh, 1.7rem)", fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>Bienvenido</h2>
              <div style={{ width: 40, height: 3, background: "#f59e0b", borderRadius: 2, margin: "6px auto 10px" }} />
              <p style={{ color: "#64748b", fontSize: "clamp(0.72rem, 1.1vh, 0.88rem)", lineHeight: 1.5, margin: 0 }}>
                Ingresa con tus credenciales para acceder al panel de tu rol.
              </p>
            </div>

            {sessionExpired && (
              <div className="alert alert-warning py-2 small" role="alert">Tu sesión expiró. Inicia sesión nuevamente.</div>
            )}
            {errorMsg && (
              <div className="alert alert-danger py-2 small" role="alert">{errorMsg}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ ...fadeUp(phase >= 2, "0.04s"), marginBottom: "clamp(8px, 1vh, 14px)" }}>
                <div style={{ position: "relative" }}>
                  <BiEnvelope style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.95rem" }} />
                  <input
                    id="username"
                    type="text"
                    placeholder="Usuario"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={submitting}
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "13px 14px 13px 42px",
                      borderRadius: "12px",
                      border: "1.5px solid #e2e8f0",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                      background: "#f8fafc",
                      color: "#1e293b",
                      fontSize: "0.92rem",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
                  />
                </div>
              </div>

              <div style={{ ...fadeUp(phase >= 2, "0.1s"), marginBottom: "clamp(10px, 1.2vh, 18px)" }}>
                <div style={{ position: "relative" }}>
                  <BiLock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.95rem" }} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "13px 42px 13px 42px",
                      borderRadius: "12px",
                      border: "1.5px solid #e2e8f0",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                      background: "#f8fafc",
                      color: "#1e293b",
                      fontSize: "0.92rem",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8", display: "flex" }}
                  >
                    {showPassword ? <BiHide style={{ fontSize: "1.1rem" }} /> : <BiShow style={{ fontSize: "1.1rem" }} />}
                  </span>
                </div>
              </div>

              <div style={{ ...fadeUp(phase >= 4) }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "clamp(10px, 1.3vh, 14px)",
                    borderRadius: "12px",
                    border: "none",
                    background: submitting ? "#94a3b8" : "linear-gradient(90deg, #f59e0b, #d97706)",
                    color: "#1c1608",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.08)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.filter = "brightness(1)"; }}
                >
                  {submitting ? "Ingresando..." : <> Ingresar <BiArrowBack style={{ transform: "scaleX(-1)" }} /> </>}
                </button>
              </div>
            </form>

            <div style={{ textAlign: "center", marginTop: "clamp(10px, 1.2vh, 18px)" }}>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <BiLock /> Conexión segura y cifrada
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="d-md-none" style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: "100%", height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          position: "absolute", inset: 0, zIndex: -1,
        }} />
        <div style={{
          width: "100%", maxWidth: 400, padding: "0 20px", ...fadeUp(phase >= 1),
          zIndex: 1,
        }}>
          <div style={{
            background: "rgba(255,255,255,0.95)", borderRadius: "24px",
            padding: "32px 24px", backdropFilter: "blur(12px)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <img src="/logo.svg" alt="Logo" style={{ height: 56, width: 56, objectFit: "contain", marginBottom: 12 }} />
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>Intranet Escolar</h2>
              <div style={{ width: 40, height: 3, background: "#f59e0b", borderRadius: 2, margin: "6px auto 10px" }} />
            </div>
            {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
              </div>
              <div className="mb-3">
                <div className="input-group">
                  <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <BiHide /> : <BiShow />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn w-100 py-2 fw-bold" disabled={submitting}
                style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)", border: "none", color: "#1c1608" }}>
                {submitting ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}