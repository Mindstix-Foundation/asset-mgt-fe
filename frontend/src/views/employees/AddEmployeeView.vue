<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-header bg-light border-bottom text-center py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div style="display: block;">
              <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">
                {{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}
              </h4>
              <p class="text-muted mb-0 small" style="display: block;">
                {{ isEditMode ? 'Update employee information' : 'Register a new employee in your system' }}
              </p>
            </div>
          </div>
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary">
                <span class="visually-hidden">Loading...</span>
              </div>
              <output class="mt-3 text-muted">Loading employee data...</output>
            </div>
            
            <!-- Form -->
            <form v-else ref="employeeForm" class="needs-validation" @submit.prevent="submitForm" @keydown.enter="handleEnterKey" novalidate autocomplete="off">
              
              <!-- Section 1: Basic Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Basic Information</legend>
                <div class="row g-4">
                  <!-- Employee ID (Auto-generated for new employees) -->
                  <div class="col-md-6" v-if="isEditMode">
                    <label for="employeeId" class="form-label">Employee ID</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="employeeId" 
                      v-model="formData.employeeId"
                      readonly
                      style="background-color: #F3F3F3;"
                    >
                    <div class="form-text">Employee identification number</div>
                  </div>

                  <!-- First Name -->
                  <div :class="isEditMode ? 'col-md-6' : 'col-md-6'">
                    <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="firstName" 
                      v-model="formData.firstName"
                      :class="getFieldClass('firstName')"
                      :disabled="isSubmitting"
                      placeholder="Enter first name" 
                      required 
                      minlength="2" 
                      maxlength="50"
                      pattern="[A-Za-z\s]{2,50}"
                      title="First name must be 2-50 characters (letters and spaces only)"
                      autocomplete="off"
                      autocapitalize="words"
                      autocorrect="off"
                      spellcheck="false"
                      @blur="validateFieldInline('firstName')"
                      @focus="clearFieldValidation('firstName')"
                      @input="formatNameField('firstName')"
                    >
                    <div class="form-text">2-50 characters (letters and spaces only)</div>
                    <div v-if="fieldErrors.firstName" class="invalid-feedback">{{ fieldErrors.firstName }}</div>
                  </div>

                  <!-- Last Name -->
                  <div class="col-md-6">
                    <label for="lastName" class="form-label">Last Name <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="lastName" 
                      v-model="formData.lastName"
                      :class="getFieldClass('lastName')"
                      :disabled="isSubmitting"
                      placeholder="Enter last name" 
                      required 
                      minlength="2" 
                      maxlength="50"
                      pattern="[A-Za-z\s]{2,50}"
                      title="Last name must be 2-50 characters (letters and spaces only)"
                      autocomplete="off"
                      autocapitalize="words"
                      autocorrect="off"
                      spellcheck="false"
                      @blur="validateFieldInline('lastName')"
                      @focus="clearFieldValidation('lastName')"
                      @input="formatNameField('lastName')"
                    >
                    <div class="form-text">2-50 characters (letters and spaces only)</div>
                    <div v-if="fieldErrors.lastName" class="invalid-feedback">{{ fieldErrors.lastName }}</div>
                  </div>

                  <!-- Email -->
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email Address <span class="text-danger">*</span></label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="formData.email"
                      :class="getFieldClass('email')"
                      :disabled="isSubmitting"
                      placeholder="john.doe@company.com" 
                      required 
                      maxlength="100"
                      title="Please enter a valid email address"
                      autocomplete="off"
                      autocapitalize="none"
                      autocorrect="off"
                      spellcheck="false"
                      @blur="validateFieldInline('email')"
                      @focus="clearFieldValidation('email')"
                      @input="handleFieldInput('email')"
                    >
                    <div class="form-text">Corporate email address (required)</div>
                    <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
                  </div>

                  <!-- Phone -->
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Phone Number <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      v-model="formData.phone"
                      :class="getFieldClass('phone')"
                      :disabled="isSubmitting"
                      placeholder="+91 9999999999"
                      pattern="^\+91\s[0-9]{10}$"
                      title="Enter a 10-digit number with '+91' prefix (e.g., +91 9876543210)"
                      autocomplete="off"
                      autocapitalize="none"
                      autocorrect="off"
                      spellcheck="false"
                      inputmode="numeric"
                      @blur="validateFieldInline('phone')"
                      @focus="onPhoneFocus"
                      @input="formatPhoneNumber"
                    >
                    <div class="form-text">Format: +91 9999999999 (exactly 10 digits)</div>
                    <div v-if="fieldErrors.phone" class="invalid-feedback">{{ fieldErrors.phone }}</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Personal Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Personal Information</legend>
                <div class="row g-4">
                  <!-- Date of Birth -->
                  <div class="col-md-6">
                    <DateInput
                      id="dateOfBirth"
                      label="Date of Birth (Optional)"
                      v-model="formData.dateOfBirth"
                      :error-message="fieldErrors.dateOfBirth"
                      :disabled="isSubmitting"
                      help-text="Used for HR records and birthday notifications"
                      @change="handleFieldInput('dateOfBirth')"
                      @blur="validateFieldInline('dateOfBirth')"
                    />
                  </div>

                  <!-- Status (for edit mode) -->
                  <div class="col-md-6" v-if="isEditMode">
                    <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="status" 
                      v-model="formData.status"
                      :class="getFieldClass('status')"
                      :disabled="isSubmitting"
                      required
                      @change="validateFieldInline('status')"
                      @focus="clearFieldValidation('status')"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    <div class="form-text">Current status of the employee</div>
                    <div v-if="fieldErrors.status" class="invalid-feedback">{{ fieldErrors.status }}</div>
                  </div>

                  <!-- Address -->
                  <div class="col-12">
                    <label for="address" class="form-label">
                      Address <span class="text-muted">(Optional)</span>
                    </label>
                    <textarea 
                      class="form-control auto-expand-textarea" 
                      id="address" 
                      v-model="formData.address"
                      :class="getFieldClass('address')"
                      :disabled="isSubmitting"
                      rows="3"
                      placeholder="Enter complete address with street, city, state, and country..."
                      autocomplete="off"
                      autocapitalize="words"
                      autocorrect="off"
                      spellcheck="false"
                      @input="autoExpandTextarea"
                      @blur="validateFieldInline('address')"
                      @focus="clearFieldValidation('address')"
                      maxlength="500"
                      title="Address cannot exceed 500 characters"
                      style="white-space: pre-wrap; overflow-wrap: break-word;"
                    ></textarea>
                    <div class="form-text">
                      Include street address, city, state, and country. Textarea expands automatically as you type.
                    </div>
                    <div class="character-count text-end">
                      <small :class="getCounterClass(formData.address?.length || 0, 500)">
                        {{ formData.address?.length || 0 }}/500 characters
                      </small>
                    </div>
                    <div v-if="fieldErrors.address" class="invalid-feedback">{{ fieldErrors.address }}</div>
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
                  {{ isSubmitting ? (isEditMode ? 'Updating Employee...' : 'Adding Employee...') : (isEditMode ? 'Update Employee' : 'Add Employee') }}
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
  </div>

  <!-- Toast notifications are handled by ToastNotification component -->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { employeeService } from '@/services/employeeService'
import type { CreateEmployeeData } from '@/services/employeeService'
import { useToastStore } from '@/stores/toast'
import DateInput from '@/components/common/DateInput.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Check if we're in edit mode
const isEditMode = computed(() => route.name === 'edit-employee')
const employeeId = computed(() => isEditMode.value ? route.params.id as string : null)

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

// Form state - Enhanced validation system like the vendor form
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({}) // null = not validated, true = valid, false = invalid
const isSubmitting = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const formSubmitted = ref(false) // Track if form has been submitted

// Debounce helpers for email check
let emailCheckTimer: number | undefined
const isCheckingEmail = ref(false)

// Template refs
const employeeForm = ref<HTMLFormElement>()

// Enhanced validation system matching the vendor form
const getFieldClass = (fieldName: string) => {
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return {} // No validation styling before first submission attempt
  }
  
  return {
    'is-valid': fieldValidation[fieldName] === true,
    'is-invalid': fieldValidation[fieldName] === false || fieldErrors[fieldName]
  }
}

