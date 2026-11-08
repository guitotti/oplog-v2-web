import { useQuery } from "@tanstack/react-query";
import { parceiroService } from "../services/parceiroService";

export const parceiroKeys = {
  all: ["parceiros"] as const,
};

export function useParceiros(enabled = true) {
  return useQuery({
    queryKey: parceiroKeys.all,
    queryFn: parceiroService.list,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
