import React, { createContext, useContext, type ReactNode } from 'react';
import { SnackbarProvider, useSnackbar, type VariantType } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant,
      action: (key) => (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => closeSnackbar(key)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ),
    });
  };

  const value: NotificationContextType = {
    showSuccess: (message: string) => showNotification(message, 'success'),
    showError: (message: string) => showNotification(message, 'error'),
    showWarning: (message: string) => showNotification(message, 'warning'),
    showInfo: (message: string) => showNotification(message, 'info'),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={5000}
      dense
    >
      <NotificationProviderInner>
        {children}
      </NotificationProviderInner>
    </SnackbarProvider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;