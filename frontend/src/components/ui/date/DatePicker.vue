<template>
  <div class="custom-date-picker-container" :class="cssClass" ref="rootRef">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <!-- Positioning wrapper for input and calendar only -->
    <div class="date-picker-positioning-wrapper">
      <div class="date-input-wrapper" :class="{ 'disabled': disabled }" @click="!disabled && toggleCalendar()">
        <input 
          v-model="displayValue" 
          type="text" 
          class="form-control date-display-input"
          :class="[inputClass, { 'disabled': disabled }]"
          :placeholder="disabled ? 'Select start date first' : placeholder"
          :id="inputId"
          readonly
          :disabled="disabled"
          @focus="!disabled && onFocus()"
          @blur="!disabled && onBlur()"
        >
        <i class="fas fa-calendar-alt date-icon" :class="{ 'disabled': disabled }"></i>
      </div>
      
      <!-- Custom Calendar Dropdown - Positioned relative to positioning wrapper -->
      <div v-if="showCalendar" class="calendar-dropdown" @click.stop>
      <div class="calendar-header">
        <button type="button" class="nav-btn" @click="previousMonth" :disabled="isMinMonth">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="month-year" @click="toggleYearPicker">
          {{ currentMonthName }} {{ currentYear }}
          <i class="fas fa-chevron-down year-chevron" :class="{ 'rotated': showYearPicker }"></i>
        </div>
        <button type="button" class="nav-btn" @click="nextMonth" :disabled="isMaxMonth">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <!-- Year Picker -->
      <div v-if="showYearPicker" class="year-picker">
        <div class="year-grid">
          <button 
            v-for="year in yearRange" 
            :key="year"
            type="button"
            class="year-btn"
            :class="{ 'selected': year === currentYear }"
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>
      
      <!-- Calendar Grid -->
      <div v-else class="calendar-grid">
        <div class="day-header">
          <div v-for="day in dayNames" :key="day" class="day-name">{{ day }}</div>
        </div>
        <div class="days-grid">
          <button 
            v-for="day in calendarDays" 
            :key="`${day.date}-${day.month}-${day.year}`"
            type="button"
            class="day-btn"
            :class="{
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'selected': day.isSelected,
              'disabled': day.isDisabled
            }"
            :disabled="day.isDisabled"
            @click="selectDate(day)"
          >
            {{ day.date }}
          </button>
        </div>
      </div>
      
        <!-- Calendar Footer -->
        <div class="calendar-footer">
          <button type="button" class="footer-btn clear-btn" @click="clearDate">
            <i class="fas fa-times"></i> Clear
          </button>
          <button type="button" class="footer-btn today-btn" @click="selectToday">
            <i class="fas fa-calendar-day"></i> Today
          </button>
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div v-if="showCalendar" class="calendar-backdrop" @click="closeCalendar"></div>
    
    <div v-if="helpText" class="form-text">{{ helpText }}</div>
    <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  inputId?: string
  errorMessage?: string
  inputClass?: string | string[] | Record<string, boolean> | any
  min?: string
  max?: string
  cssClass?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'dd-mm-yyyy',
  required: false,
  inputId: 'customDatePicker',
  inputClass: '',
  cssClass: '',
  disabled: false
})

const emit = defineEmits<Emits>()

