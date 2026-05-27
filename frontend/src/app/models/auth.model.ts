export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  expiresIn: number;
  username: string;
  rol: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol: string;
}

export interface Usuario {
  idUsuario: number;
  username: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaCreacion: string;
}
