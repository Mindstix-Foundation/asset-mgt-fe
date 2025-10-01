<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(10, 10, 10, 0.3) !important;">
          <div class="card-header bg-light border-bottom text-center py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div style="display: block;">
              <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">Collect Asset from Employee</h4>
              <p class="text-muted mb-0 small" style="display: block;">Retrieve an assigned asset from an employee</p>
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
            <form v-else ref="collectAssetForm" class="needs-validation" @submit.prevent="submitForm" novalidate>
              
              <!-- Section 1: Employee Selection -->
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
                    <div class="form-text">Select employee to filter their assigned assets (required)</div>
                  </div>
                  
                  <!-- Assignment Reason -->
                  <div v-if="selectedAssignmentReason" class="col-12">
                    <div class="asset-specifications-wrapper">
                      <NotesTextarea 
                        :model-value="selectedAssignmentReason"
                        label="Assignment Reason"
                        placeholder="No assignment reason available"
                        help-text=""
                        :max-length="1000"
                        :required="false"
                        :show-label="true"
                        :readonly="true"
                        input-id="assignmentReason"
                        @validation="() => {}"
                      />
                    </div>
                  </div>
                  
                  <!-- Assignment Notes -->
                  <div v-if="selectedAssignmentNotes" class="col-12">
                    <div class="asset-specifications-wrapper">
                      <NotesTextarea 
                        :model-value="selectedAssignmentNotes"
                        label="Assignment Notes"
                        placeholder="No assignment notes available"
                        help-text=""
                        :max-length="1000"
                        :required="false"
                        :show-label="true"
                        :readonly="true"
                        input-id="assignmentNotes"
                        @validation="() => {}"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Asset Selection -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Asset Selection</legend>
                <div class="row g-4">
                  <!-- Asset ID -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="assetId"
                        label="Asset ID"
                        :placeholder="assetSelectPlaceholder"
                        :items="assetItems"
                        v-model="selectedAsset"
                        :disabled="!hasAssignedAssets"
                        required
                        @change="onAssetChange"
                      />
                    </div>
                    <div class="form-text">Select asset to collect from employee (required)</div>
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
                
                <!-- Asset Condition When Assigned -->
                <div v-if="selectedAssetCondition" class="mt-4">
                  <div class="asset-specifications-wrapper">
                    <label for="assetConditionWhenAssigned" class="form-label">Asset Condition When Assigned</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="assetConditionWhenAssigned" 
                      :value="selectedAssetCondition"
                      disabled 
                      placeholder="No condition information available"
                    >
                    <div class="form-text">Condition of the asset when it was originally assigned</div>
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

              <!-- Section 3: Collection Details -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Collection Details</legend>
                <div class="row g-4">
                  <!-- Collection Date -->
                  <div class="col-md-6">
                    <label for="collectionDate" class="form-label">Collection Date <span class="text-danger">*</span></label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="collectionDate" 
                      v-model="formData.collectionDate"
                      :class="getFieldClass('collectionDate')"
                      required
                      @change="validateFieldInline('collectionDate')"
                      @focus="clearFieldValidation('collectionDate')"
                    >
                    <div class="form-text">Date when the asset will be collected (required)</div>
                    <div v-if="fieldErrors.collectionDate" class="invalid-feedback">{{ fieldErrors.collectionDate }}</div>
                  </div>

                  <!-- Collection Reason -->
                  <div class="col-md-6">
                    <label for="collectionReason" class="form-label">Collection Reason <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="collectionReason" 
                      v-model="formData.collectionReason"
                      :class="getFieldClass('collectionReason')"
                      required
                      @change="validateFieldInline('collectionReason')"
                      @focus="clearFieldValidation('collectionReason')"
                    >
                      <option value="">Choose reason...</option>
                      <option value="employee-left">Employee Left Company</option>
                      <option value="reassignment">Asset Reassignment</option>
                      <option value="maintenance">Maintenance Required</option>
                      <option value="upgrade">Equipment Upgrade</option>
                      <option value="return-request">Employee Return Request</option>
                      <option value="other">Other Reason</option>
                    </select>
                    <div class="form-text">Select the reason for collecting this asset (required)</div>
                    <div v-if="fieldErrors.collectionReason" class="invalid-feedback">{{ fieldErrors.collectionReason }}</div>
                  </div>

                  <!-- Asset Condition -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="assetCondition"
                        label="Asset Condition"
                        placeholder="Choose condition..."
                        :items="conditionItems"
                        v-model="selectedCondition"
                        required
                        @change="onConditionChange"
                      />
                    </div>
                    <div class="form-text">Select the current condition of the asset (required)</div>
                  </div>

                  <!-- Collection Notes -->
                  <div class="col-12">
                    <NotesTextarea 
                      v-model="formData.collectionNotes"
                      label="Collection Notes"
                      placeholder="Enter collection notes..."
                      help-text="Include asset condition, handover details, or other relevant information. Textarea expands automatically as you type."
                      :max-length="500"
                      :required="false"
                      :show-label="true"
                      input-id="collectionNotes"
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
                  class="btn btn-pink px-5 py-2" 
                  :disabled="isSubmitting"
                  @click="submitForm"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? 'Collecting Asset...' : 'Collect Asset' }}
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

    <!-- Confirmation Modal -->
    <div 
      class="modal fade" 
      :class="{ show: showConfirmationModal }" 
      :style="{ display: showConfirmationModal ? 'block' : 'none' }"
      tabindex="-1"
      id="confirmationModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius: 1rem;">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="confirmationModalLabel">
              Confirm Asset Collection
            </h5>
            <button type="button" class="btn-close" @click="closeConfirmationModal"></button>
          </div>
          <div class="modal-body pt-0">
            <div class="alert alert-warning border-0 mb-3" role="alert">
              <strong>Important:</strong> This action will mark the asset as collected and update its status to "Available".
            </div>
            
            <p class="mb-3 fw-medium">Please confirm the collection details:</p>
            
            <div class="bg-light p-4 rounded-3 border">
              <div class="row mb-2">
                <div class="col-4 fw-semibold text-muted">Asset:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.asset }}</div>
              </div>
              <div class="row mb-2">
                <div class="col-4 fw-semibold text-muted">Employee:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.employee }}</div>
              </div>
              <div class="row mb-2">
                <div class="col-4 fw-semibold text-muted">Collection Date:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.date }}</div>
              </div>
              <div class="row mb-2">
                <div class="col-4 fw-semibold text-muted">Reason:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.reason }}</div>
              </div>
              <div class="row">
                <div class="col-4 fw-semibold text-muted">Condition:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.condition }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-outline-secondary px-4" @click="closeConfirmationModal">
              Cancel
            </button>
            <button type="button" class="btn btn-pink px-4" @click="confirmCollection">
              Confirm Collection
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div 
      v-if="showConfirmationModal" 
      class="modal-backdrop fade show"
      @click="closeConfirmationModal"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showErrorToast } from '../../utils/toast'
