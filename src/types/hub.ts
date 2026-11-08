import type { ParceiroResumo } from "./parceiro";

export const TIPOS_HUB = [
  "Distribuicao",
  "Armazenagem",
  "CrossDocking",
] as const;

export type TipoHub = (typeof TIPOS_HUB)[number];

export const TIPO_HUB_LABEL: Record<TipoHub, string> = {
  Distribuicao: "Distribuição",
  Armazenagem: "Armazenagem",
  CrossDocking: "Cross-docking",
};

export interface Hub {
  id: number;
  nome: string;
  tipo: TipoHub;
  logradouro: string;
  numero: string;
  cep: string;
  complemento: string;
  email: string;
  telefone: string;
  parceiro: ParceiroResumo;
}

export type HubInput = Omit<Hub, "id" | "parceiro"> & {
  parceiro: { id: number };
};
