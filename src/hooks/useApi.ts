import React, { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import {  type ApiResponse, type ApiError } from '../types/api.types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  showSuccessMessage = false,
  showErrorMessage = true
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { showSuccess, showError } = useNotification();

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(...args);

        if (response.success && response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });

          if (showSuccessMessage) {
            showSuccess('Operation completed successfully');
          }

          return response.data;
        } else {
          const errorMessage = response.error?.message || 'Operation failed';
          setState({
            data: null,
            loading: false,
            error: errorMessage,
          });

          if (showErrorMessage) {
            showError(errorMessage);
          }

          return null;
        }
      } catch (error: any) {
        const errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
        
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        if (showErrorMessage) {
          showError(errorMessage);
        }

        return null;
      }
    },
    [apiFunction, showSuccessMessage, showErrorMessage, showSuccess, showError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hook for GET requests
export function useApiGet<T = any>(
  url: string,
  autoExecute = false,
  dependencies: any[] = []
): UseApiReturn<T> {
  const apiCall = useCallback(() => apiService.get<T>(url), [url]);
  const api = useApi<T>(apiCall, false, true);

  // Auto-execute on mount or when dependencies change
  React.useEffect(() => {
    if (autoExecute) {
      api.execute();
    }
  }, [autoExecute, ...dependencies]);

  return api;
}

// Specialized hook for POST requests
export function useApiPost<T = any>(
  url: string,
  showSuccessMessage = true
): UseApiReturn<T> {
  const apiCall = useCallback(
    (data?: any) => apiService.post<T>(url, data),
    [url]
  );
  
  return useApi<T>(apiCall, showSuccessMessage, true);
}

// Specialized hook for PUT requests
export function useApiPut<T = any>(
  url: string,
  showSuccessMessage = true
): UseApiReturn<T> {
  const apiCall = useCallback(
    (data?: any) => apiService.put<T>(url, data),
    [url]
  );
  
  return useApi<T>(apiCall, showSuccessMessage, true);
}

// Specialized hook for DELETE requests
export function useApiDelete<T = any>(
  url: string,
  showSuccessMessage = true
): UseApiReturn<T> {
  const apiCall = useCallback(
    () => apiService.delete<T>(url),
    [url]
  );
  
  return useApi<T>(apiCall, showSuccessMessage, true);
}

export default useApi;