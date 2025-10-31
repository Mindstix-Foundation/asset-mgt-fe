import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

/**
 * Use this composable in any view to automatically show a toast
 * when the route contains toast query params and then clear them.
 *
 * Supported query params:
 * - toastType: 'success' | 'error' | 'warning' | 'info'
 * - toastTitle: string
 * - toastMessage: string
 */
export function useRouteToast(): void {
  const route = useRoute()
  const router = useRouter()
  const toastStore = useToastStore()

  const tryShowFromQuery = () => {
    const toastType = route.query.toastType as string | undefined
    const toastTitle = route.query.toastTitle as string | undefined
    const toastMessage = route.query.toastMessage as string | undefined

    if (toastType && toastTitle && toastMessage) {
      if (toastType === 'success') toastStore.showSuccess(toastTitle, toastMessage)
      else if (toastType === 'error') toastStore.showError(toastTitle, toastMessage)
      else if (toastType === 'warning') toastStore.showWarning(toastTitle, toastMessage)
      else toastStore.showInfo(toastTitle, toastMessage)

      // Clean the query to avoid re-trigger
      router.replace({ path: route.path })
    }
  }

  onMounted(() => {
    tryShowFromQuery()
  })

  watch(() => route.query, () => {
    tryShowFromQuery()
  }, { deep: true })
}