import { collectAssetApiService, type ActiveAssignment, type ReturnAssignmentDto } from '../../services/collectAssetApi'
import { employeeApiService, type Employee } from '../../services/employeeApi'
import SearchableDropdown, { type Item } from '../../components/common/SearchableDropdown.vue'
import NotesDisplay from '../../components/common/NotesDisplay.vue'
import NotesTextarea from '../../components/common/NotesTextarea.vue'

const router = useRouter()
const route = useRoute()

// Form data
const formData = reactive({
  employeeId: '',
  assetId: '',
  assetBrandModel: '',
  collectionDate: '',
  collectionReason: '',
  assetCondition: '',
  collectionNotes: ''
})

// Selected items for SearchableDropdown components
const selectedEmployee = ref<Item | null>(null)
const selectedAsset = ref<Item | null>(null)
const selectedCondition = ref<Item | null>(null)

// Form state - Enhanced validation system like the prototype
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({}) // null = not validated, true = valid, false = invalid
const isSubmitting = ref(false)
const isLoading = ref(false)
const formSubmitted = ref(false) // Track if form has been submitted
const showConfirmationModal = ref(false)
const isPreSelecting = ref(false) // Flag to prevent watchers from interfering during pre-selection

// Template refs
const collectAssetForm = ref<HTMLFormElement>()

