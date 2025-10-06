import { ref, onMounted, onUnmounted } from 'vue';
import { notificationService, type Notification } from '@/services/notificationService';

// Singleton state - shared across all instances
const globalNotifications = ref<Notification[]>([]);
const globalUnreadCount = ref(0);
const globalIsLoading = ref(false);
const globalError = ref<string | null>(null);
let instanceCount = 0;

export function useNotifications() {
  const notifications = globalNotifications;
  const unreadCount = globalUnreadCount;
  const isLoading = globalIsLoading;
  const error = globalError;

  const loadNotifications = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const [notificationsData, unreadCountData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);
      
      notifications.value = notificationsData;
      unreadCount.value = unreadCountData;
    } catch (err: any) {
      // Handle 401 (Unauthorized) gracefully - user might not be logged in
      if (err?.response?.status === 401) {
        console.log('User not authenticated, skipping notification load');
        notifications.value = [];
        unreadCount.value = 0;
        return;
      }
      
      error.value = 'Failed to load notifications';
      console.error('Failed to load notifications:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state immediately
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
      
      // No need to call loadNotifications() - local state update is sufficient
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const count = await notificationService.markAllAsRead();
      
      // Update local state immediately
      for (const notification of notifications.value) {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
        }
      }
      unreadCount.value = 0;
      
      // No need to call loadNotifications() - local state update is sufficient
      return count;
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  };

  // Polling removed - notifications are only generated once daily at 1 PM
  // No need for continuous polling since new notifications won't appear throughout the day

  const refresh = () => {
    return loadNotifications();
  };

  // Load notifications only when component mounts
  onMounted(() => {
    instanceCount++;
    
    // Only load notifications on first instance (no polling needed)
    if (instanceCount === 1) {
      loadNotifications();
    }
  });

  // Clean up when component unmounts
  onUnmounted(() => {
    instanceCount--;
    
    // Reset counter when all instances are unmounted
    if (instanceCount <= 0) {
      instanceCount = 0;
    }
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}
