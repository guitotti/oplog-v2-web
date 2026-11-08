import type { ComponentProps, ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: ComponentProps<"form">["onSubmit"];
  isSubmitting?: boolean;
  error?: string | null;
  submitLabel?: string;
  children: ReactNode;
}

export function FormDialog({
  open,
  title,
  onClose,
  onSubmit,
  isSubmitting = false,
  error,
  submitLabel = "Salvar",
  children,
}: FormDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <Box
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          minHeight: 0,
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              pt: 1,
            }}
          >
            {children}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {isSubmitting ? "Salvando..." : submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
