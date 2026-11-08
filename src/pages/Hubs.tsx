import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataTable, type Column } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { HubFormDialog } from "../components/hubs/HubFormDialog";
import { useHubs } from "../hooks/useHubs";
import { useFormDialog } from "../hooks/useFormDialog";
import { TIPO_HUB_LABEL, type Hub } from "../types/hub";
import { getErrorMessage } from "../utils/api";
import { formatCep, formatTelefone } from "../utils/format";

export function Hubs() {
  const { data, isLoading, error, refetch } = useHubs();
  const dialog = useFormDialog<Hub>();

  const columns: Column<Hub>[] = [
    { key: "id", header: "ID", minWidth: 50 },
    { key: "nome", header: "Nome do HUB", minWidth: 180 },
    {
      key: "tipo",
      header: "Tipo",
      minWidth: 130,
      searchValue: (h) => TIPO_HUB_LABEL[h.tipo],
      render: (h) => (
        <Chip size="small" variant="outlined" label={TIPO_HUB_LABEL[h.tipo]} />
      ),
    },
    {
      key: "endereco",
      header: "Endereço",
      minWidth: 200,
      searchValue: (h) => `${h.logradouro} ${h.numero} ${h.complemento}`,
      render: (h) => (
        <Box>
          <Typography variant="body2">
            {h.logradouro}, {h.numero}
          </Typography>
          {h.complemento && (
            <Typography variant="caption" color="text.secondary">
              {h.complemento}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      key: "cep",
      header: "CEP",
      minWidth: 100,
      render: (h) => formatCep(h.cep),
    },
    { key: "email", header: "E-mail", minWidth: 180 },
    {
      key: "telefone",
      header: "Telefone",
      minWidth: 140,
      render: (h) => formatTelefone(h.telefone),
    },
    {
      key: "parceiro",
      header: "Parceiro",
      minWidth: 170,
      searchValue: (h) => h.parceiro?.nome,
      render: (h) => h.parceiro?.nome ?? "—",
    },
    {
      key: "acoes",
      header: "",
      align: "right",
      searchValue: () => "",
      render: (h) => (
        <Tooltip title="Alterar">
          <IconButton
            size="small"
            aria-label={`Alterar ${h.nome}`}
            onClick={(e) => {
              e.stopPropagation();
              dialog.openEdit(h);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="HUBs"
        subtitle="Centros de distribuição e armazenagem"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={dialog.openNew}
          >
            Novo HUB
          </Button>
        }
      />
      <DataTable
        columns={columns}
        rows={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={() => refetch()}
        onRowClick={dialog.openEdit}
        searchPlaceholder="Buscar por nome, endereço, parceiro..."
        emptyMessage="Nenhum HUB cadastrado."
      />
      <HubFormDialog
        key={dialog.key}
        open={dialog.open}
        hub={dialog.record}
        onClose={dialog.close}
      />
    </>
  );
}
