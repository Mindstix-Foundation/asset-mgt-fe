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
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
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
                    <label for="assetId" class="form-label">Asset ID <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="assetId" 
                      v-model="formData.assetId"
                      :class="getFieldClass('assetId')"
                      required
                      @change="validateFieldInline('assetId')"
                      @focus="clearFieldValidation('assetId')"
                    >
                      <option value="">Choose an asset...</option>
                      <option v-for="asset in availableAssets" :key="asset.id" :value="asset.id">
                        {{ asset.assetId }} - {{ asset.serialNumber }}
                      </option>
                    </select>
                    <div class="form-text">Select from available assets only (required)</div>
                    <div v-if="fieldErrors.assetId" class="invalid-feedback">{{ fieldErrors.assetId }}</div>
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
                  <div class="card border-0" style="background-color: #f8f9fa;">
                    <div class="card-body p-3">
                      <h6 class="card-title mb-3 text-dark fw-bold">
                        Asset Specifications
                      </h6>
                      <div class="specifications-content">
                        <pre class="spec-text">{{ selectedAssetSpecs }}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Employee Selection -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Employee Selection</legend>
                <div class="row g-4">
                  <!-- Employee ID - Name -->
                  <div class="col-12">
                    <label for="employeeId" class="form-label">Employee ID - Name <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="employeeId" 
                      v-model="formData.employeeId"
                      :class="getFieldClass('employeeId')"
                      required
                      @change="validateFieldInline('employeeId')"
                      @focus="clearFieldValidation('employeeId')"
                    >
                      <option value="">Choose an employee...</option>
                      <option v-for="employee in activeEmployees" :key="employee.id" :value="employee.id">
                        {{ employee.employeeId }} - {{ employee.firstName }} {{ employee.lastName }}
                      </option>
                    </select>
                    <div class="form-text">Select active employee from the list (required)</div>
                    <div v-if="fieldErrors.employeeId" class="invalid-feedback">{{ fieldErrors.employeeId }}</div>
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
                      title="Assignment reason must be 5-100 characters"
                      @blur="validateFieldInline('assignmentReason')"
                      @focus="clearFieldValidation('assignmentReason')"
                      @input="handleFieldInput('assignmentReason')"
                    >
                    <div class="form-text">Specify the reason for this assignment - 5-100 characters (required)</div>
                    <div v-if="fieldErrors.assignmentReason" class="invalid-feedback">{{ fieldErrors.assignmentReason }}</div>
                  </div>

                  <!-- Assignment Date -->
                  <div class="col-md-6">
                    <label for="assignmentDate" class="form-label">Assignment Date <span class="text-danger">*</span></label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="assignmentDate" 
                      v-model="formData.assignmentDate"
                      :class="getFieldClass('assignmentDate')"
                      required
                      @change="validateFieldInline('assignmentDate')"
                      @focus="clearFieldValidation('assignmentDate')"
                    >
                    <div class="form-text">Date when the asset will be assigned (required)</div>
                    <div v-if="fieldErrors.assignmentDate" class="invalid-feedback">{{ fieldErrors.assignmentDate }}</div>
                  </div>

                  <!-- Assignment Notes -->
                  <div class="col-12">
                    <label for="assignmentNotes" class="form-label">
                      Assignment Notes <span class="text-muted">(Optional)</span>
                    </label>
                    <textarea 
                      class="form-control auto-expand-textarea" 
                      id="assignmentNotes" 
                      v-model="formData.assignmentNotes"
                      :class="getFieldClass('assignmentNotes')"
                      rows="3" 
                      placeholder="Click to expand and add assignment notes..." 
                      @click="expandNotesField"
                      @input="autoExpandTextarea"
                      @blur="validateFieldInline('assignmentNotes')"
                      @focus="clearFieldValidation('assignmentNotes')"
                      maxlength="500"
                      title="Assignment notes cannot exceed 500 characters"
                      style="white-space: pre-wrap; overflow-wrap: break-word;"
                    ></textarea>
                    <div class="form-text">
                      Click to expand for more space. Include special instructions, conditions, or other relevant information
                    </div>
                    <div class="character-count text-end">
                      <small :class="getCounterClass(formData.assignmentNotes?.length || 0, 500)">
                        {{ formData.assignmentNotes?.length || 0 }}/500 characters
                      </small>
                    </div>
                    <div v-if="fieldErrors.assignmentNotes" class="invalid-feedback">{{ fieldErrors.assignmentNotes }}</div>
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
import { showToast, showErrorToast } from '../../utils/toast'
import { assignmentApiService, type CreateAssignmentDto } from '../../services/assignmentApi'
import { assetApiService, type Asset } from '../../services/assetApi'
import { employeeApiService, type Employee } from '../../services/employeeApi'

