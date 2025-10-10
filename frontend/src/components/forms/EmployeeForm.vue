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
                <output aria-live="polite">Loading...</output>
              </div>
              <p class="mt-3 text-muted">Loading employee data...</p>
            </div>
            
            <!-- Form -->
            <form v-else ref="employeeForm" class="needs-validation" @submit.prevent="submitForm" @keydown.enter="handleEnterKey" novalidate autocomplete="off">
              
              <!-- Section 1: Basic Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Basic Information</legend>
                <div class="row g-4">
                  <!-- Employee ID (editable in both modes, validated to 4 digits 0001-9999) -->
                  <div class="col-md-6">
                    <label for="employeeId" class="form-label">Employee ID</label>
                    <div class="position-relative">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="employeeId" 
                        v-model="formData.employeeId"
                        :disabled="isSubmitting"
                        :class="getFieldClass('employeeId')"
                        :placeholder="nextAvailableEmployeeId"
                        title="Enter a 4-digit numeric Employee ID (0001-9999)"
                        required
                        inputmode="numeric"
                        maxlength="4"
                        @input="formatEmployeeId"
                        @blur="validateFieldInline('employeeId')"
                        @focus="clearFieldValidation('employeeId')"
                      >
                      <div v-if="isCheckingEmployeeId" class="position-absolute top-50 end-0 translate-middle-y me-3">
                        <div class="spinner-border spinner-border-sm text-primary">
                          <output class="visually-hidden">Checking...</output>
                        </div>
                      </div>
                    </div>
                    <div class="form-text">
                      4 digits only (0001 to 9999)
                      <span v-if="isLoadingEmployeeIds && !isEditMode" class="text-muted ms-2">
                        <i class="fas fa-spinner fa-spin me-1"></i>Finding next available ID...
                      </span>
                    </div>
                    <div v-if="fieldErrors.employeeId" class="invalid-feedback">{{ fieldErrors.employeeId }}</div>
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
                    <div class="position-relative">
                      <input 
                        type="email" 
                        class="form-control" 
                        id="email" 
                        v-model="formData.email"
                        :class="getFieldClass('email')"
                        :disabled="isSubmitting || isAdmin"
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
                        :style="isAdmin ? 'background-color: #F3F3F3;' : ''"
                      >
                      <div v-if="isCheckingEmail" class="position-absolute top-50 end-0 translate-middle-y me-3">
                        <div class="spinner-border spinner-border-sm text-primary">
                          <output class="visually-hidden">Checking...</output>
                        </div>
                      </div>
                    </div>
                    <div class="form-text">Corporate email address (required)</div>
                    <div v-if="fieldErrors.email" class="invalid-feedback">{{ fieldErrors.email }}</div>
                    <div v-if="isAdmin" class="form-text text-muted">
                      <i class="fas fa-info-circle me-1"></i>
                      Email address cannot be changed for admin employees
                    </div>
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
                    <DatePicker
                      :inputId="'dateOfBirth'"
                      label="Date of Birth (Optional)"
                      v-model="formData.dateOfBirth"
                      :inputClass="getFieldClass('dateOfBirth')"
                      :error-message="fieldErrors.dateOfBirth"
                      :disabled="isSubmitting"
                      help-text="Used for HR records and birthday notifications"
                      @change="validateFieldInline('dateOfBirth')"
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
                    <NotesTextarea 
                      v-model="formData.address"
                      label="Address"
                      placeholder="Enter complete address with street, city, state, and country..."
                      help-text="Include street address, city, state, and country. Textarea expands automatically as you type."
                      :max-length="500"
                      :required="false"
                      :show-label="true"
                      input-id="address"
                      @validation="() => {}"
                    />
                    <div v-if="fieldErrors.address" class="invalid-feedback">{{ fieldErrors.address }}</div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          
          <!-- Action Buttons -->
          <div class="card-footer">
            <div class="form-actions">
              <!-- Footer Start -->
              <div class="container">
                <!-- Row 1: Buttons -->
                <div class="row">
                  <div class="col-12 d-flex justify-content-center gap-3 mb-1">
                    <button type="button" class="btn btn-cancel" @click="goBack">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      class="btn btn-purple" 
                      :disabled="isSubmitting"
                      @click="submitForm"
                    >
                      <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                      {{ isSubmitting ? (isEditMode ? 'Updating Employee...' : 'Adding Employee...') : (isEditMode ? 'Update Employee' : 'Add Employee') }}
                    </button>
                  </div>
                </div>
                <!-- Row 2: Small Text -->
                <div class="row">
                  <div class="col-12 text-center">
                    <small class="text-muted">
                      Fields marked with <span class="text-danger">*</span> are required
                    </small>
                  </div>
                </div>
              </div>
              <!-- Container End -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { employeeService } from '@/services/business/employeeService'
