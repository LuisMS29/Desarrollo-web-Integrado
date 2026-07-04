import axiosClient from "./axiosClient";

export const usuariosApi = {
  listar: () => axiosClient.get("/admin/usuarios"),
  obtener: (id) => axiosClient.get(`/admin/usuarios/${id}`),
  activar: (id) => axiosClient.put(`/admin/usuarios/${id}/activar`),
  desactivar: (id) => axiosClient.put(`/admin/usuarios/${id}/desactivar`),
  eliminar: (id) => axiosClient.delete(`/admin/usuarios/${id}`),
};
