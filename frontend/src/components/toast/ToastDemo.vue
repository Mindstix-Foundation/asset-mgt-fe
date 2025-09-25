<template>
  <div class="toast-demo p-4">
    <h3 class="mb-4">Toast Notification Demo</h3>
    <div class="row g-3">
      <div class="col-md-6 col-lg-3">
        <button 
          class="btn btn-success w-100" 
          @click="showSuccessToast"
        >
          Show Success Toast
        </button>
      </div>
      <div class="col-md-6 col-lg-3">
        <button 
          class="btn btn-danger w-100" 
          @click="showErrorToast"
        >
          Show Error Toast
        </button>
      </div>
      <div class="col-md-6 col-lg-3">
        <button 
          class="btn btn-warning w-100" 
          @click="showWarningToast"
        >
          Show Warning Toast
        </button>
      </div>
      <div class="col-md-6 col-lg-3">
        <button 
          class="btn btn-info w-100" 
          @click="showInfoToast"
        >
          Show Info Toast
        </button>
      </div>
    </div>
    
    <div class="mt-4">
      <h5>Custom Toast</h5>
      <div class="row g-3 align-items-end">
        <div class="col-md-3">
          <label for="title" class="form-label">Title</label>
          <input 
            id="title"
            v-model="customTitle" 
            type="text" 
            class="form-control" 
            placeholder="Enter title"
          >
        </div>
        <div class="col-md-4">
          <label for="message" class="form-label">Message</label>
          <input 
            id="message"
            v-model="customMessage" 
            type="text" 
            class="form-control" 
            placeholder="Enter message"
          >
        </div>
        <div class="col-md-2">
          <label for="type" class="form-label">Type</label>
          <select id="type" v-model="customType" class="form-select">
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
        <div class="col-md-2">
          <label for="duration" class="form-label">Duration (ms)</label>
          <input 
            id="duration"
            v-model.number="customDuration" 
            type="number" 
            class="form-control" 
            placeholder="5000"
            min="0"
          >
        </div>
        <div class="col-md-1">
          <button 
            class="btn btn-primary w-100" 
            @click="showCustomToast"
            :disabled="!customTitle || !customMessage"
          >
            Show
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToastStore, type ToastType } from '@/stores/toast'

const toastStore = useToastStore()

// Custom toast form data
const customTitle = ref('')
const customMessage = ref('')
const customType = ref<ToastType>('info')
const customDuration = ref(5000)

const showSuccessToast = () => {
  toastStore.showSuccess('Success!', 'Operation completed successfully!')
}

const showErrorToast = () => {
  toastStore.showError('Error!', 'Something went wrong. Please try again.')
}

const showWarningToast = () => {
  toastStore.showWarning('Warning!', 'Please check your input and try again.')
}

const showInfoToast = () => {
  toastStore.showInfo('Information', 'Here is some useful information for you.')
}

const showCustomToast = () => {
  if (customTitle.value && customMessage.value) {
    toastStore.showToast(
      customTitle.value,
      customMessage.value,
      customType.value,
      customDuration.value
    )
    
    // Reset form
    customTitle.value = ''
    customMessage.value = ''
    customType.value = 'info'
    customDuration.value = 5000
  }
}
</script>

<style scoped>
.toast-demo {
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}
</style> 