import type { CreateEmployeeData, UpdateEmployeeData } from '@/services/business/employeeService'
import { useToastStore } from '@/stores/toast'
import DatePicker from '@/components/ui/date/DatePicker.vue'

// Type aliases
type EmployeeStatus = 'ACTIVE' | 'INACTIVE'
type FormFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const router = useRouter()
const toastStore = useToastStore()

// Props
interface Props {
  isEditMode?: boolean
  employeeId?: string
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  employeeId: undefined
})

// Form data
const formData = reactive({
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  status: 'ACTIVE' as EmployeeStatus
})

// Form state
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({})
const isSubmitting = ref(false)
const isLoading = ref(false)
const formSubmitted = ref(false)
const nextAvailableEmployeeId = ref('0001')
const isLoadingEmployeeIds = ref(false)

// Store original email for validation (edit mode)
const originalEmail = ref('')
const isAdmin = ref(false)
// Keep a snapshot of the originally loaded employee data for diffing on update
const originalData = ref<{
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  address?: string
  status: EmployeeStatus
} | null>(null)

// Debounce helpers for email and employeeId check
let emailCheckTimer: number | undefined
let employeeIdCheckTimer: number | undefined
const isCheckingEmail = ref(false)
const isCheckingEmployeeId = ref(false)

// Template refs
const employeeForm = ref<HTMLFormElement>()

// Function to get the next available employee ID from backend
const findLowestAvailableEmployeeId = async () => {
  isLoadingEmployeeIds.value = true
  try {
    const response = await employeeService.getNextAvailableEmployeeId()
    nextAvailableEmployeeId.value = response.data.employeeId
  } catch (error) {
    console.warn('Failed to fetch next available employee ID, using default placeholder:', error)
    nextAvailableEmployeeId.value = '0001'
  } finally {
    isLoadingEmployeeIds.value = false
  }
}

// Validation system
const getFieldClass = (fieldName: string) => {
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return {}
  }
  
  return {
    'is-valid': fieldValidation[fieldName] === true,
    'is-invalid': fieldValidation[fieldName] === false || fieldErrors[fieldName]
  }
}

// Field validators
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

const validateEmailField = (value: any): boolean => {
  if (!value) return true

  const email = String(value).trim()

  // Basic structure check with common-sense constraints
  const basicRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

  // Disallow consecutive dots and leading/trailing dots in local or domain
  const hasConsecutiveDots = /\.\./.test(email)
  const [local = '', domain = ''] = email.split('@')
  const localInvalid = local.startsWith('.') || local.endsWith('.')
  const domainInvalid = domain.startsWith('-') || domain.startsWith('.') || domain.endsWith('.') || domain.endsWith('-')

  if (!basicRegex.test(email) || hasConsecutiveDots || localInvalid || domainInvalid) {
    setFieldError('email', 'Please enter a valid email address')
    return false
  }

  // Only check availability if email changed (edit mode) or in add mode
  if (!props.isEditMode || email !== originalEmail.value) {
    checkEmailAvailability(email)
  }

  return true
}

