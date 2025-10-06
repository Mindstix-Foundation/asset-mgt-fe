<template>
  <div>
    <label class="form-label" :for="id">{{ label }}</label>
    <div class="input-group date-input-group">
      <input
        :id="id"
        type="text"
        class="form-control date-display-input"
        :placeholder="placeholder || 'dd/mm/yyyy'"
        :value="formattedValue"
        @click="openPicker"
        @keydown.enter.prevent="openPicker"
        @input="onTextInput"
        :class="inputClass"
        :readonly="!allowTextInput"
        aria-haspopup="dialog"
      />
      <button type="button" class="input-group-text date-addon" @click="openPicker" aria-label="Open date picker">
        <i class="fas fa-calendar-alt"></i>
      </button>
      <input
        ref="hiddenDate"
        type="date"
        class="visually-hidden position-absolute"
        :max="max"
        :min="min"
        :value="modelValue || ''"
        @change="onNativeChange"
        tabindex="-1"
        aria-hidden="true"
      />
    </div>
    <div v-if="helpText" class="form-text">{{ helpText }}</div>
    <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  name: 'DateInput',
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    min: { type: String, default: undefined },
    max: { type: String, default: undefined },
    helpText: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    allowTextInput: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'change', 'blur'],
  computed: {
    formattedValue() {
      if (!this.modelValue) return ''
      return this.formatDateForDisplay(this.modelValue)
    },
    inputClass() {
      return {
        'is-invalid': !!this.errorMessage,
        'form-control': true
      }
    }
  },
  methods: {
    formatDateForDisplay(dateString) {
      if (!dateString) return ''
      
      // If it's already in DD/MM/YYYY format, return as is
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
        return dateString
      }
      
      // Parse the date and format as DD/MM/YYYY
      const date = new Date(dateString)
      if (Number.isNaN(date.getTime())) return ''
      
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      
      return `${day}/${month}/${year}`
    },
    
    parseDisplayDate(displayValue) {
      if (!displayValue) return ''
      
      // Handle DD/MM/YYYY format
      const match = displayValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (match) {
        const [, day, month, year] = match
        const date = new Date(year, month - 1, day)
        if (!Number.isNaN(date.getTime())) {
          return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
        }
      }
      
      return ''
    },
    
    openPicker() {
      const el = this.$refs.hiddenDate
      if (!el) return
      try {
        if (typeof el.showPicker === 'function') {
          el.showPicker()
        } else {
          el.focus()
          el.click()
        }
      } catch (error) {
        console.debug('DateInput.showPicker failed, falling back to focus/click', error)
        el.focus()
        el.click()
      }
    },
    
    onNativeChange(e) {
      const value = e.target.value || ''
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    },
    
    onTextInput(e) {
      if (!this.allowTextInput) return
      
      const value = e.target.value
      const parsed = this.parseDisplayDate(value)
      
      if (parsed) {
        this.$emit('update:modelValue', parsed)
        this.$emit('change', parsed)
      }
    }
  }
}
</script>

<style scoped>
/* Ensure label spacing matches other form elements */
.form-label {
  margin-bottom: 0.5rem !important; /* 8px */
  font-weight: 600;
  color: #495057;
}

/* Field sizing to match other form controls */
.date-input-group {
  display: flex;
}

.date-display-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.date-addon {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-left: 0;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.date-addon:hover {
  background-color: #e9ecef;
}

.date-addon:focus {
  background-color: #e9ecef;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
