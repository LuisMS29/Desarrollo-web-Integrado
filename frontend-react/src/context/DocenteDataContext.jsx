import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { docentePanelApi } from "../api/rolePanelApi";

const DocenteDataContext = createContext(null);

export function DocenteDataProvider({ children }) {
  const [docente, setDocente] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: miFicha } = await docentePanelApi.obtenerMiFicha();
      setDocente(miFicha);
      const { data: misCursos } = await docentePanelApi.listarMisCursos(miFicha.idDocente);
      setCursos(misCursos);
    } catch (err) {
      setError(
        err.friendlyMessage ||
          "No se pudo cargar tu información docente. Verifica que tu usuario tenga una ficha de docente asociada."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DocenteDataContext.Provider value={{ docente, cursos, loading, error, reload: load }}>
      {children}
    </DocenteDataContext.Provider>
  );
}

export function useDocenteData() {
  const ctx = useContext(DocenteDataContext);
  if (!ctx) throw new Error("useDocenteData debe usarse dentro de <DocenteDataProvider>");
  return ctx;
}
