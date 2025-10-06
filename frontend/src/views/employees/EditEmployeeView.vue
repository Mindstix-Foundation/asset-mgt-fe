<template>
  <div class="container-fluid py-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-body text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading employee information...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-body text-center py-5">
            <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
            <h4 class="mt-3 text-dark">Employee Not Found</h4>
            <p class="text-muted">The employee you're trying to edit could not be found.</p>
            <button class="btn btn-primary" @click="goBack">
              <i class="fas fa-arrow-left me-2"></i>Back to Employee List
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Form -->
    <div v-else class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <!-- Form Header -->
          <div class="card-header bg-light border-bottom text-center py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div style="display: block;">
              <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">Edit Employee</h4>
              <p class="text-muted mb-0 small" style="display: block;">Update employee information</p>
            </div>
          </div>

          <!-- Form Body -->
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <form ref="employeeForm" @submit.prevent="submitForm" @keydown.enter="handleEnterKey" novalidate>
              <div class="row g-4">
                <!-- Employee ID (Read-only) -->
                <div class="col-md-6">
                  <label for="employeeId" class="form-label fw-semibold">
                    Employee ID
                  </label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="employeeId"
                    v-model="formData.employeeId"
                    readonly
                    style="background-color: #F3F3F3;"
                  >
                </div>

                <!-- Status -->
                <div class="col-md-6">
                  <label for="status" class="form-label fw-semibold">
                    Status <span class="text-danger">*</span>
                  </label>
                  <select 
                    class="form-select"
                    id="status"
                    v-model="formData.status"
                    :disabled="isSubmitting"
                    required
                    :class="getFieldClass('status')"
                    @blur="validateFieldInline('status')"
                    @focus="clearFieldValidation('status')"
                    @input="handleFieldInput('status')"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <div v-if="fieldErrors.status" class="invalid-feedback">
                    {{ fieldErrors.status }}
                  </div>
                </div>

                <!-- First Name -->
                <div class="col-md-6">
                  <label for="firstName" class="form-label fw-semibold">
                    First Name <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    class="form-control shake-on-invalid"
                    id="firstName"
                    v-model="formData.firstName"
                    :disabled="isSubmitting"
                    placeholder="Enter first name"
                    required
                    maxlength="50"
                    :class="getFieldClass('firstName')"
                    @blur="validateFieldInline('firstName')"
                    @focus="clearFieldValidation('firstName')"
                    @input="handleFieldInput('firstName')"
                  >
                  <div v-if="fieldErrors.firstName" class="invalid-feedback">
                    {{ fieldErrors.firstName }}
                  </div>
                </div>

                <!-- Last Name -->
                <div class="col-md-6">
                  <label for="lastName" class="form-label fw-semibold">
                    Last Name <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    class="form-control shake-on-invalid"
                    id="lastName"
                    v-model="formData.lastName"
                    :disabled="isSubmitting"
                    placeholder="Enter last name"
                    required
                    maxlength="50"
                    :class="getFieldClass('lastName')"
                    @blur="validateFieldInline('lastName')"
                    @focus="clearFieldValidation('lastName')"
                    @input="handleFieldInput('lastName')"
                  >
                  <div v-if="fieldErrors.lastName" class="invalid-feedback">
                    {{ fieldErrors.lastName }}
                  </div>
                </div>

                <!-- Email -->
                <div class="col-md-6">
                  <label for="email" class="form-label fw-semibold">
                    Email Address <span class="text-danger">*</span>
                    <span v-if="isAdmin" class="badge bg-warning ms-2">Admin - Cannot be changed</span>
                  </label>
                  <div class="position-relative">
                    <input 
                      type="email" 
                      class="form-control shake-on-invalid"
                      id="email"
                      v-model="formData.email"
                      :disabled="isSubmitting || isAdmin"
                      placeholder="Enter email address"
                      required
                      maxlength="255"
                      :class="getFieldClass('email')"
                      @blur="validateFieldInline('email')"
                      @focus="clearFieldValidation('email')"
                      @input="handleFieldInput('email')"
                      :style="isAdmin ? 'background-color: #F3F3F3;' : ''"
                    >
                    <div v-if="isCheckingEmail" class="position-absolute top-50 end-0 translate-middle-y me-3">
                      <div class="spinner-border spinner-border-sm text-primary" role="status">
                        <span class="visually-hidden">Checking...</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="fieldErrors.email" class="invalid-feedback">
                    {{ fieldErrors.email }}
                  </div>
                  <div v-if="isAdmin" class="form-text text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    Email address cannot be changed for admin employees
                  </div>
                </div>

                <!-- Phone -->
                <div class="col-md-6">
                  <label for="phone" class="form-label fw-semibold">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    class="form-control shake-on-invalid"
                    id="phone"
                    v-model="formData.phone"
                    :disabled="isSubmitting"
                    placeholder="e.g., +91 9876543210"
                    maxlength="15"
                    :class="getFieldClass('phone')"
                    @blur="validateFieldInline('phone')"
                    @focus="clearFieldValidation('phone')"
                    @input="handleFieldInput('phone'); formatPhoneNumber($event)"
                  >
                  <div v-if="fieldErrors.phone" class="invalid-feedback">
                    {{ fieldErrors.phone }}
                  </div>
                </div>

                <!-- Date of Birth -->
                <div class="col-md-6">
                  <DateInput
                    id="dateOfBirth"
                    label="Date of Birth"
                    v-model="formData.dateOfBirth"
                    :error-message="fieldErrors.dateOfBirth"
                    :disabled="isSubmitting"
                    @change="handleFieldInput('dateOfBirth')"
                    @blur="validateFieldInline('dateOfBirth')"
                  />
                </div>

                <!-- Address -->
                <div class="col-12">
                  <label for="address" class="form-label fw-semibold">
                    Address
                  </label>
                  <div class="position-relative">
                    <textarea 
                      class="form-control auto-expand shake-on-invalid"
                      id="address"
                      v-model="formData.address"
                      :disabled="isSubmitting"
                      placeholder="Enter full address"
                      rows="3"
                      maxlength="500"
                      :class="getFieldClass('address')"
                      @blur="validateFieldInline('address')"
                      @focus="clearFieldValidation('address')"
                      @input="handleFieldInput('address'); autoExpandTextarea($event); resizeTextarea($event.target as HTMLTextAreaElement)"
                    ></textarea>
                    <div class="character-counter" :class="getCounterClass('address')">
                      {{ (formData.address || '').length }}/500
                    </div>
                  </div>
                  <div v-if="fieldErrors.address" class="invalid-feedback">
                    {{ fieldErrors.address }}
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <!-- Action Buttons -->
          <div class="card-footer bg-light border-top">
            <div class="form-actions">
              <div class="d-flex justify-content-center gap-3">
                <button 
                  type="button" 
                  class="btn btn-cancel" 
                  @click="goBack"
                  :disabled="isSubmitting || isLoading"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary px-5 py-2" 
                  :disabled="isSubmitting || isLoading"
                  @click="submitForm"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? 'Updating Employee...' : 'Update Employee' }}
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

    <!-- Toast notifications are handled by ToastNotification component -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { employeeService } from '@/services/employeeService'
