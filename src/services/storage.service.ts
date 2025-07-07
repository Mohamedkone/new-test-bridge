// src/services/storage.service.ts
import { apiService } from './api';
import { ENV } from '../utils/constants';

export interface StorageAccount {
  id: string;
  name: string;
  userId: string;
  storageType: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalSize: number;
    usedSize: number;
    fileCount: number;
  };
}

export interface CreateStorageAccountData {
  name: string;
  userId: string;
  storageType: string;
  credentials: {
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucketName?: string;
    region?: string;
    [key: string]: any;
  };
}

export interface StorageStats {
  totalSize: number;
  usedSize: number;
  fileCount: number;
  lastUpdated: string;
}

export interface OAuthStorageAccount {
  id: string;
  platform: string;
  alias: string;
  userId: string;
  isConnected: boolean;
}

export class StorageService {
  // Get storage accounts for a user
  async getStorageAccounts(userId: string): Promise<StorageAccount[]> {
    try {
      const response = await apiService.get(`/storage/user/${userId}`);
      return response.data?.storageAccounts || [];
    } catch (error) {
      console.error('Failed to fetch storage accounts:', error);
      throw new Error('Failed to fetch storage accounts');
    }
  }

  // Get OAuth storage accounts for a user
  async getOAuthStorageAccounts(userId: string): Promise<OAuthStorageAccount[]> {
    try {
      const response = await apiService.get(`/oauth/storage/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch OAuth storage accounts:', error);
      return []; // Return empty array instead of throwing
    }
  }

  // Create new storage account
  async createStorageAccount(data: CreateStorageAccountData): Promise<StorageAccount> {
    try {
      const response = await apiService.post('/storage', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create storage account:', error);
      throw new Error('Failed to create storage account');
    }
  }

  // Delete storage account
  async deleteStorageAccount(id: string): Promise<boolean> {
    try {
      await apiService.delete(`/storage/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete storage account:', error);
      throw new Error('Failed to delete storage account');
    }
  }

  // Delete multiple storage accounts
  async deleteMultipleStorageAccounts(ids: string[]): Promise<boolean> {
    try {
      const deletePromises = ids.map(id => this.deleteStorageAccount(id));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Failed to delete storage accounts:', error);
      throw new Error('Failed to delete storage accounts');
    }
  }

  // Test storage connection
  async testConnection(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiService.post(`/storage/${id}/test`);
      return response.data;
    } catch (error) {
      console.error('Failed to test storage connection:', error);
      throw new Error('Failed to test storage connection');
    }
  }

  // Update storage credentials
  async updateCredentials(id: string, credentials: any): Promise<boolean> {
    try {
      await apiService.put(`/storage/${id}/credentials`, { credentials });
      return true;
    } catch (error) {
      console.error('Failed to update storage credentials:', error);
      throw new Error('Failed to update storage credentials');
    }
  }

  // Get storage stats
  async getStorageStats(id: string): Promise<StorageStats> {
    try {
      const response = await apiService.get(`/storage/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      throw new Error('Failed to get storage stats');
    }
  }

  // Set default storage account
  async setDefaultStorage(id: string, userId: string): Promise<boolean> {
    try {
      await apiService.put(`/storage/${id}/default/${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to set default storage:', error);
      throw new Error('Failed to set default storage');
    }
  }

  // Get vault storage details
  async getVaultStorage(userId: string): Promise<any> {
    try {
      const response = await apiService.get(`/vault/storage/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get vault storage:', error);
      return null;
    }
  }
}

export const storageService = new StorageService();