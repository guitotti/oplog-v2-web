import { atom } from "jotai";
import { STORAGE_KEYS, getStoredJSON, getStoredToken } from "../utils/storage";

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: "ADMIN" | "OPERADOR";
}

export const tokenAtom = atom<string | null>(getStoredToken());

export const isAuthenticatedAtom = atom((get) => get(tokenAtom) !== null);

export const userAtom = atom<User | null>(
  getStoredJSON<User>(STORAGE_KEYS.user),
);
