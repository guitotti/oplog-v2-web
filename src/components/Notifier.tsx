import { useAtom } from "jotai";
import { Alert, Snackbar } from "@mui/material";
import { notificationAtom } from "../store/notification";

export function Notifier() {
  const [notification, setNotification] = useAtom(notificationAtom);

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setNotification(null);
  };

  return (
    <Snackbar
      key={notification?.id}
      open={notification !== null}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={notification?.severity ?? "success"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}
