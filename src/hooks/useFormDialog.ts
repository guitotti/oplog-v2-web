import { useCallback, useState } from "react";

interface FormDialogState<T> {
  open: boolean;
  record: T | null;
  key: number; // muda a cada abertura - usado para remontar o formulário limpo
}

export function useFormDialog<T>() {
  const [state, setState] = useState<FormDialogState<T>>({
    open: false,
    record: null,
    key: 0,
  });

  const openNew = useCallback(
    () => setState((s) => ({ open: true, record: null, key: s.key + 1 })),
    [],
  );

  const openEdit = useCallback(
    (record: T) => setState((s) => ({ open: true, record, key: s.key + 1 })),
    [],
  );

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return { ...state, openNew, openEdit, close };
}
