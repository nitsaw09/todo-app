import React from 'react';
import { Snackbar as MuiSnackbar, Alert } from '@mui/material';

export interface SnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ open = false, message, severity, onClose }) => {
  return (
    <MuiSnackbar open={open} autoHideDuration={2000} onClose={onClose}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};
