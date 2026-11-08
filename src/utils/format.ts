export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function formatCep(value: string): string {
  const d = onlyDigits(value);
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : value;
}

export function formatTelefone(value: string): string {
  const d = onlyDigits(value);
  if (d.length === 11)
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return value;
}

/**
 * A função formata placas de veículos
 * placa no padrão antigo (ABC-1234) - placas Mercosul (ABC1D23) ficam sem hífen
 */
export function formatPlaca(value: string): string {
  const v = value.toUpperCase();
  return /^[A-Z]{3}\d{4}$/.test(v) ? `${v.slice(0, 3)}-${v.slice(3)}` : v;
}

const tonFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatToneladas(value: number): string {
  return `${tonFormatter.format(value)} t`;
}

/**
 * A função normaliza texto para busca
 * convertendo o conteúdo para minúsculo e sem acentos
 */
export function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase();
}

export function maskCep(value: string): string {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function maskTelefone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskPlaca(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}

export function maskDigits(maxLength: number) {
  return (value: string) => onlyDigits(value).slice(0, maxLength);
}

export function maskDecimal(value: string): string {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(".", ",");
  const [int, ...dec] = cleaned.split(",");
  return dec.length ? `${int},${dec.join("").slice(0, 2)}` : int;
}
