<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto">
          <div class="card-header">
            <h4 class="card-title">Issue Asset to Employee</h4>
            <p class="text-muted">Assign an available asset to an employee</p>
          </div>
          <div class="card-body">
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
                    <div class="form-text">Select from available assets only (required)
                      <router-link to="/app/assets/add" class="ms-2">Add new asset</router-link>
                    </div>
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
                <div v-if="selectedAsset && specificationFields.length > 0" class="mt-4">
                  <div class="row g-4">
                    <!-- Dynamic readonly fields based on assetType.specificationTemplate -->
                    <div 
                      v-for="(field, index) in specificationFields" 
                      :key="field.key"
                      :class="getSpecFieldColumnClass(index, specificationFields, field.type)"
                    >
                      <!-- Text Input (Readonly) -->
                      <div v-if="field.type === 'text'">
                        <label :for="`spec-${field.key}`" class="form-label">
                          {{ field.label }}
                        </label>
                        <input 
                          type="text"
                          :id="`spec-${field.key}`"
                          class="form-control"
                          :value="assetSpecifications[field.key] || ''"
                          readonly
                          style="background-color: #F3F3F3;"
                          :placeholder="`No ${field.label.toLowerCase()} specified`"
                        />
                      </div>
                      
                      <!-- Number Input (Readonly) -->
                      <div v-else-if="field.type === 'number'">
                        <label :for="`spec-${field.key}`" class="form-label">
                          {{ field.label }}
                        </label>
                        <input 
                          type="number"
                          :id="`spec-${field.key}`"
                          class="form-control"
                          :value="assetSpecifications[field.key] || ''"
                          readonly
                          style="background-color: #F3F3F3;"
                          :placeholder="`No ${field.label.toLowerCase()} specified`"
                        />
                      </div>
                      
                      <!-- Dropdown (Readonly) -->
                      <div v-else-if="field.type === 'dropdown'">
                        <label :for="`spec-${field.key}`" class="form-label">
                          {{ field.label }}
                        </label>
                        <input 
                          type="text"
                          :id="`spec-${field.key}`"
                          class="form-control"
                          :value="assetSpecifications[field.key] || ''"
                          readonly
                          style="background-color: #F3F3F3;"
                          :placeholder="`No ${field.label.toLowerCase()} specified`"
                        />
                      </div>
                      
                      <!-- Textarea (Readonly) -->
                      <div v-else-if="field.type === 'textarea'">
                        <NotesTextarea
                          :model-value="assetSpecifications[field.key] || ''"
                          :label="field.label"
                          :placeholder="`No ${field.label.toLowerCase()} specified`"
                          help-text=""
                          :max-length="1000"
                          :required="false"
                          :show-label="true"
                          :readonly="true"
                          :input-id="`spec-${field.key}`"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Fallback: Show formatted specifications if no template fields -->
                <div v-else-if="selectedAsset && specificationFields.length === 0 && selectedAssetSpecs" class="mt-4">
                  <div class="asset-specifications-wrapper">
                    <NotesTextarea 
                      :model-value="selectedAssetSpecs || 'No specifications available'"
                      label="Asset Specifications"
                      placeholder="No specifications available"
                      help-text=""
                      :max-length="1000"
                      :required="false"
                      :show-label="true"
                      :readonly="true"
                      input-id="assetSpecifications"
                    />
                  </div>
                </div>

                <!-- Asset Condition -->
                <div v-if="selectedAsset" class="mt-4">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <label for="assetCondition" class="form-label">
                        Asset Condition
                      </label>
                      <input 
                        type="text"
                        id="assetCondition"
                        class="form-control"
                        :value="assetCondition || ''"
                        readonly
                        style="background-color: #F3F3F3;"
                        placeholder="No condition specified"
                      />
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
                    <div class="form-text">Select active employee from the list (required)
                      <router-link to="/app/employees/add" class="ms-2">Add new employee</router-link>
                    </div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 3: Issue Details -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Issue Details</legend>
                <div class="row g-4">
                  <!-- Issue Reason -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="assignmentReason"
                        label="Issue Reason"
                        placeholder="Search issue reasons..."
                        :items="assignmentReasonItems"
                        v-model="selectedAssignmentReason"
                        :required="true"
                        @change="onAssignmentReasonChange"
                      />
                    </div>
                    <div class="form-text">Select the reason for issuing this asset (required)</div>
                    <div v-if="fieldErrors.assignmentReason" class="invalid-feedback">{{ fieldErrors.assignmentReason }}</div>
                  </div>

                  <!-- Issue Date -->
                  <div class="col-md-6">
                    <DatePicker
                      v-model="formData.assignmentDate"
                      label="Issue Date"
                      placeholder="dd-mm-yyyy"
                      help-text="Date when the asset will be issued"
                      :required="true"
                      input-id="assignmentDate"
                      :error-message="fieldErrors.assignmentDate"
                      :input-class="getFieldClass('assignmentDate') as any"
                      @change="validateFieldInline('assignmentDate')"
                      @blur="validateFieldInline('assignmentDate')"
                      @focus="clearFieldValidation('assignmentDate')"
                    />
                  </div>

                  <!-- Issue Notes -->
                  <div class="col-12">
                    <NotesTextarea 
                      v-model="formData.assignmentNotes"
                      label="Issue Notes"
                      placeholder="Enter issue notes..."
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
          <div class="card-footer">
            <div class="form-actions">
              <!-- Footer Start -->
              <div class="container">
                <!-- Row 1: Buttons -->
                <div class="row">
                  <div class="col-12 form-action-buttons mb-3">
                    <button type="button" class="btn btn-cancel" @click="goBack">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      class="btn btn-green" 
                      :disabled="isSubmitting"
                      @click="submitForm"
                    >
                      <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                      {{ isSubmitting ? 'Issuing Asset...' : 'Issue Asset' }}
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
import { ref, reactive, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { assignmentApiService, type CreateAssignmentDto } from '../../services/api/assignmentApi'
import { assetApiService, type Asset } from '../../services/api/assetApi'
import { employeeApiService, type Employee } from '../../services/api/employeeApi'
import { assetTypeService } from '../../services/api/assetTypeService'
import SearchableDropdown, { type Item } from '../../components/common/SearchableDropdown.vue'
import NotesTextarea from '../../components/common/NotesTextarea.vue'
import DatePicker from '../../components/ui/date/DatePicker.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Track the origin path to redirect back after success
const originPath = ref<string>('/app/assets')

const decodeReturnToQuery = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
// Form data
const formData = reactive({
  assetId: '',
  assetBrandModel: '',
  employeeId: '',
  assignmentReason: '',
  assignmentDate: '',
  assignmentNotes: ''
})

// Reason labels for display
const reasonLabels = {
  'new-employee': 'New Employee Setup',
  'work-from-home': 'Work from Home Setup',
  'project-requirement': 'Project Requirement',
  'replacement': 'Equipment Replacement',
  'upgrade': 'Equipment Upgrade',
  'temporary-assignment': 'Temporary Assignment',
  'other': 'Other Reason'
}

// Selected items for SearchableDropdown components
const selectedAsset = ref<Item | null>(null)
const selectedEmployee = ref<Item | null>(null)
const selectedAssignmentReason = ref<Item | null>(null)

// Computed property for selected asset specifications (fallback for old format)
const selectedAssetSpecs = ref<string | null>(null)

// Specification fields (dynamic based on asset type)
interface SpecField {
  key: string
  label: string
  type: 'text' | 'number' | 'dropdown' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: (string | { value: string; deprecated?: boolean })[]
}

const specificationFields = ref<SpecField[]>([])
const assetSpecifications = reactive<Record<string, any>>({})
const assetCondition = ref<string>('')

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

const assignmentReasonItems = computed(() => [
  { id: 'new-employee', name: 'New Employee Setup', value: 'new-employee' },
  { id: 'work-from-home', name: 'Work from Home Setup', value: 'work-from-home' },
  { id: 'project-requirement', name: 'Project Requirement', value: 'project-requirement' },
  { id: 'replacement', name: 'Equipment Replacement', value: 'replacement' },
  { id: 'upgrade', name: 'Equipment Upgrade', value: 'upgrade' },
  { id: 'temporary-assignment', name: 'Temporary Assignment', value: 'temporary-assignment' },
  { id: 'other', name: 'Other Reason', value: 'other' }
])


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

const onAssignmentReasonChange = (item: Item | null) => {
  selectedAssignmentReason.value = item
  formData.assignmentReason = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('assignmentReason')
  }
  
  validateFieldInline('assignmentReason')
}

