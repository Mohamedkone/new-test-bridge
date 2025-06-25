import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ENV, STORAGE_KEYS } from '../utils/constants';
import { type ApiResponse, type ApiError } from '../types/api.types';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic PUT request
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // File upload with progress
  async uploadFile<T = any>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.axiosInstance.post<ApiResponse<T>>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
        onUploadProgress,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Set auth token
  setAuthToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  // Get current auth token
  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Handle API errors
  private handleError(error: any): ApiError {
    if (error.response?.data) {
      // Server responded with error data
      return error.response.data;
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection and try again.',
        },
      };
    } else {
      // Other error
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error.message || 'An unexpected error occurred.',
        },
      };
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; version?: string }> {
    try {
      const response = await this.axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API is not available');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;