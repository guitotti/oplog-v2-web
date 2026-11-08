import { z } from "zod";
import { TIPOS_HUB, type Hub, type HubInput, type TipoHub } from "../types/hub";
import { formatCep, maskTelefone, onlyDigits } from "../utils/format";

/** Valores do formulário: tudo como texto, convertido em `toHubInput`. */
export const hubFormSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do HUB").max(100),
  tipo: z
    .string()
    .refine(
      (v) => (TIPOS_HUB as readonly string[]).includes(v),
      "Selecione o tipo do HUB",
    ),
  parceiroId: z.string().min(1, "Selecione o parceiro responsável"),
  logradouro: z.string().trim().min(1, "Informe o logradouro").max(120),
  numero: z.string().trim().min(1, "Informe o número").max(10),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido (ex.: 13000-001)"),
  complemento: z.string().trim().max(60),
  email: z.email("Informe um e-mail válido"),
  telefone: z
    .string()
    .refine(
      (v) => [10, 11].includes(onlyDigits(v).length),
      "Telefone inválido (ex.: (19) 99999-1001)",
    ),
});

export type HubFormValues = z.infer<typeof hubFormSchema>;

export const emptyHubForm: HubFormValues = {
  nome: "",
  tipo: "",
  parceiroId: "",
  logradouro: "",
  numero: "",
  cep: "",
  complemento: "",
  email: "",
  telefone: "",
};

export function toHubFormValues(hub: Hub | null): HubFormValues {
  if (!hub) return emptyHubForm;
  return {
    nome: hub.nome,
    tipo: hub.tipo,
    parceiroId: String(hub.parceiro.id),
    logradouro: hub.logradouro,
    numero: hub.numero,
    cep: formatCep(hub.cep),
    complemento: hub.complemento,
    email: hub.email,
    telefone: maskTelefone(hub.telefone),
  };
}

export function toHubInput(values: HubFormValues): HubInput {
  return {
    nome: values.nome.trim(),
    tipo: values.tipo as TipoHub,
    logradouro: values.logradouro.trim(),
    numero: values.numero.trim(),
    cep: onlyDigits(values.cep),
    complemento: values.complemento.trim(),
    email: values.email.trim(),
    telefone: onlyDigits(values.telefone),
    parceiro: { id: Number(values.parceiroId) },
  };
}
