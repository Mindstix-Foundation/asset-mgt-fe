<template>
  <div class="notes-textarea-container">
    <label v-if="showLabel" :for="inputId" class="form-label">
      {{ label }} 
      <span v-if="required" class="text-danger">*</span>
      <span v-else-if="!readonly" class="text-muted">(Optional)</span>
    </label>
    
    <textarea 
      :id="inputId"
      ref="textareaRef"
      class="form-control auto-expand-textarea" 
      :class="getFieldClass()"
      :rows="minRows"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :required="required"
      :readonly="readonly"
      :title="`Notes cannot exceed ${maxLength} characters`"
      :value="modelValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeydown"
      style="white-space: pre-wrap; overflow-wrap: break-word;"
    ></textarea>
    
    <div class="form-text">
      {{ helpText }}
    </div>
    
    <div class="character-count text-end">
      <small :class="getCounterClass()">
        {{ currentLength }}/{{ maxLength }} characters
      </small>
    </div>
    
    <div v-if="errorMessage" class="invalid-feedback">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue'

// Props
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  helpText?: string
  maxLength?: number
  minRows?: number
  required?: boolean
  showLabel?: boolean
  inputId?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Additional Notes',
  placeholder: 'Enter additional notes...',
  helpText: 'Include payment terms, special requirements, or other relevant information.',
  maxLength: 1000,
  minRows: 3,
  required: false,
  showLabel: true,
  inputId: 'notes',
  readonly: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validation': [isValid: boolean, errorMessage?: string]
}>()

// Refs
const textareaRef = ref<HTMLTextAreaElement>()
const errorMessage = ref('')
const isValid = ref<boolean | null>(null)

// Computed
const currentLength = computed(() => props.modelValue?.length || 0)

// Methods
const handleInput = (event: Event) => {
  // Don't handle input if readonly
  if (props.readonly) {
    return
  }
  
  const target = event.target as HTMLTextAreaElement
  let value = target.value
  
  // Apply smart formatting
  value = applySmartFormatting(value, target)
  
  emit('update:modelValue', value)
  autoExpandTextarea(target)
  updateCharacterCounters()
  
  // Clear error state on input if field was invalid and now has content
  if (isValid.value === false && value.trim()) {
    validateField()
  }
}

// Handle keydown events for special keys
const handleKeydown = (event: KeyboardEvent) => {
  // Don't handle if readonly
  if (props.readonly) {
    return
  }
  
  // Handle Shift+Enter for new lines
  if (event.shiftKey && event.key === 'Enter') {
    event.preventDefault()
    const target = event.target as HTMLTextAreaElement
    const cursorPos = target.selectionStart
    const value = target.value
    
    // Insert newline at cursor position
    const newValue = value.slice(0, cursorPos) + '\n' + value.slice(cursorPos)
    
    // Apply smart formatting
    const formattedValue = applySmartFormatting(newValue, target)
    
    emit('update:modelValue', formattedValue)
    
    // Set cursor position after the newline
    nextTick(() => {
      target.selectionStart = target.selectionEnd = cursorPos + 1
      autoExpandTextarea(target)
    })
  }
}

// Apply smart formatting rules
const applySmartFormatting = (value: string, target: HTMLTextAreaElement): string => {
  if (!value) return value
  
  const lines = value.split('\n')
  let formattedLines: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    // Capitalize first letter of each line (if it's a letter)
    if (line.length > 0 && /[a-z]/.test(line[0])) {
      line = line[0].toUpperCase() + line.slice(1)
    }
    
    formattedLines.push(line)
  }
  
  return formattedLines.join('\n')
}

const handleBlur = () => {
  validateField()
}

const handleFocus = () => {
  // Clear validation state on focus if field was invalid
  if (isValid.value === false) {
    isValid.value = null
    errorMessage.value = ''
  }
}