// State
const rootRef = ref<HTMLElement | null>(null)
const showCalendar = ref(false)
const showYearPicker = ref(false)
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const displayValue = ref('')
const lastScrollPosition = ref<number | null>(null)
const instanceId = ref<string>(`datepicker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
// Toggle to enable verbose debug logs when needed
const DEBUG = false

// Day names
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Computed properties
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long' })
})

const yearRange = computed(() => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let i = currentYear - 50; i <= currentYear + 10; i++) {
    years.push(i)
  }
  return years
})

const isMinMonth = computed(() => {
  if (!props.min) return false
  const minDate = new Date(props.min)
  return currentDate.value.getFullYear() === minDate.getFullYear() && 
         currentDate.value.getMonth() <= minDate.getMonth()
})

const isMaxMonth = computed(() => {
  if (!props.max) return false
  const maxDate = new Date(props.max)
  return currentDate.value.getFullYear() === maxDate.getFullYear() && 
         currentDate.value.getMonth() >= maxDate.getMonth()
})

interface CalendarDay {
  date: number
  month: number
  year: number
  fullDate: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
}

const calendarDays = computed((): CalendarDay[] => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days: CalendarDay[] = []
  const current = new Date(startDate)
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = current.getMonth() === month
    const isToday = current.toDateString() === today.toDateString()
    const isSelected = selectedDate.value ? current.toDateString() === selectedDate.value.toDateString() : false
    const isDisabled = isDateDisabled(current)
    
    days.push({
      date: current.getDate(),
      month: current.getMonth(),
      year: current.getFullYear(),
      fullDate: new Date(current),
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

// Methods
const isDateDisabled = (date: Date): boolean => {
  if (props.min && date < new Date(props.min)) return true
  if (props.max && date > new Date(props.max)) return true
  return false
}

const formatDateForDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

const parseDisplayDate = (dateString: string): Date | null => {
  if (!dateString) return null
  
  // Handle dd-mm-yyyy format
  const parts = dateString.split('-')
  if (parts.length === 3) {
    const day = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1
    const year = Number.parseInt(parts[2], 10)
    
    // Validate parsed values
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
      return null
    }
    
    const date = new Date(year, month, day)
    
    // Validate the date is valid
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      return null
    }
    
    return date
  }
  
  return null
}

const toggleCalendar = () => {
  if (props.disabled) return
  
  if (!showCalendar.value) {
    // When opening calendar, set currentDate to selected date or today
    if (selectedDate.value) {
      currentDate.value = new Date(selectedDate.value)
    } else {
      currentDate.value = new Date()
    }
  }
  showCalendar.value = !showCalendar.value
  showYearPicker.value = false
  if (showCalendar.value) {
    // Only ensure visibility if needed - check if calendar would be cut off
    nextTick(() => {
      ensureCalendarVisible()
    })
  }
}

// Constants for visibility calculations
const SAFE_MARGIN = 24 // leave comfortable space above modal footer
const VISIBILITY_MARGIN = 20 // Allow some margin for visibility
const SCROLL_THRESHOLD = 50 // Only scroll if overflow is more than 50px
const EXTRA_CUSHION = 50 // Additional space to prevent tight fit
const RECENT_SCROLL_THRESHOLD = 20 // Minimum scroll difference to consider a new scroll

interface VisibilityMetrics {
  overflowBelow: number
  overflowAbove: number
  isFullyVisible: boolean
}

const getElements = () => {
  const root = rootRef.value as HTMLElement | null
  const container = root?.querySelector('.date-picker-positioning-wrapper') as HTMLElement | null
  const popup = container?.querySelector('.calendar-dropdown') as HTMLElement | null
  const scrollParent = container ? findScrollableAncestor(container) : null
  
  return { container, popup, scrollParent }
}

const calculateVisibilityMetrics = (popup: HTMLElement, scrollParent: HTMLElement): VisibilityMetrics => {
  const popupRect = popup.getBoundingClientRect()
  const parentRect = scrollParent.getBoundingClientRect()
  
  const overflowBelow = popupRect.bottom + SAFE_MARGIN - parentRect.bottom
  const overflowAbove = parentRect.top + SAFE_MARGIN - popupRect.top
  
  const isFullyVisible = 
    popupRect.top >= (parentRect.top - VISIBILITY_MARGIN) && 
    popupRect.bottom <= (parentRect.bottom + VISIBILITY_MARGIN)
    
  return { overflowBelow, overflowAbove, isFullyVisible }
}

const shouldSkipScroll = (scrollParent: HTMLElement): boolean => {
  const currentScrollTop = scrollParent.scrollTop
  if (lastScrollPosition.value === null) return false
  
  const scrollDifference = Math.abs(currentScrollTop - lastScrollPosition.value)
  return scrollDifference < RECENT_SCROLL_THRESHOLD
}

const adjustScroll = (
  scrollParent: HTMLElement, 
  popup: HTMLElement,
  metrics: VisibilityMetrics
) => {
  const isMeaningfullyCutOffBelow = metrics.overflowBelow > SCROLL_THRESHOLD
  const isMeaningfullyCutOffAbove = metrics.overflowAbove > SCROLL_THRESHOLD
  const popupRect = popup.getBoundingClientRect()
  
  if (isMeaningfullyCutOffBelow) {
    const scrollAmount = Math.min(
      metrics.overflowBelow - SCROLL_THRESHOLD + EXTRA_CUSHION, 
      popupRect.height * 0.8 + EXTRA_CUSHION
    )
    scrollParent.scrollTop += scrollAmount
    if (DEBUG) console.log(`[DatePicker ${props.inputId}] Scrolled down by: ${scrollAmount}px`)
  } else if (isMeaningfullyCutOffAbove) {
    const scrollAmount = Math.min(
      metrics.overflowAbove - SCROLL_THRESHOLD + EXTRA_CUSHION, 
      popupRect.height * 0.8 + EXTRA_CUSHION
    )
    scrollParent.scrollTop -= scrollAmount
    if (DEBUG) console.log(`[DatePicker ${props.inputId}] Scrolled up by: ${scrollAmount}px`)
  }
  
  lastScrollPosition.value = scrollParent.scrollTop
}

const checkFallbackScroll = (popup: HTMLElement, scrollParent: HTMLElement) => {
  nextTick(() => {
    const { overflowBelow, overflowAbove } = calculateVisibilityMetrics(popup, scrollParent)
    if (overflowBelow > SCROLL_THRESHOLD || overflowAbove > SCROLL_THRESHOLD) {
      if (DEBUG) console.log(`[DatePicker ${props.inputId}] Using fallback scroll`)
      popup.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }
  })
}

// Main function to ensure calendar visibility
const ensureCalendarVisible = () => {
  const { container, popup, scrollParent } = getElements()
  
  if (!container || !popup || !scrollParent) {
    if (DEBUG) console.log('[DatePicker] Required elements not found')
    return
  }
  
  if (shouldSkipScroll(scrollParent)) {
    if (DEBUG) console.log(`[DatePicker ${props.inputId}] Skipping recent scroll`)
    return
  }
  
  const metrics = calculateVisibilityMetrics(popup, scrollParent)
  
  if (metrics.isFullyVisible) {
    if (DEBUG) console.log('[DatePicker] Calendar already fully visible')
    return
  }
  
  adjustScroll(scrollParent, popup, metrics)
  checkFallbackScroll(popup, scrollParent)
}

// Check if an element can scroll in either direction
const canElementScroll = (el: HTMLElement): boolean => {
  const style = globalThis.getComputedStyle(el)
  const hasScrollableOverflowY = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight
  const hasScrollableOverflowX = /(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth
  return hasScrollableOverflowY || hasScrollableOverflowX
}

// Log element details for debugging
const logElementDetails = (el: HTMLElement, canScroll: boolean) => {
  if (!DEBUG) return
  
  console.log('[DatePicker] Checking element:', {
    tagName: el.tagName,
    className: el.className,
    id: el.id,
    overflowY: globalThis.getComputedStyle(el).overflowY,
    overflowX: globalThis.getComputedStyle(el).overflowX,
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
    canScroll
  })
}

// Find fallback container when no scrollable ancestor is found
const findFallbackContainer = (): HTMLElement | null => {
  const formContainer = document.querySelector('.card-body, .modal-body, .form-container, .scroll-container')
  if (formContainer) {
    DEBUG && console.log('[DatePicker] Using form container as fallback:', formContainer.className, formContainer.id)
    return formContainer as HTMLElement
  }
  
  DEBUG && console.log('[DatePicker] No scrollable ancestor found, using document body')
  return document.scrollingElement as HTMLElement | null
}

// Main function to find scrollable ancestor
const findScrollableAncestor = (start: HTMLElement): HTMLElement | null => {
  let el: HTMLElement | null = start
  let attempts = 0
  const maxAttempts = 10
  
  DEBUG && console.log('[DatePicker] Starting scroll container search from:', el.className, el.id)
  
  while (el && attempts < maxAttempts) {
    const canScroll = canElementScroll(el)
    logElementDetails(el, canScroll)
    
    if (canScroll) {
      DEBUG && console.log('[DatePicker] Found scrollable ancestor:', el.className, el.id)
      return el
    }
    
    el = el.parentElement
    attempts++
  }
  
  return findFallbackContainer()
}

const closeCalendar = () => {
  showCalendar.value = false
  showYearPicker.value = false
  // Reset scroll position tracking when calendar closes
  lastScrollPosition.value = null
}

const toggleYearPicker = () => {
  showYearPicker.value = !showYearPicker.value
  if (showYearPicker.value) {
    // Ensure current year is visible inside year grid without scrolling ancestors
    nextTick(() => {
      const root = rootRef.value as HTMLElement | null
      if (!root) return
      const yearGrid = root.querySelector('.year-grid') as HTMLElement | null
      const currentYearBtn = Array.from((root.querySelectorAll('.year-btn') || []) as NodeListOf<Element>)
        .find(btn => btn.textContent?.trim() === currentYear.value.toString()) as HTMLElement | undefined

      if (!yearGrid || !currentYearBtn) return

      const gridRect = yearGrid.getBoundingClientRect()
      const btnRect = currentYearBtn.getBoundingClientRect()

      const isBelow = btnRect.bottom > gridRect.bottom
      const isAbove = btnRect.top < gridRect.top

      if (DEBUG) console.log(`[DatePicker ${props.inputId}] Year picker visibility`, {
        grid: { top: gridRect.top, bottom: gridRect.bottom, scrollTop: yearGrid.scrollTop, h: yearGrid.clientHeight },
        btn: { top: btnRect.top, bottom: btnRect.bottom, h: currentYearBtn.offsetHeight },
        isBelow,
        isAbove
      })

      if (isBelow) {
        const delta = btnRect.bottom - gridRect.bottom + Math.floor(currentYearBtn.offsetHeight / 2)
        yearGrid.scrollTop += delta
      } else if (isAbove) {
        const delta = gridRect.top - btnRect.top + Math.floor(currentYearBtn.offsetHeight / 2)
        yearGrid.scrollTop -= delta
      }
    })
  }
}

const previousMonth = () => {
  if (isMinMonth.value) return
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  if (isMaxMonth.value) return
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectYear = (year: number) => {
  currentDate.value = new Date(year, currentDate.value.getMonth(), 1)
  showYearPicker.value = false
}

const formatDateIso = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const parseIsoDate = (value: string): Date | null => {
  if (!value) return null
  // Expecting YYYY-MM-DD
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const year = Number.parseInt(m[1], 10)
  const month = Number.parseInt(m[2], 10) - 1
  const day = Number.parseInt(m[3], 10)
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
  return date
}

const selectDate = (day: CalendarDay) => {
  if (day.isDisabled) return
  
  selectedDate.value = day.fullDate
  displayValue.value = formatDateForDisplay(day.fullDate)
  
  // Emit the date in ISO (YYYY-MM-DD) format for modelValue/change
  const iso = formatDateIso(day.fullDate)
  emit('update:modelValue', iso)
  emit('change', iso)
  
  closeCalendar()
}

const selectToday = () => {
  const today = new Date()
  if (!isDateDisabled(today)) {
    const todayDay: CalendarDay = {
      date: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
      fullDate: today,
      isCurrentMonth: true,
      isToday: true,
      isSelected: false,
      isDisabled: false
    }
    selectDate(todayDay)
  }
}

const clearDate = () => {
  selectedDate.value = null
  displayValue.value = ''
  emit('update:modelValue', '')
  emit('change', '')
  closeCalendar()
}

const onFocus = () => {
  emit('focus')
}

const onBlur = () => {
  emit('blur')
}

// Initialize from modelValue
const initializeFromModel = () => {
  if (props.modelValue) {
    // Accept both ISO (YYYY-MM-DD) and display (dd-mm-yyyy) formats
    const date = parseIsoDate(props.modelValue) || parseDisplayDate(props.modelValue)
    if (date) {
      selectedDate.value = date
      displayValue.value = formatDateForDisplay(date)
      currentDate.value = new Date(date)
    }
  } else {
    // Clear the internal state when modelValue is empty
    selectedDate.value = null
    displayValue.value = ''
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== displayValue.value) {
    initializeFromModel()
  }
}, { immediate: true })

// Handle clicks outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.custom-date-picker-container')) {
    closeCalendar()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  initializeFromModel()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom Date Picker styles will be added to filters.css */

/* Disabled state styling */
.date-input-wrapper.disabled {
  opacity: 0.6;
  cursor: default;
  background-color: #f8f9fa;
}

.date-input-wrapper.disabled .form-control {
  background-color: #e9ecef !important;
  color: #6c757d !important;
  cursor: default;
  border-color: #dee2e6;
}

.date-input-wrapper.disabled .date-icon {
  color: #6c757d !important;
  cursor: default;
}

.date-input-wrapper.disabled:hover {
  border-color: #dee2e6;
  box-shadow: none;
}

/* Ensure disabled input styling */
.form-control.disabled {
  background-color: #e9ecef !important;
  color: #6c757d !important;
  cursor: default;
  border-color: #dee2e6;
}

.form-control.disabled:focus {
  border-color: #dee2e6;
  box-shadow: none;
}

/* Ensure error message inside this component is visible regardless of parent scoped styles */
.invalid-feedback {
  display: block;
}
</style>
