<template>
  <div class="notification-dropdown" ref="dropdownRef">
    <!-- Notification Bell Icon -->
    <div 
      class="notification-icon" 
      @click="toggleDropdown"
      :class="{ 'has-notifications': unreadCount > 0 }"
    >
      <i class="fas fa-bell"></i>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </div>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="notification-dropdown-menu"
      :class="{ 'show': isOpen }"
    >
      <!-- Header -->
      <div class="notification-header">
        <h6 class="notification-title">Notifications</h6>
        <button 
          v-if="unreadCount > 0" 
          @click="handleMarkAllAsRead" 
          class="btn-mark-all"
          :disabled="isMarkingAll"
        >
          {{ isMarkingAll ? 'Marking...' : 'Mark all as read' }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="notification-loading">
        <div class="spinner-border spinner-border-sm">
          <span class="visually-hidden">Loading...</span>
        </div>
        <output class="ms-2">Loading notifications...</output>
      </div>

      <!-- Empty State -->
      <div v-else-if="notifications.length === 0" class="notification-empty">
        <i class="fas fa-bell-slash"></i>
        <p>No notifications yet</p>
      </div>

      <!-- Notifications List -->
      <div v-else class="notification-list">
        <div
          v-for="notification in displayNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.isRead }"
          @click="handleNotificationClick(notification.id)"
        >
          <div class="notification-icon-wrapper">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <h6 class="notification-item-title">{{ notification.title }}</h6>
            <p class="notification-item-message">{{ notification.message }}</p>
            <small class="notification-time">{{ formatTime(notification.createdAt) }}</small>
          </div>
          <div v-if="!notification.isRead" class="notification-unread-dot"></div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifications.length > 0" class="notification-footer">
        <router-link 
          to="/app/notifications" 
          class="btn-view-all"
          @click="closeDropdown"
        >
          View all notifications
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
const isOpen = ref(false);
const isMarkingAll = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Computed
const hasNotifications = computed(() => notifications.value.length > 0);
const displayNotifications = computed(() => notifications.value.slice(0, 10)); // Show only latest 10

// Methods
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleNotificationClick = async (notificationId: number) => {
  await markAsRead(notificationId);
  // Close dropdown after clicking on notification
  closeDropdown();
};

const handleMarkAsRead = async (notificationId: number) => {
  await markAsRead(notificationId);
};

const handleMarkAllAsRead = async () => {
  try {
    isMarkingAll.value = true;
    await markAllAsRead();
    // Close dropdown after marking all as read
    closeDropdown();
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

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // The composable handles loading notifications automatically
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.notification-dropdown {
  position: relative;
  display: inline-block;
}

.notification-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
}

.notification-icon:hover {
  background-color: #e9ecef;
  color: #495057;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-icon.has-notifications {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.notification-icon.has-notifications:hover {
  background-color: #5469d4;
  border-color: #5469d4;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.notification-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  max-height: 500px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.notification-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.notification-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.btn-mark-all {
  background: none;
  border: none;
  color: #667eea;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.btn-mark-all:hover:not(:disabled) {
  background-color: rgba(102, 126, 234, 0.1);
}

.btn-mark-all:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.notification-loading,
.notification-empty {
  padding: 40px 20px;
  text-align: center;
  color: #6c757d;
}

.notification-empty i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: rgba(102, 126, 234, 0.05);
}

.notification-item.unread:hover {
  background-color: rgba(102, 126, 234, 0.1);
}

.notification-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-item.unread .notification-icon-wrapper {
  background-color: #667eea;
  color: white;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-item-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  line-height: 1.3;
}

.notification-item-message {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #6c757d;
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  color: #adb5bd;
  font-size: 12px;
}

.notification-unread-dot {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 8px;
  height: 8px;
  background-color: #667eea;
  border-radius: 50%;
}

.notification-footer {
  padding: 16px 20px;
  border-top: 1px solid #dee2e6;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.btn-view-all {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  display: inline-block;
}

.btn-view-all:hover {
  background-color: rgba(102, 126, 234, 0.1);
  text-decoration: none;
}

/* Scrollbar styling */
.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Mobile responsiveness */
@media (max-width: 576px) {
  .notification-dropdown-menu {
    width: 300px;
    right: -50px;
  }
}
</style>