// Helper function to validate name fields (firstName, lastName)
const validateNameField = (fieldName: string, value: any): boolean => {
  if (!value) return true
  
  if (value.length < 2) {
    setFieldError(fieldName, `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`)
    return false
  }
  
  if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
    setFieldError(fieldName, `${fieldName === 'firstName' ? 'First' : 'Last'} name must be 2-50 characters (letters and spaces only)`)
    return false
  }
  
  return true
}

// Helper function to validate email field
const validateEmailField = (value: any): boolean => {
  if (!value) return true
  
  if (!String(value).includes('@')) {
    setFieldError('email', 'Please enter a valid email address')
    return false
  }
  
  checkEmailAvailability(value)
  return true
}

// Helper function to check email availability
const checkEmailAvailability = (value: any) => {
  if (emailCheckTimer) window.clearTimeout(emailCheckTimer)
  isCheckingEmail.value = true
  emailCheckTimer = window.setTimeout(async () => {
    try {
      const emailToCheck = String(value).trim()
      const excludeId = isEditMode.value ? (employeeId.value as string) : undefined
      const resp = await employeeService.checkEmailAvailability(emailToCheck, excludeId)
      const available = (resp as any)?.data?.available ?? (resp as any)?.available
      if (!available) {
        setFieldError('email', 'An employee with this email already exists')
      } else {
        setFieldValid('email')
      }
    } catch (e) {
      // On API error, do not block the user; keep current state
    } finally {
      isCheckingEmail.value = false
    }
  }, 400)
}

