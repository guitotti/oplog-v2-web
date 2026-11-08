import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hubService } from "../services/hubService";
import type { HubInput } from "../types/hub";

export const hubKeys = {
  all: ["hubs"] as const,
};

export function useHubs() {
  return useQuery({
    queryKey: hubKeys.all,
    queryFn: hubService.list,
  });
}

interface SaveHubVars {
  id?: number; // não é presente na inserção, apenas na alteração
  input: HubInput;
}

export function useSaveHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: SaveHubVars) =>
      id === undefined
        ? hubService.create(input)
        : hubService.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hubKeys.all }),
  });
}
