<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(10, 10, 10, 0.3) !important;">
          <div class="card-header bg-light border-bottom text-center py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div style="display: block;">
              <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">Issue Asset to Employee</h4>
              <p class="text-muted mb-0 small" style="display: block;">Assign an available asset to an employee</p>
            </div>
          </div>
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary">
                <output class="visually-hidden">Loading...</output>
              </div>
              <p class="mt-3 text-muted">Loading form data...</p>
            </div>
            
            <!-- Form -->
            <form v-else ref="issueAssetForm" class="needs-validation" @submit.prevent="submitForm" novalidate>
              
              <!-- Section 1: Asset Selection -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Asset Selection</legend>
                <div class="row g-4">
                  <!-- Asset ID -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="assetId"
                        label="Asset ID"
                        placeholder="Search assets..."
                        :items="assetItems"
                        v-model="selectedAsset"
                        required
                        @change="onAssetChange"
                      />
                    </div>
                    <div class="form-text">Select from available assets only (required)</div>
                  </div>

                  <!-- Asset Brand-Model -->
                  <div class="col-md-6">
                    <label for="assetBrandModel" class="form-label">Asset Brand-Model</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="assetBrandModel" 
                      v-model="formData.assetBrandModel"
                      readonly 
                      style="background-color: #F3F3F3;" 
                      placeholder="Auto-filled from selection"
                    >
                    <div class="form-text">Automatically populated based on asset selection</div>
                  </div>
                </div>

                <!-- Asset Specifications -->
                <div v-if="selectedAssetSpecs" class="mt-4">
                  <div class="asset-specifications-wrapper">
                    <NotesTextarea 
                      :model-value="selectedAssetSpecs"
                      label="Asset Specifications"
                      placeholder="No specifications available"
                      help-text=""
                      :max-length="1000"
                      :required="false"
                      :show-label="true"
                      :readonly="true"
                      input-id="assetSpecifications"
                      @validation="() => {}"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Employee Selection -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Employee Selection</legend>
                <div class="row g-4">
                  <!-- Employee ID - Name -->
                  <div class="col-12">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="employeeId"
                        label="Employee ID - Name"
                        placeholder="Search employees..."
                        :items="employeeItems"
                        v-model="selectedEmployee"
                        required
                        @change="onEmployeeChange"
                      />
                    </div>
                    <div class="form-text">Select active employee from the list (required)</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 3: Assignment Details -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Assignment Details</legend>
                <div class="row g-4">
                  <!-- Assignment Reason -->
                  <div class="col-md-6">
                    <label for="assignmentReason" class="form-label">Assignment Reason <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="assignmentReason" 
                      v-model="formData.assignmentReason"
                      :class="getFieldClass('assignmentReason')"
                      placeholder="e.g., Work laptop, Project requirement" 
                      required 
                      minlength="5" 
                      maxlength="100" 
                      title="Assignment reason must be 5-100 characters and start with a capital letter"
                      @blur="validateFieldInline('assignmentReason')"
                      @focus="clearFieldValidation('assignmentReason')"
                      @input="handleAssignmentReasonInput"
                    >
                    <div class="form-text">Specify the reason for this assignment - 5-100 characters</div>
                    <div v-if="fieldErrors.assignmentReason" class="invalid-feedback">{{ fieldErrors.assignmentReason }}</div>
                  </div>

                  <!-- Assignment Date -->
                  <div class="col-md-6">
                    <DateInput
                      id="assignmentDate"
                      label="Assignment Date *"
                      v-model="formData.assignmentDate"
                      :error-message="fieldErrors.assignmentDate"
                      help-text="Date when the asset will be assigned"
                      required
                      @change="validateFieldInline('assignmentDate')"
                      @blur="clearFieldValidation('assignmentDate')"
                    />
                  </div>

                  <!-- Assignment Notes -->
                  <div class="col-12">
                    <NotesTextarea 
                      v-model="formData.assignmentNotes"
                      label="Assignment Notes"
                      placeholder="Enter assignment notes..."
                      help-text="Include special instructions, conditions, or other relevant information."
                      :max-length="500"
                      :required="false"
                      :show-label="true"
                      input-id="assignmentNotes"
                      @validation="handleNotesValidation"
                    />
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
                  class="btn btn-success px-5 py-2" 
                  :disabled="isSubmitting"
                  @click="submitForm"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? 'Issuing Asset...' : 'Issue Asset' }}
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { assignmentApiService, type CreateAssignmentDto } from '../../services/assignmentApi'
import { assetApiService, type Asset } from '../../services/assetApi'
import { employeeApiService, type Employee } from '../../services/employeeApi'
import SearchableDropdown, { type Item } from '../../components/common/SearchableDropdown.vue'
import NotesDisplay from '../../components/common/NotesDisplay.vue'
import NotesTextarea from '../../components/common/NotesTextarea.vue'
import DateInput from '../../components/common/DateInput.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Track the origin path to redirect back after success
const originPath = ref<string>('/app/assets')
// Form data
const formData = reactive({
  assetId: '',
  assetBrandModel: '',
  employeeId: '',
  assignmentReason: '',
  assignmentDate: '',
  assignmentNotes: ''
})

