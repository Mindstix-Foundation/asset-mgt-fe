<template>
  <div class="notes-textarea-container" :class="{ 'readonly-notes-textarea': readonly }">
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
      :tabindex="readonly ? -1 : undefined"
      :title="`Notes cannot exceed ${maxLength} characters`"
      :value="modelValue"
      :style="{
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        ...(readonly ? {
          backgroundColor: 'rgb(243, 243, 243)',
          borderColor: 'rgb(224, 224, 224)',
          cursor: 'default',
          pointerEvents: 'none',
          userSelect: 'none'
        } : {})
      }"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeydown"
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
  
  for (const line of lines) {
    let formattedLine = line
    
    // Capitalize first letter of each line (if it's a letter)
    if (formattedLine.length > 0 && /[a-z]/.test(formattedLine[0])) {
      formattedLine = formattedLine[0].toUpperCase() + formattedLine.slice(1)
    }
    
    formattedLines.push(formattedLine)
  }
  
  return formattedLines.join('\n')
}

const handleBlur = () => {
  // Don't validate if readonly
  if (props.readonly) {
    return
  }
  validateField()
}

const handleFocus = () => {
  // Don't handle focus if readonly
  if (props.readonly) {
    // Immediately blur the field if it's readonly and somehow got focus
    if (textareaRef.value) {
      textareaRef.value.blur()
    }
    return
  }
  
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
  // Don't apply validation classes for readonly fields
  if (props.readonly) {
    return {}
  }
  
  // Apply validation classes to match standard input behavior
  if (isValid.value === null) {
    return {} // No validation styling before validation
  }
  
  return {
    'is-valid': isValid.value === true,
    'is-invalid': isValid.value === false
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
/* All styles moved to unified-form-styles.css for centralized form styling management */
</style>
