<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(10, 10, 10, 0.3) !important;">
          <div class="card-header bg-light border-bottom text-center py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div style="display: block;">
              <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">
                {{ isEditMode ? 'Edit Vendor' : 'Add New Vendor' }}
              </h4>
              <p class="text-muted mb-0 small" style="display: block;">
                {{ isEditMode ? 'Update vendor information' : 'Register a new supplier or service provider' }}
              </p>
            </div>
          </div>
          
          <!-- Card Body -->
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary">
                <output class="visually-hidden">Loading...</output>
              </div>
              <p class="mt-3 text-muted">Loading vendor data...</p>
            </div>
            
            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit" class="needs-validation" :class="{ 'was-validated': wasValidated }" novalidate>
              
              <!-- Section 1: Basic Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Basic Information</legend>
                <div class="row g-4">
                  <!-- Vendor Name -->
                  <div class="col-md-6">
                    <label for="vendorName" class="form-label">Vendor Name <span class="text-danger">*</span></label>
                    <div class="position-relative">
                      <input 
                        type="text" 
                        class="form-control" 
                        id="vendorName" 
                        v-model="formData.vendorName"
                        placeholder="Enter vendor name" 
                        required 
                        minlength="2" 
                        maxlength="100"
                        pattern="[A-Za-z0-9\s.&,']{2,100}"
                        title="Vendor name must be 2-100 characters (letters, numbers, spaces, periods, ampersands, commas, apostrophes only)"
                        @blur="validateField('vendorName')"
                        @focus="clearFieldError('vendorName')"
                        @input="formatToTitleCase"
                      >
                      <!-- Loading spinner for name checking -->
                      <div v-if="isCheckingName" class="position-absolute top-50 end-0 translate-middle-y me-3">
                        <div class="spinner-border spinner-border-sm text-primary">
                          <output class="visually-hidden">Checking...</output>
                        </div>
                      </div>
                    </div>
                    <div class="form-text">
                      Company or organization name (2-100 characters, letters, numbers, spaces, periods, hyphens, ampersands, commas)
                      <span v-if="isCheckingName" class="text-muted ms-2">
                        <i class="fas fa-spinner fa-spin me-1"></i>Checking availability...
                      </span>
                    </div>
                    <div v-if="errors.vendorName" class="invalid-feedback">{{ errors.vendorName }}</div>
                  </div>

                  <!-- Vendor Type -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="vendorType"
                        label="Vendor Type"
                        placeholder="Select vendor type..."
                        :items="vendorTypeItems"
                        v-model="selectedVendorType"
                        required
                        @change="onVendorTypeChange"
                      />
                    </div>
                    <div class="form-text">Select the primary type of vendor/service they provide (required)</div>
                    <!-- Error message hidden - red border is sufficient visual indication -->
                  </div>

                  <!-- Status -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="status"
                        label="Status"
                        :placeholder="props.disableStatus ? 'Active' : 'Select status...'"
                        :items="statusItems"
                        v-model="selectedStatus"
                        required
                        @change="onStatusChange"
                      />
                    </div>
                    <div class="form-text">
                      <span v-if="props.disableStatus">
                        New vendors are set to Active status
                      </span>
                      <span v-else>
                        Current status of the vendor relationship (required)
                      </span>
                    </div>
                    <!-- Error message hidden - red border is sufficient visual indication -->
                  </div>

                  <!-- Contact Person -->
                  <div class="col-md-6">
                    <label for="contactPerson" class="form-label">Contact Person <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="contactPerson" 
                      v-model="formData.contactPerson"
                      placeholder="Enter contact person name" 
                      maxlength="100"
                      pattern="[A-Za-z\s]{2,100}"
                      title="Contact person name must be 2-100 characters (letters and spaces only)"
                      @blur="validateField('contactPerson')"
                      @focus="clearFieldError('contactPerson')"
                      @input="formatContactPersonToTitleCase"
                    >
                    <div class="form-text">Primary contact person at the vendor</div>
                    <div v-if="errors.contactPerson" class="invalid-feedback">{{ errors.contactPerson }}</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Contact Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Contact Information</legend>
                <div class="row g-4">
                  <!-- Email -->
                  <div class="col-md-6">
                    <label for="email" class="form-label">Email Address <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="formData.email"
                      placeholder="vendor@company.com" 
                      maxlength="100"
                      title="Please enter a valid email address"
                      @blur="validateField('email')"
                      @focus="clearFieldError('email')"
                      @input="handleFieldInput('email')"
                    >
                    <div class="form-text">Primary email address for communication</div>
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                  </div>

                  <!-- Phone -->
                  <div class="col-md-6">
                    <label for="phone" class="form-label">Phone Number <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      v-model="formData.phone"
                      placeholder="+91 9999999999"
                      pattern="^\+91\s[0-9]{10}$"
                      title="Enter a 10-digit number with '+91' prefix (e.g., +91 9876543210)"
                      autocomplete="off"
                      autocapitalize="none"
                      autocorrect="off"
                      spellcheck="false"
                      inputmode="numeric"
                      @blur="validateField('phone')"
                      @focus="onPhoneFocus"
                      @input="formatPhoneNumber"
                    >
                    <div class="form-text">Format: +91 9999999999 (exactly 10 digits)</div>
                    <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
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
                      rows="3"
                      placeholder="Enter complete address with street, city, state, and country..."
                      @input="autoExpandTextarea"
                      @blur="validateField('address')"
                      @focus="clearFieldError('address')"
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
                    <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 3: Tax & Legal Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Tax & Legal Information</legend>
                <div class="row g-4">
                  <!-- Tax ID -->
                  <div class="col-md-6">
                    <label for="taxId" class="form-label">Tax ID <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="taxId" 
                      v-model="formData.taxId"
                      placeholder="Enter tax identification number" 
                      maxlength="50"
                      pattern="[A-Za-z0-9-]{5,50}"
                      title="Tax ID must be 5-50 characters (letters, numbers, hyphens only)"
                      @blur="validateField('taxId')"
                      @focus="clearFieldError('taxId')"
                      @input="formatTaxId"
                    >
                    <div class="form-text">Tax identification number for your country</div>
                    <div v-if="errors.taxId" class="invalid-feedback">{{ errors.taxId }}</div>
                  </div>

                  <!-- PAN Number (India specific) -->
                  <div class="col-md-6">
                    <label for="panNumber" class="form-label">PAN Number <span class="text-muted">(India - Optional)</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="panNumber" 
                      v-model="formData.panNumber"
                      placeholder="ABCDE1234F" 
                      maxlength="10"
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      title="PAN must be in format: ABCDE1234F (5 letters, 4 digits, 1 letter)"
                      @blur="validateField('panNumber')"
                      @focus="clearFieldError('panNumber')"
                      @input="formatPAN"
                    >
                    <div class="form-text">Permanent Account Number for Indian vendors (format: ABCDE1234F)</div>
                    <div v-if="errors.panNumber" class="invalid-feedback">{{ errors.panNumber }}</div>
                  </div>

                  <!-- Notes -->
                  <div class="col-12">
                    <NotesTextarea 
                      v-model="formData.notes"
                      label="Additional Notes"
                      placeholder="Enter payment terms, special requirements, or other vendor information..."
                      help-text="Include payment terms, special requirements, or other relevant information. Textarea expands automatically as you type."
                      :max-length="1000"
                      :required="false"
                      :show-label="true"
                      input-id="notes"
                      @validation="handleNotesValidation"
                    />
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
                  <div class="col-12 form-action-buttons mb-1">
                    <button type="button" class="btn btn-cancel" @click="handleCancel">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      class="btn btn-purple" 
                      :disabled="isSubmitting"
                      @click="handleSubmit"
                    >
                      <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                      {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Vendor' : 'Add Vendor') }}
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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import type { VendorStatus, VendorType, Vendor } from '@/types/vendor.types'
import NotesTextarea from '../common/NotesTextarea.vue'
import SearchableDropdown, { type Item } from '../common/SearchableDropdown.vue'
import VendorApiService from '@/services/api/vendorApi'

// Props
interface Props {
  vendor?: Vendor
  isEditMode?: boolean
  disableStatus?: boolean
  initialStatus?: VendorStatus
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  vendor: undefined,
  disableStatus: false,
  initialStatus: 'ACTIVE' as VendorStatus
})

