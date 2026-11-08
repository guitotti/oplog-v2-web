export interface Parceiro {
  id: number;
  nome: string;
  cnpj: string;
}

export type ParceiroResumo = Pick<Parceiro, "id" | "nome">;
