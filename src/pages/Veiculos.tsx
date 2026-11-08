import { Button, Chip, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataTable, type Column } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { VeiculoFormDialog } from "../components/veiculos/VeiculoFormDialog";
import { useVeiculos } from "../hooks/useVeiculos";
import { useFormDialog } from "../hooks/useFormDialog";
import { TIPO_VEICULO_LABEL, type Veiculo } from "../types/veiculo";
import { getErrorMessage } from "../utils/api";
import { formatPlaca, formatToneladas } from "../utils/format";

export function Veiculos() {
  const { data, isLoading, error, refetch } = useVeiculos();
  const dialog = useFormDialog<Veiculo>();

  const columns: Column<Veiculo>[] = [
    { key: "id", header: "ID", minWidth: 60 },
    {
      key: "placa",
      header: "Placa",
      minWidth: 100,
      render: (v) => formatPlaca(v.placa),
    },
    { key: "modelo", header: "Modelo", minWidth: 140 },
    { key: "marca", header: "Marca", minWidth: 120 },
    { key: "ano", header: "Ano", align: "right" },
    {
      key: "capacidadeCarga",
      header: "Cap. de Carga",
      align: "right",
      minWidth: 120,
      render: (v) => formatToneladas(v.capacidadeCarga),
    },
    {
      key: "tipo",
      header: "Tipo",
      minWidth: 110,
      searchValue: (v) => TIPO_VEICULO_LABEL[v.tipo],
      render: (v) => (
        <Chip
          size="small"
          variant="outlined"
          label={TIPO_VEICULO_LABEL[v.tipo]}
        />
      ),
    },
    {
      key: "acoes",
      header: "",
      align: "right",
      searchValue: () => "",
      render: (v) => (
        <Tooltip title="Alterar">
          <IconButton
            size="small"
            aria-label={`Alterar veículo ${v.placa}`}
            onClick={(e) => {
              e.stopPropagation();
              dialog.openEdit(v);
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
        title="Veículos"
        subtitle="Veículos utilizados na operação logística"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={dialog.openNew}
          >
            Novo veículo
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
        searchPlaceholder="Buscar por placa, modelo, marca..."
        emptyMessage="Nenhum veículo cadastrado."
      />
      <VeiculoFormDialog
        key={dialog.key}
        open={dialog.open}
        veiculo={dialog.record}
        onClose={dialog.close}
      />
    </>
  );
}