const checkEmailAvailability = (value: any) => {
  if (emailCheckTimer) globalThis.clearTimeout(emailCheckTimer)
  isCheckingEmail.value = true
  emailCheckTimer = globalThis.setTimeout(async () => {
    try {
      const emailToCheck = String(value).trim()
      const excludeId = props.isEditMode ? formData.employeeId : undefined
      const resp = await employeeService.checkEmailAvailability(emailToCheck, excludeId)
      const available = (resp as any)?.data?.available ?? (resp as any)?.available
      if (available) {
        setFieldValid('email')
      } else {
        setFieldError('email', 'An employee with this email already exists')
      }
    } catch (e) {
      console.warn('Email availability check failed:', e)
    } finally {
      isCheckingEmail.value = false
    }
  }, 400)
}

// Check Employee ID availability (in add mode; in edit mode, check only if changed)
const checkEmployeeIdAvailability = (value: any) => {
  if (props.isEditMode && value === props.employeeId) {
    // Unchanged employeeId in edit mode - treat as valid
    setFieldValid('employeeId')
    return
  }
  if (employeeIdCheckTimer) globalThis.clearTimeout(employeeIdCheckTimer)
  isCheckingEmployeeId.value = true
  employeeIdCheckTimer = globalThis.setTimeout(async () => {
    try {
      const idToCheck = String(value).trim()
      if (!/^\d{4}$/.test(idToCheck) || idToCheck === '0000') {
        // Skip check if invalid format; inline validator will handle messaging
        return
      }
      const resp = await employeeService.checkEmployeeIdAvailability(idToCheck)
      const available = (resp as any)?.data?.available ?? (resp as any)?.data?.data?.available ?? (resp as any)?.available
      if (available) {
        setFieldValid('employeeId')
      } else {
        setFieldError('employeeId', 'An employee with this ID already exists')
      }
    } catch (e) {
      console.warn('Employee ID availability check failed:', e)
    } finally {
      isCheckingEmployeeId.value = false
    }
  }, 400)
}

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
  
  const digits = strVal.replace(/^\+91\s?/, '').replaceAll(/\D/g, '')
  
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

const validateFieldType = (fieldName: string, value: any): boolean => {
  switch (fieldName) {
    case 'employeeId': {
      const v = String(value || '')
      if (!/^\d{4}$/.test(v)) {
        setFieldError('employeeId', 'Employee ID must be exactly 4 digits (0001-9999)')
        return false
      }
      if (v === '0000') {
        setFieldError('employeeId', 'Employee ID cannot be 0000')
        return false
      }
      checkEmployeeIdAvailability(v)
      return true
    }
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
  const element = document.getElementById(fieldName) as FormFieldElement
  
  if (!element) return true

  // Only call setCustomValidity on native form controls
  if ('setCustomValidity' in element && typeof (element as any).setCustomValidity === 'function') {
    ;(element as any).setCustomValidity('')
  }

  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '')) {
    setFieldError(fieldName, '')
    return false
  }

  const isFieldValid = validateFieldType(fieldName, value)
  if (!isFieldValid) {
    return false
  }

  // If the element supports native validity checking, use it; otherwise treat as valid
  if ('checkValidity' in element && typeof (element as any).checkValidity === 'function') {
    if ((element as any).checkValidity()) {
      setFieldValid(fieldName)
      return true
    }
    setFieldError(fieldName, (element as any).validationMessage || `${getFieldDisplayName(fieldName)} is invalid`)
    return false
  }

  // Elements without native validity (e.g., custom components) are considered valid if our custom validation passed
  setFieldValid(fieldName)
  return true
}

const setFieldError = (fieldName: string, message: string) => {
  fieldErrors[fieldName] = message
  fieldValidation[fieldName] = false
  
  const element = document.getElementById(fieldName) as FormFieldElement
  if (element && 'setCustomValidity' in element && typeof (element as any).setCustomValidity === 'function') {
    ;(element as any).setCustomValidity(message)
  }
}

