import axios from "axios";

// Cambia esto si tu backend corre en otra URL/puerto
export const API_BASE_URL = "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el token JWT a cada petición saliente
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ie_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza los errores del backend para mostrarlos fácilmente en la UI
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token vencido/ inválido o sin permisos: forzar logout limpio
    if (status === 401) {
      const hadToken = !!localStorage.getItem("ie_token");
      localStorage.removeItem("ie_token");
      localStorage.removeItem("ie_user");
      if (hadToken && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=1";
      }
    }

    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === "string" ? error.response.data : null);

    const friendlyMessage =
      backendMessage ||
      (status === 403
        ? "No tienes permisos para realizar esta acción."
        : status === 404
        ? "El recurso solicitado no existe."
        : status >= 500
        ? "Error del servidor. Intenta nuevamente en unos segundos."
        : !error.response
        ? "No se pudo conectar con el servidor. Verifica que el backend esté encendido."
        : "Ocurrió un error inesperado.");

    error.friendlyMessage = friendlyMessage;
    return Promise.reject(error);
  }
);

export default axiosClient;
