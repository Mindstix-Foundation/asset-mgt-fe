import { apiService, type ApiResponse } from '../core/apiClient';

export interface Notification {
  id: number;
  type: 'MAINTENANCE_REMINDER';
  title: string;
  message: string;
  isRead: boolean;
  data?: {
    maintenanceId?: number;
    assetId?: string;
    maintenanceType?: string;
    scheduledDate?: string;
  };
  createdAt: string;
  readAt?: string;
}

export interface NotificationsPagination {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface NotificationsQuery {
  page?: number;
  limit?: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAsReadResponse {
  success: boolean;
}

export interface MarkAllAsReadResponse {
  count: number;
  message: string;
}

const PAGE_SIZE = 20;

class NotificationService {
  private readonly baseUrl = '/notifications';

  async getNotifications(
    params: NotificationsQuery = {},
  ): Promise<{ notifications: Notification[]; pagination: NotificationsPagination }> {
    try {
      const query = new URLSearchParams();
      const page = params.page ?? 1;
      const limit = params.limit ?? PAGE_SIZE;
      query.append('page', String(page));
      query.append('limit', String(limit));

      const response: ApiResponse<{
        notifications: Notification[];
        pagination: NotificationsPagination;
      }> = await apiService.get(`${this.baseUrl}?${query.toString()}`);

      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiService.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`);
      return response.count;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: number): Promise<boolean> {
    try {
      const response = await apiService.post<MarkAsReadResponse>(`${this.baseUrl}/mark-as-read`, {
        notificationId,
      });
      return response.success;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  async markAsUnread(notificationId: number): Promise<boolean> {
    try {
      const response = await apiService.post<MarkAsReadResponse>(`${this.baseUrl}/mark-as-unread`, {
        notificationId,
      });
      return response.success;
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<number> {
    try {
      const response = await apiService.post<MarkAllAsReadResponse>(`${this.baseUrl}/mark-all-as-read`);
      return response.count;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
export { PAGE_SIZE as NOTIFICATIONS_PAGE_SIZE };
