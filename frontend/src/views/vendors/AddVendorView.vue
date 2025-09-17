<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
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
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Loading vendor data...</p>
            </div>
            
            <!-- Form -->
            <form v-else ref="vendorForm" class="needs-validation" @submit.prevent="submitForm" novalidate>
              
              <!-- Section 1: Basic Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Basic Information</legend>
                <div class="row g-4">
                  <!-- Vendor Name -->
                  <div class="col-md-6">
                    <label for="vendorName" class="form-label">Vendor Name <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="vendorName" 
                      v-model="formData.vendorName"
                      :class="getFieldClass('vendorName')"
                      placeholder="Enter vendor name" 
                      required 
                      minlength="2" 
                      maxlength="100"
                      pattern="[A-Za-z0-9\s\.\-&]{2,100}"
                      title="Vendor name must be 2-100 characters (letters, numbers, spaces, periods, hyphens, ampersands only)"
                      @blur="validateFieldInline('vendorName')"
                      @focus="clearFieldValidation('vendorName')"
                      @input="handleFieldInput('vendorName')"
                    >
                    <div class="form-text">Company or organization name (2-100 characters)</div>
                    <div v-if="fieldErrors.vendorName" class="invalid-feedback">{{ fieldErrors.vendorName }}</div>
                  </div>

                  <!-- Vendor Type -->
                  <div class="col-md-6">
                    <label for="vendorType" class="form-label">Vendor Type <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="vendorType" 
                      v-model="formData.vendorType"
                      :class="getFieldClass('vendorType')"
                      required
                      @change="validateFieldInline('vendorType')"
                      @focus="clearFieldValidation('vendorType')"
                    >
                      <option value="">Choose Type...</option>
                      <option value="SUPPLIER">Supplier</option>
                      <option value="SERVICE">Service Provider</option>
                      <option value="MANUFACTURER">Manufacturer</option>
                      <option value="DISTRIBUTOR">Distributor</option>
                      <option value="CONTRACTOR">Contractor</option>
                      <option value="BOTH">Supplier & Service Provider</option>
                    </select>
                    <div class="form-text">Select the primary type of vendor/service they provide (required)</div>
                    <div v-if="fieldErrors.vendorType" class="invalid-feedback">{{ fieldErrors.vendorType }}</div>
                  </div>

                  <!-- Status -->
                  <div class="col-md-6">
                    <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="status" 
                      v-model="formData.status"
                      :class="getFieldClass('status')"
                      required
                      @change="validateFieldInline('status')"
                      @focus="clearFieldValidation('status')"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                    <div class="form-text">Current status of the vendor relationship (required)</div>
                    <div v-if="fieldErrors.status" class="invalid-feedback">{{ fieldErrors.status }}</div>
                  </div>

                  <!-- Contact Person -->
                  <div class="col-md-6">
                    <label for="contactPerson" class="form-label">Contact Person <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="contactPerson" 
                      v-model="formData.contactPerson"
                      :class="getFieldClass('contactPerson')"
                      placeholder="Enter contact person name" 
                      maxlength="100"
                      pattern="[A-Za-z\s]{2,100}"
                      title="Contact person name must be 2-100 characters (letters and spaces only)"
                      @blur="validateFieldInline('contactPerson')"
                      @focus="clearFieldValidation('contactPerson')"
                      @input="handleFieldInput('contactPerson')"
                    >
                    <div class="form-text">Primary contact person at the vendor</div>
                    <div v-if="fieldErrors.contactPerson" class="invalid-feedback">{{ fieldErrors.contactPerson }}</div>
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
                      :class="getFieldClass('email')"
                      placeholder="vendor@company.com" 
                      maxlength="100"
                      title="Please enter a valid email address"
                      @blur="validateFieldInline('email')"
                      @focus="clearFieldValidation('email')"
                      @input="handleFieldInput('email')"
                    >
                    <div class="form-text">Primary email address for communication</div>
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
                      placeholder="+91 9876543210"
                      pattern="[\+]?[0-9\s\-\(\)]{10,20}"
                      title="Please enter a valid phone number"
                      @blur="validateFieldInline('phone')"
                      @focus="clearFieldValidation('phone')"
                      @input="formatPhoneNumber"
                    >
                    <div class="form-text">Include country code (e.g., +91 9876543210)</div>
                    <div v-if="fieldErrors.phone" class="invalid-feedback">{{ fieldErrors.phone }}</div>
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
                      rows="3"
                      placeholder="Enter complete address with street, city, state, and country..."
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
                      :class="getFieldClass('taxId')"
                      placeholder="Enter tax identification number" 
                      maxlength="50"
                      pattern="[A-Za-z0-9\-]{5,50}"
                      title="Tax ID must be 5-50 characters (letters, numbers, hyphens only)"
                      @blur="validateFieldInline('taxId')"
                      @focus="clearFieldValidation('taxId')"
                      @input="formatTaxId"
                    >
                    <div class="form-text">Tax identification number for your country</div>
                    <div v-if="fieldErrors.taxId" class="invalid-feedback">{{ fieldErrors.taxId }}</div>
                  </div>

                  <!-- PAN Number (India specific) -->
                  <div class="col-md-6">
                    <label for="panNumber" class="form-label">PAN Number <span class="text-muted">(India - Optional)</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="panNumber" 
                      v-model="formData.panNumber"
                      :class="getFieldClass('panNumber')"
                      placeholder="ABCDE1234F" 
                      maxlength="10"
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      title="PAN must be in format: ABCDE1234F (5 letters, 4 digits, 1 letter)"
                      @blur="validateFieldInline('panNumber')"
                      @focus="clearFieldValidation('panNumber')"
                      @input="formatPAN"
                    >
                    <div class="form-text">Permanent Account Number for Indian vendors (format: ABCDE1234F)</div>
                    <div v-if="fieldErrors.panNumber" class="invalid-feedback">{{ fieldErrors.panNumber }}</div>
                  </div>

                  <!-- Notes -->
                  <div class="col-12">
                    <label for="notes" class="form-label">
                      Additional Notes <span class="text-muted">(Optional)</span>
                    </label>
                    <textarea 
                      class="form-control auto-expand-textarea" 
                      id="notes" 
                      v-model="formData.notes"
                      :class="getFieldClass('notes')"
                      rows="3"
                      placeholder="Enter payment terms, special requirements, or other vendor information..."
                      @input="autoExpandTextarea"
                      @blur="validateFieldInline('notes')"
                      @focus="clearFieldValidation('notes')"
                      maxlength="1000"
                      title="Notes cannot exceed 1000 characters"
                      style="white-space: pre-wrap; overflow-wrap: break-word;"
                    ></textarea>
                    <div class="form-text">
                      Include payment terms, special requirements, or other relevant information. Textarea expands automatically as you type.
                    </div>
                    <div class="character-count text-end">
                      <small :class="getCounterClass(formData.notes?.length || 0, 1000)">
                        {{ formData.notes?.length || 0 }}/1000 characters
                      </small>
                    </div>
                    <div v-if="fieldErrors.notes" class="invalid-feedback">{{ fieldErrors.notes }}</div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          
          <!-- Action Buttons -->
          <div class="card-footer bg-light border-top">
            <div class="form-actions">
              <div class="d-flex justify-content-center gap-3">
                <button type="button" class="btn btn-outline-secondary px-4 py-2" @click="goBack">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary px-5 py-2" 
                  :disabled="isSubmitting || isLoading"
                  @click="submitForm"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? (isEditMode ? 'Updating Vendor...' : 'Adding Vendor...') : (isEditMode ? 'Update Vendor' : 'Add Vendor') }}
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

  <!-- Dynamic Toast Container - Created automatically by showToast function -->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VendorApiService from '../../services/vendorApi'
