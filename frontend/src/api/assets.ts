import { apiService } from './index';
import { API_ENDPOINTS } from '@/constants';
import type { Asset, ApiResponse, PaginatedResponse, FilterOptions } from '@/types';

export const assetsApi = {
  // Get all assets with optional filtering and pagination
  getAssets: async (params?: {
    page?: number;
    limit?: number;
    filters?: FilterOptions;
    search?: string;
  }): Promise<PaginatedResponse<Asset>> => {
    const response = await apiService.get<PaginatedResponse<Asset>>(
      API_ENDPOINTS.ASSETS.LIST,
      { params }
    );
    return response.data;
  },

  // Get single asset by ID
  getAsset: async (id: string): Promise<Asset> => {
    const response = await apiService.get<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSETS.UPDATE(id)
    );
    return response.data.data;
  },

  // Create new asset
  createAsset: async (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> => {
    const response = await apiService.post<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSETS.CREATE,
      asset
    );
    return response.data.data;
  },

  // Update existing asset
  updateAsset: async (id: string, asset: Partial<Asset>): Promise<Asset> => {
    const response = await apiService.put<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSETS.UPDATE(id),
      asset
    );
    return response.data.data;
  },

  // Delete asset
  deleteAsset: async (id: string): Promise<void> => {
    await apiService.delete(API_ENDPOINTS.ASSETS.DELETE(id));
  },

  // Assign asset to employee
  assignAsset: async (assetId: string, employeeId: string): Promise<Asset> => {
    const response = await apiService.post<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSETS.ASSIGN(assetId),
      { employeeId }
    );
    return response.data.data;
  },

  // Unassign asset from employee
  unassignAsset: async (assetId: string): Promise<Asset> => {
    const response = await apiService.post<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSETS.UNASSIGN(assetId)
    );
    return response.data.data;
  },

  // Bulk upload assets
  bulkUpload: async (file: File): Promise<{ success: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiService.post<ApiResponse<{ success: number; errors: string[] }>>(
      `${API_ENDPOINTS.ASSETS.LIST}/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Export assets
  exportAssets: async (format: 'xlsx' | 'pdf' | 'csv', filters?: FilterOptions): Promise<Blob> => {
    const response = await apiService.post<Blob>(
      `${API_ENDPOINTS.ASSETS.LIST}/export`,
      { format, filters },
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
}; 