// Helper function to apply validation classes to SearchableDropdown components
const applyValidationToSearchableDropdown = (fieldName: string, validationType: 'valid' | 'invalid') => {
  // Find the SearchableDropdown input by ID
  const input = document.getElementById(fieldName) as HTMLInputElement
  
  if (!input) {
    // If input is not found, try again after a short delay to allow for component mounting
    setTimeout(() => {
      const delayedInput = document.getElementById(fieldName) as HTMLInputElement
      if (delayedInput) {
        // Apply validation classes
        if (validationType === 'invalid') {
          delayedInput.classList.add('is-invalid')
          delayedInput.classList.remove('is-valid')
        } else {
          delayedInput.classList.add('is-valid')
          delayedInput.classList.remove('is-invalid')
        }
      }
    }, 100)
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

// Helper function to apply validation classes to DatePicker components
const applyValidationToDatePicker = (fieldName: string, validationType: 'valid' | 'invalid') => {
  // Find the DatePicker input by ID
  const input = document.getElementById(fieldName) as HTMLInputElement
  
  if (!input) {
    console.warn(`Could not find input for DatePicker field: ${fieldName}`)
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
  if (selectedValue) {
    setFieldValid(fieldName)
    applyValidationToSearchableDropdown(fieldName, 'valid')
    return true
  } else {
    setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
    applyValidationToSearchableDropdown(fieldName, 'invalid')
    return false
  }
}


const validateAssignmentDate = (fieldName: string, value: any): boolean => {
  if (!value) {
    setFieldError(fieldName, 'Issue date is required')
    return false
  }
  
  // Parse date from both dd-mm-yyyy and yyyy-mm-dd formats
  const parseDate = (dateString: string): Date | null => {
    const parts = dateString.split('-')
    if (parts.length === 3) {
      // Check if it's yyyy-mm-dd format (first part is 4 digits)
      if (parts[0].length === 4) {
        const [year, month, day] = parts.map(Number)
        return new Date(year, month - 1, day) // month is 0-indexed
      } else {
        // Assume dd-mm-yyyy format
        const [day, month, year] = parts.map(Number)
        return new Date(year, month - 1, day) // month is 0-indexed
      }
    }
    return null
  }
  
  const selectedDate = parseDate(value)
  
  if (!selectedDate || Number.isNaN(selectedDate.getTime())) {
    setFieldError(fieldName, 'Invalid date format')
    return false
  }
  
  setFieldValid(fieldName)
  return true
}

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const validateStandardField = (fieldName: string, element: HTMLElement): boolean => {
  const inputElement = element as FormElement
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
  assignmentReason: () => validateRequiredDropdown('assignmentReason', selectedAssignmentReason.value),
  assignmentDate: (value: any) => validateAssignmentDate('assignmentDate', value)
}

const validateFieldInline = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as FormElement
  
  if (!element) {
    return false
  }

  // Clear previous custom validity
  element.setCustomValidity('')

  // Check if field is required
  if (!validateRequiredField(fieldName, value, element)) {
    return false
  }

  // Handle specific field validations
  const handler = validationHandlers[fieldName as keyof typeof validationHandlers]
  if (handler) {
    if (fieldName === 'assignmentDate') {
      return (handler as (value: any) => boolean)(value)
    } else {
      return (handler as () => boolean)()
    }
  }

  // For SearchableDropdown fields, we've already handled validation above
  const searchableDropdownFields = ['assetId', 'employeeId', 'assignmentReason']
  if (searchableDropdownFields.includes(fieldName)) {
    return true // Already validated above
  }

  // Use native validation for other fields
  return validateStandardField(fieldName, element)
}

const setFieldError = (fieldName: string, message: string) => {
  fieldErrors[fieldName] = message
  fieldValidation[fieldName] = false
  
  const element = document.getElementById(fieldName) as FormElement
  if (element) {
    element.setCustomValidity(message)
  }
  
  // Apply validation classes to SearchableDropdown fields
  const searchableDropdownFields = ['assetId', 'employeeId', 'assignmentReason']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'invalid')
  }
  
  // Apply validation classes to DatePicker fields
  const datePickerFields = ['assignmentDate']
  if (datePickerFields.includes(fieldName)) {
    applyValidationToDatePicker(fieldName, 'invalid')
  }
}