// Emits
const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

// Reactive data
const formData = reactive({
  vendorName: '',
  vendorType: '' as VendorType | '',
  status: props.initialStatus,
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  taxId: '',
  panNumber: '',
  notes: ''
})

const errors = reactive({
  vendorName: '',
  vendorType: '',
  status: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  taxId: '',
  panNumber: '',
  notes: ''
})

const wasValidated = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(false)
const isCheckingName = ref(false)
const nameCheckTimeout = ref<number | null>(null)

// Store original vendor data for comparison (only in edit mode)
const originalVendorData = ref<any>(null)

// Selected items for SearchableDropdown components
const selectedVendorType = ref<Item | null>(null)
const selectedStatus = ref<Item | null>(null)

// Computed properties for SearchableDropdown items
const vendorTypeItems = computed(() => [
  { id: 'SUPPLIER', name: 'Supplier', value: 'SUPPLIER' },
  { id: 'SERVICE', name: 'Service Provider', value: 'SERVICE' },
  { id: 'MANUFACTURER', name: 'Manufacturer', value: 'MANUFACTURER' },
  { id: 'DISTRIBUTOR', name: 'Distributor', value: 'DISTRIBUTOR' },
  { id: 'CONTRACTOR', name: 'Contractor', value: 'CONTRACTOR' },
  { id: 'BOTH', name: 'Supplier & Service Provider', value: 'BOTH' }
])

