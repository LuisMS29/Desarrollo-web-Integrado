import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";

/**
 * El AuthContext solo guarda username/rol/token (lo que devuelve /auth/login).
 * Cuando se necesita el idUsuario real (por ejemplo, para autocompletar el
 * autor de un comunicado) se consulta /auth/profile una sola vez.
 */
export function useCurrentUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    authApi
      .getProfile()
      .then(({ data }) => {
        if (mounted) setUsuario(data);
      })
      .catch(() => {
        if (mounted) setUsuario(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { usuario, loading };
}
