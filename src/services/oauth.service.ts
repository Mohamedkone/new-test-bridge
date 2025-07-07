// src/services/oauth.service.ts
import { apiService } from './api';

export interface OAuthProvider {
  name: string;
  displayName: string;
  available: boolean;
  requiresConfig: boolean;
}

export interface OAuthAuthorizationResponse {
  authUrl: string;
  state: string;
}

export interface OAuthTokenResponse {
  success: boolean;
  storageId: string;
  message?: string;
}

export class OAuthService {
  // Get available OAuth providers
  async getProviders(): Promise<OAuthProvider[]> {
    try {
      const response = await apiService.get('/oauth/providers');
      return response.data?.providers || [];
    } catch (error) {
      console.error('Failed to fetch OAuth providers:', error);
      throw new Error('Failed to fetch OAuth providers');
    }
  }

  // Start Google Drive OAuth flow
  async authorizeGoogleDrive(userId: string): Promise<OAuthAuthorizationResponse> {
    try {
      const response = await apiService.post('/oauth/google-drive/authorize', {
        userId,
        redirectUri: `${window.location.origin}/oauth/google/callback`
      });
      return response;
    } catch (error) {
      console.error('Failed to start Google Drive OAuth:', error);
      throw new Error('Failed to start Google Drive OAuth');
    }
  }

  // Start Dropbox OAuth flow
  async authorizeDropbox(userId: string): Promise<OAuthAuthorizationResponse> {
    try {
      const response = await apiService.post('/oauth/dropbox/authorize', {
        userId,
        redirectUri: `${window.location.origin}/oauth/dropbox/callback`
      });
      return response;
    } catch (error) {
      console.error('Failed to start Dropbox OAuth:', error);
      throw new Error('Failed to start Dropbox OAuth');
    }
  }

  // Start OneDrive OAuth flow
  async authorizeOneDrive(userId: string): Promise<OAuthAuthorizationResponse> {
    try {
      const response = await apiService.post('/oauth/onedrive/authorize', {
        userId,
        redirectUri: `${window.location.origin}/oauth/onedrive/callback`
      });
      return response;
    } catch (error) {
      console.error('Failed to start OneDrive OAuth:', error);
      throw new Error('Failed to start OneDrive OAuth');
    }
  }

  // Handle OAuth callback
  async handleCallback(provider: string, code: string, state: string, userId: string): Promise<OAuthTokenResponse> {
    try {
      const response = await apiService.post(`/oauth/${provider}/token`, {
        code,
        state,
        userId
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to handle ${provider} OAuth callback:`, error);
      throw new Error(`Failed to complete ${provider} authentication`);
    }
  }

  // Revoke OAuth tokens
  async revokeTokens(provider: string, storageId: string): Promise<boolean> {
    try {
      await apiService.post(`/oauth/${provider}/revoke`, { storageId });
      return true;
    } catch (error) {
      console.error(`Failed to revoke ${provider} tokens:`, error);
      throw new Error(`Failed to revoke ${provider} access`);
    }
  }

  // Test OAuth connection
  async testOAuthConnection(provider: string, storageId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.post(`/oauth/${provider}/test`, { storageId });
      return response.data;
    } catch (error) {
      console.error(`Failed to test ${provider} connection:`, error);
      throw new Error(`Failed to test ${provider} connection`);
    }
  }

  // Refresh OAuth tokens
  async refreshTokens(provider: string, storageId: string): Promise<boolean> {
    try {
      await apiService.post(`/oauth/${provider}/refresh`, { storageId });
      return true;
    } catch (error) {
      console.error(`Failed to refresh ${provider} tokens:`, error);
      throw new Error(`Failed to refresh ${provider} tokens`);
    }
  }
}

export const oauthService = new OAuthService();