const statusItems = computed(() => {
  if (props.disableStatus) {
    // Only show Active option for new vendors
    return [
      { id: 'ACTIVE', name: 'Active', value: 'ACTIVE' }
    ]
  } else {
    // Show both options for editing existing vendors
    return [
      { id: 'ACTIVE', name: 'Active', value: 'ACTIVE' },
      { id: 'INACTIVE', name: 'Inactive', value: 'INACTIVE' }
    ]
  }
})

// SearchableDropdown change handlers
const onVendorTypeChange = (item: Item | null) => {
  selectedVendorType.value = item
  formData.vendorType = item && item.value ? item.value.toString() as VendorType : '' as VendorType
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldError('vendorType')
  }
  
  validateField('vendorType')
}

const onStatusChange = (item: Item | null) => {
  selectedStatus.value = item
  formData.status = item && item.value ? item.value.toString() as VendorStatus : '' as VendorStatus
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldError('status')
  }
  
  validateField('status')
}


// Helper functions for field validation
const setFieldValidation = (element: HTMLElement, isValid: boolean, errorMessage: string = '', errorKey?: string) => {
  if (isValid) {
    element.classList.remove('is-invalid')
    element.classList.add('is-valid')
    if (errorKey) (errors as any)[errorKey] = ''
  } else {
    element.classList.add('is-invalid')
    element.classList.remove('is-valid')
    if (errorKey) (errors as any)[errorKey] = errorMessage
  }
}

