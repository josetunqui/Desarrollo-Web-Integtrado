export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;     // "Bearer"
  usuario: string;
  rol: string;      // "ROLE_ADMIN" | "ROLE_CLIENTE"
  expiraEn: number; // segundos
}

export interface Sesion {
  token: string;
  usuario: string;
  rol: string;
  expira: number; // milisegundos (Date.now())
}

export interface Perfil {
  usuario: string;
  rol: string;
  mensaje: string;
}
