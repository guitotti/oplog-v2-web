import { atom } from "jotai";
import type { AlertColor } from "@mui/material";

export interface Notification {
  id: number;
  message: string;
  severity: AlertColor;
}

export const notificationAtom = atom<Notification | null>(null);
