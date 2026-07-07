<template>
  <div class="notifications-page">
    <div class="container-fluid py-4">
      <div class="card notifications-inbox">
        <div class="card-body p-0">
          <header class="notifications-inbox__header">
            <div>
              <h1 class="notifications-inbox__title">
                <i class="fas fa-bell me-2"></i>
                Notifications
              </h1>
              <p class="notifications-inbox__subtitle mb-0">
                Stay up to date with maintenance reminders and other alerts.
              </p>
            </div>
            <button
              v-if="unreadCount > 0"
              type="button"
              class="btn btn-gray btn-modern btn-sm"
              :disabled="isMarkingAll"
              @click="handleMarkAllAsRead"
            >
              <i class="fas fa-check-double me-1"></i>
              {{ isMarkingAll ? 'Marking...' : 'Mark all as read' }}
            </button>
          </header>

          <div v-if="isLoading" class="notifications-inbox__state">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted mb-0">Loading notifications...</p>
          </div>

          <div v-else-if="notifications.length === 0" class="notifications-inbox__state">
            <i class="fas fa-bell-slash notifications-inbox__empty-icon"></i>
            <h3 class="h5 mb-2">No notifications</h3>
            <p class="text-muted mb-0">
              When something needs your attention, it will appear here.
            </p>
          </div>

          <template v-else>
            <ul class="notifications-inbox__list list-unstyled mb-0">
              <li
                v-for="notification in notifications"
                :key="notification.id"
                class="notifications-inbox__item"
                :class="{ 'notifications-inbox__item--unread': !notification.isRead }"
                tabindex="0"
                @click="onNotificationRowClick(notification)"
                @dblclick="onNotificationRowDoubleClick(notification)"
                @keydown.enter.prevent="onNotificationRowClick(notification)"
                @keydown.space.prevent="onNotificationRowClick(notification)"
              >
                <span v-if="!notification.isRead" class="visually-hidden">Unread. </span>
                <div class="notifications-inbox__icon">
                  <i :class="notificationIcon(notification.type)"></i>
                </div>
                <div class="notifications-inbox__content">
                  <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <h2 class="notifications-inbox__item-title h6 mb-0">{{ notification.title }}</h2>
                    <span class="notifications-inbox__time">{{ formatTime(notification.createdAt) }}</span>
                  </div>
                  <p class="notifications-inbox__message mb-2">{{ notification.message }}</p>
                  <div v-if="notification.data" class="notifications-inbox__meta">
                    <span v-if="notification.data.assetId">
                      <strong>Asset:</strong> {{ notification.data.assetId }}
                    </span>
                    <span v-if="notification.data.maintenanceType">
                      <strong>Type:</strong> {{ notification.data.maintenanceType }}
                    </span>
                    <span v-if="notification.data.scheduledDate">
                      <strong>Due:</strong> {{ formatDate(notification.data.scheduledDate) }}
                    </span>
                  </div>
                  <div class="notifications-inbox__footer">
                    <span
                      class="notifications-inbox__status"
                      :class="notification.isRead ? 'is-read' : 'is-unread'"
                    >
                      {{ notification.isRead ? 'Read' : 'Unread' }}
                    </span>
                    <router-link
                      v-if="getReviewRoute(notification)"
                      :to="getReviewRoute(notification)!"
                      class="btn btn-gray btn-modern btn-sm notifications-inbox__review"
                      @click.stop
                      @dblclick.stop
                    >
                      Review now
                      <i class="fas fa-arrow-right ms-1"></i>
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>

            <div v-if="hasMore" class="notifications-inbox__load-more">
              <button
                type="button"
                class="btn btn-gray btn-modern"
                :disabled="isLoadingMore"
                @click="loadMore"
              >
                <span v-if="isLoadingMore">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Loading...
                </span>
                <span v-else>Load more ({{ notifications.length }} of {{ totalCount }})</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import {
  notificationService,
  NOTIFICATIONS_PAGE_SIZE,
  type Notification,
} from '@/services/api/notificationService'
import { ROUTE_NAMES } from '@/constants/routes'

const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const totalCount = ref(0)
const page = ref(1)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const isMarkingAll = ref(false)
const rowMarkBusyIds = ref<Set<number>>(new Set())

const hasMore = computed(
  () => notifications.value.length < totalCount.value,
)

onMounted(() => {
  void loadPage(1)
})

function beginRowMarkBusy(notification: Notification): boolean {
  if (rowMarkBusyIds.value.has(notification.id)) return false
  rowMarkBusyIds.value = new Set([...rowMarkBusyIds.value, notification.id])
  return true
}

function endRowMarkBusy(notification: Notification) {
  const next = new Set(rowMarkBusyIds.value)
  next.delete(notification.id)
  rowMarkBusyIds.value = next
}

