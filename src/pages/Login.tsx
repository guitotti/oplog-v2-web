import { Navigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { isMockAuth } from "../services/authService";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  senha: z.string().min(1, "Informe a senha"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: isMockAuth
      ? { email: "admin@oplog.com", senha: "mock" }
      : { email: "", senha: "" },
  });

  const mutation = useMutation({ mutationFn: login });

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        component="form"
        noValidate
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            OPLOG
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Operações Logísticas
          </Typography>
        </Box>

        {isMockAuth && (
          <Alert severity="info">
            Login com mock: utilizar qualquer e-mail e senha
          </Alert>
        )}

        {mutation.isError && (
          <Alert severity="error">{mutation.error.message}</Alert>
        )}

        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          fullWidth
          {...register("senha")}
          error={!!errors.senha}
          helperText={errors.senha?.message}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={mutation.isPending}
          startIcon={
            mutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {mutation.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </Paper>
    </Box>
  );
}
