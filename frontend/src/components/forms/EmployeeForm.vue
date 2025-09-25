<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(10, 10, 10, 0.3) !important;">
          <!-- Card Header -->
          <div class="card-header bg-light border-bottom py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div class="d-flex justify-content-between align-items-center">
              <div class="text-center flex-grow-1">
                <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">
                  {{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}
                </h4>
                <p class="text-muted mb-0 small" style="display: block;">
                  {{ isEditMode ? 'Update employee information in your system' : 'Register a new employee in your system' }}
                </p>
              </div>
              <!-- Bulk Upload Button (only show when not in edit mode) -->
              <div v-if="!isEditMode" class="ms-3">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary btn-sm" 
                  @click="openBulkUpload"
                  title="Bulk Upload Employees"
                >
                  <i class="fas fa-file-excel me-1"></i>Bulk Upload
                </button>
              </div>
            </div>
          </div>
          
          <!-- Card Body -->
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <form @submit.prevent="handleSubmit" class="needs-validation" :class="{ 'was-validated': wasValidated }" novalidate>
              
              <!-- Section 1: Basic Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Basic Information</legend>
                <div class="row g-4">
                  
                  <!-- Employee ID -->
                  <div class="col-md-6">
                    <label for="employeeId" class="form-label">
                      Employee ID 
                      <span class="text-muted" v-if="!isEditMode">(Auto-generated)</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="employeeId" 
                      v-model="formData.employeeId"
                      :placeholder="isEditMode ? 'Employee ID' : 'EMP-XXX'"
                      :readonly="!isEditMode"
                      style="background-color: #F3F3F3;"
                    >
                    <div class="form-text">
                      {{ isEditMode ? 'Employee identification number' : 'Automatically generated when form is submitted' }}
                    </div>
                  </div>

                  <!-- First Name -->
                  <div class="col-md-6">
                    <label for="firstName" class="form-label">
                      First Name <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="firstName" 
                      v-model="formData.firstName"
                      placeholder="Enter first name" 
                      required 
                      minlength="2" 
                      maxlength="50" 
                      pattern="[A-Za-z\s]{2,50}"
                      title="First name must be 2-50 characters (letters and spaces only)"
                      @blur="validateField('firstName')"
                      @input="clearFieldError('firstName')"
                    >
                    <div class="form-text">2-50 characters (letters and spaces only)</div>
                    <div class="invalid-feedback">{{ errors.firstName }}</div>
                  </div>

                  <!-- Last Name -->
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">
                      Last Name <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="lastName" 
                      v-model="formData.lastName"
                      placeholder="Enter last name" 
                      required 
                      minlength="2" 
                      maxlength="50" 
                      pattern="[A-Za-z\s]{2,50}"
                      title="Last name must be 2-50 characters (letters and spaces only)"
                      @blur="validateField('lastName')"
                      @input="clearFieldError('lastName')"
                    >
                    <div class="form-text">2-50 characters (letters and spaces only)</div>
                    <div class="invalid-feedback">{{ errors.lastName }}</div>
                  </div>

                  <!-- Email -->
                  <div class="col-md-6">
                    <label for="email" class="form-label">
                      Email Address <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="formData.email"
                      placeholder="john.doe@company.com" 
                      required 
                      maxlength="100"
                      title="Please enter a valid email address"
                      @blur="validateField('email')"
                      @input="clearFieldError('email')"
                    >
                    <div class="form-text">Corporate email address (required)</div>
                    <div class="invalid-feedback">{{ errors.email }}</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Contact & Personal Details -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Contact & Personal Details</legend>
                <div class="row g-4">
                  
                  <!-- Phone -->
                  <div class="col-md-6">
                    <label for="phone" class="form-label">
                      Phone Number <span class="text-muted">(Optional)</span>
                    </label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      v-model="formData.phone"
                      placeholder="+91 98765 43210" 
                      pattern="[\+]?[0-9\s\-\(\)]{10,20}"
                      title="Please enter a valid phone number"
                      @blur="validateField('phone')"
                      @input="clearFieldError('phone')"
                    >
                    <div class="form-text">Contact phone number with country code (e.g., +91 9876543210)</div>
                    <div class="invalid-feedback">{{ errors.phone }}</div>
                  </div>

                  <!-- Date of Birth -->
                  <div class="col-md-6">
                    <label for="dateOfBirth" class="form-label">
                      Date of Birth <span class="text-muted">(Optional)</span>
                    </label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="dateOfBirth" 
                      v-model="formData.dateOfBirth"
                      @change="validateField('dateOfBirth')"
                      @input="clearFieldError('dateOfBirth')"
                    >
                    <div class="form-text">Used for HR records and birthday notifications</div>
                    <div class="invalid-feedback">{{ errors.dateOfBirth }}</div>
                  </div>

                  <!-- Address -->
                  <div class="col-12">
                    <label for="address" class="form-label">
                      Address <span class="text-muted">(Optional)</span>
                    </label>
                    <textarea 
                      class="form-control expandable-notes" 
                      id="address" 
                      v-model="formData.address"
                      :rows="addressExpanded ? 6 : 3"
                      placeholder="Click to expand and add address..." 
                      maxlength="300"
                      @click="expandAddress"
                      @input="updateCharacterCount"
                    ></textarea>
                    <div class="form-text">
                      {{ addressExpanded ? 'Expanded! Include street address, city, state, and ZIP code' : 'Click to expand for more space. Include street address, city, state, and ZIP code' }}
                    </div>
                    <div class="character-count text-end">
                      <small :class="`text-${characterCountClass}`">{{ addressCharCount }}/300 characters</small>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          
          <!-- Action Buttons -->
          <div class="card-footer bg-light border-top">
            <div class="form-actions">
              <div class="d-flex justify-content-center gap-3">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary px-4 py-2" 
                  @click="handleCancel"
                  :disabled="isSubmitting"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary px-5 py-2" 
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Employee' : 'Add Employee') }}
                </button>
              </div>
              <div class="text-center mt-3">
                <small class="text-muted">
                  Fields marked with <span class="text-danger">*</span> are required
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bulk Upload Modal -->
    <BulkUploadModal
      ref="bulkUploadModal"
      modal-id="employeeFormBulkUploadModal"
      title="Bulk Upload Employees"
      entity-name="employee"
      :columns="employeeColumns"
      :template-data="employeeTemplateData"
      upload-button-text="Upload Employees"
      @upload="handleBulkUpload"
      @template-download="handleTemplateDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { employeeService } from '@/services/employeeService'
import BulkUploadModal from '@/components/BulkUploadModal.vue'

// Props
interface Props {
  employee?: any
  isEditMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  employee: null
})