// API data
const activeEmployees = ref<Employee[]>([])
const assignedAssets = ref<ActiveAssignment[]>([])
const isLoadingEmployees = ref(false)
const isLoadingAssignments = ref(false)

// Transform API data to SearchableDropdown format
const employeeItems = computed(() => {
  return activeEmployees.value.map(employee => ({
    id: employee.id,
    name: `${employee.employeeId} - ${employee.firstName} ${employee.lastName}`,
    value: employee.id.toString()
  }))
})

const assetItems = computed(() => {
  return filteredAssignedAssets.value.map(assignment => ({
    id: assignment.id,
    name: `${assignment.asset.assetId} - ${assignment.asset.serialNumber || 'No Serial'}`,
    value: assignment.id.toString()
  }))
})

const conditionItems = computed(() => [
  { id: 'GOOD', name: 'Good', value: 'GOOD' },
  { id: 'FAIR', name: 'Fair', value: 'FAIR' },
  { id: 'POOR', name: 'Poor', value: 'POOR' },
  { id: 'DAMAGED', name: 'Damaged', value: 'DAMAGED' }
])

const reasonLabels = {
  'employee-left': 'Employee Left Company',
  'reassignment': 'Asset Reassignment',
  'maintenance': 'Maintenance Required',
  'upgrade': 'Equipment Upgrade',
  'return-request': 'Employee Return Request',
  'other': 'Other Reason'
}

const conditionLabels = {
  'NEW': 'New',
  'GOOD': 'Good',
  'FAIR': 'Fair',
  'POOR': 'Poor',
  'DAMAGED': 'Damaged'
}

// Computed properties
const filteredAssignedAssets = computed(() => {
  if (!formData.employeeId) {
    return assignedAssets.value
  }
  // Convert both to numbers for comparison since formData.employeeId is a string
  const selectedEmployeeId = parseInt(formData.employeeId)
  return assignedAssets.value.filter(assignment => assignment.employee.id === selectedEmployeeId)
})

const hasAssignedAssets = computed(() => {
  return filteredAssignedAssets.value.length > 0
})

const assetSelectPlaceholder = computed(() => {
  if (!formData.employeeId) {
    return 'Choose an assigned asset...'
  }
  if (filteredAssignedAssets.value.length === 0) {
    return 'No assets assigned to this employee'
  }
  const selectedEmployee = activeEmployees.value.find(emp => emp.id === formData.employeeId)
  return `Choose asset assigned to ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}...`
})

