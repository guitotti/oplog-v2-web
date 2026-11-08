import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { veiculoService } from "../services/veiculoService";
import type { VeiculoInput } from "../types/veiculo";

export const veiculoKeys = {
  all: ["veiculos"] as const,
};

export function useVeiculos() {
  return useQuery({
    queryKey: veiculoKeys.all,
    queryFn: veiculoService.list,
  });
}

interface SaveVeiculoVars {
  id?: number; // não é presente na inserção, apenas na alteração
  input: VeiculoInput;
}

export function useSaveVeiculo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: SaveVeiculoVars) =>
      id === undefined
        ? veiculoService.create(input)
        : veiculoService.update(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: veiculoKeys.all }),
  });
}