import type { UpdateEmployeeData } from '@/services/employeeService'
import { useToastStore } from '@/stores/toast'
import DateInput from '@/components/common/DateInput.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Get employee ID from route
const employeeId = computed(() => route.params.id as string)

// Form data
const formData = reactive({
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
})

// Store original email for validation
const originalEmail = ref('')

// Store admin status
const isAdmin = ref(false)

// Form state - Enhanced validation system
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({}) // null = not validated, true = valid, false = invalid
const isSubmitting = ref(false)
const isLoading = ref(false)
const loadError = ref(false)
const formSubmitted = ref(false) // Track if form has been submitted

// Debounce helpers for email check
let emailCheckTimer: number | undefined
const isCheckingEmail = ref(false)

// Template refs
const employeeForm = ref<HTMLFormElement>()

// Enhanced validation system
const getFieldClass = (fieldName: string) => {
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return {}
  }
  
  return {
    'is-valid': fieldValidation[fieldName] === true,
    'is-invalid': fieldValidation[fieldName] === false || fieldErrors[fieldName]
  }
}

const validateFieldInline = async (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
  if (!element) return true

  element.setCustomValidity('')

  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '')) {
    setFieldError(fieldName, '')
    return false
  }

  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      if (value && value.length < 2) {
        setFieldError(fieldName, `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`)
        return false
      }
      if (value && !/^[A-Za-z\s]{2,50}$/.test(value)) {
        setFieldError(fieldName, `${fieldName === 'firstName' ? 'First' : 'Last'} name must be 2-50 characters (letters and spaces only)`)
        return false
      }
      break
    
    case 'email':
      if (value && !String(value).includes('@')) {
        setFieldError(fieldName, 'Please enter a valid email address')
        return false
      }
      if (value && String(value) !== originalEmail.value) {
        if (emailCheckTimer) window.clearTimeout(emailCheckTimer)
        isCheckingEmail.value = true
        emailCheckTimer = window.setTimeout(async () => {
          try {
            const resp = await employeeService.checkEmailAvailability(String(value), formData.employeeId)
            const available = (resp as any)?.data?.available ?? (resp as any)?.available
            if (!available) {
              setFieldError('email', 'An employee with this email already exists')
            } else {
              setFieldValid('email')
            }
          } catch (e) {
          } finally {
            isCheckingEmail.value = false
          }
        }, 400)
      }
      break
    
    case 'phone':
      if (value && String(value).length < 10) {
        setFieldError(fieldName, 'Phone number must be at least 10 digits (e.g., +91 9876543210)')
        return false
      }
      break
    
    case 'dateOfBirth':
      if (value) {
        const today = new Date()
        const birthDate = new Date(String(value))
        const minAge = new Date()
        minAge.setFullYear(today.getFullYear() - 100)
        const maxAge = new Date()
        maxAge.setFullYear(today.getFullYear() - 16)

        if (birthDate > today) {
          setFieldError(fieldName, 'Date of birth cannot be in the future')
          return false
        } else if (birthDate > maxAge) {
          setFieldError(fieldName, 'Employee must be at least 16 years old')
          return false
        } else if (birthDate < minAge) {
          setFieldError(fieldName, 'Please enter a valid date of birth')
          return false
        }
      }
      break
  }

  if (element.checkValidity()) {
    setFieldValid(fieldName)
    return true
  } else {
    setFieldError(fieldName, element.validationMessage || `${getFieldDisplayName(fieldName)} is invalid`)
    return false
  }
}