const validateVendorName = (element: HTMLElement) => {
  const value = formData.vendorName
  if (!value || value.trim() === '') {
    setFieldValidation(element, false, '', 'vendorName')
  } else if (value.length < 2) {
    setFieldValidation(element, false, 'Vendor name must be at least 2 characters', 'vendorName')
  } else if (/^[A-Za-z0-9\s.&,']{2,100}$/.test(value)) {
    setFieldValidation(element, true, '', 'vendorName')
  } else {
    setFieldValidation(element, false, 'Vendor name must be 2-100 characters (letters, numbers, spaces, periods, ampersands, commas, apostrophes only)', 'vendorName')
  }
}

const validateContactPerson = (element: HTMLElement, value: any) => {
  if (value && value.length < 2) {
    setFieldValidation(element, false, 'Contact person name must be at least 2 characters', 'contactPerson')
  } else if (value && /^[A-Za-z\s]{2,100}$/.test(value)) {
    setFieldValidation(element, true, '', 'contactPerson')
  } else {
    setFieldValidation(element, false, 'Contact person name must be 2-100 characters (letters and spaces only)', 'contactPerson')
  }
}

const validateEmail = (element: HTMLElement, value: any) => {
  if (value && value.includes('@')) {
    setFieldValidation(element, true, '', 'email')
  } else {
    setFieldValidation(element, false, 'Please enter a valid email address', 'email')
  }
}

const validatePhone = (element: HTMLElement, value: any): boolean => {
  if (!value) return true
  
  const strVal = String(value)
  
  // Treat bare prefix as empty (optional field)
  if (/^\+91\s?$/.test(strVal)) {
    formData.phone = '' as any
    const el = document.getElementById('phone') as HTMLInputElement
    if (el) el.value = ''
    setFieldValidation(element, true, '', 'phone')
    return true
  }
  
  if (!strVal.startsWith('+91')) {
    setFieldValidation(element, false, "Phone number must start with '+91'", 'phone')
    return false
  }
  
  const digits = strVal.replace(/^\+91\s?/, '').replaceAll(/\D/g, '')
  
  if (digits.length < 10) {
    setFieldValidation(element, false, 'Phone number must be exactly 10 digits after +91', 'phone')
    return false
  }
  
  if (digits.length > 10) {
    setFieldValidation(element, false, 'Phone number cannot exceed 10 digits after +91', 'phone')
    return false
  }
  
  setFieldValidation(element, true, '', 'phone')
  return true
}

const validateTaxId = (element: HTMLElement, value: any) => {
  if (value && value.length < 5) {
    setFieldValidation(element, false, 'Tax ID must be at least 5 characters', 'taxId')
  } else {
    setFieldValidation(element, true, '', 'taxId')
  }
}

const validatePanNumber = (element: HTMLElement, value: any) => {
  if (value && value.length === 10) {
    const panPattern = /^[A-Z]{5}\d{4}[A-Z]$/
    if (panPattern.test(value)) {
      setFieldValidation(element, true, '', 'panNumber')
    } else {
      setFieldValidation(element, false, 'PAN format should be: ABCDE1234F (5 letters, 4 digits, 1 letter)', 'panNumber')
    }
  } else {
    setFieldValidation(element, true, '', 'panNumber')
  }
}

const validateAddress = (element: HTMLElement, value: any) => {
  if (value && value.length > 500) {
    setFieldValidation(element, false, 'Address cannot exceed 500 characters', 'address')
  } else {
    setFieldValidation(element, true, '', 'address')
  }
}

const validateRequiredDropdown = (fieldName: string, selectedValue: any) => {
  if (selectedValue) {
    (errors as any)[fieldName] = ''
    applyValidationToSearchableDropdown(fieldName, 'valid')
    console.log(`${fieldName} validation: VALID - selection made`)
  } else {
    (errors as any)[fieldName] = ''
    applyValidationToSearchableDropdown(fieldName, 'invalid')
    console.log(`${fieldName} validation: INVALID - no selection`)
  }
}

const validateOptionalField = (fieldName: string) => {
  (errors as any)[fieldName] = ''
  const textarea = document.getElementById('notes') as HTMLTextAreaElement
  if (textarea) {
    textarea.classList.add('is-valid')
    textarea.classList.remove('is-invalid')
  } else {
    console.warn('Could not find notes textarea element')
  }
}

// Validation configuration mapping
const validationHandlers = {
  vendorName: (element: HTMLElement) => validateVendorName(element),
  contactPerson: (element: HTMLElement, value: any) => validateContactPerson(element, value),
  email: (element: HTMLElement, value: any) => validateEmail(element, value),
  phone: (element: HTMLElement, value: any) => validatePhone(element, value),
  taxId: (element: HTMLElement, value: any) => validateTaxId(element, value),
  panNumber: (element: HTMLElement, value: any) => validatePanNumber(element, value),
  address: (element: HTMLElement, value: any) => validateAddress(element, value),
  vendorType: () => validateRequiredDropdown('vendorType', selectedVendorType.value),
  status: () => validateRequiredDropdown('status', selectedStatus.value),
  notes: () => validateOptionalField('notes')
}

const validateField = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
  if (!element) return false

  // Clear previous custom validity
  element.setCustomValidity('')

  const handler = validationHandlers[fieldName as keyof typeof validationHandlers]
  if (handler) {
    if (['vendorType', 'status', 'notes'].includes(fieldName)) {
      (handler as () => void)()
    } else {
      (handler as (element: HTMLElement, value: any) => void)(element, value)
    }
  }

  return true
}