const setFieldValid = (fieldName: string) => {
  delete fieldErrors[fieldName]
  fieldValidation[fieldName] = true
  
  const element = document.getElementById(fieldName) as FormFieldElement
  if (element && 'setCustomValidity' in element && typeof (element as any).setCustomValidity === 'function') {
    ;(element as any).setCustomValidity('')
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

const formatNameField = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData] as string
  if (value && typeof value === 'string') {
    const formatted = value
      .trim()
      .replaceAll(/\s+/g, ' ')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())
      .replaceAll(/\s\w/g, (match) => match.toUpperCase())
    
    ;(formData as any)[fieldName] = formatted
  }
  
  handleFieldInput(fieldName)
}

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    employeeId: 'Employee ID',
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

// Input formatters
const formatPhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  const prefix = '+91 '
  let raw = target.value || ''

  if (!raw.startsWith('+91')) {
    raw = prefix + raw.replace(/^[^0-9+]*/, '')
  }

  let digits = raw.replace(/^\+91\s?/, '').replaceAll(/\D/g, '')
  if (digits.length > 10) digits = digits.slice(0, 10)

  const composed = digits.length ? `${prefix}${digits}` : prefix
  target.value = composed
  formData.phone = composed

  handleFieldInput('phone')
}

const onPhoneFocus = (event: FocusEvent) => {
  clearFieldValidation('phone')
  const target = event.target as HTMLInputElement
  const prefix = '+91 '
  if (!target.value || !target.value.startsWith('+91')) {
    target.value = prefix
    formData.phone = prefix
  }
}

// Ensure employeeId stays 4-digit numeric in add mode and auto-pad left
const formatEmployeeId = (event: Event) => {
  if (props.isEditMode) return
  const input = event.target as HTMLInputElement
  let digits = (input.value || '').replaceAll(/\D/g, '')
  if (digits.length > 4) digits = digits.slice(0, 4)
  input.value = digits
  formData.employeeId = digits
  handleFieldInput('employeeId')
}

// Load employee data for editing
const loadEmployeeData = async () => {
  if (!props.isEditMode || !props.employeeId) return

  isLoading.value = true
  try {
    const response = await employeeService.getEmployee(props.employeeId)
    const employee = response.data.employee

    formData.employeeId = employee.employeeId
    formData.firstName = employee.firstName
    formData.lastName = employee.lastName
    formData.email = employee.email
    formData.phone = formatPhoneFromApi(employee.phone)
    formData.dateOfBirth = employee.dateOfBirth || ''
    formData.address = employee.address || ''
    formData.status = employee.status || 'ACTIVE'

    originalEmail.value = employee.email
    isAdmin.value = employee.isAdmin || false

    // Capture original values in a normalized shape for accurate diffing
    originalData.value = {
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: normalizePhoneForSubmit(formatPhoneFromApi(employee.phone) as any),
      dateOfBirth: employee.dateOfBirth || undefined,
      address: employee.address || undefined,
      status: (employee.status || 'ACTIVE') as EmployeeStatus
    }

    nextTick(() => {
      resizeAllTextareas()
      setTimeout(() => resizeAllTextareas(), 100)
      setTimeout(() => resizeAllTextareas(), 300)
    })
  } catch (error: any) {
    console.error('Error loading employee data:', error)
    toastStore.showError('Error', 'Failed to load employee data. Please try again.')
    router.push('/app/employees')
  } finally {
    isLoading.value = false
  }
}