// Helper function to validate phone field
const validatePhoneField = (value: any): boolean => {
  if (!value) return true
  
  const strVal = String(value)
  
  // Treat bare prefix as empty (optional field)
  if (/^\+91\s?$/.test(strVal)) {
    formData.phone = '' as any
    const el = document.getElementById('phone') as HTMLInputElement
    if (el) el.value = ''
    setFieldValid('phone')
    return true
  }
  
  if (!strVal.startsWith('+91')) {
    setFieldError('phone', "Phone number must start with '+91'")
    return false
  }
  
  const digits = strVal.replace(/^\+91\s?/, '').replace(/\D/g, '')
  
  if (digits.length < 10) {
    setFieldError('phone', 'Phone number must be exactly 10 digits after +91')
    return false
  }
  
  if (digits.length > 10) {
    setFieldError('phone', 'Phone number cannot exceed 10 digits after +91')
    return false
  }
  
  return true
}

// Helper function to validate date of birth field
const validateDateOfBirthField = (value: any): boolean => {
  if (!value) return true
  
  const today = new Date()
  const birthDate = new Date(String(value))
  const minAge = new Date()
  minAge.setFullYear(today.getFullYear() - 100)
  const maxAge = new Date()
  maxAge.setFullYear(today.getFullYear() - 16)

  if (birthDate > today) {
    setFieldError('dateOfBirth', 'Date of birth cannot be in the future')
    return false
  }
  
  if (birthDate > maxAge) {
    setFieldError('dateOfBirth', 'Employee must be at least 16 years old')
    return false
  }
  
  if (birthDate < minAge) {
    setFieldError('dateOfBirth', 'Please enter a valid date of birth')
    return false
  }
  
  return true
}

