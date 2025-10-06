<template>
  <div>
    <label class="info-label" :for="id">{{ label }}</label>
    <div class="input-group date-input-group">
      <input
        :id="id"
        type="text"
        class="form-control date-display-input"
        :placeholder="placeholder || 'dd/mm/yyyy'"
        :value="formattedValue"
        @click="openPicker"
        @keydown.enter.prevent="openPicker"
        readonly
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
  </div>
</template>

<script>
export default {
  name: 'DateField',
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    min: { type: String, default: undefined },
    max: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    formattedValue() {
      if (!this.modelValue) return ''
      return this.formatDateForDisplay(this.modelValue)
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
    
    openPicker() {
      const el = this.$refs.hiddenDate
      if (!el) return
      try {
        if (typeof el.showPicker === 'function') {
          el.showPicker()
        } else {
          el.focus(); el.click()
        }
      } catch (error) {
        // Fallback for browsers that throw on showPicker
        // Log at debug level to aid troubleshooting without noisy errors
        console.debug('DateField.showPicker failed, falling back to focus/click', error)
        el.focus(); el.click()
      }
    },
    onNativeChange(e) {
      const value = e.target.value || ''
      this.$emit('update:modelValue', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped>
/* Ensure label spacing matches dropdowns */
.info-label {
  margin-bottom: 0.5rem !important; /* 8px */
}

/* Field sizing to match dropdown */
.date-input-group {
  display: flex;
}

.date-input-group .date-display-input {
  height: 37.6px !important;
  line-height: 1.5;
  font-size: 1rem;
  padding: 0.375rem 0.75rem;
  border-top-left-radius: 0.375rem !important;
  border-bottom-left-radius: 0.375rem !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background-color: #fff;
  cursor: pointer;
}

/* Addon shaped to complete rounded outer corners and equal height */
.date-input-group .date-addon {
  height: 37.6px !important;
  line-height: 1.5;
  padding: 0 0.75rem;
  border-left: 0 !important;
  border-top-right-radius: 0.375rem !important;
  border-bottom-right-radius: 0.375rem !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  background-color: #fff;
  cursor: pointer;
}
</style>