// Selected items for SearchableDropdown components
const selectedAsset = ref<Item | null>(null)
const selectedEmployee = ref<Item | null>(null)

// Computed property for selected asset specifications
const selectedAssetSpecs = ref<string | null>(null)

// Form state - Enhanced validation system like the prototype
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({}) // null = not validated, true = valid, false = invalid
const isSubmitting = ref(false)
const isLoading = ref(false)
const formSubmitted = ref(false) // Track if form has been submitted

// Template refs
const issueAssetForm = ref<HTMLFormElement>()

// API data
const availableAssets = ref<Asset[]>([])
const activeEmployees = ref<Employee[]>([])
const isLoadingAssets = ref(false)
const isLoadingEmployees = ref(false)

// Transform API data to SearchableDropdown format
const assetItems = computed(() => {
  return availableAssets.value.map(asset => ({
    id: asset.id,
    name: `${asset.assetId} - ${asset.serialNumber}`,
    value: asset.id.toString()
  }))
})

const employeeItems = computed(() => {
  return activeEmployees.value.map(employee => ({
    id: employee.id,
    name: `${employee.employeeId} - ${employee.firstName} ${employee.lastName}`,
    value: employee.id.toString()
  }))
})


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

// SearchableDropdown change handlers
const onAssetChange = (item: Item | null) => {
  selectedAsset.value = item
  formData.assetId = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('assetId')
  }
  
  validateFieldInline('assetId')
}

const onEmployeeChange = (item: Item | null) => {
  selectedEmployee.value = item
  formData.employeeId = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('employeeId')
  }
  
  validateFieldInline('employeeId')
}

// Helper function to apply validation classes to SearchableDropdown components
const applyValidationToSearchableDropdown = (fieldName: string, validationType: 'valid' | 'invalid') => {
  // Find the SearchableDropdown input by ID
  const input = document.getElementById(fieldName) as HTMLInputElement
  
  if (!input) {
    console.warn(`Could not find input for SearchableDropdown field: ${fieldName}`)
    return
  }

  // Apply validation classes
  if (validationType === 'invalid') {
    input.classList.add('is-invalid')
    input.classList.remove('is-valid')
  } else {
    input.classList.add('is-valid')
    input.classList.remove('is-invalid')
  }
}

// Helper functions for field validation
const validateRequiredField = (fieldName: string, value: any, element: HTMLElement): boolean => {
  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '')) {
    setFieldError(fieldName, '') // No message needed - red styling shows it's required
    return false
  }
  
  return true
}

const validateRequiredDropdown = (fieldName: string, selectedValue: any): boolean => {
  if (!selectedValue) {
    setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
    applyValidationToSearchableDropdown(fieldName, 'invalid')
    return false
  } else {
    setFieldValid(fieldName)
    applyValidationToSearchableDropdown(fieldName, 'valid')
    return true
  }
}