import type { CreateVendorDto, UpdateVendorDto, VendorStatus, VendorType, Vendor } from '../../types/vendor.types'
import { showToast, showErrorToast, showVendorSuccessToast } from '../../utils/toast'

const router = useRouter()
const route = useRoute()

// Check if we're in edit mode
const isEditMode = computed(() => route.name === 'edit-vendor')
const vendorId = computed(() => isEditMode.value ? parseInt(route.params.id as string) : null)

// Form data
const formData = reactive({
  vendorName: '',
  vendorType: '' as VendorType | '',
  status: 'ACTIVE' as VendorStatus,
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  taxId: '',
  panNumber: '',
  notes: ''
})

// Form state - Enhanced validation system like the prototype
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({}) // null = not validated, true = valid, false = invalid
const isSubmitting = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const formSubmitted = ref(false) // Track if form has been submitted

// Template refs
const vendorForm = ref<HTMLFormElement>()

// Enhanced validation system matching the prototype
const getFieldClass = (fieldName: string) => {
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return {} // No validation styling before first submission attempt
  }
  
  return {
    'is-valid': fieldValidation[fieldName] === true,
    'is-invalid': fieldValidation[fieldName] === false || fieldErrors[fieldName]
  }
}

const validateFieldInline = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
  if (!element) return false

  // Clear previous custom validity
  element.setCustomValidity('')

  // Check if field is required
  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '')) {
    setFieldError(fieldName, '') // No message needed - red styling shows it's required
    return false
  }

  // Additional custom validations based on field type
  switch (fieldName) {
    case 'vendorName':
      if (value && value.length < 2) {
        setFieldError(fieldName, 'Vendor name must be at least 2 characters')
        return false
      }
      if (value && !/^[A-Za-z0-9\s\.\-&]{2,100}$/.test(value)) {
        setFieldError(fieldName, 'Vendor name must be 2-100 characters (letters, numbers, spaces, periods, hyphens, ampersands only)')
        return false
      }
      break
    
    case 'contactPerson':
      if (value && value.length < 2) {
        setFieldError(fieldName, 'Contact person name must be at least 2 characters')
        return false
      }
      if (value && !/^[A-Za-z\s]{2,100}$/.test(value)) {
        setFieldError(fieldName, 'Contact person name must be 2-100 characters (letters and spaces only)')
        return false
      }
      break
    
    case 'email':
      if (value && !value.includes('@')) {
        setFieldError(fieldName, 'Please enter a valid email address')
        return false
      }
      break
    
    case 'phone':
      if (value && value.length < 10) {
        setFieldError(fieldName, 'Phone number must be at least 10 digits (e.g., +91 9876543210)')
        return false
      }
      break
    
    case 'taxId':
      if (value && value.length < 5) {
        setFieldError(fieldName, 'Tax ID must be at least 5 characters')
        return false
      }
      break
    
    case 'panNumber':
      if (value && value.length === 10) {
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
        if (!panPattern.test(value)) {
          setFieldError(fieldName, 'PAN format should be: ABCDE1234F (5 letters, 4 digits, 1 letter)')
          return false
        }
      }
      break
  }

  // Use native validation
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