const setFieldValid = (fieldName: string) => {
  delete fieldErrors[fieldName]
  fieldValidation[fieldName] = true
  
  const element = document.getElementById(fieldName) as FormElement
  if (element) {
    element.setCustomValidity('')
  }
  
  // Apply validation classes to SearchableDropdown fields
  const searchableDropdownFields = ['assetId', 'employeeId', 'assignmentReason']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'valid')
  }
  
  // Apply validation classes to DatePicker fields
  const datePickerFields = ['assignmentDate']
  if (datePickerFields.includes(fieldName)) {
    applyValidationToDatePicker(fieldName, 'valid')
  }
}

const clearFieldValidation = (fieldName: string) => {
  if (fieldValidation[fieldName] === false) {
    fieldValidation[fieldName] = null
    delete fieldErrors[fieldName]
  }
  
  // Also clear validation for SearchableDropdown components
  const searchableDropdownFields = ['assetId', 'employeeId', 'assignmentReason']
  if (searchableDropdownFields.includes(fieldName)) {
    const input = document.getElementById(fieldName) as HTMLInputElement
    if (input) {
      input.classList.remove('is-invalid', 'is-valid')
    }
  }
  
  // Also clear validation for DatePicker components
  const datePickerFields = ['assignmentDate']
  if (datePickerFields.includes(fieldName)) {
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

  // Validate required fields only
  let isFormValid = true
  const requiredFields = ['assetId', 'employeeId', 'assignmentReason', 'assignmentDate']

  for (const fieldName of requiredFields) {
    const isValid = validateFieldInline(fieldName)
    if (!isValid) {
      isFormValid = false
    }
  }

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

    if (!selectedAssetId || !selectedEmployeeId) {
      throw new Error('Please select both an asset and an employee')
    }

    // Get the current condition of the selected asset
    const currentAsset = availableAssets.value.find(asset => asset.id === selectedAssetId)
    const currentCondition = currentAsset?.condition || 'WORKING_CONDITION' // Fallback if condition is not available

    // Block assignment for TRASH-condition assets
    if (currentCondition === 'TRASH') {
      toastStore.showError(
        'Cannot Assign Asset',
        'This asset is marked as Trash and cannot be assigned. Please select a different asset.'
      )
      return
    }

    // Convert date from dd-mm-yyyy to yyyy-mm-dd format for API
    const convertDateFormat = (dateString: string): string => {
      if (!dateString) return ''
      
      // If already in yyyy-mm-dd format, return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString
      }
      
      // Convert from dd-mm-yyyy to yyyy-mm-dd
      const parts = dateString.split('-')
      if (parts.length === 3) {
        const [day, month, year] = parts
        return `${year}-${month}-${day}`
      }
      
      return dateString
    }
    
    // Prepare assignment data for API
    const assignmentData: CreateAssignmentDto = {
      assetId: selectedAssetId,
      employeeId: selectedEmployeeId,
      issueDate: convertDateFormat(formData.assignmentDate),
      issueCondition: currentCondition as 'NEW' | 'WORKING_CONDITION' | 'SOFTWARE_ISSUE' | 'HARDWARE_ISSUE' | 'NEEDS_REPAIR' | 'REFURBISHED', // Use the asset's current condition
      issueReason: reasonLabels[formData.assignmentReason as keyof typeof reasonLabels] || formData.assignmentReason,
      notes: formData.assignmentNotes || undefined
    }

    // Call the API to create assignment
    await assignmentApiService.createAssignment(assignmentData)
    
    const assignmentDetails = generateAssignmentDetails()
    
    // Redirect to the originating view immediately after success
    router.push(originPath.value)
    
    // Show success toast after redirect (with a small delay to ensure page loads)
    setTimeout(() => {
      toastStore.showSuccess('Success', `${assignmentDetails} has been issued successfully!`)
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
  const selectedEmployee = activeEmployees.value.find(emp => emp.id.toString() === formData.employeeId)
  
  let details = ''
  if (selectedAsset && selectedEmployee) {
    details = `${selectedAsset.assetId} - ${selectedAsset.model.name} to ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
  }
  return details || 'Asset issue'
}

const resetForm = () => {
  // Reset form data
  for (const key of Object.keys(formData)) {
    if (key === 'assignmentDate') {
      // Set date in dd-mm-yyyy format
      const today = new Date()
      const day = today.getDate().toString().padStart(2, '0')
      const month = (today.getMonth() + 1).toString().padStart(2, '0')
      const year = today.getFullYear()
      formData[key as keyof typeof formData] = `${day}-${month}-${year}`
    } else {
      formData[key as keyof typeof formData] = ''
    }
  }
  
  // Clear validation state
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
  for (const key of Object.keys(fieldValidation)) delete fieldValidation[key]
  
  // Reset form state
  formSubmitted.value = false
  
  if (issueAssetForm.value) {
    issueAssetForm.value.classList.remove('was-validated')
  }

  // Clear all validation classes from DOM elements
  nextTick(() => {
    const fields = document.querySelectorAll('.is-valid, .is-invalid')
    for (const field of fields) {
      field.classList.remove('is-valid', 'is-invalid')
    }
  })
}


// Navigation methods
const goBack = () => {
  router.push(originPath.value)
}

const scrollToFirstError = () => {
  // Hide any existing toasts (but keep this for other error toasts)
  const existingToasts = document.querySelectorAll('.custom-toast-notification')
  for (const toast of existingToasts) {
    toast.remove()
  }
  
  // Look for the first invalid input/select/textarea specifically
  const firstInvalid = document.querySelector('input.is-invalid, select.is-invalid, textarea.is-invalid, input:invalid, select:invalid, textarea:invalid') as FormElement
  
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
  assetCondition.value = ''
  // Clear specification fields
  specificationFields.value = []
  for (const key of Object.keys(assetSpecifications)) {
    delete assetSpecifications[key]
  }
}

// Load specification template from asset type
const loadAssetTypeTemplate = async (assetTypeId: number) => {
  try {
    const response = await assetTypeService.getAssetTypeById(assetTypeId)
    const assetType = response.data.assetType
    
    // Handle case where specificationTemplate might be a string
    let template = assetType.specificationTemplate
    if (typeof template === 'string') {
      try {
        template = JSON.parse(template)
      } catch (error) {
        console.error('Failed to parse specification template JSON:', error)
        template = undefined
      }
    }
    
    if (template && template.fields && Array.isArray(template.fields)) {
      specificationFields.value = template.fields.filter((field: SpecField) => Boolean(field?.key))
    } else {
      specificationFields.value = []
    }
  } catch (error) {
    console.error('Error loading asset type template:', error)
    specificationFields.value = []
  }
}

// Helper function to get column class for specification fields
const getSpecFieldColumnClass = (index: number, fields: SpecField[], fieldType: string): string => {
  // For textarea fields, use full width
  if (fieldType === 'textarea') {
    return 'col-12'
  }
  
  // For other fields, use half width on medium screens and up
  return 'col-md-6'
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

const formatAssetCondition = (condition: string | null | undefined): string => {
  if (!condition) {
    return ''
  }
  return condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase()
}

const clearAssetSpecifications = () => {
  for (const key of Object.keys(assetSpecifications)) {
    delete assetSpecifications[key]
  }
}

const populateAssetSpecifications = (specifications: Record<string, any>) => {
  clearAssetSpecifications()
  
  for (const key of Object.keys(specifications)) {
    const value = specifications[key]
    assetSpecifications[key] = value !== null && value !== undefined ? value : ''
  }
}

const handleAssetTypeAndSpecifications = async (asset: any) => {
  if (!asset.assetType?.id) {
    specificationFields.value = []
    return
  }

  await loadAssetTypeTemplate(asset.assetType.id)

  if (asset.specifications && typeof asset.specifications === 'object') {
    populateAssetSpecifications(asset.specifications)
  } else {
    clearAssetSpecifications()
  }
}

const handleFallbackSpecifications = (asset: any) => {
  if (specificationFields.value.length === 0) {
    selectedAssetSpecs.value = formatSpecifications(asset.specifications)
  } else {
    selectedAssetSpecs.value = null
  }
}

const processAssetDetails = async (asset: any) => {
  setAssetBrandModel(asset)
  assetCondition.value = formatAssetCondition(asset.condition)
  await handleAssetTypeAndSpecifications(asset)
  handleFallbackSpecifications(asset)
}

const loadAssetDetails = async (assetIdNumber: number) => {
  try {
    const response = await assetApiService.getAssetById(assetIdNumber)
    const asset = response.data.asset

    if (asset) {
      await processAssetDetails(asset)
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
    // Use the dropdown API to get all non-assigned assets without pagination
    const response = await assetApiService.getAssetsForDropdowns({ status: 'NON_ASSIGNED' })
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

// Helper functions for onMounted
const setDefaultAssignmentDate = () => {
  const today = new Date()
  const day = today.getDate().toString().padStart(2, '0')
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const year = today.getFullYear()
  formData.assignmentDate = `${day}-${month}-${year}`
}

const handlePreSelectedAsset = (hasExplicitReturnPath: boolean) => {
  const selectedAssetId = localStorage.getItem('selectedAssetId')
  const selectedAssetType = localStorage.getItem('selectedAssetType')
  
  if (!selectedAssetId || !selectedAssetType) {
    return false
  }
  
  if (!hasExplicitReturnPath) {
    originPath.value = '/app/assets'
  }
  
  const asset = availableAssets.value.find(asset => asset.assetId === selectedAssetId)
  if (asset) {
    selectedAsset.value = {
      id: asset.id,
      name: `${asset.assetId} - ${asset.serialNumber}`,
      value: asset.id.toString()
    }
    formData.assetId = asset.id.toString()
    formData.assetBrandModel = `${asset.brand.name} ${asset.model.name}`
    toastStore.showInfo('Info', `Asset ${selectedAssetId} pre-selected for issuing`)
  } else {
    toastStore.showError('Error', `Asset ${selectedAssetId} not found in available assets`)
  }
  
  localStorage.removeItem('selectedAssetId')
  localStorage.removeItem('selectedAssetType')
  return true
}

const handlePreSelectedEmployee = (fromQuery: string | undefined, hasExplicitReturnPath: boolean) => {
  const employeeIdFromQuery = route.query.employeeId as string
  if (!employeeIdFromQuery) {
    return false
  }
  
  if (!fromQuery && !hasExplicitReturnPath) {
    originPath.value = '/app/employees'
  }
  
  const employeeId = Number.parseInt(employeeIdFromQuery)
  const employee = activeEmployees.value.find(emp => Number(emp.id) === employeeId)
  if (employee) {
    selectedEmployee.value = {
      id: employee.id,
      name: `${employee.employeeId} - ${employee.firstName} ${employee.lastName}`,
      value: employee.id.toString()
    }
    formData.employeeId = employee.id.toString()
    toastStore.showInfo('Info', `Employee ${employee.firstName} ${employee.lastName} pre-selected for asset issue`)
  } else {
    toastStore.showError('Error', `Employee with ID ${employeeIdFromQuery} not found in active employees`)
  }
  return true
}

const determineOriginPath = (fromQuery: string | undefined, hasExplicitReturnPath: boolean) => {
  if (hasExplicitReturnPath) {
    return
  }
  
  if (fromQuery === 'employees') {
    originPath.value = '/app/employees'
  } else if (fromQuery === 'assets') {
    originPath.value = '/app/assets'
  } else if (fromQuery === 'dashboard') {
    originPath.value = '/app/dashboard'
  }
}

const focusAppropriateField = (assetWasPreSelected: boolean) => {
  nextTick(() => {
    const focusField = assetWasPreSelected ? 'employeeId' : 'assetId'
    const field = document.getElementById(focusField)
    if (field) field.focus()
  })
}

// Lifecycle
onMounted(async () => {
  ;(globalThis as any).scrollToFirstError = scrollToFirstError
  
  isLoading.value = true
  
  try {
    await Promise.all([
      loadAvailableAssets(),
      loadActiveEmployees()
    ])
  } catch (error) {
    console.error('Error loading form data:', error)
  } finally {
    isLoading.value = false
  }
  
  setDefaultAssignmentDate()
  
  const decodedReturnTo = decodeReturnToQuery(route.query.returnTo)
  const hasExplicitReturnPath = !!decodedReturnTo
  if (decodedReturnTo) {
    originPath.value = decodedReturnTo
  }

  const fromQuery = route.query.from as string | undefined
  const assetWasPreSelected = handlePreSelectedAsset(hasExplicitReturnPath)
  
  handlePreSelectedEmployee(fromQuery, hasExplicitReturnPath)
  determineOriginPath(fromQuery, hasExplicitReturnPath)
  focusAppropriateField(assetWasPreSelected)
})

</script>

<style scoped>
/* Import unified form styles */
@import url('../../assets/unified-form-styles.css');

/* Component-specific responsive adjustments only */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
  }
}

@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important;
  }
  
  .auto-expand-textarea.expanded {
    height: 100px !important;
  }
}
</style>
