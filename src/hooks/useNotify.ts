import { useCallback } from "react";
import { useSetAtom } from "jotai";
import type { AlertColor } from "@mui/material";
import { notificationAtom } from "../store/notification";

export function useNotify() {
  const setNotification = useSetAtom(notificationAtom);

  return useCallback(
    (message: string, severity: AlertColor = "success") =>
      setNotification({ id: Date.now(), message, severity }),
    [setNotification],
  );
}
