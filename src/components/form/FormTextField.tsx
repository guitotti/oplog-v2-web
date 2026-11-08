import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { TextField, type TextFieldProps } from "@mui/material";

type FormTextFieldProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "value" | "onChange" | "onBlur" | "error" | "inputRef"
> & {
  name: FieldPath<T>;
  control: Control<T>;
  mask?: (value: string) => string;
  children?: ReactNode;
};

export function FormTextField<T extends FieldValues>({
  name,
  control,
  mask,
  helperText,
  children,
  ...props
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          name={field.name}
          value={field.value ?? ""}
          onChange={(e) =>
            field.onChange(mask ? mask(e.target.value) : e.target.value)
          }
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helperText}
          fullWidth
        >
          {children}
        </TextField>
      )}
    />
  );
}