const validateAssignmentReason = (fieldName: string, value: any): boolean => {
  if (!value) return true
  
  if (value.length < 5) {
    setFieldError(fieldName, 'Assignment reason must be at least 5 characters')
    return false
  }
  
  if (value.length > 100) {
    setFieldError(fieldName, 'Assignment reason cannot exceed 100 characters')
    return false
  }
  
  // Check if first letter is capitalized
  if (value.length > 0 && value.charAt(0) !== value.charAt(0).toUpperCase()) {
    setFieldError(fieldName, 'Assignment reason must start with a capital letter')
    return false
  }
  
  // Check for valid characters (letters, numbers, spaces, common punctuation)
  if (!/^[A-Za-z0-9\s.,!?()-]+$/.test(value)) {
    setFieldError(fieldName, 'Assignment reason contains invalid characters')
    return false
  }
  
  return true
}

const validateAssignmentDate = (fieldName: string, value: any): boolean => {
  if (!value) return true
  
  const today = new Date().toISOString().split('T')[0]
  if (value < today) {
    setFieldError(fieldName, 'Assignment date cannot be in the past')
    return false
  }
  
  return true
}

const validateStandardField = (fieldName: string, element: HTMLElement): boolean => {
  const inputElement = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  if (inputElement.checkValidity()) {
    setFieldValid(fieldName)
    return true
  } else {
    setFieldError(fieldName, inputElement.validationMessage || `${getFieldDisplayName(fieldName)} is invalid`)
    return false
  }
}

// Validation configuration mapping
const validationHandlers = {
  assetId: () => validateRequiredDropdown('assetId', selectedAsset.value),
  employeeId: () => validateRequiredDropdown('employeeId', selectedEmployee.value),
  assignmentReason: (value: any) => validateAssignmentReason('assignmentReason', value),
  assignmentDate: (value: any) => validateAssignmentDate('assignmentDate', value)
}

const validateFieldInline = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
  if (!element) return false

  // Clear previous custom validity
  element.setCustomValidity('')

  // Check if field is required
  if (!validateRequiredField(fieldName, value, element)) {
    return false
  }

  // Handle specific field validations
  const handler = validationHandlers[fieldName as keyof typeof validationHandlers]
  if (handler) {
    if (['assignmentReason', 'assignmentDate'].includes(fieldName)) {
      return (handler as (value: any) => boolean)(value)
    } else {
      return (handler as () => boolean)()
    }
  }

  // For SearchableDropdown fields, we've already handled validation above
  const searchableDropdownFields = ['assetId', 'employeeId']
  if (searchableDropdownFields.includes(fieldName)) {
    return true // Already validated above
  }

  // Use native validation for other fields
  return validateStandardField(fieldName, element)
}

const setFieldError = (fieldName: string, message: string) => {
  fieldErrors[fieldName] = message
  fieldValidation[fieldName] = false
  
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  if (element) {
    element.setCustomValidity(message)
  }
  
  // Apply validation classes to SearchableDropdown fields
  const searchableDropdownFields = ['assetId', 'employeeId']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'invalid')
  }
}

const setFieldValid = (fieldName: string) => {
  delete fieldErrors[fieldName]
  fieldValidation[fieldName] = true
  
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  if (element) {
    element.setCustomValidity('')
  }
  
  // Apply validation classes to SearchableDropdown fields
  const searchableDropdownFields = ['assetId', 'employeeId']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'valid')
  }
}

const clearFieldValidation = (fieldName: string) => {
  if (fieldValidation[fieldName] === false) {
    fieldValidation[fieldName] = null
    delete fieldErrors[fieldName]
  }
  
  // Also clear validation for SearchableDropdown components
  const searchableDropdownFields = ['assetId', 'employeeId']
  if (searchableDropdownFields.includes(fieldName)) {
    const input = document.getElementById(fieldName) as HTMLInputElement
    if (input) {
      input.classList.remove('is-invalid', 'is-valid')
    }
  }
}

const handleFieldInput = (fieldName: string) => {
  // Clear error state on input if field was invalid
  if (fieldValidation[fieldName] === false && formData[fieldName as keyof typeof formData]?.toString().trim()) {
    validateFieldInline(fieldName)
  }
}

// Special handler for Assignment Reason with formatting
const handleAssignmentReasonInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  // Auto-capitalize first letter
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
    formData.assignmentReason = value
  }
  
  // Clear error state on input if field was invalid
  if (fieldValidation.assignmentReason === false && value.trim()) {
    validateFieldInline('assignmentReason')
  }
}