// Helper function to apply validation classes to SearchableDropdown components
const applyValidationToSearchableDropdown = (fieldName: string, validationType: 'valid' | 'invalid') => {
  // Try multiple ways to find the SearchableDropdown input
  let input: HTMLInputElement | null = null
  
  // Method 1: Find by ID and then look for form-control in parent wrapper
  const element = document.getElementById(fieldName)
  if (element) {
    const wrapper = element.closest('.form-searchable-dropdown')
    if (wrapper) {
      input = wrapper.querySelector('.form-control') as HTMLInputElement
    }
  }
  
  // Method 2: If not found, try direct selector
  if (!input) {
    input = document.querySelector(`#${fieldName} .form-control`) as HTMLInputElement
  }
  
  // Method 3: If still not found, try finding by wrapper and then input
  if (!input) {
    const wrapper = document.querySelector(`#${fieldName}`)?.parentElement?.querySelector('.form-searchable-dropdown')
    if (wrapper) {
      input = wrapper.querySelector('.form-control') as HTMLInputElement
    }
  }
  
  // Method 4: Try finding by the wrapper that contains the fieldName
  if (!input) {
    const wrapper = document.querySelector(`.form-searchable-dropdown:has(#${fieldName})`)
    if (wrapper) {
      input = wrapper.querySelector('.form-control') as HTMLInputElement
    }
  }
  
  if (!input) {
    console.warn(`Could not find input for SearchableDropdown field: ${fieldName}`)
    return
  }

  // Apply validation classes
  if (validationType === 'invalid') {
    input.classList.add('is-invalid')
    input.classList.remove('is-valid')
    console.log(`Applied INVALID class to ${fieldName} SearchableDropdown`)
  } else {
    input.classList.add('is-valid')
    input.classList.remove('is-invalid')
    console.log(`Applied VALID class to ${fieldName} SearchableDropdown`)
  }
}

// Helper functions for clearing field errors
const clearSearchableDropdownError = (fieldName: string) => {
  const element = document.getElementById(fieldName)
  if (element) {
    const wrapper = element.closest('.form-searchable-dropdown')
    if (wrapper) {
      const input = wrapper.querySelector('.form-control') as HTMLInputElement
      if (input) {
        input.classList.remove('is-invalid')
      }
    }
  }
}

const clearTextareaError = (fieldName: string) => {
  const textarea = document.getElementById(fieldName) as HTMLTextAreaElement
  if (textarea) {
    textarea.classList.remove('is-invalid')
  }
}

const clearStandardFieldError = (fieldName: string) => {
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  if (element) {
    element.classList.remove('is-invalid')
  }
}

const clearFieldError = (fieldName: string) => {
  (errors as any)[fieldName] = ''
  
  const searchableDropdownFields = ['vendorType', 'status']
  
  if (searchableDropdownFields.includes(fieldName)) {
    clearSearchableDropdownError(fieldName)
  } else if (fieldName === 'notes') {
    clearTextareaError(fieldName)
  } else {
    clearStandardFieldError(fieldName)
  }
}