const confirmationDetails = computed(() => {
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  const selectedEmployee = activeEmployees.value.find(emp => 
    emp.id.toString() === formData.employeeId.toString()
  )
  const reasonLabel = reasonLabels[formData.collectionReason as keyof typeof reasonLabels] || formData.collectionReason
  const conditionLabel = conditionLabels[formData.assetCondition as keyof typeof conditionLabels] || formData.assetCondition
  
  // Build asset display with serial number
  let assetDisplay = '-'
  if (selectedAssignment) {
    const serialInfo = selectedAssignment.asset.serialNumber ? ` - ${selectedAssignment.asset.serialNumber}` : ''
    assetDisplay = `${selectedAssignment.asset.assetId}${serialInfo} - ${selectedAssignment.asset.model.name}`
  }
  
  return {
    asset: assetDisplay,
    employee: selectedEmployee ? `${selectedEmployee.employeeId} - ${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '-',
    date: formData.collectionDate ? new Date(formData.collectionDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '-',
    reason: reasonLabel || '-',
    condition: conditionLabel || '-'
  }
})

// Computed property for selected asset specifications
const selectedAssetSpecs = computed(() => {
  if (!formData.assetId) return null
  
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  
  const specs = selectedAssignment?.asset?.model?.specifications
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

// Computed property for selected assignment reason
const selectedAssignmentReason = computed(() => {
  if (!formData.assetId) return null
  
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  
  return selectedAssignment?.issueReason || null
})

// Computed property for selected assignment notes
const selectedAssignmentNotes = computed(() => {
  if (!formData.assetId) return null
  
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  
  return selectedAssignment?.notes || null
})

// Computed property for selected asset condition when assigned
const selectedAssetCondition = computed(() => {
  if (!formData.assetId) return null
  
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  
  if (!selectedAssignment?.issueCondition) return null
  
  // Format the condition for display
  const condition = selectedAssignment.issueCondition
  const conditionLabel = conditionLabels[condition as keyof typeof conditionLabels] || condition
  
  return conditionLabel
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
const onEmployeeChange = (item: Item | null) => {
  selectedEmployee.value = item
  formData.employeeId = item && item.value ? item.value.toString() : ''
  
  // Clear asset selection when employee changes
  selectedAsset.value = null
  formData.assetId = ''
  formData.assetBrandModel = ''
  
  // Clear validation errors
  if (item) {
    clearFieldValidation('employeeId')
  }
  clearFieldValidation('assetId')
  
  validateFieldInline('employeeId')
}

const onAssetChange = (item: Item | null) => {
  selectedAsset.value = item
  formData.assetId = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('assetId')
  }
  
  validateFieldInline('assetId')
}

const onConditionChange = (item: Item | null) => {
  selectedCondition.value = item
  formData.assetCondition = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('assetCondition')
  }
  
  validateFieldInline('assetCondition')
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
    case 'employeeId':
      if (!selectedEmployee.value) {
        setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
        applyValidationToSearchableDropdown(fieldName, 'invalid')
        return false
      } else {
        setFieldValid(fieldName)
        applyValidationToSearchableDropdown(fieldName, 'valid')
        return true
      }
      
    case 'assetId':
      if (!selectedAsset.value) {
        setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
        applyValidationToSearchableDropdown(fieldName, 'invalid')
        return false
      } else {
        setFieldValid(fieldName)
        applyValidationToSearchableDropdown(fieldName, 'valid')
        return true
      }
      
    case 'assetCondition':
      if (!selectedCondition.value) {
        setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
        applyValidationToSearchableDropdown(fieldName, 'invalid')
        return false
      } else {
        setFieldValid(fieldName)
        applyValidationToSearchableDropdown(fieldName, 'valid')
        return true
      }
      
    case 'collectionDate':
      if (value) {
        const today = new Date().toISOString().split('T')[0]
        const futureLimit = new Date()
        futureLimit.setDate(futureLimit.getDate() + 30) // Allow up to 30 days in future
        const futureLimitStr = futureLimit.toISOString().split('T')[0]
        
        if (value > futureLimitStr) {
          setFieldError(fieldName, 'Collection date cannot be more than 30 days in the future')
          return false
        }
      }
      break
  }

  // For SearchableDropdown fields, we've already handled validation above
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition']
  if (searchableDropdownFields.includes(fieldName)) {
    return true // Already validated above
  }

  // Use native validation for other fields
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
  
  // Apply validation classes to SearchableDropdown fields
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition']
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
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition']
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
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition']
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

// Handle notes validation
const handleNotesValidation = (isValid: boolean, errorMessage?: string) => {
  if (!isValid && errorMessage) {
    fieldErrors.collectionNotes = errorMessage
    fieldValidation.collectionNotes = false
  } else {
    fieldErrors.collectionNotes = ''
    fieldValidation.collectionNotes = true
  }
}

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    employeeId: 'Employee ID - Name',
    assetId: 'Asset ID',
    assetBrandModel: 'Asset Brand-Model',
    collectionDate: 'Collection Date',
    collectionReason: 'Collection Reason',
    assetCondition: 'Asset Condition',
    collectionNotes: 'Collection Notes'
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
  const requiredFields = ['employeeId', 'assetId', 'collectionDate', 'collectionReason', 'assetCondition']
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
    if (collectAssetForm.value) {
      collectAssetForm.value.classList.add('was-validated')
    }
    return
  }

  // Show confirmation modal instead of direct submission
  showConfirmationModal.value = true
}

// Confirmation modal handlers
const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

const confirmCollection = async () => {
  closeConfirmationModal()
  isSubmitting.value = true

  try {
    // Prepare return data for API
    const returnData: ReturnAssignmentDto = {
      returnDate: formData.collectionDate,
      returnCondition: formData.assetCondition, // Already uppercase from SearchableDropdown
      returnReason: formData.collectionReason,
      notes: formData.collectionNotes || undefined
    }

    // Call the API to collect/return the asset
    const response = await collectAssetApiService.collectAsset(parseInt(formData.assetId), returnData)
    
    const collectionDetails = generateCollectionDetails()
    
    // Show success toast with action buttons
    showCollectAssetSuccessToast(collectionDetails)
    
  } catch (error: any) {
    console.error('Error collecting asset:', error)
    showErrorToast(error.message || 'An error occurred while collecting the asset. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Helper methods
const generateCollectionDetails = () => {
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  const selectedEmployee = activeEmployees.value.find(emp => 
    emp.id.toString() === formData.employeeId.toString()
  )
  
  let details = ''
  if (selectedAssignment) {
    const serialInfo = selectedAssignment.asset.serialNumber ? ` - ${selectedAssignment.asset.serialNumber}` : ''
    details = `${selectedAssignment.asset.assetId}${serialInfo} - ${selectedAssignment.asset.model.name}`
  }
  
  if (selectedEmployee) {
    details += ` from ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
  }
  
  return details || 'Asset collection'
}

const resetForm = () => {
  // Reset form data
  Object.keys(formData).forEach(key => {
    if (key === 'collectionDate') {
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
  
  if (collectAssetForm.value) {
    collectAssetForm.value.classList.remove('was-validated')
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

const collectAnotherAsset = async () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())
  
  resetForm()
  
  // Reload data to ensure we have the latest assigned assets
  try {
    await Promise.all([
      loadActiveEmployees(),
      loadAssignedAssets()
    ])
  } catch (error) {
    console.error('Error reloading data:', error)
  }
  
  showToast('Ready to collect another asset!', 'info')
  
  // Focus on first field
  nextTick(() => {
    const firstField = document.getElementById('assetId')
    if (firstField) firstField.focus()
  })
}

const viewAssetStatus = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  existingToasts.forEach(toast => toast.remove())
  
  showToast('Redirecting to Asset Status...', 'info')
  
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

// Custom success toast for asset collection
const showCollectAssetSuccessToast = (collectionDetails: string) => {
  const message = `<div class="mb-3">
    <strong>${collectionDetails}</strong> has been collected successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    <button type="button" class="btn btn-sm btn-success" onclick="collectAnotherAsset()">
      Collect Another
    </button>
    <button type="button" class="btn btn-sm btn-outline-success" onclick="viewAssetStatus()">
      View Assets
    </button>
  </div>`
  
  // Use the existing toast utility
  showToast(message, 'success')
}


// Employee selection handler - filter assets by selected employee
watch(() => selectedEmployee.value, (newValue) => {
  // Don't clear asset selection during pre-selection
  if (isPreSelecting.value) return
  
  // Clear asset selection when employee changes
  selectedAsset.value = null
  formData.assetId = ''
  formData.assetBrandModel = ''
  
  // Clear validation for asset field
  clearFieldValidation('assetId')
})

// Asset selection handler - sync with employee dropdown
watch(() => selectedAsset.value, (newValue) => {
  if (newValue && newValue.value) {
    const assignmentId = parseInt(newValue.value.toString())
    const selectedAssignment = assignedAssets.value.find(assignment => assignment.id === assignmentId)
    
    if (selectedAssignment) {
      // Check if brand and model exist
      if (selectedAssignment.asset.brand && selectedAssignment.asset.model) {
        const brandModel = `${selectedAssignment.asset.brand.name} ${selectedAssignment.asset.model.name}`
        formData.assetBrandModel = brandModel
      } else {
        formData.assetBrandModel = 'Brand/Model not available'
      }
      
      // Auto-select employee if not already selected
      if (!selectedEmployee.value) {
        selectedEmployee.value = {
          id: selectedAssignment.employee.id,
          name: `${selectedAssignment.employee.employeeId} - ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`,
          value: selectedAssignment.employee.id.toString()
        }
        formData.employeeId = selectedAssignment.employee.id.toString()
      }
    } else {
      formData.assetBrandModel = ''
    }
  } else {
    formData.assetBrandModel = ''
  }
}, { immediate: true })

// Watch for when assignedAssets are loaded to update brand-model if assetId is already set
watch(() => assignedAssets.value, (newAssignments) => {
  if (newAssignments.length > 0 && selectedAsset.value) {
    const assignmentId = selectedAsset.value.value ? parseInt(selectedAsset.value.value.toString()) : null
    if (assignmentId) {
      const selectedAssignment = newAssignments.find(assignment => assignment.id === assignmentId)
      if (selectedAssignment && selectedAssignment.asset.brand && selectedAssignment.asset.model) {
        const brandModel = `${selectedAssignment.asset.brand.name} ${selectedAssignment.asset.model.name}`
        formData.assetBrandModel = brandModel
      }
    }
  }
  
  // Also check for pre-selection from localStorage when assignments are loaded
  const selectedAssetId = localStorage.getItem('selectedAssetId')
  if (selectedAssetId && newAssignments.length > 0 && !selectedAsset.value) {
    const selectedAssignment = newAssignments.find(assignment => assignment.asset.assetId === selectedAssetId)
    if (selectedAssignment) {
      // Set pre-selection flag to prevent watchers from interfering
      isPreSelecting.value = true
      
      // Set both values together
      selectedAsset.value = {
        id: selectedAssignment.id,
        name: `${selectedAssignment.asset.assetId} - ${selectedAssignment.asset.serialNumber || 'No Serial'}`,
        value: selectedAssignment.id.toString()
      }
      selectedEmployee.value = {
        id: selectedAssignment.employee.id,
        name: `${selectedAssignment.employee.employeeId} - ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`,
        value: selectedAssignment.employee.id.toString()
      }
      formData.assetId = selectedAssignment.id.toString()
      formData.employeeId = selectedAssignment.employee.id.toString()
      formData.assetBrandModel = `${selectedAssignment.asset.brand.name} ${selectedAssignment.asset.model.name}`
      
      // Clear pre-selection flag after a short delay
      nextTick(() => {
        setTimeout(() => {
          isPreSelecting.value = false
        }, 100)
      })
      
      showToast(`Asset ${selectedAssetId} pre-selected for collection from ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`, 'info')
      
      localStorage.removeItem('selectedAssetId')
      localStorage.removeItem('currentEmployee')
    }
  }
}, { deep: true })

// API loading functions
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

const loadAssignedAssets = async () => {
  try {
    isLoadingAssignments.value = true
    // No limit - get all active assignments (assigned assets)
    const response = await collectAssetApiService.getActiveAssignments()
    assignedAssets.value = response.data.assignments
  } catch (error: any) {
    console.error('Error loading assigned assets:', error)
    showErrorToast('Failed to load assigned assets. Please try again.')
  } finally {
    isLoadingAssignments.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Make functions available globally for toast buttons
  ;(window as any).collectAnotherAsset = collectAnotherAsset
  ;(window as any).viewAssetStatus = viewAssetStatus
  ;(window as any).scrollToFirstError = scrollToFirstError
  
  // Set loading state
  isLoading.value = true
  
  try {
    // Load data from APIs in parallel
    await Promise.all([
      loadActiveEmployees(),
      loadAssignedAssets()
    ])
  } catch (error) {
    console.error('Error loading form data:', error)
  } finally {
    isLoading.value = false
  }
  
  // Set today's date as default
  formData.collectionDate = new Date().toISOString().split('T')[0]
  
  // Query parameter based preselect (preferred)
  const qpAssetId = route.query.assetId ? route.query.assetId.toString() : ''
  const qpEmployeeId = route.query.employeeId ? route.query.employeeId.toString() : ''
  let selectedAssetId = qpAssetId || localStorage.getItem('selectedAssetId') || ''
  let currentEmployee = qpEmployeeId || localStorage.getItem('currentEmployee') || ''
  
  if (selectedAssetId) {
    // Find the assignment by asset ID
    const selectedAssignment = assignedAssets.value.find(assignment => assignment.asset.assetId === selectedAssetId)
    
    if (selectedAssignment) {
      // Set pre-selection flag to prevent watchers from interfering
      isPreSelecting.value = true
      
      // Set both values together
      selectedAsset.value = {
        id: selectedAssignment.id,
        name: `${selectedAssignment.asset.assetId} - ${selectedAssignment.asset.serialNumber || 'No Serial'}`,
        value: selectedAssignment.id.toString()
      }
      selectedEmployee.value = {
        id: selectedAssignment.employee.id,
        name: `${selectedAssignment.employee.employeeId} - ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`,
        value: selectedAssignment.employee.id.toString()
      }
      formData.assetId = selectedAssignment.id.toString()
      formData.employeeId = selectedAssignment.employee.id.toString()
      formData.assetBrandModel = `${selectedAssignment.asset.brand.name} ${selectedAssignment.asset.model.name}`
      
      // Clear pre-selection flag after a short delay
      nextTick(() => {
        setTimeout(() => {
          isPreSelecting.value = false
        }, 100)
      })
      
      // Show success message for pre-selection
      showToast(`Asset ${selectedAssetId} pre-selected for collection from ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`, 'info')
    } else {
      console.error('Assignment not found for asset:', selectedAssetId)
      showErrorToast(`Asset ${selectedAssetId} not found in assigned assets`)
    }
    
    // Clear only if they were from localStorage, keep query params intact
    if (!qpAssetId) localStorage.removeItem('selectedAssetId')
    if (!qpEmployeeId) localStorage.removeItem('currentEmployee')
  }
  
  // Focus on appropriate field
  nextTick(() => {
    // If both employee and asset are preselected, focus next required unselected field.
    // If asset is selected but employee isn't, focus employee; if employee selected but asset isn't, focus asset.
    let focusField = 'employeeId'
    const hasEmployee = !!formData.employeeId
    const hasAsset = !!formData.assetId
    if (hasEmployee && hasAsset) {
      focusField = 'collectionReason'
    } else if (hasEmployee && !hasAsset) {
      focusField = 'assetId'
    } else if (!hasEmployee && hasAsset) {
      focusField = 'employeeId'
    }
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

.btn-pink {
  background-color: #FF579F !important;
  border-color: #FF579F !important;
  color: #FFFFFF !important;
}

.btn-pink:hover {
  background-color: #e04a8a !important;
  border-color: #e04a8a !important;
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


/* Modal styling */
.modal-content {
  border: none !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/* Confirmation Modal Specific Styling */
.modal-header {
  padding: 1.5rem 1.5rem 0 1.5rem !important;
  border-bottom: none !important;
}

.modal-title {
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  color: #0A0A0A !important;
  margin: 0 !important;
}

.modal-body {
  padding: 1rem 1.5rem !important;
}

.modal-footer {
  padding: 0 1.5rem 1.5rem 1.5rem !important;
  border-top: none !important;
  gap: 0.75rem !important;
}

/* Important Alert Styling */
.alert-warning {
  background-color: #F3F3F3 !important;
  border: 2px solid #E0E0E0 !important;
  color: #0A0A0A !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  margin-bottom: 1.5rem !important;
}

.alert-warning strong {
  color: #0A0A0A !important;
  font-weight: 700 !important;
}

/* Collection Details Section */
.bg-light {
  background-color: #F3F3F3 !important;
  border: 2px solid #E0E0E0 !important;
  border-radius: 0.5rem !important;
  padding: 1.25rem !important;
}

.bg-light .row {
  margin-bottom: 0.75rem !important;
}

.bg-light .row:last-child {
  margin-bottom: 0 !important;
}

.bg-light .col-4 {
  font-weight: 600 !important;
  color: #666666 !important;
  font-size: 0.9rem !important;
}

.bg-light .col-8 {
  font-weight: 500 !important;
  color: #0A0A0A !important;
  font-size: 0.95rem !important;
}

/* Modal Buttons */
.modal-footer .btn {
  padding: 0.75rem 1.5rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  min-width: 120px !important;
}

.modal-footer .btn-outline-secondary {
  background-color: #ffffff !important;
  border: 2px solid #666666 !important;
  color: #666666 !important;
}

.modal-footer .btn-outline-secondary:hover {
  background-color: #E97676 !important;
  border-color: #E97676 !important;
  color: #ffffff !important;
}

.modal-footer .btn-pink {
  background-color: #FF579F !important;
  border-color: #FF579F !important;
  color: #ffffff !important;
}

.modal-footer .btn-pink:hover {
  background-color: #e04a8a !important;
  border-color: #e04a8a !important;
}

/* Close Button */
.btn-close {
  background: none !important;
  border: none !important;
  font-size: 1.25rem !important;
  color: #666666 !important;
  opacity: 0.8 !important;
  transition: all 0.2s ease !important;
}

.btn-close:hover {
  opacity: 1 !important;
  color: #E97676 !important;
}

/* Description Text */
.modal-body p {
  margin-bottom: 1rem !important;
  color: #0A0A0A !important;
  font-weight: 500 !important;
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
  
  /* Modal responsive adjustments */
  .modal-header {
    padding: 1rem 1rem 0 1rem !important;
  }
  
  .modal-body {
    padding: 0.75rem 1rem !important;
  }
  
  .modal-footer {
    padding: 0 1rem 1rem 1rem !important;
    flex-direction: column !important;
    gap: 0.5rem !important;
  }
  
  .modal-footer .btn {
    width: 100% !important;
    margin-bottom: 0.5rem !important;
  }
  
  .modal-footer .btn:last-child {
    margin-bottom: 0 !important;
  }
  
  .bg-light {
    padding: 1rem !important;
  }
  
  .bg-light .col-4,
  .bg-light .col-8 {
    font-size: 0.85rem !important;
  }
  
  .alert-warning {
    padding: 0.75rem !important;
    margin-bottom: 1rem !important;
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
  
  /* Modal responsive adjustments for small screens */
  .modal-header {
    padding: 0.75rem 0.75rem 0 0.75rem !important;
  }
  
  .modal-body {
    padding: 0.5rem 0.75rem !important;
  }
  
  .modal-footer {
    padding: 0 0.75rem 0.75rem 0.75rem !important;
  }
  
  .modal-title {
    font-size: 1.1rem !important;
  }
  
  .bg-light {
    padding: 0.75rem !important;
  }
  
  .bg-light .col-4,
  .bg-light .col-8 {
    font-size: 0.8rem !important;
  }
  
  .alert-warning {
    padding: 0.5rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  .modal-footer .btn {
    padding: 0.5rem 1rem !important;
    font-size: 0.9rem !important;
  }
}
</style> 