// Handle notes validation
const handleNotesValidation = (isValid: boolean, errorMessage?: string) => {
  if (!isValid && errorMessage) {
    fieldErrors.assignmentNotes = errorMessage
    fieldValidation.assignmentNotes = false
  } else {
    fieldErrors.assignmentNotes = ''
    fieldValidation.assignmentNotes = true
  }
}

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    assetId: 'Asset ID',
    assetBrandModel: 'Asset Brand-Model',
    employeeId: 'Employee ID - Name',
    assignmentReason: 'Assignment Reason',
    assignmentDate: 'Assignment Date',
    assignmentNotes: 'Assignment Notes'
  }
  return displayNames[fieldName] || fieldName
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
    if (issueAssetForm.value) {
      issueAssetForm.value.classList.add('was-validated')
    }
    return
  }

  isSubmitting.value = true

  try {
    // Get the selected asset and employee IDs from the dropdown selections
    const selectedAssetId = selectedAsset.value?.value ? Number.parseInt(selectedAsset.value.value.toString()) : null
    const selectedEmployeeId = selectedEmployee.value?.value ? Number.parseInt(selectedEmployee.value.value.toString()) : null

    console.log('Selected asset ID:', selectedAssetId)
    console.log('Selected employee ID:', selectedEmployeeId)

    if (!selectedAssetId || !selectedEmployeeId) {
      throw new Error('Please select both an asset and an employee')
    }

    // Get the current condition of the selected asset
    const currentAsset = availableAssets.value.find(asset => asset.id === selectedAssetId)
    const currentCondition = currentAsset?.condition || 'GOOD' // Fallback to GOOD if condition is not available

    // Prepare assignment data for API
    const assignmentData: CreateAssignmentDto = {
      assetId: selectedAssetId,
      employeeId: selectedEmployeeId,
      issueDate: formData.assignmentDate,
      issueCondition: currentCondition as "GOOD" | "NEW" | "FAIR" | "POOR" | "DAMAGED", // Use the asset's current condition
      issueReason: formData.assignmentReason,
      notes: formData.assignmentNotes || undefined
    }

    // Call the API to create assignment
    await assignmentApiService.createAssignment(assignmentData)
    
    const assignmentDetails = generateAssignmentDetails()
    
    // Redirect to asset list immediately after success
    router.push('/app/assets')
    
    // Show success toast after redirect (with a small delay to ensure page loads)
    setTimeout(() => {
      toastStore.showSuccess('Success', `${assignmentDetails} has been assigned successfully!`)
    }, 100)
    
  } catch (error: any) {
    console.error('Error issuing asset:', error)
    toastStore.showError('Error', error.message || 'An error occurred while issuing the asset. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Helper methods
const generateAssignmentDetails = () => {
  const selectedAsset = availableAssets.value.find(asset => asset.id.toString() === formData.assetId)
  const selectedEmployee = activeEmployees.value.find(emp => emp.id === formData.employeeId)
  
  let details = ''
  if (selectedAsset && selectedEmployee) {
    details = `${selectedAsset.assetId} - ${selectedAsset.model.name} to ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
  }
  return details || 'Asset assignment'
}

const resetForm = () => {
  // Reset form data
  Object.keys(formData).forEach(key => {
    if (key === 'assignmentDate') {
      formData[key as keyof typeof formData] = new Date().toISOString().split('T')[0]
    } else {
      formData[key as keyof typeof formData] = ''
    }
  })
  
  // Clear validation state
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])
  Object.keys(fieldValidation).forEach(key => delete fieldValidation[key])
  
  // Reset form state
  formSubmitted.value = false
  
  if (issueAssetForm.value) {
    issueAssetForm.value.classList.remove('was-validated')
  }

  // Clear all validation classes from DOM elements
  nextTick(() => {
    const fields = document.querySelectorAll('.is-valid, .is-invalid')
    fields.forEach(field => {
      field.classList.remove('is-valid', 'is-invalid')
    })
  })
}


// Navigation methods
const goBack = () => {
  router.push('/app/assets')
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


const clearSelectedAssetInfo = () => {
  formData.assetBrandModel = ''
  selectedAssetSpecs.value = null
}

// Helper functions for asset details loading
const setAssetBrandModel = (asset: any) => {
  if (asset.brand && asset.model) {
    formData.assetBrandModel = `${asset.brand.name} ${asset.model.name}`
  } else {
    formData.assetBrandModel = 'Brand/Model not available'
  }
}

const formatSpecifications = (specs: any): string | null => {
  if (!specs) return null
  
  if (typeof specs === 'object') {
    return Object.entries(specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
  }
  
  if (typeof specs === 'string') {
    try {
      const parsed = JSON.parse(specs)
      if (parsed && typeof parsed === 'object') {
        return Object.entries(parsed)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      }
      return specs
    } catch {
      return specs
    }
  }
  
  return null
}

const processAssetDetails = (asset: any) => {
  setAssetBrandModel(asset)
  selectedAssetSpecs.value = formatSpecifications(asset.model?.specifications)
}

const loadAssetDetails = async (assetIdNumber: number) => {
  try {
    const response = await assetApiService.getAssetById(assetIdNumber)
    const asset = response.data.asset

    if (asset) {
      processAssetDetails(asset)
    } else {
      clearSelectedAssetInfo()
    }
  } catch (error) {
    console.error('Error fetching asset details:', error)
    clearSelectedAssetInfo()
  }
}

// Asset and Employee selection handlers
watch(() => selectedAsset.value, async (newValue) => {
  if (newValue && newValue.value) {
    const assetId = Number.parseInt(newValue.value.toString())
    await loadAssetDetails(assetId)
  } else {
    clearSelectedAssetInfo()
  }
}, { immediate: true })


// Watch for when availableAssets are loaded to update brand-model if assetId is already set
watch(() => availableAssets.value, (newAssets) => {
  if (newAssets.length > 0 && selectedAsset.value) {
    const assetId = selectedAsset.value.value ? Number.parseInt(selectedAsset.value.value.toString()) : null
    if (assetId) {
      const asset = newAssets.find(asset => asset.id === assetId)
      if (asset && asset.brand && asset.model) {
        const brandModel = `${asset.brand.name} ${asset.model.name}`
        formData.assetBrandModel = brandModel
      }
    }
  }
}, { deep: true })

// API loading functions
const loadAvailableAssets = async () => {
  try {
    isLoadingAssets.value = true
    // Use the dropdown API to get all available assets without pagination
    const response = await assetApiService.getAssetsForDropdowns({ status: 'AVAILABLE' })
    availableAssets.value = response.data.assets
  } catch (error: any) {
    console.error('Error loading available assets:', error)
    toastStore.showError('Error', 'Failed to load available assets. Please try again.')
  } finally {
    isLoadingAssets.value = false
  }
}

const loadActiveEmployees = async () => {
  try {
    isLoadingEmployees.value = true
    // No limit - get all active employees
    const response = await employeeApiService.getActiveEmployees()
    activeEmployees.value = response.data.employees
  } catch (error: any) {
    console.error('Error loading active employees:', error)
    toastStore.showError('Error', 'Failed to load active employees. Please try again.')
  } finally {
    isLoadingEmployees.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Make functions available globally
  ;(window as any).scrollToFirstError = scrollToFirstError
  
  // Set loading state
  isLoading.value = true
  
  try {
    // Load data from APIs in parallel
    await Promise.all([
      loadAvailableAssets(),
      loadActiveEmployees()
    ])
  } catch (error) {
    console.error('Error loading form data:', error)
  } finally {
    isLoading.value = false
  }
  
  // Set today's date as default
  formData.assignmentDate = new Date().toISOString().split('T')[0]
  
  // Check if asset was pre-selected from assets page
  const selectedAssetId = localStorage.getItem('selectedAssetId')
  const selectedAssetType = localStorage.getItem('selectedAssetType')
  const fromQuery = route.query.from as string | undefined
  
  if (selectedAssetId && selectedAssetType) {
    // Came from assets page
    originPath.value = '/app/assets'
    // Find the asset by assetId (not database ID)
    const asset = availableAssets.value.find(asset => asset.assetId === selectedAssetId)
    if (asset) {
      // Set the selected asset for SearchableDropdown
      selectedAsset.value = {
        id: asset.id,
        name: `${asset.assetId} - ${asset.serialNumber}`,
        value: asset.id.toString()
      }
      formData.assetId = asset.id.toString()
      formData.assetBrandModel = `${asset.brand.name} ${asset.model.name}`
      
      // Show success message for pre-selection
      toastStore.showInfo('Info', `Asset ${selectedAssetId} pre-selected for issuing`)
    } else {
      console.error('Asset not found:', selectedAssetId, 'Available assets:', availableAssets.value.map(a => a.assetId))
      toastStore.showError('Error', `Asset ${selectedAssetId} not found in available assets`)
    }
    
    localStorage.removeItem('selectedAssetId')
    localStorage.removeItem('selectedAssetType')
  }
  
  // Check if employee was pre-selected from employee page
  const employeeIdFromQuery = route.query.employeeId as string
  if (employeeIdFromQuery) {
    // Came from employees page unless explicitly overridden by from query
    if (!fromQuery) {
      originPath.value = '/app/employees'
    }
    const employeeId = Number.parseInt(employeeIdFromQuery)
    const employee = activeEmployees.value.find(emp => emp.id === employeeId.toString())
    if (employee) {
      // Set the selected employee for SearchableDropdown
      selectedEmployee.value = {
        id: employee.id,
        name: `${employee.employeeId} - ${employee.firstName} ${employee.lastName}`,
        value: employee.id.toString()
      }
      formData.employeeId = employee.id.toString()
      
      // Show success message for pre-selection
      toastStore.showInfo('Info', `Employee ${employee.firstName} ${employee.lastName} pre-selected for asset assignment`)
    } else {
      console.error('Employee not found:', employeeIdFromQuery, 'Available employees:', activeEmployees.value.map(e => e.id))
      toastStore.showError('Error', `Employee with ID ${employeeIdFromQuery} not found in active employees`)
    }
  }
  
  // If explicit origin provided in query, respect it
  if (fromQuery === 'employees') originPath.value = '/app/employees'
  else if (fromQuery === 'assets') originPath.value = '/app/assets'
  else if (fromQuery === 'dashboard') originPath.value = '/app/dashboard'
  
  // Focus on appropriate field
  nextTick(() => {
    // Determine which field to focus based on what was pre-selected
    let focusField = 'assetId' // Default to asset field
    
    if (selectedAssetId && selectedAssetType) {
      // Asset was pre-selected, focus on employee field
      focusField = 'employeeId'
    }
    // Note: If employee was pre-selected, we keep the default 'assetId' focus
    
    const field = document.getElementById(focusField)
    if (field) field.focus()
  })
})

</script>

<style scoped>
/* Import the unified form styles */
@import url('../../assets/unified-form-styles.css');

/* Additional component-specific styles */

/* Asset Specifications - Make it look like a non-editable input */
.asset-specifications-wrapper :deep(.form-control) {
  background-color: #F3F3F3 !important;
  border: 2px solid #E0E0E0 !important;
  color: #0A0A0A !important;
  cursor: default !important;
  resize: none !important;
}

.asset-specifications-wrapper :deep(.form-control:hover) {
  border-color: #E0E0E0 !important;
  background-color: #F3F3F3 !important;
}

.asset-specifications-wrapper :deep(.form-control:focus) {
  border-color: #E0E0E0 !important;
  box-shadow: none !important;
  background-color: #F3F3F3 !important;
  outline: none !important;
}

.asset-specifications-wrapper :deep(.form-control::placeholder) {
  color: #999999 !important;
}

.asset-specifications-wrapper :deep(.character-count) {
  display: none !important;
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

.btn-success {
  background-color: #21AF65 !important;
  border-color: #21AF65 !important;
  color: #FFFFFF !important;
}

.btn-success:hover {
  background-color: #1e9c5a !important;
  border-color: #1e9c5a !important;
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
  
  .auto-expand-textarea.expanded {
    height: 100px !important;
  }
}
</style>
