import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
  show: boolean
  title: string
  message: string
  type: ToastType
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const show = ref(false)
  const title = ref('')
  const message = ref('')
  const type = ref<ToastType>('info')
  const duration = ref(3000) // Default 3 seconds

  let timeoutId: number | null = null

  const showToast = (
    toastTitle: string,
    toastMessage: string,
    toastType: ToastType = 'info',
    toastDuration?: number
  ) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    title.value = toastTitle
    message.value = toastMessage
    type.value = toastType
    duration.value = toastDuration || 3000
    show.value = true

    // Auto-hide toast after duration
    if (duration.value > 0) {
      timeoutId = setTimeout(() => {
        hideToast()
      }, duration.value)
    }
  }

  const hideToast = () => {
    show.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const showSuccess = (title: string, message: string, duration?: number) => {
    showToast(title, message, 'success', duration)
  }

  const showError = (title: string, message: string, duration?: number) => {
    showToast(title, message, 'error', duration)
  }

  const showWarning = (title: string, message: string, duration?: number) => {
    showToast(title, message, 'warning', duration)
  }

  const showInfo = (title: string, message: string, duration?: number) => {
    showToast(title, message, 'info', duration)
  }

  return {
    // State
    show,
    title,
    message,
    type,
    duration,
    // Actions
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}) 