// Emits
const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

// Reactive data
const formData = reactive({
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: ''
})

const wasValidated = ref(false)
const isSubmitting = ref(false)
const addressExpanded = ref(false)
const bulkUploadModal = ref()

// Computed properties
const addressCharCount = computed(() => formData.address.length)

const characterCountClass = computed(() => {
  const percentage = (addressCharCount.value / 300) * 100
  if (percentage > 90) return 'danger'
  if (percentage > 75) return 'warning'
  return 'muted'
})

// Bulk upload computed properties
const employeeColumns = computed(() => [
  { 
    key: 'firstName', 
    label: 'First Name', 
    required: true,
    validation: (value: string) => {
      if (!value || value.trim() === '') return 'First name is required'
      if (value.length < 2 || value.length > 50) return 'First name must be 2-50 characters'
      if (!/^[A-Za-z\s]+$/.test(value)) return 'First name can only contain letters and spaces'
      return null
    }
  },
  { 
    key: 'lastName', 
    label: 'Last Name', 
    required: true,
    validation: (value: string) => {
      if (!value || value.trim() === '') return 'Last name is required'
      if (value.length < 2 || value.length > 50) return 'Last name must be 2-50 characters'
      if (!/^[A-Za-z\s]+$/.test(value)) return 'Last name can only contain letters and spaces'
      return null
    }
  },
  { 
    key: 'email', 
    label: 'Email', 
    required: true,
    validation: (value: string) => {
      if (!value || value.trim() === '') return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
      return null
    }
  },
  { 
    key: 'phone', 
    label: 'Phone',
    validation: (value: string) => {
      if (value && !value.startsWith('+91')) return 'Phone should start with +91'
      return null
    }
  },
  { 
    key: 'dateOfBirth', 
    label: 'Date of Birth (YYYY-MM-DD)',
    validation: (value: string) => {
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Date of Birth must be YYYY-MM-DD'
      return null
    }
  },
  { key: 'address', label: 'Address' }
])

