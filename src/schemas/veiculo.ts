import { z } from "zod";
import {
  TIPOS_VEICULO,
  type TipoVeiculo,
  type Veiculo,
  type VeiculoInput,
} from "../types/veiculo";

const ANO_MAXIMO = new Date().getFullYear() + 1;

/** Valores do formulário: tudo como texto, convertido em `toVeiculoInput`. */
export const veiculoFormSchema = z.object({
  placa: z
    .string()
    .regex(
      /^[A-Z]{3}\d[A-Z0-9]\d{2}$/,
      "Placa inválida (ex.: ABC1234 ou ABC1D23)",
    ),
  modelo: z.string().trim().min(1, "Informe o modelo").max(60),
  marca: z.string().trim().min(1, "Informe a marca").max(60),
  ano: z
    .string()
    .regex(/^\d{4}$/, "Informe o ano com 4 dígitos")
    .refine(
      (v) => Number(v) >= 1950 && Number(v) <= ANO_MAXIMO,
      `Ano deve estar entre 1950 e ${ANO_MAXIMO}`,
    ),
  capacidadeCarga: z
    .string()
    .regex(/^\d+(,\d{1,2})?$/, "Informe a capacidade (ex.: 25,5)")
    .refine((v) => Number(v.replace(",", ".")) > 0, "Deve ser maior que zero"),
  tipo: z
    .string()
    .refine(
      (v) => (TIPOS_VEICULO as readonly string[]).includes(v),
      "Selecione o tipo do veículo",
    ),
});

export type VeiculoFormValues = z.infer<typeof veiculoFormSchema>;

export const emptyVeiculoForm: VeiculoFormValues = {
  placa: "",
  modelo: "",
  marca: "",
  ano: "",
  capacidadeCarga: "",
  tipo: "",
};

export function toVeiculoFormValues(
  veiculo: Veiculo | null,
): VeiculoFormValues {
  if (!veiculo) return emptyVeiculoForm;
  return {
    placa: veiculo.placa,
    modelo: veiculo.modelo,
    marca: veiculo.marca,
    ano: String(veiculo.ano),
    capacidadeCarga: String(veiculo.capacidadeCarga).replace(".", ","),
    tipo: veiculo.tipo,
  };
}

export function toVeiculoInput(values: VeiculoFormValues): VeiculoInput {
  return {
    placa: values.placa,
    modelo: values.modelo.trim(),
    marca: values.marca.trim(),
    ano: Number(values.ano),
    capacidadeCarga: Number(values.capacidadeCarga.replace(",", ".")),
    tipo: values.tipo as TipoVeiculo,
  };
}