const router = useRouter()
const route = useRoute()

// Form data
const formData = reactive({
  assetId: '',
  assetBrandModel: '',
  employeeId: '',
  assignmentReason: '',
  assignmentDate: '',
  assignmentNotes: ''
})

// Computed property for selected asset specifications
const selectedAssetSpecs = computed(() => {
  if (!formData.assetId) return null
  
  const selectedAsset = availableAssets.value.find(asset => 
    asset.id.toString() === formData.assetId || asset.id === parseInt(formData.assetId)
  )
  
  const specs = selectedAsset?.model?.specifications
  if (!specs) return null
  
  // Handle different types of specifications
  if (typeof specs === 'object' && specs !== null) {
    // If it's already an object, format it directly
    return Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  } else if (typeof specs === 'string') {
    // If it's a JSON string, try to parse it
    try {
      const parsed = JSON.parse(specs)
      if (typeof parsed === 'object' && parsed !== null) {
        return Object.entries(parsed)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
      }
    } catch (e) {
      // If it's not JSON, return as is
    }
  }
  
  return specs
})

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
    case 'assignmentReason':
      if (value && value.length < 5) {
        setFieldError(fieldName, 'Assignment reason must be at least 5 characters')
        return false
      }
      if (value && value.length > 100) {
        setFieldError(fieldName, 'Assignment reason cannot exceed 100 characters')
        return false
      }
      break
    
    case 'assignmentDate':
      if (value) {
        const today = new Date().toISOString().split('T')[0]
        if (value < today) {
          setFieldError(fieldName, 'Assignment date cannot be in the past')
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
  const requiredFields = ['assetId', 'employeeId', 'assignmentReason', 'assignmentDate']
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
    // Prepare assignment data for API
    const assignmentData: CreateAssignmentDto = {
      assetId: parseInt(formData.assetId),
      employeeId: parseInt(formData.employeeId),
      issueDate: formData.assignmentDate,
      issueCondition: 'GOOD', // Default condition, could be made configurable
      issueReason: formData.assignmentReason,
      notes: formData.assignmentNotes || undefined
    }

    // Call the API to create assignment
    const response = await assignmentApiService.createAssignment(assignmentData)
    
    const assignmentDetails = generateAssignmentDetails()
    
    // Show success toast with action buttons
    showIssueAssetSuccessToast(assignmentDetails)
    
  } catch (error: any) {
    console.error('Error issuing asset:', error)
    showErrorToast(error.message || 'An error occurred while issuing the asset. Please try again.')
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

// Expandable notes functionality with character counter
const expandNotesField = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  if (!textarea.classList.contains('expanded')) {
    textarea.classList.add('expanded')
    textarea.style.height = '120px'
    textarea.rows = 6
    textarea.placeholder = 'Enter detailed assignment notes...'
    textarea.focus()
    
    // Update the helper text
    const helpText = textarea.nextElementSibling as HTMLElement
    if (helpText) {
      helpText.innerHTML = 'Expanded! Enter detailed assignment information, special conditions, or instructions.'
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

// Navigation methods
const goBack = () => {
  router.push('/app/assets')
}

const issueAnotherAsset = async () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())
  
  resetForm()
  
  // Reload data to ensure we have the latest available assets
  try {
    await Promise.all([
      loadAvailableAssets(),
      loadActiveEmployees()
    ])
  } catch (error) {
    console.error('Error reloading data:', error)
  }
  
  showToast('Ready to issue another asset!', 'info')
  
  // Focus on first field
  nextTick(() => {
    const firstField = document.getElementById('assetId')
    if (firstField) firstField.focus()
  })
}

const viewAssignments = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())
  
  showToast('Redirecting to Asset Assignments...', 'info')
  
  setTimeout(() => {
    router.push('/app/assets')
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

// Custom success toast for asset issuance
const showIssueAssetSuccessToast = (assignmentDetails: string) => {
  const message = `<div class="mb-3">
    <strong>${assignmentDetails}</strong> has been assigned successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    <button type="button" class="btn btn-sm btn-success" onclick="issueAnotherAsset()">
      Issue Another Asset
    </button>
    <button type="button" class="btn btn-sm btn-outline-success" onclick="viewAssignments()">
      View Assignments
    </button>
  </div>`
  
  // Use the existing toast utility
  showToast(message, 'success')
}

// Watchers for textarea auto-expansion
watch(() => formData.assignmentNotes, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const textarea = document.getElementById('assignmentNotes') as HTMLTextAreaElement
      if (textarea) {
        resizeTextarea(textarea)
      }
    })
  }
})

