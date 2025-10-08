<template>
  <div class="custom-date-picker-container" :class="cssClass">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <div class="date-input-wrapper" @click="toggleCalendar">
      <input 
        v-model="displayValue" 
        type="text" 
        class="form-control date-display-input"
        :class="inputClass"
        :placeholder="placeholder"
        :id="inputId"
        readonly
        @focus="onFocus"
        @blur="onBlur"
      >
      <i class="fas fa-calendar-alt date-icon"></i>
    </div>
    
    <!-- Custom Calendar Dropdown -->
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
  cssClass: ''
})

const emit = defineEmits<Emits>()

// State
const showCalendar = ref(false)
const showYearPicker = ref(false)
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const displayValue = ref('')

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
}

const closeCalendar = () => {
  showCalendar.value = false
  showYearPicker.value = false
}

const toggleYearPicker = () => {
  showYearPicker.value = !showYearPicker.value
  if (showYearPicker.value) {
    // Scroll to current year when opening year picker
    nextTick(() => {
      const yearButtons = document.querySelectorAll('.year-btn')
      const currentYearBtn = Array.from(yearButtons).find(btn => 
        btn.textContent?.trim() === currentYear.value.toString()
      ) as HTMLElement
      
      if (currentYearBtn) {
        currentYearBtn.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
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

const selectDate = (day: CalendarDay) => {
  if (day.isDisabled) return
  
  selectedDate.value = day.fullDate
  displayValue.value = formatDateForDisplay(day.fullDate)
  
  // Emit the date in dd-mm-yyyy format
  emit('update:modelValue', displayValue.value)
  emit('change', displayValue.value)
  
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
    const date = parseDisplayDate(props.modelValue)
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
</style>