const employeeTemplateData = computed(() => [
  {
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9123456789',
    dateOfBirth: '1992-05-21',
    address: '123 MG Road Pune'
  }
])

// Watchers
watch(() => [formData.firstName, formData.lastName], () => {
  if (!props.isEditMode && formData.firstName && formData.lastName) {
    generateEmployeeId()
  }
}, { deep: true })

// Methods
const generateEmployeeId = () => {
  if (formData.firstName && formData.lastName) {
    formData.employeeId = employeeService.generateEmployeeIdPreview(formData.firstName, formData.lastName)
  }
}

const validateField = (fieldName: string) => {
  const field = document.getElementById(fieldName) as HTMLInputElement
  if (!field) return

  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      if (!formData[fieldName] || formData[fieldName].trim() === '') {
        errors[fieldName] = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`
        field.classList.add('is-invalid')
        field.classList.remove('is-valid')
      } else if (formData[fieldName].length < 2 || formData[fieldName].length > 50) {
        errors[fieldName] = `${fieldName === 'firstName' ? 'First' : 'Last'} name must be 2-50 characters`
        field.classList.add('is-invalid')
        field.classList.remove('is-valid')
      } else if (!/^[A-Za-z\s]+$/.test(formData[fieldName])) {
        errors[fieldName] = `${fieldName === 'firstName' ? 'First' : 'Last'} name can only contain letters and spaces`
        field.classList.add('is-invalid')
        field.classList.remove('is-valid')
      } else {
        errors[fieldName] = ''
        field.classList.remove('is-invalid')
        field.classList.add('is-valid')
      }
      break

    case 'email':
      if (!formData.email || formData.email.trim() === '') {
        errors.email = 'Email address is required'
        field.classList.add('is-invalid')
        field.classList.remove('is-valid')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address'
        field.classList.add('is-invalid')
        field.classList.remove('is-valid')
      } else {
        errors.email = ''
        field.classList.remove('is-invalid')
        field.classList.add('is-valid')
      }
      break

    case 'phone':
      if (formData.phone && formData.phone.length < 10) {
        errors.phone = 'Phone number must be at least 10 digits'
        field.classList.add('is-invalid')
        field.classList.remove('is-valid')
      } else {
        errors.phone = ''
        field.classList.remove('is-invalid')
        if (formData.phone) field.classList.add('is-valid')
      }
      break

    case 'dateOfBirth':
      if (formData.dateOfBirth) {
        const today = new Date()
        const birthDate = new Date(formData.dateOfBirth)
        const minAge = new Date()
        minAge.setFullYear(today.getFullYear() - 100)
        const maxAge = new Date()
        maxAge.setFullYear(today.getFullYear() - 16)

        if (birthDate > today) {
          errors.dateOfBirth = 'Date of birth cannot be in the future'
          field.classList.add('is-invalid')
          field.classList.remove('is-valid')
        } else if (birthDate > maxAge) {
          errors.dateOfBirth = 'Employee must be at least 16 years old'
          field.classList.add('is-invalid')
          field.classList.remove('is-valid')
        } else if (birthDate < minAge) {
          errors.dateOfBirth = 'Please enter a valid date of birth'
          field.classList.add('is-invalid')
          field.classList.remove('is-valid')
        } else {
          errors.dateOfBirth = ''
          field.classList.remove('is-invalid')
          field.classList.add('is-valid')
        }
      }
      break
  }
}

const clearFieldError = (fieldName: string) => {
  if (errors[fieldName as keyof typeof errors]) {
    const field = document.getElementById(fieldName) as HTMLInputElement
    if (field && formData[fieldName as keyof typeof formData]) {
      field.classList.remove('is-invalid')
    }
  }
}

const expandAddress = () => {
  if (!addressExpanded.value) {
    addressExpanded.value = true
    const textarea = document.getElementById('address') as HTMLTextAreaElement
    if (textarea) {
      textarea.placeholder = 'Enter complete address with street, city, state, and ZIP code...'
      textarea.focus()
    }
  }
}

const updateCharacterCount = () => {
  // Character count is computed automatically
}

const validateForm = (): boolean => {
  let isValid = true
  
  // Validate required fields
  if (!formData.firstName || formData.firstName.trim() === '') {
    validateField('firstName')
    isValid = false
  }
  
  if (!formData.lastName || formData.lastName.trim() === '') {
    validateField('lastName')
    isValid = false
  }
  
  if (!formData.email || formData.email.trim() === '') {
    validateField('email')
    isValid = false
  }

  // Validate optional fields if they have values
  if (formData.phone) {
    validateField('phone')
    if (errors.phone) isValid = false
  }

  if (formData.dateOfBirth) {
    validateField('dateOfBirth')
    if (errors.dateOfBirth) isValid = false
  }

  return isValid
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  wasValidated.value = true

  if (!validateForm()) {
    // Scroll to first error
    const firstInvalid = document.querySelector('.is-invalid') as HTMLElement
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => firstInvalid.focus(), 300)
    }
    return
  }

  isSubmitting.value = true

  try {
    // Emit the form data
    emit('submit', { ...formData })
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

// Bulk upload methods
const openBulkUpload = () => {
  if (bulkUploadModal.value) {
    bulkUploadModal.value.openModal()
  }
}

const handleBulkUpload = (data: any[]) => {
  console.log('Bulk upload data received:', data)
  // Here you could emit the bulk upload data to parent component
  // or handle the bulk upload logic directly
  emit('submit', data)
}

const handleTemplateDownload = (type: string) => {
  console.log(`Template downloaded: ${type}`)
}

// Initialize form data if editing
onMounted(() => {
  if (props.isEditMode && props.employee) {
    Object.assign(formData, props.employee)
  }
})
</script>

<style scoped>
/* Dynamic Card Sizing */
.card {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.card-body {
  width: 100% !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  position: relative;
}

/* Consistent Fieldset Styling */
.form-fieldset {
  border: 1px solid #B7B7B7 !important;
  border-radius: 0.5rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
  background: rgba(243, 243, 243, 0.3);
  position: relative;
  width: 100% !important;
  box-sizing: border-box !important;
}

.form-fieldset:hover {
  border-color: #B7B7B7 !important;
  background: rgba(243, 243, 243, 0.5);
  transition: all 0.2s ease;
}

.form-legend {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #666666 !important;
  background-color: #FFFFFF !important;
  padding: 0.375rem 0.75rem !important;
  border: 1px solid #B7B7B7 !important;
  border-radius: 0.375rem !important;
  margin-bottom: 1rem !important;
  box-shadow: 0 1px 3px rgba(10, 10, 10, 0.1);
  width: auto !important;
  float: none !important;
}

/* Form Container */
.needs-validation {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* Form Labels */
.form-label {
  font-weight: 600;
  color: #666666;
  margin-bottom: 0.5rem;
}

/* WCAG AA Compliant Form Controls */
.form-control, .form-select {
  border: 2px solid #999999;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  color: #0A0A0A;
}

/* Enhanced placeholder contrast - WCAG AA compliant */
.form-control::placeholder {
  color: #4b5563 !important;
  opacity: 1;
}

.form-select option {
  color: #0A0A0A;
}

.form-control:focus, .form-select:focus {
  border-color: #331FEA;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  outline: 2px solid transparent;
}

.form-control:hover, .form-select:hover {
  border-color: #666666;
}

/* High Contrast Form Text - WCAG AA Compliant */
.form-text {
  font-size: 0.875rem;
  color: #666666 !important;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Enhanced Required Field Indicator */
.text-danger {
  color: #dc2626 !important;
  font-weight: 700;
  font-size: 1.1em;
}

/* WCAG AA Compliant Optional Field Indicator */
.text-muted {
  color: #4b5563 !important;
  font-weight: 600;
  font-size: 0.9em;
}

/* Action Buttons */
.form-actions {
  padding: 1.5rem;
  box-sizing: border-box;
  width: 100%;
}

.card-footer {
  background: #F3F3F3 !important;
  border-top: 2px solid #B7B7B7 !important;
  border-radius: 0 0 1.5rem 1.5rem !important;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #331FEA !important;
  border-color: #331FEA !important;
  color: #FFFFFF !important;
}

.btn-primary:hover:not(:disabled) {
  background-color: #331FEA !important;
  border-color: #331FEA !important;
  opacity: 0.9;
}

/* WCAG AA Compliant Cancel Button */
.btn-outline-secondary {
  background-color: #F3F3F3 !important;
  border: 2px solid #999999 !important;
  color: #666666 !important;
  font-weight: 600;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #F3F3F3 !important;
  border-color: #5a6268 !important;
  color: #0A0A0A !important;
  transform: translateY(-1px);
}

.btn-outline-secondary:focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25) !important;
  border-color: #5a6268 !important;
}

/* Card Styling */
.card {
  border-radius: 1.5rem !important;
  border: none !important;
  box-shadow: 0 10px 40px rgba(10, 10, 10, 0.1) !important;
}

/* Validation States */
.was-validated .form-control:valid,
.was-validated .form-select:valid {
  border-color: #10b981;
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25);
}

.was-validated .form-control:invalid,
.was-validated .form-select:invalid,
.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc2626;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.25);
  animation: subtle-shake 0.3s ease-in-out;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

@keyframes subtle-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

/* Expandable Notes Styling */
.expandable-notes {
  transition: height 0.3s ease, border-color 0.2s ease;
  cursor: pointer;
  resize: none;
}

.expandable-notes:hover {
  border-color: #999999;
}

.expandable-notes:focus {
  cursor: text;
  resize: vertical;
}

/* Enhanced Button Accessibility */
.btn:focus-visible {
  outline: 2px solid #331FEA;
  outline-offset: 2px;
}

/* Character Counter Styling */
.character-count {
  margin-top: 0.25rem;
  transition: color 0.3s ease;
}

.character-count .text-warning {
  color: #FFC000 !important;
}

.character-count .text-danger {
  color: #dc2626 !important;
  font-weight: 600;
}

/* Disable automatic validation styling - only show on form submission */
.form-control:valid:not(.is-valid),
.form-select:valid:not(.is-valid) {
  border-color: #999999 !important;
  box-shadow: none !important;
  background-image: none !important;
}

.form-control:invalid:not(.is-invalid),
.form-select:invalid:not(.is-invalid) {
  border-color: #999999 !important;
  box-shadow: none !important;
  background-image: none !important;
}

/* Only show validation styling when form has been submitted */
.was-validated .form-control:valid,
.was-validated .form-select:valid,
.form-control.is-valid,
.form-select.is-valid {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25) !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
  }
  
  .form-actions {
    padding: 1rem;
  }
  
  .card-footer {
    border-radius: 0 0 1rem 1rem !important;
  }
  
  .form-fieldset {
    padding: 1rem !important;
    margin-bottom: 1rem !important;
    border-radius: 0.375rem !important;
  }
  
  .form-legend {
    font-size: 0.9rem !important;
    padding: 0.25rem 0.5rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 0.75rem;
  }
  
  .d-flex.gap-3 {
    flex-direction: column;
    gap: 0 !important;
  }
}

/* Responsive Enhancements */
@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important;
  }
  
  .form-actions {
    padding: 0.75rem;
  }
  
  .card-footer {
    border-radius: 0 0 0.75rem 0.75rem !important;
  }
  
  .form-fieldset {
    padding: 0.75rem !important;
    margin-bottom: 0.75rem !important;
    border-radius: 0.25rem !important;
  }
  
  .form-legend {
    font-size: 0.85rem !important;
    padding: 0.2rem 0.4rem !important;
    margin-bottom: 0.5rem !important;
  }
}
</style> 