import { api } from "../utils/api";
import type { Hub, HubInput } from "../types/hub";

export const hubService = {
  async list(): Promise<Hub[]> {
    const { data } = await api.get<Hub[]>("/hubs");
    return data;
  },

  async getById(id: number): Promise<Hub> {
    const { data } = await api.get<Hub>(`/hubs/${id}`);
    return data;
  },

  async create(input: HubInput): Promise<Hub> {
    const { data } = await api.post<Hub>("/hubs", input);
    return data;
  },

  async update(id: number, input: HubInput): Promise<Hub> {
    const { data } = await api.put<Hub>(`/hubs/${id}`, input);
    return data;
  },
};
