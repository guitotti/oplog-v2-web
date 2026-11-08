import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { userAtom } from "../store/auth";
import { authService } from "../services/authService";
import { saveUser } from "../utils/storage";

export function useSessionValidation() {
  const { token, clearLocalSession } = useAuth();
  const setUser = useSetAtom(userAtom);

  const query = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: () => authService.me(token as string),
    enabled: token !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      saveUser(query.data);
      setUser(query.data);
    }
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.isError) clearLocalSession();
  }, [query.isError, clearLocalSession]);

  return query;
}