const handleFieldInput = (fieldName: string) => {
  // Clear error state on input if field was invalid and now has content
  if (errors[fieldName as keyof typeof errors] && formData[fieldName as keyof typeof formData]?.toString().trim()) {
    clearFieldError(fieldName)
  }
}

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    vendorName: 'Vendor Name',
    vendorType: 'Vendor Type',
    status: 'Status',
    contactPerson: 'Contact Person',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Address',
    taxId: 'Tax ID',
    panNumber: 'PAN Number',
    notes: 'Additional Notes'
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
  clearFieldError('phone')
  const target = event.target as HTMLInputElement
  const prefix = '+91 '
  if (!target.value || !target.value.startsWith('+91')) {
    target.value = prefix
    formData.phone = prefix
  }
}

const formatToTitleCase = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Convert to title case
  const titleCaseValue = (value as any).replaceAll(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
  
  target.value = titleCaseValue
  formData.vendorName = titleCaseValue
  handleFieldInput('vendorName')
  
  // Trigger debounced name check
  debouncedCheckVendorName(titleCaseValue)
}

// Debounced vendor name checking
const debouncedCheckVendorName = (name: string) => {
  // Clear existing timeout
  if (nameCheckTimeout.value) {
    clearTimeout(nameCheckTimeout.value)
  }
  
  // Don't check if name is too short or empty
  if (!name || name.trim().length < 2) {
    clearFieldError('vendorName')
    return
  }
  
  // Set new timeout
  nameCheckTimeout.value = setTimeout(() => {
    checkVendorNameExists(name.trim())
  }, 500) // 500ms delay
}

// Check if vendor name already exists
const checkVendorNameExists = async (name: string) => {
  if (!name || name.trim().length < 2) return
  
  isCheckingName.value = true
  
  try {
    const excludeId = props.isEditMode && props.vendor ? props.vendor.id : undefined
    const result = await VendorApiService.checkVendorNameExists(name, excludeId)
    
    if (result.data.available) {
      // Name is available
      errors.vendorName = ''
      const element = document.getElementById('vendorName') as HTMLInputElement
      if (element) {
        element.classList.remove('is-invalid')
        element.classList.add('is-valid')
      }
    } else {
      // Name already exists
      errors.vendorName = 'This vendor name already exists. Please choose a different name.'
      const element = document.getElementById('vendorName') as HTMLInputElement
      if (element) {
        element.classList.add('is-invalid')
        element.classList.remove('is-valid')
      }
    }
  } catch (error) {
    console.error('Error checking vendor name:', error)
    // Don't show error to user for API failures, just clear the validation state
    errors.vendorName = ''
    const element = document.getElementById('vendorName') as HTMLInputElement
    if (element) {
      element.classList.remove('is-invalid')
    }
  } finally {
    isCheckingName.value = false
  }
}

const formatContactPersonToTitleCase = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Convert to title case
  const titleCaseValue = (value as any).replaceAll(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
  
  target.value = titleCaseValue
  formData.contactPerson = titleCaseValue
  handleFieldInput('contactPerson')
}

const formatTaxId = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = (target.value as any).replaceAll(/[^A-Za-z0-9-]/g, '').toUpperCase()
  formData.taxId = target.value
  handleFieldInput('taxId')
}

const formatPAN = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = (target.value as any).replaceAll(/[^a-zA-Z0-9]/g, '').toUpperCase()
  formData.panNumber = target.value
  handleFieldInput('panNumber')
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
  for (const textarea of textareas) {
    if (textarea.value.trim()) { // Only resize if there's content
      resizeTextarea(textarea)
    }
  }
}

// Character counters
const getCounterClass = (length: number, maxLength: number) => {
  const percentage = (length / maxLength) * 100
  if (percentage > 90) return 'text-danger'
  if (percentage > 75) return 'text-warning'
  return 'text-muted'
}

