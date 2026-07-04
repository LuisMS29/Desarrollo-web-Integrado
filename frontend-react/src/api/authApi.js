import axiosClient from "./axiosClient";

export const authApi = {
  login: (username, password) =>
    axiosClient.post("/auth/login", { username, password }),

  register: (payload) => axiosClient.post("/auth/register", payload),

  getProfile: () => axiosClient.get("/auth/profile"),
};
