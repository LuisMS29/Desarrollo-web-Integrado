import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { estudiantePanelApi } from "../api/rolePanelApi";

const EstudianteDataContext = createContext(null);

export function EstudianteDataProvider({ children }) {
  const [estudiante, setEstudiante] = useState(null);
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: miFicha } = await estudiantePanelApi.obtenerMiFicha();
      setEstudiante(miFicha);
      const { data: misMatriculas } = await estudiantePanelApi.listarMisMatriculas(miFicha.idEstudiante);
      setMatriculas(misMatriculas.filter((m) => m.estado === "ACTIVO"));
    } catch (err) {
      setError(
        err.friendlyMessage ||
          "No se pudo cargar tu información. Verifica que tu usuario tenga una ficha de estudiante asociada."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <EstudianteDataContext.Provider value={{ estudiante, matriculas, loading, error, reload: load }}>
      {children}
    </EstudianteDataContext.Provider>
  );
}

export function useEstudianteData() {
  const ctx = useContext(EstudianteDataContext);
  if (!ctx) throw new Error("useEstudianteData debe usarse dentro de <EstudianteDataProvider>");
  return ctx;
}