// Input formatters matching the prototype
const formatPhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  // Allow only numbers, +, -, spaces, and parentheses
  target.value = target.value.replace(/[^0-9+\-\s\(\)]/g, '')
  formData.phone = target.value
  handleFieldInput('phone')
}

const formatTaxId = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.replace(/[^A-Za-z0-9\-]/g, '').toUpperCase()
  formData.taxId = target.value
  handleFieldInput('taxId')
}

const formatPAN = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  formData.panNumber = target.value
  handleFieldInput('panNumber')
}

// Load vendor data for editing
const loadVendorData = async () => {
  if (!isEditMode.value || !vendorId.value) return

  isLoading.value = true
  try {
    const response = await VendorApiService.getVendorById(vendorId.value)
    const vendor = response.data.vendor

    // Populate form with existing data
    formData.vendorName = vendor.name
    formData.vendorType = vendor.vendorType || ''
    formData.status = vendor.status
    formData.contactPerson = vendor.contactPerson || ''
    formData.email = vendor.email || ''
    formData.phone = vendor.phone || ''
    formData.address = vendor.address || ''
    formData.taxId = vendor.taxId || ''
    formData.panNumber = vendor.panNumber || ''
    formData.notes = vendor.notes || ''

    // Auto-expand textareas if they have content - multiple attempts to ensure it works
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
  } catch (error: any) {
    console.error('Error loading vendor data:', error)
    // This is a backend/API error, so show error toast
    showErrorToast('Failed to load vendor data. Please try again.')
    router.push('/app/vendors')
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

  // Validate all fields
  let isFormValid = true
  const requiredFields = ['vendorName', 'vendorType', 'status']
  const allFields = Object.keys(formData)

  allFields.forEach(fieldName => {
    if (!validateFieldInline(fieldName)) {
      isFormValid = false
    }
  })

  if (!isFormValid) {
    // Don't show error toast for validation errors - instead scroll to first error
    scrollToFirstError()
    // Add 'was-validated' class to show validation styling
    if (vendorForm.value) {
      vendorForm.value.classList.add('was-validated')
    }
    return
  }

  isSubmitting.value = true

  try {
    if (isEditMode.value && vendorId.value) {
      // Update existing vendor
      const vendorData: UpdateVendorDto = {
        name: formData.vendorName,
        vendorType: formData.vendorType as VendorType,
        contactPerson: formData.contactPerson || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        taxId: formData.taxId || undefined,
        panNumber: formData.panNumber || undefined,
        notes: formData.notes || undefined,
        status: formData.status
      }

      await VendorApiService.updateVendor(vendorId.value, vendorData)
      successMessage.value = generateVendorDetails()
      
      // Show success toast for edit mode with integrated redirect
      showVendorSuccessToast(successMessage.value, true)
    } else {
      // Create new vendor
      const vendorData: CreateVendorDto = {
        name: formData.vendorName,
        vendorType: formData.vendorType as VendorType,
        contactPerson: formData.contactPerson || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        taxId: formData.taxId || undefined,
        panNumber: formData.panNumber || undefined,
        notes: formData.notes || undefined,
        status: formData.status
      }

      await VendorApiService.createVendor(vendorData)
      successMessage.value = generateVendorDetails()
      
      // Show success toast for create mode with integrated redirect
      showVendorSuccessToast(successMessage.value, false)
    }
    
  } catch (error: any) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} vendor:`, error)
    
    // Handle specific backend/API errors - these should show error toasts
    let errorMsg = `An error occurred while ${isEditMode.value ? 'updating' : 'adding'} the vendor. Please try again.`
    
    if (error.response?.status === 409) {
      errorMsg = 'A vendor with this name or email already exists.'
    } else if (error.response?.status === 400) {
      errorMsg = 'Server validation failed. Please check your data and try again.'
    } else if (error.response?.status === 404) {
      errorMsg = 'Vendor not found.'
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    }
    
    // This is a backend/API error, so show error toast
    showErrorToast(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

// Helper methods
const generateVendorDetails = () => {
  let details = formData.vendorName
  if (formData.vendorType) {
    const typeLabels: Record<string, string> = {
      SUPPLIER: 'Supplier',
      SERVICE: 'Service Provider',
      MANUFACTURER: 'Manufacturer',
      DISTRIBUTOR: 'Distributor',
      CONTRACTOR: 'Contractor',
      BOTH: 'Supplier & Service Provider'
    }
    details += ` (${typeLabels[formData.vendorType]})`
  }
  return details || 'Vendor'
}

const resetForm = () => {
  // Reset form data
  Object.keys(formData).forEach(key => {
    if (key === 'status') {
      formData[key as keyof typeof formData] = 'ACTIVE' as VendorStatus
    } else {
      formData[key as keyof typeof formData] = ''
    }
  })
  
  // Clear validation state
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])
  Object.keys(fieldValidation).forEach(key => delete fieldValidation[key])
  
  // Reset form state
  formSubmitted.value = false
  
  if (vendorForm.value) {
    vendorForm.value.classList.remove('was-validated')
  }

  // Clear all validation classes from DOM elements and reset textarea heights
  nextTick(() => {
    const fields = document.querySelectorAll('.is-valid, .is-invalid')
    fields.forEach(field => {
      field.classList.remove('is-valid', 'is-invalid')
    })
    
    // Reset textarea heights to minimum
    const textareas = document.querySelectorAll('.auto-expand-textarea') as NodeListOf<HTMLTextAreaElement>
    textareas.forEach(textarea => {
      textarea.style.height = '72px' // Reset to 3 rows
    })
  })
}

// Toast methods - Using the reusable toast utility from @/utils/toast

// Auto-expanding textarea functionality
const autoExpandTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  resizeTextarea(textarea)
  
  // Update character counters
  updateCharacterCounters()
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

// Character counters
const updateCharacterCounters = () => {
  // Counter is handled in template reactively
}

const getCounterClass = (length: number, maxLength: number) => {
  const percentage = (length / maxLength) * 100
  if (percentage > 90) return 'text-danger'
  if (percentage > 75) return 'text-warning'
  return 'text-muted'
}

// Navigation methods
const goBack = () => {
  router.push('/app/vendors')
}

const addAnotherVendor = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if (window.bootstrap) {
      const toastInstance = window.bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  resetForm()
  showToast('Ready to add another vendor!', 'info')
  
  // Focus on first field
  nextTick(() => {
    const firstField = document.getElementById('vendorName')
    if (firstField) firstField.focus()
  })
}

const viewVendorList = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if (window.bootstrap) {
      const toastInstance = window.bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  showToast('Redirecting to Vendor List...', 'info')
  
  setTimeout(() => {
    router.push('/app/vendors')
  }, 1500)
}

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

// Lifecycle
onMounted(async () => {
  // Make functions available globally for toast buttons
  ;(window as any).addAnotherVendor = addAnotherVendor
  ;(window as any).scrollToFirstError = scrollToFirstError
  
  if (isEditMode.value) {
    await loadVendorData()
  }
  
  // Focus on first field
  nextTick(() => {
    const firstField = document.getElementById('vendorName')
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

/* Toast styling */
.toast {
  border-radius: 0.75rem !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
  border: 2px solid #B7B7B7 !important;
  min-width: 350px;
  max-width: 500px;
}

.toast-body {
  padding: 1rem 1.25rem;
  background-color: #ffffff;
  color: #212529;
  font-weight: 500;
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