const validateField = () => {
  const value = props.modelValue?.trim() || ''
  
  // Check if field is required
  if (props.required && !value) {
    errorMessage.value = ''
    isValid.value = false
    emit('validation', false, '')
    return false
  }
  
  // Check max length
  if (value.length > props.maxLength) {
    errorMessage.value = `Notes cannot exceed ${props.maxLength} characters`
    isValid.value = false
    emit('validation', false, errorMessage.value)
    return false
  }
  
  // Field is valid
  errorMessage.value = ''
  isValid.value = true
  emit('validation', true)
  return true
}

const getFieldClass = () => {
  if (isValid.value === null) {
    return {} // No validation styling before validation
  }
  
  return {
    'is-valid': isValid.value === true,
    'is-invalid': isValid.value === false || errorMessage.value
  }
}

const getCounterClass = () => {
  const percentage = (currentLength.value / props.maxLength) * 100
  if (percentage > 90) return 'text-danger'
  if (percentage > 75) return 'text-warning'
  return 'text-muted'
}

// Auto-expanding textarea functionality
const autoExpandTextarea = (textarea: HTMLTextAreaElement) => {
  if (!textarea) return
  
  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto'
  
  // Set the height to match the content
  const minHeight = props.minRows * 24 // 24px per row
  const newHeight = Math.max(textarea.scrollHeight, minHeight)
  textarea.style.height = newHeight + 'px'
}

// Helper function to resize all textareas with content
const resizeAllTextareas = () => {
  if (textareaRef.value && props.modelValue?.trim()) {
    autoExpandTextarea(textareaRef.value)
  }
}

// Character counters
const updateCharacterCounters = () => {
  // Counter is handled in template reactively
}

// Watch for changes in modelValue to auto-expand
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (textareaRef.value) {
        autoExpandTextarea(textareaRef.value)
      }
    })
  }
})

// Lifecycle
onMounted(() => {
  // Auto-expand textarea if it has content
  nextTick(() => {
    resizeAllTextareas()
    
    // Also try again after a short delay in case Vue hasn't fully updated
    setTimeout(() => {
      resizeAllTextareas()
    }, 100)
    
    // Final attempt after a longer delay
    setTimeout(() => {
      resizeAllTextareas()
    }, 300)
  })
})

// Expose methods for parent components
defineExpose({
  validate: validateField,
  focus: () => textareaRef.value?.focus(),
  clear: () => {
    emit('update:modelValue', '')
    isValid.value = null
    errorMessage.value = ''
  }
})
</script>

<style scoped>
.notes-textarea-container {
  width: 100%;
}

.auto-expand-textarea {
  transition: height 0.2s ease, border-color 0.2s ease;
  resize: none;
  overflow: hidden;
  min-height: 72px; /* 3 rows minimum */
}

.auto-expand-textarea:hover {
  border-color: #999999;
}

.character-count {
  margin-top: 0.25rem;
  transition: color 0.3s ease;
}

.character-count .text-warning {
  color: #f59e0b !important;
}

.character-count .text-danger {
  color: #dc2626 !important;
  font-weight: 600;
}

/* Form controls */
.form-control {
  border: 2px solid #999999;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  color: #1f2937;
}

.form-control::placeholder {
  color: #4b5563 !important;
  opacity: 1;
}

.form-control:focus {
  border-color: #331FEA;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  outline: 2px solid transparent;
}

.form-control:hover {
  border-color: #6b7280;
}

/* Validation styling */
.form-control.is-valid {
  border-color: #21AF65 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
}

.form-control.is-invalid {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
  animation: subtle-shake 0.3s ease-in-out;
}

@keyframes subtle-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

/* Form labels */
.form-label {
  font-weight: 600;
  color: #666666;
  margin-bottom: 0.5rem;
}

.form-text {
  font-size: 0.875rem;
  color: #666666 !important;
  margin-top: 0.25rem;
  font-weight: 500;
}

.text-danger {
  color: #dc2626 !important;
  font-weight: 700;
  font-size: 1.1em;
}

.text-muted {
  color: #4b5563 !important;
  font-weight: 600;
  font-size: 0.9em;
}
</style>