async function loadPage(targetPage: number, append = false) {
  const loading = append ? isLoadingMore : isLoading
  loading.value = true

  try {
    const [result, count] = await Promise.all([
      notificationService.getNotifications({
        page: targetPage,
        limit: NOTIFICATIONS_PAGE_SIZE,
      }),
      append ? Promise.resolve(unreadCount.value) : notificationService.getUnreadCount(),
    ])

    if (append) {
      notifications.value = [...notifications.value, ...result.notifications]
    } else {
      notifications.value = result.notifications
      unreadCount.value = count
    }

    totalCount.value = result.pagination.totalCount
    page.value = targetPage
  } catch (error) {
    console.error('Failed to load notifications:', error)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!hasMore.value || isLoadingMore.value) return
  await loadPage(page.value + 1, true)
}

function notificationIcon(type: Notification['type']) {
  switch (type) {
    case 'MAINTENANCE_REMINDER':
      return 'fas fa-wrench'
    default:
      return 'fas fa-bell'
  }
}

function getReviewRoute(notification: Notification): RouteLocationRaw | null {
  switch (notification.type) {
    case 'MAINTENANCE_REMINDER':
      return { name: ROUTE_NAMES.MAINTENANCE }
    default:
      return null
  }
}

function dispatchNotificationsUpdated() {
  globalThis.dispatchEvent(new Event('notifications-updated'))
}

async function markOneRead(notification: Notification) {
  if (notification.isRead) return
  if (!beginRowMarkBusy(notification)) return

  try {
    await notificationService.markAsRead(notification.id)
    notification.isRead = true
    notification.readAt = new Date().toISOString()
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    dispatchNotificationsUpdated()
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  } finally {
    endRowMarkBusy(notification)
  }
}

async function markOneUnread(notification: Notification) {
  if (!notification.isRead) return
  if (!beginRowMarkBusy(notification)) return

  try {
    await notificationService.markAsUnread(notification.id)
    notification.isRead = false
    notification.readAt = undefined
    unreadCount.value += 1
    dispatchNotificationsUpdated()
  } catch (error) {
    console.error('Failed to mark notification as unread:', error)
  } finally {
    endRowMarkBusy(notification)
  }
}

function onNotificationRowClick(notification: Notification) {
  if (!notification.isRead) {
    void markOneRead(notification)
  }
}

function onNotificationRowDoubleClick(notification: Notification) {
  if (notification.isRead) {
    void markOneUnread(notification)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    isMarkingAll.value = true
    await notificationService.markAllAsRead()
    for (const notification of notifications.value) {
      if (!notification.isRead) {
        notification.isRead = true
        notification.readAt = new Date().toISOString()
      }
    }
    unreadCount.value = 0
    dispatchNotificationsUpdated()
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  } finally {
    isMarkingAll.value = false
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`

  return date.toLocaleDateString()
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
</script>

<style scoped>
.notifications-page {
  min-height: 100%;
  background-color: #f8f9fa;
}

.notifications-inbox {
  border: 1px solid var(--element-gray, #dee2e6);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.notifications-inbox__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--element-gray, #dee2e6);
  background: #fff;
}

.notifications-inbox__title {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--primary-black, #212529);
  margin-bottom: 0.35rem;
}

.notifications-inbox__subtitle {
  color: var(--primary-dark-gray, #6c757d);
  font-size: 0.95rem;
}

.notifications-inbox__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  padding: 2rem;
  text-align: center;
}

.notifications-inbox__empty-icon {
  font-size: 3rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.notifications-inbox__list {
  background: #fff;
}

.notifications-inbox__item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f1f3f4;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notifications-inbox__item:first-child {
  border-top: none;
}

.notifications-inbox__item:hover,
.notifications-inbox__item:focus-visible {
  background-color: #f8f9fa;
  outline: none;
}

.notifications-inbox__item--unread {
  background-color: rgba(102, 126, 234, 0.05);
  border-left: 4px solid var(--secondary-purple, #667eea);
}

.notifications-inbox__icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.12);
  color: var(--secondary-purple, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notifications-inbox__item--unread .notifications-inbox__icon {
  background: var(--secondary-purple, #667eea);
  color: #fff;
}

.notifications-inbox__content {
  flex: 1;
  min-width: 0;
}

.notifications-inbox__item-title {
  color: var(--primary-black, #212529);
  font-weight: 600;
}

.notifications-inbox__time {
  color: #6c757d;
  font-size: 0.875rem;
  white-space: nowrap;
}

.notifications-inbox__message {
  color: #495057;
  line-height: 1.5;
}

.notifications-inbox__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.75rem;
}

.notifications-inbox__footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.notifications-inbox__status {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
}

.notifications-inbox__status.is-unread {
  background: var(--secondary-purple, #667eea);
  color: #fff;
}

.notifications-inbox__status.is-read {
  background: #e9ecef;
  color: #6c757d;
}

.notifications-inbox__review {
  text-decoration: none;
}

.notifications-inbox__load-more {
  display: flex;
  justify-content: center;
  padding: 1.25rem 1.5rem 1.5rem;
  border-top: 1px solid #f1f3f4;
  background: #fff;
}

@media (max-width: 768px) {
  .notifications-inbox__header {
    flex-direction: column;
    align-items: stretch;
  }

  .notifications-inbox__item {
    padding: 1rem;
  }
}
</style>