const setFieldError = (fieldName: string, message: string) => {
  fieldErrors[fieldName] = message
  fieldValidation[fieldName] = false
  
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  if (element) {
    element.setCustomValidity(message)
  }
}

const setFieldValid = (fieldName: string) => {
  delete fieldErrors[fieldName]
  fieldValidation[fieldName] = true
  
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  if (element) {
    element.setCustomValidity('')
  }
}

const clearFieldValidation = (fieldName: string) => {
  if (fieldValidation[fieldName] === false) {
    fieldValidation[fieldName] = null
    delete fieldErrors[fieldName]
  }
}

const handleFieldInput = (fieldName: string) => {
  if (fieldValidation[fieldName] === false && formData[fieldName as keyof typeof formData]?.toString().trim()) {
    validateFieldInline(fieldName)
  }
}

// Utility functions
const formatPhoneNumber = (event: Event) => {}

const autoExpandTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  resizeTextarea(textarea)
}

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const resizeAllTextareas = () => {
  const textareas = document.querySelectorAll('textarea.auto-expand')
  textareas.forEach((textarea) => {
    resizeTextarea(textarea as HTMLTextAreaElement)
  })
}

const getCounterClass = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData] as string || ''
  const maxLength = fieldName === 'address' ? 500 : 255
  const percentage = (value.length / maxLength) * 100
  
  return {
    'text-warning': percentage >= 80 && percentage < 95,
    'text-danger': percentage >= 95
  }
}

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    address: 'Address',
    status: 'Status'
  }
  return displayNames[fieldName] || fieldName
}

