import { api } from "../utils/api";
import type { Parceiro } from "../types/parceiro";

export const parceiroService = {
  async list(): Promise<Parceiro[]> {
    const { data } = await api.get<Parceiro[]>("/parceiros");
    return data;
  },
};
