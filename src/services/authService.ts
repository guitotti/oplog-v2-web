import type { User } from "../store/auth";

export interface Credentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

interface AuthService {
  login(credentials: Credentials): Promise<LoginResponse>;
  logout(token: string | null): Promise<void>;
  me(token: string): Promise<User>;
}

const API_URL = import.meta.env.VITE_API_URL;

export const isMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";

const apiAuthService: AuthService = {
  async login(credentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      throw new Error(
        res.status === 401 ? "E-mail ou senha inválidos" : "Erro ao autenticar",
      );
    }
    return res.json();
  },

  async logout(token) {
    if (!token) return;
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  },

  async me(token) {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Sessão inválida");
    return res.json();
  },
};

const MOCK_USER: User = {
  id: 1,
  nome: "Administrador",
  email: "admin@oplog.com",
  perfil: "ADMIN",
};

const mockAuthService: AuthService = {
  async login() {
    await new Promise((r) => setTimeout(r, 300));
    return { token: "oplog-mock-token", user: MOCK_USER };
  },
  async logout() {},
  async me() {
    return MOCK_USER;
  },
};

export const authService: AuthService = isMockAuth
  ? mockAuthService
  : apiAuthService;
