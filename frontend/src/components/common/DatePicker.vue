<template>
  <div class="date-picker-container">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <div class="date-input-container" @click="showDatePicker">
      <input 
        v-model="displayValue" 
        type="text" 
        class="form-control date-display"
        :class="inputClass"
        :placeholder="placeholder"
        :id="inputId"
        readonly
        @focus="onFocus"
        @blur="onBlur"
      >
      <input 
        v-model="internalValue" 
        type="date" 
        class="form-control date-picker"
        @change="onDateChange"
        ref="datePicker"
      >
      <i class="fas fa-calendar-alt date-icon"></i>
    </div>
    
    <div v-if="helpText" class="form-text">{{ helpText }}</div>
    <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  inputId?: string
  errorMessage?: string
  inputClass?: string | string[] | Record<string, boolean> | any
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
  inputId: 'datePicker',
  inputClass: ''
})

const emit = defineEmits<Emits>()

const datePicker = ref<HTMLInputElement | null>(null)
const internalValue = ref('')
const displayValue = ref('')

// Convert yyyy-mm-dd to dd-mm-yyyy
const convertDateToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Convert dd-mm-yyyy to yyyy-mm-dd
const convertDDMMYYYYToDate = (dateString: string): Date | null => {
  if (!dateString) return null
  
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  
  const day = Number.parseInt(parts[0], 10)
  const month = Number.parseInt(parts[1], 10) - 1 // JavaScript months are 0-indexed
  const year = Number.parseInt(parts[2], 10)
  
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null
  
  const date = new Date(year, month, day)
  
  // Validate the date is valid
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null
  }
  
  return date
}

// Initialize display value from model value
const initializeDisplayValue = () => {
  if (props.modelValue) {
    const date = new Date(props.modelValue)
    if (!Number.isNaN(date.getTime())) {
      displayValue.value = convertDateToDDMMYYYY(date)
      internalValue.value = props.modelValue
    }
  }
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== displayValue.value) {
    // Check if the value is already in dd-mm-yyyy format
    if (/^\d{2}-\d{2}-\d{4}$/.test(newValue)) {
      // Already in dd-mm-yyyy format
      displayValue.value = newValue
      // Convert to yyyy-mm-dd for internal value
      const parts = newValue.split('-')
      if (parts.length === 3) {
        internalValue.value = `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    } else {
      // Assume it's in ISO format (yyyy-mm-dd) or a date string
      const date = new Date(newValue)
      if (!Number.isNaN(date.getTime())) {
        displayValue.value = convertDateToDDMMYYYY(date)
        internalValue.value = newValue
      }
    }
  } else if (!newValue) {
    displayValue.value = ''
    internalValue.value = ''
  }
}, { immediate: true })

// Methods
const showDatePicker = () => {
  if (datePicker.value) {
    datePicker.value.showPicker()
  }
}

const onDateChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value) {
    const date = new Date(input.value)
    const ddMMYYYY = convertDateToDDMMYYYY(date)
    displayValue.value = ddMMYYYY
    internalValue.value = input.value
    
    // Emit the dd-mm-yyyy format for form data
    emit('update:modelValue', ddMMYYYY)
    emit('change', ddMMYYYY)
  } else {
    displayValue.value = ''
    internalValue.value = ''
    
    emit('update:modelValue', '')
    emit('change', '')
  }
}

const onFocus = () => {
  emit('focus')
}

const onBlur = () => {
  emit('blur')
}

// Initialize on mount
nextTick(() => {
  initializeDisplayValue()
})
</script>

<style scoped>
.date-picker-container {
  position: relative;
}

.date-input-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.date-display {
  font-family: inherit;
  cursor: pointer;
  background-color: white;
  border-radius: 0.5rem !important;
  height: 3rem !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  border: 2px solid var(--element-gray) !important;
  transition: all 0.2s ease !important;
  color: #212529 !important;
  box-sizing: border-box !important;
}

.date-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: -1;
  border-radius: 0.375rem !important;
  pointer-events: none;
}

.date-icon {
  position: absolute;
  right: 10px;
  color: #6c757d;
  cursor: pointer;
  z-index: 1;
  pointer-events: none;
}

.date-input-container:hover .date-icon {
  color: #495057;
}

.date-display:hover {
  border-color: var(--primary-mid-gray) !important;
}

.date-display:focus {
  border-color: #331FEA !important;
  box-shadow: 0 0 0 3px rgba(51, 31, 234, 0.1) !important;
  outline: 2px solid transparent !important;
  background-color: #fff !important;
}

/* Form Controls - Match unified form styles */
.form-control {
  border-radius: 0.5rem !important;
  height: 3rem !important;
  padding: 0.75rem 1rem !important;
  font-size: 1rem !important;
  border: 2px solid var(--element-gray) !important;
  transition: all 0.2s ease !important;
  background: #fff !important;
  color: #212529 !important;
  box-sizing: border-box !important;
}

/* Date Input Validation - Match unified form styles */
.form-control.is-invalid {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
  animation: subtle-shake 0.3s ease-in-out !important;
}

.form-control.is-valid {
  border-color: #21AF65 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
}

/* Validation animation */
@keyframes subtle-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.form-control[placeholder="dd-mm-yyyy"] {
  font-family: inherit;
}
</style>
