"use client";
import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { TextField } from "../TextField/TextField.component";

interface SelectFieldProps {
  label: string;
  value?: string;
  variant?: "standard" | "filled" | "outlined" | undefined;
  onChange: (event: SelectChangeEvent) => void;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  margin?: "normal" | "dense" | "none" | undefined;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  variant,
  onChange,
  options,
  fullWidth = true,
  error,
  helperText,
  margin = "normal"
}) => {
  return (
    <FormControl variant={variant} fullWidth={fullWidth} error={error} margin={margin}>
      <InputLabel id ={label}>{label}</InputLabel>
      <Select labelId={label} name={label} value={value} onChange={onChange} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <p style={{ color: "red", fontSize: "12px" }}>{helperText}</p>}
    </FormControl>
  );
};
