<template>
  <button
    type="button"
    class="notification-bell"
    :class="{ 'notification-bell--active': isOnNotificationsPage }"
    :aria-label="isOnNotificationsPage ? 'Close notifications' : 'Open notifications'"
    :title="isOnNotificationsPage ? 'Back to previous page' : 'Notifications'"
    @click="handleClick"
  >
    <i class="fas fa-bell"></i>
    <span v-if="unreadCount > 0" class="notification-bell__badge">{{ unreadCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notificationService } from '@/services/api/notificationService'
import { ROUTE_NAMES } from '@/constants/routes'

const route = useRoute()
const router = useRouter()

const unreadCount = ref(0)
const returnPath = ref<string | null>(null)

const isOnNotificationsPage = computed(() => route.name === ROUTE_NAMES.NOTIFICATIONS)

async function loadUnreadCount() {
  try {
    unreadCount.value = await notificationService.getUnreadCount()
  } catch {
    unreadCount.value = 0
  }
}

function handleClick() {
  if (isOnNotificationsPage.value) {
    const back = returnPath.value
    returnPath.value = null
    if (back) {
      router.push(back).catch(() => {})
    } else {
      router.push({ name: ROUTE_NAMES.DASHBOARD }).catch(() => {})
    }
    return
  }

  returnPath.value = route.fullPath
  router.push({ name: ROUTE_NAMES.NOTIFICATIONS }).catch(() => {})
}

function onNotificationsUpdated() {
  void loadUnreadCount()
}

watch(
  () => route.name,
  (name, prev) => {
    if (prev === ROUTE_NAMES.NOTIFICATIONS && name !== ROUTE_NAMES.NOTIFICATIONS) {
      returnPath.value = null
      void loadUnreadCount()
    }
  },
)

onMounted(() => {
  void loadUnreadCount()
  globalThis.addEventListener('notifications-updated', onNotificationsUpdated)
})

onUnmounted(() => {
  globalThis.removeEventListener('notifications-updated', onNotificationsUpdated)
})
</script>

<style scoped>
.notification-bell {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--primary-dark-gray, #495057);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.notification-bell:hover,
.notification-bell--active {
  background-color: rgba(102, 126, 234, 0.1);
  color: var(--secondary-purple, #667eea);
}

.notification-bell__badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background-color: var(--secondary-red, #dc3545);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}
</style>
