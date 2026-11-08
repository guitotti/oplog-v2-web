import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, TextField } from "@mui/material";
import { FormDialog } from "../form/FormDialog";
import { FormTextField } from "../form/FormTextField";
import { useSaveVeiculo } from "../../hooks/useVeiculos";
import { useNotify } from "../../hooks/useNotify";
import {
  toVeiculoFormValues,
  toVeiculoInput,
  veiculoFormSchema,
  type VeiculoFormValues,
} from "../../schemas/veiculo";
import {
  TIPOS_VEICULO,
  TIPO_VEICULO_LABEL,
  type Veiculo,
} from "../../types/veiculo";
import { getErrorMessage } from "../../utils/api";
import { maskDecimal, maskDigits, maskPlaca } from "../../utils/format";

interface VeiculoFormDialogProps {
  open: boolean;
  veiculo: Veiculo | null; // pode ser null caso seja uma nova inserção
  onClose: () => void;
}

export function VeiculoFormDialog({
  open,
  veiculo,
  onClose,
}: VeiculoFormDialogProps) {
  const isEdit = veiculo !== null;
  const notify = useNotify();
  const mutation = useSaveVeiculo();

  const { control, handleSubmit } = useForm<VeiculoFormValues>({
    resolver: zodResolver(veiculoFormSchema),
    defaultValues: toVeiculoFormValues(veiculo),
  });

  const onSubmit = handleSubmit((values) =>
    mutation.mutate(
      { id: veiculo?.id, input: toVeiculoInput(values) },
      {
        onSuccess: (saved) => {
          notify(
            isEdit
              ? `Veículo ${saved.placa} alterado com sucesso`
              : `Veículo ${saved.placa} inserido com sucesso`,
          );
          onClose();
        },
      },
    ),
  );

  return (
    <FormDialog
      open={open}
      title={isEdit ? "Alterar veículo" : "Novo veículo"}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      error={mutation.isError ? getErrorMessage(mutation.error) : null}
      submitLabel={isEdit ? "Alterar" : "Inserir"}
    >
      {isEdit && (
        <TextField
          label="ID"
          value={veiculo.id}
          disabled
          fullWidth
          helperText="Gerado pelo sistema"
          sx={{ gridColumn: "1 / -1", maxWidth: { sm: "calc(50% - 8px)" } }}
        />
      )}

      <FormTextField
        control={control}
        name="placa"
        label="Placa"
        mask={maskPlaca}
        required
        autoFocus
        placeholder="ABC1D23"
      />
      <FormTextField
        control={control}
        name="tipo"
        label="Tipo do Veículo"
        select
        required
      >
        {TIPOS_VEICULO.map((tipo) => (
          <MenuItem key={tipo} value={tipo}>
            {TIPO_VEICULO_LABEL[tipo]}
          </MenuItem>
        ))}
      </FormTextField>
      <FormTextField control={control} name="modelo" label="Modelo" required />
      <FormTextField control={control} name="marca" label="Marca" required />
      <FormTextField
        control={control}
        name="ano"
        label="Ano"
        mask={maskDigits(4)}
        required
        slotProps={{ htmlInput: { inputMode: "numeric" } }}
      />
      <FormTextField
        control={control}
        name="capacidadeCarga"
        label="Capacidade de Carga (t)"
        mask={maskDecimal}
        required
        placeholder="25,5"
        slotProps={{ htmlInput: { inputMode: "decimal" } }}
      />
    </FormDialog>
  );
}
