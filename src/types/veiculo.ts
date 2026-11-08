export const TIPOS_VEICULO = [
  "Caminhao",
  "Van",
  "Picape",
  "Utilitario",
] as const;

export type TipoVeiculo = (typeof TIPOS_VEICULO)[number];

export const TIPO_VEICULO_LABEL: Record<TipoVeiculo, string> = {
  Caminhao: "Caminhão",
  Van: "Van",
  Picape: "Picape",
  Utilitario: "Utilitário",
};

export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  capacidadeCarga: number;
  tipo: TipoVeiculo;
}

export type VeiculoInput = Omit<Veiculo, "id">;
