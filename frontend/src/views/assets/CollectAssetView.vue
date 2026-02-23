<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto">
          <div class="card-header">
            <h4 class="card-title">Collect Asset from Employee</h4>
            <p class="text-muted">Retrieve an assigned asset from an employee</p>
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
                        placeholder="Search employees with assigned assets..."
                        :items="employeeItems"
                        v-model="selectedEmployee"
                        required
                        @change="onEmployeeChange"
                      />
                    </div>
                    <div class="form-text">Select employee who has assets assigned to them (required)</div>
                  </div>
                  
                  <!-- Issue Reason -->
                  <div v-if="selectedAssignmentReason" class="col-12">
                    <label for="issueReason" class="form-label">Issue Reason</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="issueReason" 
                      :value="selectedAssignmentReason"
                      readonly 
                      style="background-color: #F3F3F3; cursor: default;" 
                      placeholder="No issue reason available"
                    >
                    <div class="form-text">Reason for the original asset assignment</div>
                  </div>
                  
                  <!-- Issue Notes -->
                  <div v-if="selectedAssignmentNotes" class="col-12">
                    <div class="asset-specifications-wrapper">
                      <NotesTextarea 
                        :model-value="selectedAssignmentNotes"
                        label="Issue Notes"
                        placeholder="No issue notes available"
                        help-text=""
                        :max-length="1000"
                        :required="false"
                        :show-label="true"
                        :readonly="true"
                        input-id="assignmentNotes"
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
                      style="background-color: #F3F3F3; cursor: default;" 
                      placeholder="Auto-filled from selection"
                    >
                    <div class="form-text">Automatically populated based on asset selection</div>
                  </div>
                </div>
                

                <!-- Asset Specifications -->
                <div v-if="selectedAssetObject && specificationFields.length > 0" class="mt-4">
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
                <div v-else-if="selectedAssetObject && specificationFields.length === 0 && selectedAssetSpecs" class="mt-4">
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
                    <DatePicker
                      v-model="formData.collectionDate"
                      label="Collection Date"
                      placeholder="dd-mm-yyyy"
                      help-text="Date when the asset will be collected (required)"
                      :required="true"
                      input-id="collectionDate"
                      :error-message="fieldErrors.collectionDate"
                      :input-class="getFieldClass('collectionDate') as any"
                      @change="validateFieldInline('collectionDate')"
                      @blur="validateFieldInline('collectionDate')"
                      @focus="clearFieldValidation('collectionDate')"
                    />
                  </div>

                  <!-- Issue Date -->
                  <div class="col-md-6">
                    <label for="issueDate" class="form-label">Issue Date</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="issueDate" 
                      :value="selectedAssignmentDate"
                      readonly 
                      style="background-color: #F3F3F3; cursor: default;" 
                      placeholder="Auto-filled from assignment"
                    >
                    <div class="form-text">Date when the asset was originally issued</div>
                  </div>

                  <!-- Asset Condition -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="assetCondition"
                        :label="isAssetIssuedAsRefurbished ? 'Asset Condition (Locked to Refurbished)' : 'Asset Condition'"
                        placeholder="Choose condition..."
                        :items="conditionItems"
                        v-model="selectedCondition"
                        :disabled="isAssetIssuedAsRefurbished"
                        required
                        @change="onConditionChange"
                      />
                    </div>
                    <div class="form-text">Select the current condition of the asset (required)</div>
                  </div>

                  <!-- Issue Condition -->
                  <div class="col-md-6">
                    <label for="issueCondition" class="form-label">Issue Condition</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="issueCondition" 
                      :value="selectedAssetCondition"
                      readonly 
                      style="background-color: #F3F3F3; cursor: default;" 
                      placeholder="Auto-filled from assignment"
                    >
                    <div class="form-text">Condition of the asset when it was originally issued</div>
                  </div>

                  <!-- Collection Reason -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="collectionReason"
                        label="Collection Reason"
                        placeholder="Search collection reasons..."
                        :items="collectionReasonItems"
                        v-model="selectedCollectionReason"
                        :required="true"
                        @change="onCollectionReasonChange"
                      />
                    </div>
                    <div class="form-text">Select the reason for collecting this asset (required)</div>
                    <div v-if="fieldErrors.collectionReason" class="invalid-feedback">{{ fieldErrors.collectionReason }}</div>
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
                      class="btn btn-pink" 
                      :disabled="isSubmitting"
                      @click="submitForm"
                    >
                      <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                      {{ isSubmitting ? 'Collecting Asset...' : 'Collect Asset' }}
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
              <div class="row mb-2">
                <div class="col-4 fw-semibold text-muted">Issue Date:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.assignmentDate }}</div>
              </div>
              <div class="row mb-2">
                <div class="col-4 fw-semibold text-muted">Issue Condition:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.assignmentCondition }}</div>
              </div>
              <div class="row">
                <div class="col-4 fw-semibold text-muted">Current Condition:</div>
                <div class="col-8 fw-medium">{{ confirmationDetails.condition }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-cancel btn-sm" @click="closeConfirmationModal">
              Cancel
            </button>
            <button type="button" class="btn btn-pink btn-sm" @click="confirmCollection">
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
import { useToastStore } from '@/stores/toast'
import { collectAssetApiService, type ActiveAssignment, type ReturnAssignmentDto } from '../../services/api/collectAssetApi'
import { employeeApiService, type Employee } from '../../services/api/employeeApi'
import { assetTypeService } from '../../services/api/assetTypeService'
import { assetApiService } from '../../services/api/assetApi'
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
const selectedCollectionReason = ref<Item | null>(null)

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

const collectionReasonItems = computed(() => [
  { id: 'employee-left', name: 'Employee Left Company', value: 'employee-left' },
  { id: 'reassignment', name: 'Asset Reassignment', value: 'reassignment' },
  { id: 'maintenance', name: 'Maintenance Required', value: 'maintenance' },
  { id: 'upgrade', name: 'Equipment Upgrade', value: 'upgrade' },
  { id: 'return-request', name: 'Employee Return Request', value: 'return-request' },
  { id: 'other', name: 'Other Reason', value: 'other' }
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
  'DAMAGED': 'Damaged',
  'REFURBISHED': 'Refurbished'
}

// Computed properties
const filteredAssignedAssets = computed(() => {
  if (!formData.employeeId) {
    return assignedAssets.value
  }
  // Convert both to numbers for comparison since formData.employeeId is a string
  const selectedEmployeeId = Number.parseInt(formData.employeeId)
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
    assignmentDate: selectedAssignmentDate.value || '-',
    assignmentCondition: selectedAssetCondition.value || '-',
    condition: conditionLabel || '-'
  }
})

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
const assetConditionDisplay = ref<string>('')

// Computed property for selected asset object (for template condition)
const selectedAssetObject = computed(() => {
  if (!formData.assetId) return null
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  return selectedAssignment?.asset || null
})

// Computed property for selected asset specifications (fallback)
const selectedAssetSpecs = computed(() => {
  if (!formData.assetId) return null
  
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  
  // Use asset.specifications instead of model.specifications
  const specs = selectedAssignment?.asset?.specifications
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
      console.warn('Error parsing asset specifications JSON:', e)
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

// Computed property for selected assignment date
const selectedAssignmentDate = computed(() => {
  if (!formData.assetId) return null
  
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  
  if (!selectedAssignment?.issueDate) return null
  
  // Format the date for display (dd-mm-yyyy format)
  try {
    const date = new Date(selectedAssignment.issueDate)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  } catch (error) {
    console.warn('Failed to format issue date:', error)
    return selectedAssignment.issueDate
  }
})

// Computed property to check if the selected asset was issued in REFURBISHED condition
const isAssetIssuedAsRefurbished = computed(() => {
  if (!formData.assetId) {
    return false
  }
  
  const selectedAssignment = assignedAssets.value.find(assignment => 
    assignment.id.toString() === formData.assetId.toString()
  )
  
  return selectedAssignment?.issueCondition === 'REFURBISHED'
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
  // Prevent changing condition if asset was issued as REFURBISHED
  if (isAssetIssuedAsRefurbished.value && item && item.value !== 'REFURBISHED') {
    toastStore.showWarning('Warning', 'Cannot change condition. Asset was issued in REFURBISHED condition and must be collected as REFURBISHED.')
    
    // Reset to REFURBISHED
    selectedCondition.value = {
      id: 'REFURBISHED',
      name: 'Refurbished',
      value: 'REFURBISHED'
    }
    formData.assetCondition = 'REFURBISHED'
    return
  }
  
  selectedCondition.value = item
  formData.assetCondition = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('assetCondition')
  }
  
  validateFieldInline('assetCondition')
}

const onCollectionReasonChange = (item: Item | null) => {
  selectedCollectionReason.value = item
  formData.collectionReason = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('collectionReason')
  }
  
  validateFieldInline('collectionReason')
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
  // Extract the actual value from Proxy Object or use the value directly
  const actualValue = selectedValue?.value || selectedValue
  
  if (selectedValue) {
    // Special validation for asset condition when asset was issued as REFURBISHED
    if (fieldName === 'assetCondition' && isAssetIssuedAsRefurbished.value) {
      if (actualValue !== 'REFURBISHED') {
        setFieldError(fieldName, 'Collection condition must be REFURBISHED when asset was issued in REFURBISHED condition')
        applyValidationToSearchableDropdown(fieldName, 'invalid')
        return false
      }
    }
    
    setFieldValid(fieldName)
    applyValidationToSearchableDropdown(fieldName, 'valid')
    return true
  } else {
    // Special case: if asset was issued as REFURBISHED and no value is selected, it should be auto-validated
    if (fieldName === 'assetCondition' && isAssetIssuedAsRefurbished.value) {
      setFieldValid(fieldName)
      applyValidationToSearchableDropdown(fieldName, 'valid')
      return true
    }
    
    setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
    applyValidationToSearchableDropdown(fieldName, 'invalid')
    return false
  }
}

const validateCollectionDate = (fieldName: string, value: any): boolean => {
  if (!value) {
    setFieldError(fieldName, 'Collection date is required')
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
  
  // Check if date is more than 30 days in the future
  const futureLimit = new Date()
  futureLimit.setDate(futureLimit.getDate() + 30)
  
  if (selectedDate > futureLimit) {
    setFieldError(fieldName, 'Collection date cannot be more than 30 days in the future')
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
  employeeId: () => validateRequiredDropdown('employeeId', selectedEmployee.value),
  assetId: () => validateRequiredDropdown('assetId', selectedAsset.value),
  assetCondition: () => validateRequiredDropdown('assetCondition', selectedCondition.value),
  collectionReason: () => validateRequiredDropdown('collectionReason', selectedCollectionReason.value),
  collectionDate: (value: any) => validateCollectionDate('collectionDate', value)
}

const validateFieldInline = (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as FormElement
  
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
    if (fieldName === 'collectionDate') {
      return (handler as (value: any) => boolean)(value)
    } else {
      return (handler as () => boolean)()
    }
  }

  // For SearchableDropdown fields, we've already handled validation above
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition', 'collectionReason']
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
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition', 'collectionReason']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'invalid')
  }
  
  // Apply validation classes to DatePicker fields
  const datePickerFields = ['collectionDate']
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
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition', 'collectionReason']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'valid')
  }
  
  // Apply validation classes to DatePicker fields
  const datePickerFields = ['collectionDate']
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
  const searchableDropdownFields = ['employeeId', 'assetId', 'assetCondition', 'collectionReason']
  if (searchableDropdownFields.includes(fieldName)) {
    const input = document.getElementById(fieldName) as HTMLInputElement
    if (input) {
      input.classList.remove('is-invalid', 'is-valid')
    }
  }
  
  // Also clear validation for DatePicker components
  const datePickerFields = ['collectionDate']
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

// Helper function to convert date from dd-mm-yyyy to yyyy-mm-dd
const convertDateFormat = (dateString: string): string => {
  if (!dateString) return ''
  
  // Check if it's already in yyyy-mm-dd format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
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

  for (const fieldName of allFields) {
    if (!validateFieldInline(fieldName)) {
      isFormValid = false
    }
  }

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
      returnDate: convertDateFormat(formData.collectionDate), // Convert date format
      returnCondition: formData.assetCondition as 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED' | 'REFURBISHED', // Already uppercase from SearchableDropdown
      returnReason: formData.collectionReason,
      notes: formData.collectionNotes || undefined
    }
    

    // Call the API to collect/return the asset
    await collectAssetApiService.collectAsset(Number.parseInt(formData.assetId), returnData)
    
    const collectionDetails = generateCollectionDetails()
    
    // Redirect to the originating view immediately after success
    router.push(originPath.value)
    
    // Show success toast after redirect (with a small delay to ensure page loads)
    setTimeout(() => {
      toastStore.showSuccess('Success', `${collectionDetails} has been collected successfully!`)
    }, 100)
    
  } catch (error: any) {
    console.error('Error collecting asset:', error)
    toastStore.showError('Error', error.message || 'An error occurred while collecting the asset. Please try again.')
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
  for (const key of Object.keys(formData)) {
    if (key === 'collectionDate') {
      formData[key as keyof typeof formData] = new Date().toISOString().split('T')[0]
    } else {
      formData[key as keyof typeof formData] = ''
    }
  }
  
  // Clear validation state
  for (const key of Object.keys(fieldErrors)) delete fieldErrors[key]
  for (const key of Object.keys(fieldValidation)) delete fieldValidation[key]
  
  // Reset form state
  formSubmitted.value = false
  
  if (collectAssetForm.value) {
    collectAssetForm.value.classList.remove('was-validated')
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

// Removed functions - no longer needed with simple toast notifications

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

// Helper function to set brand model from assignment
const setBrandModelFromAssignment = (selectedAssignment: ActiveAssignment) => {
  if (selectedAssignment.asset.brand && selectedAssignment.asset.model) {
    formData.assetBrandModel = `${selectedAssignment.asset.brand.name} ${selectedAssignment.asset.model.name}`
  } else {
    formData.assetBrandModel = 'Brand/Model not available'
  }
}

// Helper function to auto-select employee from assignment
const autoSelectEmployeeFromAssignment = (selectedAssignment: ActiveAssignment) => {
  if (!selectedEmployee.value) {
    selectedEmployee.value = {
      id: selectedAssignment.employee.id,
      name: `${selectedAssignment.employee.employeeId} - ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`,
      value: selectedAssignment.employee.id.toString()
    }
    formData.employeeId = selectedAssignment.employee.id.toString()
  }
}

// Helper function to handle refurbished condition auto-selection
const handleRefurbishedConditionAutoSelect = () => {
  selectedCondition.value = {
    id: 'REFURBISHED',
    name: 'Refurbished',
    value: 'REFURBISHED'
  }
  formData.assetCondition = 'REFURBISHED'
  
  nextTick(() => {
    validateFieldInline('assetCondition')
  })
  
  toastStore.showInfo('Info', 'Asset was issued in REFURBISHED condition. Collection condition has been automatically set to REFURBISHED.')
}

// Load specification template from asset type
const loadAssetTypeTemplate = async (assetTypeId: number) => {
  try {
    const response = await assetTypeService.getAssetTypeById(assetTypeId)
    let assetType = response.data.assetType
    
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

const handleLoadAssetError = (error: any) => {
  console.error('Error fetching asset details:', error)
  specificationFields.value = []
  clearAssetSpecifications()
  assetConditionDisplay.value = ''
}

// Load asset details and populate specifications
const loadAssetDetails = async (assetId: number) => {
  try {
    const response = await assetApiService.getAssetById(assetId)
    const asset = response.data.asset

    if (!asset) {
      return
    }

    assetConditionDisplay.value = formatAssetCondition(asset.condition)
    await handleAssetTypeAndSpecifications(asset)
  } catch (error) {
    handleLoadAssetError(error)
  }
}

// Clear asset details
const clearAssetDetails = () => {
  specificationFields.value = []
  for (const key of Object.keys(assetSpecifications)) {
    delete assetSpecifications[key]
  }
  assetConditionDisplay.value = ''
}

// Asset selection handler - sync with employee dropdown
watch(() => selectedAsset.value, async (newValue) => {
  if (!newValue?.value) {
    formData.assetBrandModel = ''
    clearAssetDetails()
    return
  }
  
  const assignmentId = Number.parseInt(newValue.value.toString())
  const selectedAssignment = assignedAssets.value.find(assignment => assignment.id === assignmentId)
  
  if (!selectedAssignment) {
    formData.assetBrandModel = ''
    clearAssetDetails()
    return
  }
  
  setBrandModelFromAssignment(selectedAssignment)
  autoSelectEmployeeFromAssignment(selectedAssignment)
  
  // Load asset details for specifications
  if (selectedAssignment.asset?.id) {
    await loadAssetDetails(selectedAssignment.asset.id)
  }
  
  if (selectedAssignment.issueCondition === 'REFURBISHED') {
    handleRefurbishedConditionAutoSelect()
  }
}, { immediate: true })

// Also watch formData.assetId to load specifications when asset changes
watch(() => formData.assetId, async (newAssetId) => {
  if (!newAssetId) {
    clearAssetDetails()
    return
  }
  
  const assignmentId = Number.parseInt(newAssetId.toString())
  const selectedAssignment = assignedAssets.value.find(assignment => assignment.id === assignmentId)
  
  if (selectedAssignment?.asset?.id) {
    await loadAssetDetails(selectedAssignment.asset.id)
  }
})

// Helper function to update brand model for existing selection
const updateBrandModelForExistingSelection = (newAssignments: ActiveAssignment[]) => {
  if (!selectedAsset.value?.value || newAssignments.length === 0) {
    return
  }
  
  const assignmentId = Number.parseInt(selectedAsset.value.value.toString())
  const selectedAssignment = newAssignments.find(assignment => assignment.id === assignmentId)
  
  if (selectedAssignment?.asset.brand && selectedAssignment?.asset.model) {
    formData.assetBrandModel = `${selectedAssignment.asset.brand.name} ${selectedAssignment.asset.model.name}`
  }
}

// Helper function to set pre-selection values from assignment
const setPreSelectionValues = (selectedAssignment: ActiveAssignment, selectedAssetId: string) => {
  isPreSelecting.value = true
  
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
  
  handlePreSelectionCondition(selectedAssignment, selectedAssetId)
  clearPreSelectionFlag()
  cleanupLocalStorage()
}

// Helper function to handle refurbished condition for pre-selection
const handlePreSelectionCondition = (selectedAssignment: ActiveAssignment, selectedAssetId: string) => {
  const isRefurbished = selectedAssignment.issueCondition === 'REFURBISHED'
  
  if (isRefurbished) {
    selectedCondition.value = {
      id: 'REFURBISHED',
      name: 'Refurbished',
      value: 'REFURBISHED'
    }
    formData.assetCondition = 'REFURBISHED'
    nextTick(() => validateFieldInline('assetCondition'))
  }
  
  const message = isRefurbished 
    ? `Asset ${selectedAssetId} pre-selected for collection from ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}. Condition automatically set to REFURBISHED.`
    : `Asset ${selectedAssetId} pre-selected for collection from ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`
  
  toastStore.showInfo('Info', message)
}

// Helper function to clear pre-selection flag
const clearPreSelectionFlag = () => {
  nextTick(() => {
    setTimeout(() => {
      isPreSelecting.value = false
    }, 100)
  })
}

// Helper function to cleanup localStorage
const cleanupLocalStorage = () => {
  localStorage.removeItem('selectedAssetId')
  localStorage.removeItem('currentEmployee')
}

// Helper function to handle localStorage pre-selection
const handleLocalStoragePreSelection = (newAssignments: ActiveAssignment[]) => {
  const selectedAssetId = localStorage.getItem('selectedAssetId')
  
  if (!selectedAssetId || newAssignments.length === 0 || selectedAsset.value) {
    return
  }
  
  const selectedAssignment = newAssignments.find(assignment => assignment.asset.assetId === selectedAssetId)
  
  if (selectedAssignment) {
    setPreSelectionValues(selectedAssignment, selectedAssetId)
  }
}

// Watch for when assignedAssets are loaded to update brand-model if assetId is already set
watch(() => assignedAssets.value, (newAssignments) => {
  updateBrandModelForExistingSelection(newAssignments)
  handleLocalStoragePreSelection(newAssignments)
}, { deep: true })

// API loading functions
const loadActiveEmployees = async () => {
  try {
    isLoadingEmployees.value = true
    // Get only employees who have assets assigned to them
    const response = await employeeApiService.getEmployeesForDropdowns('ACTIVE', true)
    activeEmployees.value = response.data.employees
  } catch (error: any) {
    console.error('Error loading employees with assigned assets:', error)
    toastStore.showError('Error', 'Failed to load employees with assigned assets. Please try again.')
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
    toastStore.showError('Error', 'Failed to load assigned assets. Please try again.')
  } finally {
    isLoadingAssignments.value = false
  }
}

// Helper functions to reduce cognitive complexity
const initializeFormData = () => {
  formData.collectionDate = new Date().toISOString().split('T')[0]
}

const getQueryParameters = () => {
  const qpAssetId = route.query.assetId ? route.query.assetId.toString() : ''
  const qpEmployeeId = route.query.employeeId ? route.query.employeeId.toString() : ''
  const fromQuery = route.query.from as string | undefined
  const selectedAssetId = qpAssetId || localStorage.getItem('selectedAssetId') || ''
  const currentEmployee = qpEmployeeId || localStorage.getItem('currentEmployee') || ''
  
  
  return { qpAssetId, qpEmployeeId, fromQuery, selectedAssetId, currentEmployee }
}

const inferOriginPath = (
  fromQuery: string | undefined,
  qpEmployeeId: string,
  currentEmployee: string,
  qpAssetId: string,
  skipOriginUpdate: boolean
) => {
  if (skipOriginUpdate) return

  if (!fromQuery && (qpEmployeeId || currentEmployee)) {
    originPath.value = '/app/employees'
  } else if (!fromQuery && (qpAssetId || localStorage.getItem('selectedAssetId'))) {
    originPath.value = '/app/assets'
  }
}

const setPreselectedAssignment = (selectedAssignment: any, selectedAssetId: string) => {
  isPreSelecting.value = true
  
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
  
  // Auto-select REFURBISHED condition if asset was issued in REFURBISHED condition
  if (selectedAssignment.issueCondition === 'REFURBISHED') {
    selectedCondition.value = {
      id: 'REFURBISHED',
      name: 'Refurbished',
      value: 'REFURBISHED'
    }
    formData.assetCondition = 'REFURBISHED'
    
    // Trigger validation to mark the field as valid
    nextTick(() => {
      validateFieldInline('assetCondition')
    })
  }
  
  nextTick(() => {
    setTimeout(() => {
      isPreSelecting.value = false
    }, 100)
  })
  
  const message = selectedAssignment.issueCondition === 'REFURBISHED' 
    ? `Asset ${selectedAssetId} pre-selected for collection from ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}. Condition automatically set to REFURBISHED.`
    : `Asset ${selectedAssetId} pre-selected for collection from ${selectedAssignment.employee.firstName} ${selectedAssignment.employee.lastName}`
  
  toastStore.showInfo('Info', message)
}

const handleAssetPreselection = (
  selectedAssetId: string,
  qpAssetId: string,
  qpEmployeeId: string,
  currentEmployee: string,
  fromQuery: string | undefined,
  skipOriginUpdate: boolean
) => {
  if (!selectedAssetId) return
  
  inferOriginPath(fromQuery, qpEmployeeId, currentEmployee, qpAssetId, skipOriginUpdate)
  
  const selectedAssignment = assignedAssets.value.find(assignment => assignment.asset.assetId === selectedAssetId)
  
  if (selectedAssignment) {
    setPreselectedAssignment(selectedAssignment, selectedAssetId)
  } else {
    console.error('Assignment not found for asset:', selectedAssetId)
    toastStore.showError('Error', `Asset ${selectedAssetId} not found in assigned assets`)
  }
  
  // Clear localStorage only if values weren't from query params
  if (!qpAssetId) localStorage.removeItem('selectedAssetId')
  if (!qpEmployeeId) localStorage.removeItem('currentEmployee')
}

const setFinalOriginPath = (fromQuery: string | undefined, qpEmployeeId: string, skipOriginUpdate: boolean) => {
  if (skipOriginUpdate) return

  if (fromQuery === 'employees') {
    originPath.value = '/app/employees'
  } else if (fromQuery === 'assets') {
    originPath.value = '/app/assets'
  } else if (fromQuery === 'dashboard') {
    originPath.value = '/app/dashboard'
  } else if (!fromQuery && qpEmployeeId) {
    originPath.value = '/app/employees'
  }
  
}

const focusAppropriateField = () => {
  nextTick(() => {
    const hasEmployee = !!formData.employeeId
    const hasAsset = !!formData.assetId
    
    let focusField = 'employeeId'
    if (hasEmployee && hasAsset) {
      focusField = 'collectionReason'
    } else if (hasEmployee && !hasAsset) {
      focusField = 'assetId'
    }
    // If (!hasEmployee && hasAsset), focusField remains 'employeeId' (default value)
    
    const field = document.getElementById(focusField)
    if (field) field.focus()
  })
}

// Lifecycle
onMounted(async () => {
  // Make functions available globally
  ;(globalThis as any).scrollToFirstError = scrollToFirstError
  
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
  
  // Initialize form data
  initializeFormData()
  
  // Get query parameters
  const { qpAssetId, qpEmployeeId, fromQuery, selectedAssetId, currentEmployee } = getQueryParameters()
  const decodedReturnTo = decodeReturnToQuery(route.query.returnTo)
  const hasExplicitReturnPath = !!decodedReturnTo

  if (decodedReturnTo) {
    originPath.value = decodedReturnTo
  }
  
  // Handle asset preselection
  handleAssetPreselection(selectedAssetId, qpAssetId, qpEmployeeId, currentEmployee, fromQuery, hasExplicitReturnPath)
  
  // Set final origin path
  setFinalOriginPath(fromQuery, qpEmployeeId, hasExplicitReturnPath)
  
  // Focus appropriate field
  focusAppropriateField()
})
</script> 

<style scoped>
/* Import unified form styles */
@import url('../../assets/unified-form-styles.css');

/* Component-specific styles: Modal styling */
.modal-content {
  border: none !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
}

/* Modal backdrop - Using Bootstrap default */

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

/* Description Text */
.modal-body p {
  margin-bottom: 1rem !important;
  color: #0A0A0A !important;
  font-weight: 500 !important;
}

/* Component-specific responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
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
}
</style> 