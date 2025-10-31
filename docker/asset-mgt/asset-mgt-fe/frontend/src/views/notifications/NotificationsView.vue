<template>
  <div class="notifications-page">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="page-title">Notifications</h1>
            <p class="page-subtitle">Stay updated with your maintenance schedules and system alerts</p>
          </div>
          <div class="header-actions">
            <button 
              v-if="unreadCount > 0" 
              @click="handleMarkAllAsRead" 
              class="btn btn-outline-primary"
              :disabled="isMarkingAll"
            >
              <i class="fas fa-check-double me-2"></i>
              {{ isMarkingAll ? 'Marking...' : 'Mark all as read' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary">
          <output class="visually-hidden">Loading...</output>
        </div>
        <p class="mt-3 text-muted">Loading notifications...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="empty-state">
        <div class="empty-state-content">
          <i class="fas fa-bell-slash empty-state-icon"></i>
          <h3 class="empty-state-title">No notifications yet</h3>
          <p class="empty-state-description">
            You'll receive notifications here for maintenance reminders, asset assignments, and system alerts.
          </p>
        </div>
      </div>

      <!-- Notifications List -->
      <div v-else class="notifications-container">
        <div class="row">
          <div class="col-12">
            <div class="notifications-list">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="notification-card"
                :class="{ 'unread': !notification.isRead }"
                @click="handleMarkAsRead(notification.id)"
              >
                <div class="notification-card-body">
                  <div class="notification-icon-wrapper">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-header">
                      <h5 class="notification-title">{{ notification.title }}</h5>
                      <div class="notification-meta">
                        <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                        <span v-if="!notification.isRead" class="notification-status unread">Unread</span>
                        <span v-else class="notification-status read">Read</span>
                      </div>
                    </div>
                    <p class="notification-message">{{ notification.message }}</p>
                    <div v-if="notification.data" class="notification-data">
                      <div v-if="notification.data.maintenanceId" class="data-item">
                        <strong>Maintenance ID:</strong> {{ notification.data.maintenanceId }}
                      </div>
                      <div v-if="notification.data.assetId" class="data-item">
                        <strong>Asset ID:</strong> {{ notification.data.assetId }}
                      </div>
                      <div v-if="notification.data.maintenanceType" class="data-item">
                        <strong>Type:</strong> {{ notification.data.maintenanceType }}
                      </div>
                      <div v-if="notification.data.scheduledDate" class="data-item">
                        <strong>Scheduled Date:</strong> {{ formatDate(notification.data.scheduledDate) }}
                      </div>
                    </div>
                  </div>
                  <div class="notification-actions">
                    <button 
                      v-if="!notification.isRead" 
                      @click.stop="handleMarkAsRead(notification.id)"
                      class="btn btn-sm btn-outline-primary"
                    >
                      Mark as read
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNotifications } from '@/composables/useNotifications';

// Use the notifications composable
const {
  notifications,
  unreadCount,
  isLoading,
  markAsRead,
  markAllAsRead,
} = useNotifications();

// Local state
const isMarkingAll = ref(false);

// Methods
const handleMarkAsRead = async (notificationId: number) => {
  await markAsRead(notificationId);
};

const handleMarkAllAsRead = async () => {
  try {
    isMarkingAll.value = true;
    await markAllAsRead();
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  } finally {
    isMarkingAll.value = false;
  }
};

const getNotificationIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    MAINTENANCE_REMINDER: 'fas fa-wrench',
    MAINTENANCE_OVERDUE: 'fas fa-exclamation-triangle',
    ASSET_ASSIGNED: 'fas fa-hand-holding',
    ASSET_RETURNED: 'fas fa-undo',
    SYSTEM_ALERT: 'fas fa-info-circle',
  };
  return iconMap[type] || 'fas fa-bell';
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  
  return date.toLocaleDateString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// The composable handles loading notifications automatically
</script>

<style scoped>
.notifications-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem 0;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-state-content {
  text-align: center;
  max-width: 400px;
}

.empty-state-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1.5rem;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1rem;
}

.empty-state-description {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0;
}

.notifications-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.notifications-list {
  padding: 0;
}

.notification-card {
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-card:last-child {
  border-bottom: none;
}

.notification-card:hover {
  background-color: #f8f9fa;
}

.notification-card.unread {
  background-color: rgba(102, 126, 234, 0.05);
  border-left: 4px solid #667eea;
}

.notification-card.unread:hover {
  background-color: rgba(102, 126, 234, 0.1);
}

.notification-card-body {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  gap: 1rem;
}

.notification-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.2rem;
  color: #6c757d;
}

.notification-card.unread .notification-icon-wrapper {
  background-color: #667eea;
  color: white;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.notification-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  line-height: 1.3;
}

.notification-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.notification-time {
  font-size: 0.875rem;
  color: #6c757d;
}

.notification-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.notification-status.unread {
  background-color: #667eea;
  color: white;
}

.notification-status.read {
  background-color: #e9ecef;
  color: #6c757d;
}

.notification-message {
  color: #495057;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.notification-data {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 0.5rem;
}

.data-item {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #495057;
}

.data-item:last-child {
  margin-bottom: 0;
}

.data-item strong {
  color: #212529;
  margin-right: 0.5rem;
}

.notification-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .page-header {
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .notification-card-body {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .notification-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .notification-meta {
    align-items: flex-start;
  }
}
</style>