// Load employee data for editing
const loadEmployeeData = async () => {
  if (!employeeId.value) {
    loadError.value = true
    return
  }

  isLoading.value = true
  try {
    const response = await employeeService.getEmployee(employeeId.value)
    const employee = response.data.employee

    formData.employeeId = employee.employeeId
    formData.firstName = employee.firstName
    formData.lastName = employee.lastName
    formData.email = employee.email
    formData.phone = employee.phone || ''
    formData.dateOfBirth = employee.dateOfBirth || ''
    formData.address = employee.address || ''
    formData.status = employee.status || 'ACTIVE'

    originalEmail.value = employee.email
    isAdmin.value = employee.isAdmin || false

    nextTick(() => {
      resizeAllTextareas()
      
      setTimeout(() => {
        resizeAllTextareas()
      }, 100)
      
      setTimeout(() => {
        resizeAllTextareas()
      }, 300)
    })
  } catch (error: any) {
    console.error('Error loading employee data:', error)
    loadError.value = true
  } finally {
    isLoading.value = false
  }
}

// Form submission with enhanced validation
const submitForm = async (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  formSubmitted.value = true
  
  if (isSubmitting.value) return

  const fieldsToValidate = ['firstName', 'lastName', 'email', 'status']
  let hasErrors = false

  for (const fieldName of fieldsToValidate) {
    const isValid = await validateFieldInline(fieldName)
    if (!isValid) {
      hasErrors = true
    }
  }

  const optionalFields = ['phone', 'dateOfBirth', 'address']
  for (const fieldName of optionalFields) {
    const value = formData[fieldName as keyof typeof formData]
    if (value && value.toString().trim()) {
      const isValid = await validateFieldInline(fieldName)
      if (!isValid) {
        hasErrors = true
      }
    }
  }

  if (hasErrors) {
    scrollToFirstError()
    return
  }

  isSubmitting.value = true

  try {
    const updateData: UpdateEmployeeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      address: formData.address || undefined,
      status: formData.status
    }

    // Only include email if employee is not admin
    if (!isAdmin.value) {
      updateData.email = formData.email
    }

    const response = await employeeService.updateEmployee(employeeId.value, updateData)
    const updatedEmployee = response.data.employee

    const employeeName = `${updatedEmployee.firstName} ${updatedEmployee.lastName}`
    
    // Redirect to employee list immediately after success
    router.push('/app/employees')
    
    // Show success toast after redirect (with a small delay to ensure page loads)
    setTimeout(() => {
      toastStore.showSuccess('Success', `Employee ${employeeName} updated successfully!`)
    }, 100)

  } catch (error: any) {
    console.error('Error updating employee:', error)
    
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update employee. Please try again.'
    toastStore.showError('Error', errorMsg)
    
  } finally {
    isSubmitting.value = false
  }
}

// Navigation functions
const goBack = () => {
  router.push('/app/employees')
}

const scrollToFirstError = () => {
  nextTick(() => {
    const firstErrorField = document.querySelector('.is-invalid')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ;(firstErrorField as HTMLElement).focus()
    }
  })
}

// Keyboard navigation handler
const handleEnterKey = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement
  
  // Don't submit if user is in a textarea (allow Enter for new lines)
  if (target.tagName === 'TEXTAREA') {
    return
  }
  
  // Prevent default Enter behavior
  event.preventDefault()
  
  // If it's the last field or submit button, submit the form
  const form = employeeForm.value
  if (!form) return
  
  const focusableElements = form.querySelectorAll(
    'input:not([readonly]):not([disabled]), select:not([disabled]), textarea:not([readonly]):not([disabled]), button:not([disabled])'
  ) as NodeListOf<HTMLElement>
  
  const currentIndex = Array.from(focusableElements).indexOf(target)
  const isLastField = currentIndex === focusableElements.length - 1
  
  if (isLastField || (target as HTMLInputElement).type === 'submit' || target.classList.contains('btn-primary')) {
    // Submit the form
    submitForm()
  } else {
    // Move to next field
    const nextElement = focusableElements[currentIndex + 1]
    if (nextElement) {
      nextElement.focus()
    }
  }
}

// Removed global function - no longer needed with simple toast notifications

onMounted(() => {
  loadEmployeeData()
})
</script>

<style scoped>
@import url('../../assets/unified-form-styles.css');

.auto-expand {
  resize: none;
  overflow: hidden;
  min-height: 80px;
}

.character-counter {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.75rem;
  color: #6c757d;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
}

.shake-on-invalid.is-invalid {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style> 