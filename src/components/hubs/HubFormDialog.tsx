import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, TextField } from "@mui/material";
import { FormDialog } from "../form/FormDialog";
import { FormTextField } from "../form/FormTextField";
import { useSaveHub } from "../../hooks/useHubs";
import { useParceiros } from "../../hooks/useParceiros";
import { useNotify } from "../../hooks/useNotify";
import {
  hubFormSchema,
  toHubFormValues,
  toHubInput,
  type HubFormValues,
} from "../../schemas/hub";
import { TIPOS_HUB, TIPO_HUB_LABEL, type Hub } from "../../types/hub";
import { getErrorMessage } from "../../utils/api";
import { maskCep, maskTelefone } from "../../utils/format";

interface HubFormDialogProps {
  open: boolean;
  hub: Hub | null; // pode ser null caso seja uma nova inserção
  onClose: () => void;
}

export function HubFormDialog({ open, hub, onClose }: HubFormDialogProps) {
  const isEdit = hub !== null;
  const notify = useNotify();
  const mutation = useSaveHub();
  const parceiros = useParceiros(open);

  const { control, handleSubmit } = useForm<HubFormValues>({
    resolver: zodResolver(hubFormSchema),
    defaultValues: toHubFormValues(hub),
  });

  const onSubmit = handleSubmit((values) =>
    mutation.mutate(
      { id: hub?.id, input: toHubInput(values) },
      {
        onSuccess: (saved) => {
          notify(
            isEdit
              ? `${saved.nome} alterado com sucesso`
              : `${saved.nome} inserido com sucesso`,
          );
          onClose();
        },
      },
    ),
  );

  const parceirosHelper = parceiros.isLoading
    ? "Carregando parceiros..."
    : parceiros.isError
      ? "Não foi possível carregar os parceiros"
      : undefined;

  return (
    <FormDialog
      open={open}
      title={isEdit ? "Alterar HUB" : "Novo HUB"}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      error={mutation.isError ? getErrorMessage(mutation.error) : null}
      submitLabel={isEdit ? "Alterar" : "Inserir"}
    >
      {isEdit && (
        <TextField
          label="ID"
          value={hub.id}
          disabled
          fullWidth
          helperText="Gerado pelo sistema"
          sx={{ gridColumn: "1 / -1", maxWidth: { sm: "calc(50% - 8px)" } }}
        />
      )}

      <FormTextField
        control={control}
        name="nome"
        label="Nome do HUB"
        required
        autoFocus
        sx={{ gridColumn: "1 / -1" }}
      />
      <FormTextField
        control={control}
        name="tipo"
        label="Tipo do HUB"
        select
        required
      >
        {TIPOS_HUB.map((tipo) => (
          <MenuItem key={tipo} value={tipo}>
            {TIPO_HUB_LABEL[tipo]}
          </MenuItem>
        ))}
      </FormTextField>
      <FormTextField
        control={control}
        name="parceiroId"
        label="Parceiro"
        select
        required
        disabled={!parceiros.data}
        helperText={parceirosHelper}
      >
        {(parceiros.data ?? []).map((p) => (
          <MenuItem key={p.id} value={String(p.id)}>
            {p.nome}
          </MenuItem>
        ))}
      </FormTextField>

      <FormTextField
        control={control}
        name="logradouro"
        label="Logradouro"
        required
        sx={{ gridColumn: "1 / -1" }}
      />
      <FormTextField control={control} name="numero" label="Número" required />
      <FormTextField
        control={control}
        name="cep"
        label="CEP"
        mask={maskCep}
        required
        placeholder="00000-000"
        slotProps={{ htmlInput: { inputMode: "numeric" } }}
      />
      <FormTextField
        control={control}
        name="complemento"
        label="Complemento"
        sx={{ gridColumn: "1 / -1" }}
      />
      <FormTextField
        control={control}
        name="email"
        label="E-mail"
        type="email"
        required
      />
      <FormTextField
        control={control}
        name="telefone"
        label="Telefone"
        mask={maskTelefone}
        required
        placeholder="(00) 00000-0000"
        slotProps={{ htmlInput: { inputMode: "tel" } }}
      />
    </FormDialog>
  );
}