// Form submission
const submitForm = async (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  formSubmitted.value = true

  const isFormValid = await validateAllFields()
  if (!isFormValid) {
    await markFormInvalidAndFocus()
    return
  }

  isSubmitting.value = true

  try {
    if (props.isEditMode && props.employeeId) {
      const updatePayload = buildUpdateEmployeeData()
      const response = await employeeService.updateEmployee(props.employeeId, updatePayload)
      const employeeName = `${response.data.employee.firstName} ${response.data.employee.lastName}`
      navigateToListWithToast(`Employee ${employeeName} updated successfully!`)
    } else {
      const createPayload = buildCreateEmployeeData()
      await employeeService.createEmployee(createPayload)
      const employeeName = `${formData.firstName} ${formData.lastName}`
      navigateToListWithToast(`Employee ${employeeName} added successfully!`)
    }
  } catch (error: any) {
    console.error(`Error ${props.isEditMode ? 'updating' : 'creating'} employee:`, error)
    const errorMsg = mapEmployeeError(error, !!props.isEditMode)
    toastStore.showError('Error', errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

// Extracted helpers to reduce cognitive complexity
const validateAllFields = async (): Promise<boolean> => {
  const allFields = Object.keys(formData)
  const validationResults = await Promise.all(
    allFields.map((fieldName) => validateFieldInline(fieldName))
  )
  return validationResults.every(Boolean)
}

const markFormInvalidAndFocus = async () => {
  if (employeeForm.value) {
    employeeForm.value.classList.add('was-validated')
  }
  await nextTick()
  scrollToFirstError()
}

const buildUpdateEmployeeData = (): UpdateEmployeeData => {
  const current = {
    employeeId: String(formData.employeeId || ''),
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: normalizePhoneForSubmit(formData.phone),
    dateOfBirth: formData.dateOfBirth || undefined,
    address: formData.address || undefined,
    status: formData.status as EmployeeStatus
  }

  const base = originalData.value || {
    employeeId: props.employeeId || '',
    firstName: '',
    lastName: '',
    email: '',
    phone: undefined,
    dateOfBirth: undefined,
    address: undefined,
    status: 'ACTIVE' as EmployeeStatus
  }

  const payload: UpdateEmployeeData = {}

  if (current.firstName !== base.firstName) payload.firstName = current.firstName
  if (current.lastName !== base.lastName) payload.lastName = current.lastName

  // Email can only be updated if not admin
  if (!isAdmin.value && current.email !== base.email) (payload as any).email = current.email

  if (current.phone !== base.phone) payload.phone = current.phone
  if (current.dateOfBirth !== base.dateOfBirth) payload.dateOfBirth = current.dateOfBirth
  if (current.address !== base.address) payload.address = current.address
  if (current.status !== base.status) payload.status = current.status

  // Allow updating employeeId if changed and valid
  if (/^\d{4}$/.test(current.employeeId) && current.employeeId !== base.employeeId && current.employeeId !== '0000') {
    ;(payload as any).employeeId = current.employeeId
  }

  return payload
}

const buildCreateEmployeeData = (): CreateEmployeeData => {
  const paddedId = formData.employeeId ? formData.employeeId.padStart(4, '0') : ''
  return {
    employeeId: paddedId,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: normalizePhoneForSubmit(formData.phone),
    dateOfBirth: formData.dateOfBirth || undefined,
    address: formData.address || undefined
  }
}

const navigateToListWithToast = (message: string) => {
  router.push('/app/employees')
  setTimeout(() => {
    toastStore.showSuccess('Success', message)
  }, 100)
}

const mapEmployeeError = (error: any, isEdit: boolean): string => {
  const defaultMsg = `An error occurred while ${isEdit ? 'updating' : 'adding'} the employee. Please try again.`
  const status = error?.response?.status
  if (status === 409) return 'An employee with this email already exists.'
  if (status === 400) return 'Server validation failed. Please check your data and try again.'
  if (status === 404) return 'Employee not found.'
  return error?.response?.data?.message || defaultMsg
}

// Helper methods
const normalizePhoneForSubmit = (val: string) => {
  if (!val) return undefined
  const match = val.match(/^\+91\s(\d{10})$/)
  if (match) return `+91 ${match[1]}`
  return undefined
}

const formatPhoneFromApi = (val?: string) => {
  if (!val) return ''
  const onlyDigits = val.replaceAll(/\D/g, '')
  const match = val.match(/^\+91\s?(\d{10})$/)
  if (match) return `+91 ${match[1]}`
  if (onlyDigits.length === 10) return `+91 ${onlyDigits}`
  if (onlyDigits.length === 12 && onlyDigits.startsWith('91')) return `+91 ${onlyDigits.slice(2)}`
  return ''
}

// Auto-expanding textarea
const autoExpandTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  resizeTextarea(textarea)
}

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  if (!textarea) return
  textarea.style.height = 'auto'
  const newHeight = Math.max(textarea.scrollHeight, 72)
  textarea.style.height = newHeight + 'px'
}

const resizeAllTextareas = () => {
  const textareas = document.querySelectorAll('.auto-expand-textarea') as NodeListOf<HTMLTextAreaElement>
  for (const textarea of textareas) {
    if (textarea.value.trim()) {
      resizeTextarea(textarea)
    }
  }
}

// Run validation for all fields (used on initial load in edit mode)
const runInitialValidation = async () => {
  await nextTick()
  formSubmitted.value = true
  if (employeeForm.value) {
    employeeForm.value.classList.add('was-validated')
  }
  const fields = Object.keys(formData)
  await Promise.all(fields.map((f) => validateFieldInline(f)))
}

const getCounterClass = (length: number, maxLength: number) => {
  const percentage = (length / maxLength) * 100
  if (percentage > 90) return 'text-danger'
  if (percentage > 75) return 'text-warning'
  return 'text-muted'
}

const goBack = () => {
  router.push('/app/employees')
}

const scrollToFirstError = () => {
  const firstInvalid = document.querySelector('input.is-invalid, select.is-invalid, textarea.is-invalid, input:invalid, select:invalid, textarea:invalid') as HTMLElement
  
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
    
    setTimeout(() => {
      firstInvalid.focus()
    }, 500)
  }
}