// Helper function to validate specific field types
const validateFieldType = (fieldName: string, value: any): boolean => {
  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      return validateNameField(fieldName, value)
    case 'email':
      return validateEmailField(value)
    case 'phone':
      return validatePhoneField(value)
    case 'dateOfBirth':
      return validateDateOfBirthField(value)
    default:
      return true
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

  const isFieldValid = validateFieldType(fieldName, value)
  if (!isFieldValid) {
    return false
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
  // Clear error state on input if field was invalid
  if (fieldValidation[fieldName] === false && formData[fieldName as keyof typeof formData]?.toString().trim()) {
    validateFieldInline(fieldName)
  }
}

const formatNameField = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData] as string
  if (value && typeof value === 'string') {
    // Format: trim, remove extra spaces, capitalize first letter of each word
    const formatted = value
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .toLowerCase() // Convert to lowercase first
      .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
      .replace(/\s\w/g, (match) => match.toUpperCase()) // Capitalize first letter after space
    
    ;(formData as any)[fieldName] = formatted
  }
  
  // Call the original field input handler for validation
  handleFieldInput(fieldName)
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

// Input formatters matching the vendor form
const formatPhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  const prefix = '+91 '
  let raw = target.value || ''

  // Always enforce prefix
  if (!raw.startsWith('+91')) {
    raw = prefix + raw.replace(/^[^0-9+]*/, '')
  }

  // Keep only digits after the prefix, max 10
  let digits = raw.replace(/^\+91\s?/, '').replace(/\D/g, '')
  if (digits.length > 10) digits = digits.slice(0, 10)

  // Recompose
  const composed = digits.length ? `${prefix}${digits}` : prefix
  target.value = composed
  formData.phone = composed

  handleFieldInput('phone')
}

// Ensure prefix when focusing the phone field
const onPhoneFocus = (event: FocusEvent) => {
  clearFieldValidation('phone')
  const target = event.target as HTMLInputElement
  const prefix = '+91 '
  if (!target.value || !target.value.startsWith('+91')) {
    target.value = prefix
    formData.phone = prefix
  }
}

// Load employee data for editing
const loadEmployeeData = async () => {
  if (!isEditMode.value || !employeeId.value) return

  isLoading.value = true
  try {
    const response = await employeeService.getEmployee(employeeId.value)
    const employee = response.data.employee

    // Populate form with existing data
    formData.employeeId = employee.employeeId
    formData.firstName = employee.firstName
    formData.lastName = employee.lastName
    formData.email = employee.email
    formData.phone = formatPhoneFromApi(employee.phone)
    formData.dateOfBirth = employee.dateOfBirth || ''
    formData.address = employee.address || ''
    formData.status = employee.status || 'ACTIVE'

    // Auto-expand textareas if they have content
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
    toastStore.showError('Error', 'Failed to load employee data. Please try again.')
    router.push('/app/employees')
  } finally {
    isLoading.value = false
  }
}

// Helper function to validate form fields
const validateFormFields = async (): Promise<boolean> => {
  const allFields = Object.keys(formData)
  const validationResults = await Promise.all(
    allFields.map((fieldName) => validateFieldInline(fieldName))
  )
  return validationResults.every(Boolean)
}

// Helper function to handle validation errors
const handleValidationErrors = async () => {
  if (employeeForm.value) {
    employeeForm.value.classList.add('was-validated')
  }
  await nextTick()
  scrollToFirstError()
}

// Helper function to prepare employee data for update
const prepareUpdateData = () => {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: normalizePhoneForSubmit(formData.phone),
    dateOfBirth: formData.dateOfBirth || undefined,
    address: formData.address || undefined,
    status: formData.status
  }
}

// Helper function to prepare employee data for creation
const prepareCreateData = (): CreateEmployeeData => {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: normalizePhoneForSubmit(formData.phone),
    dateOfBirth: formData.dateOfBirth || undefined,
    address: formData.address || undefined
  }
}

// Helper function to handle successful update
const handleUpdateSuccess = () => {
  successMessage.value = generateEmployeeDetails()
  resetForm()
  toastStore.showSuccess('Success', successMessage.value)
}

// Helper function to handle successful creation
const handleCreateSuccess = () => {
  successMessage.value = generateEmployeeDetails()
  resetForm()
  router.push('/app/employees')
  setTimeout(() => {
    toastStore.showSuccess('Success', successMessage.value)
  }, 100)
}

