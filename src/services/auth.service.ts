import { apiService } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import { type LoginResponse, type User } from '../types/auth.types';
// import { ApiResponse } from '../types/api.types';

export class AuthService {
  // Login to API with Auth0 token
  async loginWithAuth0Token(idToken: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse['data']>(
        API_ENDPOINTS.AUTH.LOGIN,
        { idToken }
      );

      if (response.success && response.data) {
        // Store the API token
        apiService.setAuthToken(response.data.token);
        
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error(response.error?.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Authentication failed');
    }
  }

  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Failed to get user profile');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user profile');
    }
  }

  

  // Validate token
  async validateToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await apiService.post<{ valid: boolean; user?: User }>(
        API_ENDPOINTS.AUTH.VALIDATE_TOKEN,
        { token }
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        return { valid: false };
      }
    } catch (error) {
      return { valid: false };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if logout fails on server, we should clear local storage
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear local storage
      this.clearStoredUser();
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  // Get auth token
  getAuthToken(): string | null {
    return apiService.getAuthToken();
  }

  // Remove auth token
  removeAuthToken(): void {
    apiService.removeAuthToken();
  }

  // Get stored user data
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  // Store user data
  storeUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  // Clear stored user data
  clearStoredUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    this.removeAuthToken();
  }
}

export const authService = new AuthService();
export default authService;