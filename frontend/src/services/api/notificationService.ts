import { apiService } from './apiClient';

export interface Notification {
  id: number;
  type: 'MAINTENANCE_REMINDER' | 'MAINTENANCE_OVERDUE' | 'ASSET_ASSIGNED' | 'ASSET_RETURNED' | 'SYSTEM_ALERT';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
  readAt?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
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

class NotificationService {
  private readonly baseUrl = '/notifications';

  async getNotifications(): Promise<Notification[]> {
    try {
      return await apiService.get<Notification[]>(this.baseUrl);
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