// Asset and Employee selection handlers
watch(() => formData.assetId, (newValue) => {
  if (newValue) {
    const selectedAsset = availableAssets.value.find(asset => 
      asset.id.toString() === newValue || asset.id === parseInt(newValue)
    )
    
    if (selectedAsset) {
      // Check if brand and model exist
      if (selectedAsset.brand && selectedAsset.model) {
        const brandModel = `${selectedAsset.brand.name} ${selectedAsset.model.name}`
        formData.assetBrandModel = brandModel
      } else {
        formData.assetBrandModel = 'Brand/Model not available'
      }
    } else {
      formData.assetBrandModel = ''
    }
  } else {
    formData.assetBrandModel = ''
  }
}, { immediate: true })


// Watch for when availableAssets are loaded to update brand-model if assetId is already set
watch(() => availableAssets.value, (newAssets) => {
  if (newAssets.length > 0 && formData.assetId) {
    const selectedAsset = newAssets.find(asset => 
      asset.id.toString() === formData.assetId || asset.id === parseInt(formData.assetId)
    )
    if (selectedAsset && selectedAsset.brand && selectedAsset.model) {
      const brandModel = `${selectedAsset.brand.name} ${selectedAsset.model.name}`
      formData.assetBrandModel = brandModel
    }
  }
}, { deep: true })

// API loading functions
const loadAvailableAssets = async () => {
  try {
    isLoadingAssets.value = true
    // No limit - get all available assets
    const response = await assetApiService.getAvailableAssets()
    availableAssets.value = response.data.assets
  } catch (error: any) {
    console.error('Error loading available assets:', error)
    showErrorToast('Failed to load available assets. Please try again.')
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
    showErrorToast('Failed to load active employees. Please try again.')
  } finally {
    isLoadingEmployees.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Make functions available globally for toast buttons
  ;(window as any).issueAnotherAsset = issueAnotherAsset
  ;(window as any).viewAssignments = viewAssignments
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
  
  if (selectedAssetId && selectedAssetType) {
    // Find the asset by assetId (not database ID)
    const selectedAsset = availableAssets.value.find(asset => asset.assetId === selectedAssetId)
    if (selectedAsset) {
      formData.assetId = selectedAsset.id.toString()
      formData.assetBrandModel = `${selectedAsset.brand.name} ${selectedAsset.model.name}`
      
      // Show success message for pre-selection
      showToast(`Asset ${selectedAssetId} pre-selected for issuing`, 'info')
    } else {
      console.error('Asset not found:', selectedAssetId, 'Available assets:', availableAssets.value.map(a => a.assetId))
      showErrorToast(`Asset ${selectedAssetId} not found in available assets`)
    }
    
    localStorage.removeItem('selectedAssetId')
    localStorage.removeItem('selectedAssetType')
  }
  
  // Focus on appropriate field
  nextTick(() => {
    // If asset was pre-selected, focus on employee field, otherwise focus on asset field
    const focusField = (selectedAssetId && selectedAssetType) ? 'employeeId' : 'assetId'
    const field = document.getElementById(focusField)
    if (field) field.focus()
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

.auto-expand-textarea.expanded {
  cursor: text;
  resize: vertical;
}

.auto-expand-textarea:focus {
  cursor: text;
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

/* Asset Specifications Styling */
.specifications-content {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1rem;
}

.spec-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.875rem;
  color: #212529;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  background: transparent;
  border: none;
  padding: 0;
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
  
  /* Specifications responsive */
  .specifications-content {
    padding: 0.75rem;
  }
  
  .spec-text {
    font-size: 0.8rem;
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