const validateForm = (): boolean => {
  let isValid = true
  
  // Validate required fields
  const requiredFields = ['vendorName', 'vendorType', 'status']
  
  for (const fieldName of requiredFields) {
    validateField(fieldName)
    
    // Special handling for SearchableDropdown fields
    if ((fieldName === 'vendorType' && !selectedVendorType.value) || 
        (fieldName === 'status' && !selectedStatus.value) || 
        errors[fieldName as keyof typeof errors]) {
      isValid = false
    }
  }

  // Also validate optional fields to show green borders
  const optionalFields = ['contactPerson', 'email', 'phone', 'address', 'taxId', 'panNumber', 'notes']
  for (const fieldName of optionalFields) {
    validateField(fieldName)
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
    // Prepare vendor data based on mode
    const vendorData = props.isEditMode && originalVendorData.value
      ? buildEditModeVendorData()
      : {
          name: formData.vendorName,
          vendorType: formData.vendorType as VendorType,
          contactPerson: formData.contactPerson || undefined,
          email: formData.email || undefined,
          phone: normalizePhoneForSubmit(formData.phone),
          address: formData.address || undefined,
          taxId: formData.taxId || undefined,
          panNumber: formData.panNumber || undefined,
          notes: formData.notes || undefined,
          status: formData.status
        }

    emit('submit', vendorData)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
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

const hasChanged = (newVal: any, oldVal: any): boolean => {
  const normalizeEmpty = (val: any) => (!val || val === '' ? null : val)
  const normalizedNew = normalizeEmpty(newVal)
  const normalizedOld = normalizeEmpty(oldVal)
  
  if (typeof normalizedNew === 'number' || typeof normalizedOld === 'number') {
    return String(normalizedNew) !== String(normalizedOld)
  }
  
  return normalizedNew !== normalizedOld
}

const buildEditModeVendorData = (): any => {
  const original = originalVendorData.value
  const vendorData: any = {}

  const fieldMappings = [
    { formKey: 'vendorName', dataKey: 'name' },
    { formKey: 'vendorType', dataKey: 'vendorType' },
    { formKey: 'status', dataKey: 'status' },
    { formKey: 'contactPerson', dataKey: 'contactPerson', transform: (val: any) => val || undefined },
    { formKey: 'email', dataKey: 'email', transform: (val: any) => val || undefined },
    { formKey: 'phone', dataKey: 'phone', transform: (val: any) => normalizePhoneForSubmit(val) },
    { formKey: 'address', dataKey: 'address', transform: (val: any) => val || undefined },
    { formKey: 'taxId', dataKey: 'taxId', transform: (val: any) => val || undefined },
    { formKey: 'panNumber', dataKey: 'panNumber', transform: (val: any) => val || undefined },
    { formKey: 'notes', dataKey: 'notes', transform: (val: any) => val || undefined }
  ]

  for (const { formKey, dataKey, transform } of fieldMappings) {
    const formValue = (formData as any)[formKey]
    const originalValue = (original as any)[formKey]
    
    if (hasChanged(formValue, originalValue)) {
      vendorData[dataKey] = transform ? transform(formValue) : formValue
    }
  }

  return vendorData
}

// Handle notes validation
const handleNotesValidation = (isValid: boolean, errorMessage?: string) => {
  if (!isValid && errorMessage) {
    errors.notes = errorMessage
  } else {
    errors.notes = ''
  }
}

// Initialize form data if editing
// Helper functions for form initialization
const populateFormDataFromVendor = (vendor: any) => {
  formData.vendorName = vendor.name
  formData.vendorType = vendor.vendorType || ''
  formData.status = vendor.status
  formData.contactPerson = vendor.contactPerson || ''
  formData.email = vendor.email || ''
  formData.phone = formatPhoneFromApi(vendor.phone)
  formData.address = vendor.address || ''
  formData.taxId = vendor.taxId || ''
  formData.panNumber = vendor.panNumber || ''
  formData.notes = vendor.notes || ''
  
  // Store original data for change tracking
  originalVendorData.value = {
    vendorName: vendor.name,
    vendorType: vendor.vendorType || '',
    status: vendor.status,
    contactPerson: vendor.contactPerson || '',
    email: vendor.email || '',
    phone: formatPhoneFromApi(vendor.phone),
    address: vendor.address || '',
    taxId: vendor.taxId || '',
    panNumber: vendor.panNumber || '',
    notes: vendor.notes || ''
  }
}

const setSelectedDropdownItems = (vendor: any) => {
  if (vendor.vendorType) {
    const vendorTypeOption = vendorTypeItems.value.find(item => item.value === vendor.vendorType)
    if (vendorTypeOption) {
      selectedVendorType.value = vendorTypeOption
    }
  }
  
  if (vendor.status) {
    const statusOption = statusItems.value.find(item => item.value === vendor.status)
    if (statusOption) {
      selectedStatus.value = statusOption
    }
  }
}

const autoExpandTextareas = () => {
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
}

const initializeEditMode = (vendor: any) => {
  populateFormDataFromVendor(vendor)
  setSelectedDropdownItems(vendor)
  autoExpandTextareas()
}

const initializeNewVendor = () => {
  if (props.disableStatus) {
    // Set status to ACTIVE when disabled (for new vendors)
    formData.status = 'ACTIVE' as VendorStatus
    selectedStatus.value = {
      id: 'ACTIVE',
      name: 'Active',
      value: 'ACTIVE'
    }
  } else {
    // Don't set default status - user must make selection
    formData.status = '' as VendorStatus
    selectedStatus.value = null
  }
  
  // Don't set default vendor type - user must choose
  formData.vendorType = '' as VendorType
  selectedVendorType.value = null
}

onMounted(async () => {
  isLoading.value = true
  try {
    if (props.isEditMode && props.vendor) {
      initializeEditMode(props.vendor)
    } else {
      initializeNewVendor()
    }
  } catch (error) {
    console.error('Error loading vendor data:', error)
  } finally {
    isLoading.value = false
  }
})

// Cleanup timeout on unmount
onUnmounted(() => {
  if (nameCheckTimeout.value) {
    clearTimeout(nameCheckTimeout.value)
  }
})

// Watch for vendor prop changes to populate form data
watch(() => props.vendor, (newVendor) => {
  if (newVendor && props.isEditMode) {
    // Populate form with existing data
    formData.vendorName = newVendor.name
    formData.vendorType = newVendor.vendorType || ''
    formData.status = newVendor.status
    formData.contactPerson = newVendor.contactPerson || ''
    formData.email = newVendor.email || ''
    formData.phone = formatPhoneFromApi(newVendor.phone)
    formData.address = newVendor.address || ''
    formData.taxId = newVendor.taxId || ''
    formData.panNumber = newVendor.panNumber || ''
    formData.notes = newVendor.notes || ''

    // Set selected items for SearchableDropdown components
    if (newVendor.vendorType) {
      const vendorTypeOption = vendorTypeItems.value.find(item => item.value === newVendor.vendorType)
      if (vendorTypeOption) {
        selectedVendorType.value = vendorTypeOption
      }
    }
    
    if (newVendor.status) {
      const statusOption = statusItems.value.find(item => item.value === newVendor.status)
      if (statusOption) {
        selectedStatus.value = statusOption
      }
    }

    // Auto-expand textareas if they have content
    nextTick(() => {
      resizeAllTextareas()
      
      // Also try again after a short delay in case Vue hasn't fully updated
      setTimeout(() => {
        resizeAllTextareas()
      }, 300)
    })
  }
}, { immediate: true })

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

watch(() => formData.notes, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const textarea = document.getElementById('notes') as HTMLTextAreaElement
      if (textarea) {
        resizeTextarea(textarea)
      }
    })
  }
})
</script>

<style scoped>
@import url('../../assets/unified-form-styles.css');
</style>
