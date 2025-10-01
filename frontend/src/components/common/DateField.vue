<template>
  <div>
    <label class="info-label" :for="id">{{ label }}</label>
    <div class="input-group date-input-group">
      <input
        :id="id"
        type="text"
        class="form-control date-display-input"
        :placeholder="placeholder || 'yyyy-mm-dd'"
        :value="formattedValue"
        @click="openPicker"
        @keydown.enter.prevent="openPicker"
        readonly
        aria-haspopup="dialog"
      />
      <span class="input-group-text date-addon" role="button" @click="openPicker" aria-label="Open date picker">
        <i class="fas fa-calendar-alt"></i>
      </span>
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
      return this.modelValue || ''
    }
  },
  methods: {
    openPicker() {
      const el = this.$refs.hiddenDate
      if (!el) return
      try {
        if (typeof el.showPicker === 'function') {
          el.showPicker()
        } else {
          el.focus(); el.click()
        }
      } catch (_) {
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
