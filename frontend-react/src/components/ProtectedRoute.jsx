import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ONBOARDING_ROUTES = {
  ESTUDIANTE: "/estudiante/completar-perfil",
  DOCENTE: "/docente/completar-perfil",
};

/**
 * Protege un grupo de rutas. Si se pasa `allowedRoles`, además valida
 * que el rol del usuario logueado esté en la lista permitida.
 * Si el perfil del usuario está incompleto, redirige al onboarding.
 */
export default function ProtectedRoute({ allowedRoles, ignorePerfil }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  if (!ignorePerfil && user.perfilCompleto === false && ONBOARDING_ROUTES[user.rol]) {
    const onboardingPath = ONBOARDING_ROUTES[user.rol];
    if (location.pathname !== onboardingPath) {
      return <Navigate to={onboardingPath} replace />;
    }
  }

  return <Outlet />;
}