// Keyboard navigation handler
const handleEnterKey = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement
  
  if (target.tagName === 'TEXTAREA') {
    return
  }
  
  event.preventDefault()
  
  const form = employeeForm.value
  if (!form) return
  
  const focusableElements = form.querySelectorAll(
    'input:not([readonly]):not([disabled]), select:not([disabled]), textarea:not([readonly]):not([disabled]), button:not([disabled])'
  ) as NodeListOf<HTMLElement>
  
  const currentIndex = Array.from(focusableElements).indexOf(target)
  const isLastField = currentIndex === focusableElements.length - 1
  
  if (isLastField || (target as HTMLInputElement).type === 'submit' || target.classList.contains('btn-purple')) {
    submitForm()
  } else {
    const nextElement = focusableElements[currentIndex + 1]
    if (nextElement) {
      nextElement.focus()
    }
  }
}

// Watchers
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
  if (props.isEditMode) {
    await loadEmployeeData()
    // Immediately validate all fields on landing in edit mode
    await runInitialValidation()
  } else {
    // In add mode, find the lowest available employee ID for placeholder
    await findLowestAvailableEmployeeId()
  }
  
  nextTick(() => {
    const targetId = props.isEditMode ? 'firstName' : 'employeeId'
    const targetField = document.getElementById(targetId)
    if (targetField) targetField.focus()
  })
})
</script>

<style scoped>
/* Import unified form styles (replaces old formValidation.css) */
@import url('../../assets/unified-form-styles.css');

/* Additional component-specific styles */
.auto-expand-textarea {
  transition: height 0.2s ease, border-color 0.2s ease;
  resize: none;
  overflow: hidden;
  min-height: 72px;
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

/* Enhanced validation styling */
.was-validated .form-control:valid,
.was-validated .form-select:valid {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25) !important;
}

/* Fix Bootstrap valid/invalid background icons tiling on selects */
.form-select.is-valid,
.was-validated .form-select:valid {
  background-repeat: no-repeat !important;
  background-position: right 0.75rem center !important;
  background-size: 1rem 1rem !important;
}

.form-select.is-invalid,
.was-validated .form-select:invalid {
  background-repeat: no-repeat !important;
  background-position: right 0.75rem center !important;
  background-size: 1rem 1rem !important;
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

