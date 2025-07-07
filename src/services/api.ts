// src/services/api.ts
import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';
import { ENV, STORAGE_KEYS } from '../utils/constants';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

class ApiService {
  private axiosInstance: AxiosInstance;
  public authToken: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadAuthToken();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.removeAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private loadAuthToken(): void {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      this.authToken = token;
    }
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  public getAuthToken(): string | null {
    return this.authToken || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  public removeAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private async handleRequest<T>(
    request: () => Promise<AxiosResponse<any>>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await request();
      
      // Handle different response formats
      if (response.data.success !== undefined) {
        // Backend returns { success: boolean, data: any, error?: any }
        return response.data;
      } else {
        // Backend returns data directly
        return {
          success: true,
          data: response.data,
        };
      }
    } catch (error: any) {
      console.error('API Request failed:', error);
      
      if (error.response?.data) {
        // Server returned an error response
        return {
          success: false,
          error: {
            code: error.response.data.error?.code || 'API_ERROR',
            message: error.response.data.error?.message || error.response.data.message || 'An error occurred',
            details: error.response.data.error?.details || error.response.data,
          },
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: 'Unable to connect to the server. Please check your internet connection.',
          },
        };
      } else {
        // Other error
        return {
          success: false,
          error: {
            code: 'UNKNOWN_ERROR',
            message: error.message || 'An unexpected error occurred',
          },
        };
      }
    }
  }

  // GET request
  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.handleRequest(() =>
      this.axiosInstance.get(url, { params })
    );
  }

  // POST request
  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.handleRequest(() =>
      this.axiosInstance.post(url, data)
    );
  }

  // PUT request
  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.handleRequest(() =>
      this.axiosInstance.put(url, data)
    );
  }

  // PATCH request
  public async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.handleRequest(() =>
      this.axiosInstance.patch(url, data)
    );
  }

  // DELETE request
  public async delete<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.handleRequest(() =>
      this.axiosInstance.delete(url, { data })
    );
  }

  // Upload file with progress
  public async uploadFile<T>(
    url: string,
    formData: FormData,
    onProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    return this.handleRequest(() =>
      this.axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress,
      })
    );
  }

  // Download file
  public async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.axiosInstance.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();