// Helper function to handle errors
const handleSubmitError = (error: any) => {
  console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} employee:`, error)
  
  let errorMsg = `An error occurred while ${isEditMode.value ? 'updating' : 'adding'} the employee. Please try again.`
  
  if (error.response?.status === 409) {
    errorMsg = 'An employee with this email already exists.'
  } else if (error.response?.status === 400) {
    errorMsg = 'Server validation failed. Please check your data and try again.'
  } else if (error.response?.status === 404) {
    errorMsg = 'Employee not found.'
  } else if (error.response?.data?.message) {
    errorMsg = error.response.data.message
  }
  
  toastStore.showError('Error', errorMsg)
}

// Form submission with enhanced validation
const submitForm = async (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  formSubmitted.value = true

  const isFormValid = await validateFormFields()
  if (!isFormValid) {
    await handleValidationErrors()
    return
  }

  isSubmitting.value = true

  try {
    if (isEditMode.value && employeeId.value) {
      const employeeData = prepareUpdateData()
      await employeeService.updateEmployee(employeeId.value, employeeData)
      handleUpdateSuccess()
    } else {
      const employeeData = prepareCreateData()
      await employeeService.createEmployee(employeeData)
      handleCreateSuccess()
    }
  } catch (error: any) {
    handleSubmitError(error)
  } finally {
    isSubmitting.value = false
  }
}

// Helper methods
const generateEmployeeDetails = () => {
  let details = `${formData.firstName} ${formData.lastName}`.trim()
  if (formData.employeeId) {
    details += ` (${formData.employeeId})`
  }
  return details || 'Employee'
}

// Normalize phone to '+91 9999999999' or undefined
const normalizePhoneForSubmit = (val: string) => {
  if (!val) return undefined
  const match = val.match(/^\+91\s(\d{10})$/)
  if (match) return `+91 ${match[1]}`
  return undefined
}

// Format incoming API value to '+91 9999999999' or ''
const formatPhoneFromApi = (val?: string) => {
  if (!val) return ''
  const onlyDigits = val.replace(/\D/g, '')
  // If already in +91XXXXXXXXXX
  const match = val.match(/^\+91\s?(\d{10})$/)
  if (match) return `+91 ${match[1]}`
  // If 10 digits only, assume India code
  if (onlyDigits.length === 10) return `+91 ${onlyDigits}`
  // If 12 digits starting with 91, coerce
  if (onlyDigits.length === 12 && onlyDigits.startsWith('91')) return `+91 ${onlyDigits.slice(2)}`
  return ''
}

const resetForm = () => {
  // Cancel any pending email validation
  if (emailCheckTimer) {
    window.clearTimeout(emailCheckTimer)
    emailCheckTimer = undefined
  }
  isCheckingEmail.value = false
  
  // Reset form data
  Object.keys(formData).forEach(key => {
    if (key === 'status') {
      formData[key as keyof typeof formData] = 'ACTIVE' as any
    } else {
      formData[key as keyof typeof formData] = '' as any
    }
  })
  
  // Clear validation state
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])
  Object.keys(fieldValidation).forEach(key => {
    fieldValidation[key] = null
  })
  
  // Reset form state
  formSubmitted.value = false
  
  if (employeeForm.value) {
    employeeForm.value.classList.remove('was-validated')
  }

  // Clear all validation classes from DOM elements and reset textarea heights
  nextTick(() => {
    const fields = document.querySelectorAll('.is-valid, .is-invalid')
    fields.forEach(field => {
      field.classList.remove('is-valid', 'is-invalid')
      // Also clear any custom validity messages
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity('')
      }
    })
    
    // Reset textarea heights to minimum
    const textareas = document.querySelectorAll('.auto-expand-textarea') as NodeListOf<HTMLTextAreaElement>
    textareas.forEach(textarea => {
      textarea.style.height = '72px' // Reset to 3 rows
    })
  })
}

// Auto-expanding textarea functionality
const autoExpandTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  resizeTextarea(textarea)
}

// Helper function to resize a specific textarea
const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  if (!textarea) return
  
  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto'
  
  // Set the height to match the content
  const newHeight = Math.max(textarea.scrollHeight, 72) // Minimum 3 rows (24px per row)
  textarea.style.height = newHeight + 'px'
}

// Function to resize all textareas with content
const resizeAllTextareas = () => {
  const textareas = document.querySelectorAll('.auto-expand-textarea') as NodeListOf<HTMLTextAreaElement>
  textareas.forEach(textarea => {
    if (textarea.value.trim()) { // Only resize if there's content
      resizeTextarea(textarea)
    }
  })
}

const getCounterClass = (length: number, maxLength: number) => {
  const percentage = (length / maxLength) * 100
  if (percentage > 90) return 'text-danger'
  if (percentage > 75) return 'text-warning'
  return 'text-muted'
}

// Navigation methods
const goBack = () => {
  router.push('/app/employees')
}

// Removed functions - no longer needed with simple toast notifications

const scrollToFirstError = () => {
  // Hide any existing toasts (but keep this for other error toasts)
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())
  
  // Look for the first invalid input/select/textarea specifically
  const firstInvalid = document.querySelector('input.is-invalid, select.is-invalid, textarea.is-invalid, input:invalid, select:invalid, textarea:invalid') as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
  if (firstInvalid) {
    // Simple scroll to the first invalid field
    firstInvalid.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
    
    // Focus the field after scroll - simple and clean
    setTimeout(() => {
      firstInvalid.focus()
    }, 500)
  }
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

// Watchers for textarea auto-expansion
watch(() => formData.address, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const textarea = document.getElementById('address') as HTMLTextAreaElement
      if (textarea) {
        resizeTextarea(textarea)
      }
    })
  }
})

// Lifecycle
onMounted(async () => {
  // Make functions available globally
  ;(window as any).scrollToFirstError = scrollToFirstError
  
  if (isEditMode.value) {
    await loadEmployeeData()
  }
  
  // Focus on first field
  nextTick(() => {
    const firstField = document.getElementById('firstName')
    if (firstField) firstField.focus()
  })
})
</script>

<style scoped>
/* Import the unified form styles */
@import url('../../assets/unified-form-styles.css');

/* Additional component-specific styles */
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

/* Form fieldset styling */
.form-fieldset {
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.5rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
  background: rgba(248, 250, 252, 0.3);
  position: relative;
  width: 100% !important;
  box-sizing: border-box !important;
}

.form-fieldset:hover {
  border-color: #cbd5e1 !important;
  background: rgba(248, 250, 252, 0.5);
  transition: all 0.2s ease;
}

.form-legend {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #666666 !important;
  background-color: #ffffff !important;
  padding: 0.375rem 0.75rem !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.375rem !important;
  margin-bottom: 1rem !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: auto !important;
  float: none !important;
}

/* Enhanced form controls */
.form-control, .form-select {
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

.form-control:focus, .form-select:focus {
  border-color: #331FEA;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  outline: 2px solid transparent;
}

.form-control:hover, .form-select:hover {
  border-color: #6b7280;
}

/* Enhanced validation styling */
.was-validated .form-control:valid,
.was-validated .form-select:valid {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25) !important;
}

.was-validated .form-control:invalid,
.was-validated .form-select:invalid,
.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.25) !important;
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

/* Action buttons */
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

.btn-primary:hover {
  background-color: #2415c7 !important;
  border-color: #2415c7 !important;
}

.btn-outline-secondary {
  background-color: #f8f9fa !important;
  border: 2px solid #6c757d !important;
  color: #495057 !important;
  font-weight: 600;
}

.btn-outline-secondary:hover {
  background-color: #E97676 !important;
  border-color: #E97676 !important;
  color: #FFFFFF !important;
}

.btn:focus-visible {
  outline: 2px solid #331FEA;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
  }
  
  .form-actions {
    padding: 1rem;
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

@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important;
  }
  
  .form-actions {
    padding: 0.75rem;
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