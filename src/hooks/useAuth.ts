import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { isAuthenticatedAtom, tokenAtom, userAtom } from "../store/auth";
import { authService, type Credentials } from "../services/authService";
import { clearSession, saveSession } from "../utils/storage";

export function useAuth() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const queryClient = useQueryClient();

  const login = useCallback(
    async (credentials: Credentials) => {
      const { token: newToken, user: newUser } =
        await authService.login(credentials);
      saveSession(newToken, newUser);
      setUser(newUser);
      setToken(newToken);
      return newUser;
    },
    [setToken, setUser],
  );

  /** Encerra apenas a sessão local (exemplo: token rejeitado pelo back-end). */
  const clearLocalSession = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
    queryClient.clear();
  }, [queryClient, setToken, setUser]);

  const logout = useCallback(async () => {
    const currentToken = token;
    clearLocalSession();
    await authService.logout(currentToken);
  }, [clearLocalSession, token]);

  return { isAuthenticated, token, user, login, logout, clearLocalSession };
}
