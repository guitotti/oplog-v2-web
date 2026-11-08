import axios, { isAxiosError } from "axios";
import { getStoredToken } from "./storage";
import { mockAdapter } from "./mockAdapter";

export const isMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

/**
 * Cliente HTTP da aplicação
 * Com VITE_USE_MOCK_API=true, as requisições são respondidas pelo mock do adapter e nenhuma chamada de rede é feita
 */
export const api = axios.create({
  baseURL: isMockApi ? undefined : import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  ...(isMockApi && { adapter: mockAdapter }),
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    if (!error.response) return "Não foi possível conectar ao servidor";
    return error.response.data?.message ?? `Erro ${error.response.status}`;
  }
  return error instanceof Error ? error.message : "Erro inesperado";
}
