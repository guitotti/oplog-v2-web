import { api } from "../utils/api";
import type { Veiculo, VeiculoInput } from "../types/veiculo";

export const veiculoService = {
  async list(): Promise<Veiculo[]> {
    const { data } = await api.get<Veiculo[]>("/veiculos");
    return data;
  },

  async getById(id: number): Promise<Veiculo> {
    const { data } = await api.get<Veiculo>(`/veiculos/${id}`);
    return data;
  },

  async create(input: VeiculoInput): Promise<Veiculo> {
    const { data } = await api.post<Veiculo>("/veiculos", input);
    return data;
  },

  async update(id: number, input: VeiculoInput): Promise<Veiculo> {
    const { data } = await api.put<Veiculo>(`/veiculos/${id}`, input);
    return data;
  },
};
