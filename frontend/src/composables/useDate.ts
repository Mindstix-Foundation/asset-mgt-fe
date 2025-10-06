/**
 * Date Composable
 * Reactive date utilities and formatting
 */

import { ref, computed, type Ref } from 'vue'
import { parseApiDate, formatDateOnly, formatDateTime, formatDateForInput } from '@/utils/date'

/**
 * Composable for reactive date handling
 * @param initialDate - Optional initial date value
 * @returns Object with date utilities
 */
export function useDate(initialDate?: string | Date | null) {
  const date: Ref<Date | null> = ref(initialDate ? parseApiDate(initialDate) : null)

  // Formatted date (display format)
  const formatted = computed(() => (date.value ? formatDateOnly(date.value) : ''))

  // Formatted date with time
  const formattedDateTime = computed(() => (date.value ? formatDateTime(date.value) : ''))

  // Formatted for input fields
  const formattedForInput = computed(() => (date.value ? formatDateForInput(date.value) : ''))

  // Set new date value
  const setDate = (newDate: string | Date | null | undefined) => {
    date.value = newDate ? parseApiDate(newDate) : null
  }

  // Reset date to null
  const clear = () => {
    date.value = null
  }

  // Check if date is valid
  const isValid = computed(() => date.value !== null && !isNaN(date.value.getTime()))

  // Check if date is in the past
  const isPast = computed(() => {
    if (!date.value) return false
    return date.value < new Date()
  })

  // Check if date is in the future
  const isFuture = computed(() => {
    if (!date.value) return false
    return date.value > new Date()
  })

  // Check if date is today
  const isToday = computed(() => {
    if (!date.value) return false
    const today = new Date()
    return (
      date.value.getDate() === today.getDate() &&
      date.value.getMonth() === today.getMonth() &&
      date.value.getFullYear() === today.getFullYear()
    )
  })

  // Get days from now
  const daysFromNow = computed(() => {
    if (!date.value) return null
    const today = new Date()
    const diffTime = date.value.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  return {
    // State
    date,

    // Computed
    formatted,
    formattedDateTime,
    formattedForInput,
    isValid,
    isPast,
    isFuture,
    isToday,
    daysFromNow,

    // Methods
    setDate,
    clear,
  }
}

/**
 * Composable for date range handling
 * @param initialStartDate - Optional initial start date
 * @param initialEndDate - Optional initial end date
 */
export function useDateRange(initialStartDate?: string | Date | null, initialEndDate?: string | Date | null) {
  const startDate = useDate(initialStartDate)
  const endDate = useDate(initialEndDate)

  // Check if date range is valid
  const isValidRange = computed(() => {
    if (!startDate.date.value || !endDate.date.value) return false
    return startDate.date.value <= endDate.date.value
  })

  // Get number of days in range
  const daysInRange = computed(() => {
    if (!startDate.date.value || !endDate.date.value) return null
    const diffTime = endDate.date.value.getTime() - startDate.date.value.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  // Clear both dates
  const clearRange = () => {
    startDate.clear()
    endDate.clear()
  }

  return {
    startDate,
    endDate,
    isValidRange,
    daysInRange,
    clearRange,
  }
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 days")
 */
export function useRelativeTime(date: string | Date | null | undefined) {
  const parsedDate = parseApiDate(date)
  
  if (!parsedDate) return 'Invalid date'

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export default useDate

