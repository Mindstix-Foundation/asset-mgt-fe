<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(10, 10, 10, 0.3) !important;">
          <div class="card-header bg-light border-bottom text-center py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div style="display: block;">
              <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">
                {{ isEditMode ? 'Edit Asset' : 'Add New Asset' }}
              </h4>
              <p class="text-muted mb-0 small" style="display: block;">
                {{ isEditMode ? 'Update asset information in your system' : 'Register a new asset in your system' }}
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
              <p class="mt-3 text-muted">Loading asset data...</p>
            </div>
            
            <!-- Form -->
            <form v-else ref="assetForm" @submit.prevent="handleSubmit" class="needs-validation" :class="{ 'was-validated': wasValidated }" @keydown.enter="handleEnterKey" novalidate autocomplete="off">
              
              <!-- Section 1: Basic Asset Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Basic Asset Information</legend>
                <div class="row g-4">
                  <!-- Asset ID -->
                  <div class="col-md-6">
                    <label for="assetId" class="form-label">
                      Asset ID 
                      <span class="text-muted" v-if="!isEditMode">(Auto-generated)</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="assetId" 
                      v-model="formData.assetId"
                      :placeholder="isEditMode ? 'Asset ID' : 'AST-XXX'"
                      :readonly="!isEditMode"
                      style="background-color: #F3F3F3;"
                    >
                    <div class="form-text">
                      {{ isEditMode ? 'Asset identification number' : 'Automatically generated when form is submitted' }}
                    </div>
                  </div>

                  <!-- Serial Number -->
                  <div class="col-md-6">
                    <label for="serialNumber" class="form-label">
                      Serial Number <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="serialNumber" 
                      v-model="formData.serialNumber"
                      :class="getFieldClass('serialNumber')"
                      placeholder="Enter serial number" 
                      required 
                      minlength="3" 
                      maxlength="50" 
                      pattern="[A-Za-z0-9\-_]{3,50}"
                      title="Serial number must be 3-50 characters (letters, numbers, hyphens, underscores only)"
                      @blur="validateFieldInline('serialNumber')"
                      @focus="clearFieldValidation('serialNumber')"
                      @input="handleFieldInput('serialNumber')"
                    >
                    <div class="form-text">3-50 characters (letters, numbers, hyphens, underscores only)</div>
                    <div class="invalid-feedback">{{ errors.serialNumber }}</div>
                  </div>

                  <!-- Asset Category -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="assetCategory"
                        :label="props.disableAssetIdentity ? 'Asset Category (Read-only)' : 'Asset Category'"
                        placeholder="Search categories..."
                        :items="categoryItems"
                        v-model="selectedCategory"
                        :required="!props.disableAssetIdentity"
                        :disabled="props.disableAssetIdentity"
                        @change="onCategoryChange"
                      />
                    </div>
                    <div class="form-text">
                      <span v-if="props.disableAssetIdentity">
                        Asset category cannot be changed after creation
                      </span>
                      <span v-else>
                        Select the high-level category first. 
                        <router-link to="/app/assets/manage-categories" class="text-primary">
                          <i class="fas fa-cogs me-1"></i>Manage Categories
                        </router-link>
                      </span>
                    </div>
                  </div>

                  <!-- Asset Type -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="assetType"
                        :label="props.disableAssetIdentity ? 'Asset Type (Read-only)' : 'Asset Type'"
                        :placeholder="props.disableAssetIdentity ? 'Asset type (read-only)' : (selectedCategory ? 'Search asset types...' : 'Select category first...')"
                        :items="typeItems"
                        v-model="selectedType"
                        :disabled="props.disableAssetIdentity || !selectedCategory"
                        :required="!props.disableAssetIdentity"
                        @change="onTypeChange"
                      />
                    </div>
                    <div class="form-text">
                      <span v-if="props.disableAssetIdentity">
                        Asset type cannot be changed after creation
                      </span>
                      <span v-else>
                        Select category above to unlock asset type options.
                        <span v-if="typeItems.length === 0 && selectedCategory">
                          <router-link to="/app/assets/manage-categories" class="text-primary">
                            <i class="fas fa-plus me-1"></i>Add asset types
                          </router-link>
                        </span>
                      </span>
                    </div>
                  </div>

                  <!-- Brand -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="brand"
                        :label="props.disableAssetIdentity ? 'Brand (Read-only)' : 'Brand'"
                        :placeholder="props.disableAssetIdentity ? 'Brand (read-only)' : (selectedType ? 'Search brands...' : 'Select asset type first...')"
                        :items="brandItems"
                        v-model="selectedBrand"
                        :disabled="props.disableAssetIdentity || !selectedType"
                        :required="!props.disableAssetIdentity"
                        @change="onBrandChange"
                      />
                    </div>
                    <div class="form-text">
                      <span v-if="props.disableAssetIdentity">
                        Brand cannot be changed after creation
                      </span>
                      <span v-else>
                        Select asset type above to unlock brand options.
                        <span v-if="brandItems.length === 0 && selectedType">
                          <router-link to="/app/assets/manage-categories" class="text-primary">
                            <i class="fas fa-plus me-1"></i>Add brands
                          </router-link>
                        </span>
                      </span>
                    </div>
                  </div>

                  <!-- Model -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="model"
                        :label="props.disableAssetIdentity ? 'Model (Read-only)' : 'Model'"
                        :placeholder="props.disableAssetIdentity ? 'Model (read-only)' : (selectedBrand ? 'Search models...' : 'Select brand first...')"
                        :items="modelItems"
                        v-model="selectedModel"
                        :disabled="props.disableAssetIdentity || !selectedBrand"
                        :required="!props.disableAssetIdentity"
                        @change="onModelChange"
                      />
                    </div>
                    <div class="form-text">
                      <span v-if="props.disableAssetIdentity">
                        Model cannot be changed after creation
                      </span>
                      <span v-else>
                        Select brand above to unlock model options.
                        <span v-if="modelItems.length === 0 && selectedBrand">
                          <router-link to="/app/assets/manage-categories" class="text-primary">
                            <i class="fas fa-plus me-1"></i>Add models
                          </router-link>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Purchase & Financial Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Purchase & Financial Information</legend>
                <div class="row g-4">
                  <!-- Purchase Date -->
                  <div class="col-md-6">
                    <DatePicker
                      id="purchaseDate"
                      label="Purchase Date (Optional)"
                      v-model="formData.purchaseDate"
                      :max="todayDate"
                      help-text="Cannot be future date"
                      @change="handleFieldInput('purchaseDate')"
                      @blur="validateFieldInline('purchaseDate')"
                    />
                  </div>

                  <!-- Purchase Cost -->
                  <div class="col-md-6">
                    <label for="purchaseCost" class="form-label">
                      Purchase Cost <span class="text-muted">(Optional)</span>
                    </label>
                    <div class="search-input-container">
                      <span class="search-icon">₹</span>
                      <input 
                        type="number" 
                        class="form-control search-input" 
                        id="purchaseCost" 
                        v-model="formData.purchaseCost"
                        :class="getFieldClass('purchaseCost')"
                        placeholder="0.00" 
                        step="0.01" 
                        min="0" 
                        max="1000000"
                        title="Purchase cost cannot exceed ₹10,00,000"
                        @blur="validateFieldInline('purchaseCost')"
                        @focus="clearFieldValidation('purchaseCost')"
                        @input="handleFieldInput('purchaseCost')"
                      >
                    </div>
                    <div class="form-text">Enter amount in Indian Rupees (max ₹10,00,000)</div>
                  </div>

                  <!-- Vendor -->
                  <div class="col-12">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="vendor"
                        label="Vendor (Optional)"
                        placeholder="Search vendors..."
                        :items="vendorItems"
                        v-model="selectedVendor"
                        :required="false"
                        @change="onVendorChange"
                      />
                    </div>
                    <div class="form-text">Select the vendor or supplier for this asset</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 3: Warranty Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Warranty Information</legend>
                <div class="row g-4">
                  <!-- Warranty Start Date -->
                  <div class="col-md-6">
                    <DatePicker
                      id="warrantyStartDate" 
                      label="Warranty Start Date (Optional)"
                      v-model="formData.warrantyStartDate"
                      help-text="When warranty coverage begins"
                      @change="handleFieldInput('warrantyStartDate')"
                      @blur="validateFieldInline('warrantyStartDate')"
                    />
                  </div>

                  <!-- Warranty End Date -->
                  <div class="col-md-6">
                    <DatePicker
                      id="warrantyEndDate" 
                      label="Warranty End Date (Optional)"
                      v-model="formData.warrantyEndDate"
                      help-text="When warranty coverage expires"
                      @change="handleFieldInput('warrantyEndDate')"
                      @blur="validateFieldInline('warrantyEndDate')"
                    />
                  </div>
                </div>
              </fieldset>

              <!-- Section 4: Location & Status -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Location & Status</legend>
                <div class="row g-4">
                  <!-- Location -->
                  <div class="col-md-6">
                    <label for="location" class="form-label">
                      Location <span class="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="location" 
                      v-model="formData.location"
                      :class="getFieldClass('location')"
                      placeholder="e.g., Warehouse A, Shelf B2" 
                      required 
                      minlength="2" 
                      maxlength="100"
                      title="Location must be 2-100 characters"
                      @blur="validateFieldInline('location')"
                      @focus="clearFieldValidation('location')"
                      @input="handleFieldInput('location')"
                    >
                    <div class="form-text">Physical location where asset is stored (2-100 characters)</div>
                  </div>

                  <!-- Condition -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="condition"
                        label="Condition"
                        placeholder="Select condition..."
                        :items="conditionItems"
                        v-model="selectedCondition"
                        required
                        @change="onConditionChange"
                      />
                    </div>
                    <div class="form-text">Physical condition of the asset</div>
                  </div>

                  <!-- Status -->
                  <div class="col-md-6">
                    <div v-if="isEditMode">
                      <!-- Edit Mode: Dynamic status options based on current status -->
                      <div class="form-searchable-dropdown">
                        <SearchableDropdown
                          id="status"
                          label="Status"
                          placeholder="Select status..."
                          :items="statusItems"
                          v-model="selectedStatus"
                          @change="onStatusChange"
                        />
                      </div>
                    </div>
                    <div v-else>
                      <!-- New Asset Mode: Fixed AVAILABLE status -->
                      <label for="status" class="form-label">Status</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="status" 
                        value="AVAILABLE"
                        readonly 
                        style="background-color: #F3F3F3;"
                      >
                      <div class="form-text">New assets are automatically set to AVAILABLE status</div>
                    </div>
                    <div class="invalid-feedback">{{ errors.status }}</div>
                  </div>

                  <!-- Notes -->
                  <div class="col-12">
                    <NotesTextarea 
                      v-model="formData.notes"
                      label="Additional Notes"
                      placeholder="Enter special handling instructions, known issues, or other relevant information..."
                      help-text="Include special handling instructions, known issues, or other relevant information. Textarea expands automatically as you type."
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
          <div class="card-footer bg-light border-top">
            <div class="form-actions">
              <div class="d-flex justify-content-center gap-3">
                <button 
                  type="button" 
                  class="btn btn-cancel" 
                  @click="handleCancel"
                  :disabled="isSubmitting"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary px-5 py-2" 
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Registering...') : (isEditMode ? 'Update Asset' : 'Register Asset') }}
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
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { assetService } from '@/services/business/assetService'
import NotesTextarea from '../common/NotesTextarea.vue'
import SearchableDropdown, { type Item } from '../common/SearchableDropdown.vue'
import DatePicker from '../ui/date/DatePicker.vue'
import { assetCategoryService } from '@/services/api/assetCategoryService'
import { assetTypeService } from '@/services/api/assetTypeService'
import { brandService } from '@/services/api/brandService'
import { modelService } from '@/services/api/modelService'
import { VendorApiService } from '@/services/api/vendorApi'
import type { AssetCategory } from '@/services/api/assetCategoryService'
import type { AssetType } from '@/services/api/assetTypeService'
import type { Brand } from '@/services/api/brandService'
import type { Model } from '@/services/api/modelService'
import type { Vendor } from '@/types/vendor.types'

// Type aliases
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

// Props
interface Props {
  asset?: any
  isEditMode?: boolean
  disableAssetIdentity?: boolean // New prop to disable asset category, type, brand, model in edit mode
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  asset: null,
  disableAssetIdentity: false
})

// Emits
const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

// Helper function to ensure date format is correct
const ensureDateFormat = (dateValue: any): string => {
  if (!dateValue) return ''
  if (typeof dateValue === 'string') {
    // If it's already in yyyy-MM-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue
    }
    // If it's a date string, try to parse and format it
    const date = new Date(dateValue)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  }
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0]
  }
  return ''
}

// Reactive data
const formData = reactive({
  assetId: '',
  serialNumber: '',
  assetTypeId: undefined as string | undefined,
  brandId: undefined as string | undefined,
  modelId: undefined as string | undefined,
  vendorId: undefined as string | undefined,
  purchaseDate: '',
  purchaseCost: '',
  warrantyStartDate: '',
  warrantyEndDate: '',
  location: '',
  condition: 'NEW',
  status: 'AVAILABLE',
  notes: ''
})

// UI form data for dropdowns (separate from API data)
const uiFormData = reactive({
  assetCategory: '',
  assetType: '',
  brand: '',
  model: '',
  vendor: ''
})

// Selected items for SearchableDropdown components
const selectedCategory = ref<Item | null>(null)
const selectedType = ref<Item | null>(null)
const selectedBrand = ref<Item | null>(null)
const selectedModel = ref<Item | null>(null)
const selectedVendor = ref<Item | null>(null)
const selectedCondition = ref<Item | null>(null)
const selectedStatus = ref<Item | null>(null)

const errors = reactive({
  serialNumber: '',
  assetCategory: '',
  assetType: '',
  brand: '',
  model: '',
  purchaseDate: '',
  purchaseCost: '',
  vendor: '',
  warrantyStartDate: '',
  warrantyEndDate: '',
  location: '',
  condition: '',
  status: '',
  notes: ''
})

// Validation state management (following EmployeeForm pattern)
const fieldValidation = reactive<Record<string, boolean | null>>({})
const wasValidated = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(false)
const notesExpanded = ref(false)
const formSubmitted = ref(false)

// Store original asset data for comparison (only in edit mode)
const originalAssetData = ref<any>(null)

// Template refs
const assetForm = ref<HTMLFormElement>()

// API Data
const categories = ref<AssetCategory[]>([])
const assetTypes = ref<AssetType[]>([])
const brands = ref<Brand[]>([])
const models = ref<Model[]>([])
const vendors = ref<Vendor[]>([])

// Computed properties
const notesCharCount = computed(() => formData.notes.length)

const characterCountClass = computed(() => {
  const percentage = (notesCharCount.value / 1000) * 100
  if (percentage > 90) return 'danger'
  if (percentage > 75) return 'warning'
  return 'muted'
})

// Today's date for date validation
const todayDate = computed(() => new Date().toISOString().split('T')[0])

// Transform API data to SearchableDropdown format
const categoryItems = computed(() => {
  return categories.value.map(category => ({
    id: category.id,
    name: category.name,
    value: category.id.toString()
  }))
})

const typeItems = computed(() => {
  if (!selectedCategory.value) return []
  return assetTypes.value.map(type => ({
    id: type.id,
    name: type.name,
    value: type.id.toString()
  }))
})

const brandItems = computed(() => {
  if (!selectedType.value) return []
  return brands.value.map(brand => ({
    id: brand.id,
    name: brand.name,
    value: brand.id.toString()
  }))
})

const modelItems = computed(() => {
  if (!selectedBrand.value) return []
  return models.value.map(model => ({
    id: model.id,
    name: model.name,
    value: model.id.toString()
  }))
})

const vendorItems = computed(() => {
  return vendors.value.map(vendor => ({
    id: vendor.id,
    name: vendor.name,
    value: vendor.id.toString()
  }))
})

const conditionItems = computed(() => {
  const baseConditions = [
    { id: 'GOOD', name: 'Good', value: 'GOOD' },
    { id: 'FAIR', name: 'Fair', value: 'FAIR' },
    { id: 'POOR', name: 'Poor', value: 'POOR' },
    { id: 'DAMAGED', name: 'Damaged', value: 'DAMAGED' },
    { id: 'REFURBISHED', name: 'Refurbished', value: 'REFURBISHED' }
  ]
  
  // Check if asset has assignment history
  const assetIssues = props.asset?.assetIssues || []
  
  // If asset has never been assigned, include NEW option
  if (assetIssues.length === 0) {
    return [
      { id: 'NEW', name: 'New', value: 'NEW' },
      ...baseConditions
    ]
  }
  
  // Check if asset is currently assigned to its first employee
  const hasReturnedAssignments = assetIssues.some((issue: any) => issue.returnDate !== null)
  
  // If asset has been returned from any employee, exclude NEW option
  if (hasReturnedAssignments) {
    return baseConditions
  }
  
  // If asset is currently assigned to its first employee, include NEW option
  return [
    { id: 'NEW', name: 'New', value: 'NEW' },
    ...baseConditions
  ]
})

const statusItems = computed(() => {
  return availableStatusOptions.value.map(option => ({
    id: option.value,
    name: option.label,
    value: option.value
  }))
})

// Computed properties for cascading dropdowns (keeping for backward compatibility)
const availableTypes = computed(() => {
  if (!uiFormData.assetCategory || uiFormData.assetCategory === 'add_new') {
    return []
  }
  return assetTypes.value
})

const availableBrands = computed(() => {
  if (!uiFormData.assetType || uiFormData.assetType === 'add_new') {
    return []
  }
  return brands.value
})

const availableModels = computed(() => {
  if (!uiFormData.brand || uiFormData.brand === 'add_new') return []
  return models.value
})

// Available status options based on current status (Edit mode only)
const availableStatusOptions = computed(() => {
  if (!props.isEditMode) return []
  
  const currentStatus = formData.status
  
  switch (currentStatus) {
    case 'AVAILABLE':
      return [
        { value: 'AVAILABLE', label: 'AVAILABLE (Current)' },
        { value: 'LOST', label: 'LOST' }
      ]
    case 'ASSIGNED':
      return [
        { value: 'ASSIGNED', label: 'ASSIGNED (Current)' },
        { value: 'LOST', label: 'LOST' }
      ]
    case 'IN_MAINTENANCE':
      return [
        { value: 'IN_MAINTENANCE', label: 'IN_MAINTENANCE (Current)' },
        { value: 'AVAILABLE', label: 'AVAILABLE (Maintenance Complete)' },
        { value: 'ASSIGNED', label: 'ASSIGNED (Return to Employee)' }
      ]
    case 'RETIRED':
      return [
        { value: 'RETIRED', label: 'RETIRED (Current)' },
        { value: 'AVAILABLE', label: 'AVAILABLE (Reactivated)' }
      ]
    case 'LOST':
      return [
        { value: 'LOST', label: 'LOST (Current)' },
        { value: 'AVAILABLE', label: 'AVAILABLE (Found)' }
      ]
    default:
      return [
        { value: 'AVAILABLE', label: 'AVAILABLE' },
        { value: 'LOST', label: 'LOST' }
      ]
  }
})

// Validation system (following EmployeeForm pattern)
const getFieldClass = (fieldName: string) => {
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return {}
  }
  
  return {
    'is-valid': fieldValidation[fieldName] === true,
    'is-invalid': fieldValidation[fieldName] === false || errors[fieldName as keyof typeof errors]
  }
}

const setFieldError = (fieldName: string, message: string) => {
  errors[fieldName as keyof typeof errors] = message
  fieldValidation[fieldName] = false
  
  const element = document.getElementById(fieldName) as FormElement
  if (element && 'setCustomValidity' in element) {
    element.setCustomValidity(message)
  }
}

const setFieldValid = (fieldName: string) => {
  delete errors[fieldName as keyof typeof errors]
  fieldValidation[fieldName] = true
  
  const element = document.getElementById(fieldName) as FormElement
  if (element && 'setCustomValidity' in element) {
    element.setCustomValidity('')
  }
}

const clearFieldValidation = (fieldName: string) => {
  if (fieldValidation[fieldName] === false) {
    fieldValidation[fieldName] = null
    delete errors[fieldName as keyof typeof errors]
  }
}

const handleFieldInput = (fieldName: string) => {
  if (fieldValidation[fieldName] === false && (formData as any)[fieldName]?.toString().trim()) {
    validateFieldInline(fieldName)
  }
}

const validateFieldInline = async (fieldName: string) => {
  const value = (formData as any)[fieldName]
  const element = document.getElementById(fieldName) as FormElement
  
  // Handle dropdown fields that don't have direct HTML form elements
  const dropdownFields = ['assetCategory', 'assetType', 'brand', 'model', 'condition', 'vendor', 'status']
  if (dropdownFields.includes(fieldName)) {
    const isFieldValid = await validateFieldType(fieldName, value)
    return isFieldValid
  }
  
  if (!element) return true

  // Only call setCustomValidity if the element supports it
  if ('setCustomValidity' in element) {
    element.setCustomValidity('')
  }

  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '')) {
    setFieldError(fieldName, '')
    return false
  }

  const isFieldValid = await validateFieldType(fieldName, value)
  if (!isFieldValid) {
    return false
  }

  // Only call checkValidity if the element supports it
  if ('checkValidity' in element) {
    if (element.checkValidity()) {
      setFieldValid(fieldName)
      return true
    } else {
      setFieldError(fieldName, element.validationMessage || `${getFieldDisplayName(fieldName)} is invalid`)
      return false
    }
  } else {
    // For elements that don't support checkValidity, just use our validation result
    setFieldValid(fieldName)
    return true
  }
}

const validateFieldType = async (fieldName: string, value: any): Promise<boolean> => {
  switch (fieldName) {
    case 'serialNumber':
      return await validateSerialNumberField(value)
    case 'location':
      return validateLocationField(value)
    case 'purchaseDate':
      return validatePurchaseDateField(value)
    case 'purchaseCost':
      return validatePurchaseCostField(value)
    case 'warrantyStartDate':
    case 'warrantyEndDate':
      return validateWarrantyDateField(fieldName, value)
    case 'notes':
      return validateNotesField(value)
    case 'assetCategory':
      return validateRequiredDropdownField('assetCategory', selectedCategory.value)
    case 'assetType':
      return validateRequiredDropdownField('assetType', selectedType.value)
    case 'brand':
      return validateRequiredDropdownField('brand', selectedBrand.value)
    case 'model':
      return validateRequiredDropdownField('model', selectedModel.value)
    case 'condition':
      return validateRequiredDropdownField('condition', selectedCondition.value)
    case 'vendor':
      return validateOptionalDropdownField('vendor', selectedVendor.value)
    case 'status':
      return validateOptionalDropdownField('status', selectedStatus.value)
    default:
      return true
  }
}

const validateRequiredDropdownField = (fieldName: string, selectedValue: any): boolean => {
  if (selectedValue) {
    setFieldValid(fieldName)
    return true
  } else {
    setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
    return false
  }
}

const validateOptionalDropdownField = (fieldName: string, selectedValue: any): boolean => {
  // Optional fields are always valid
  setFieldValid(fieldName)
  return true
}

// Field validation functions (following EmployeeForm pattern)
const validateSerialNumberField = async (value: any): Promise<boolean> => {
  if (!value || value.toString().trim() === '') {
    setFieldError('serialNumber', 'Serial number is required')
    return false
  }

  const serialNumber = value.toString().trim()
  if (serialNumber.length < 3 || serialNumber.length > 50) {
    setFieldError('serialNumber', 'Serial number must be 3-50 characters')
    return false
  }

  if (!/^[A-Za-z0-9\-_]{3,50}$/.test(serialNumber)) {
    setFieldError('serialNumber', 'Serial number must be 3-50 characters (letters, numbers, hyphens, underscores only)')
    return false
  }

  // Check uniqueness via API
  try {
    const excludeAssetId = props.isEditMode && props.asset ? props.asset.id : undefined
    const result = await assetService.checkSerialNumberUnique(serialNumber, excludeAssetId)
    
    if (result.isUnique) {
      setFieldValid('serialNumber')
      return true
    } else {
      setFieldError('serialNumber', `Serial number '${serialNumber}' is already in use by asset ${result.existingAsset?.assetId || 'unknown'}`)
      return false
    }
  } catch (error) {
    console.error('Error checking serial number uniqueness:', error)
    // On error, assume it's valid to avoid blocking the user
    setFieldValid('serialNumber')
    return true
  }
}

const validateLocationField = (value: any): boolean => {
  if (!value || value.toString().trim() === '') {
    setFieldError('location', 'Location is required')
    return false
  }
  
  const location = value.toString().trim()
  if (location.length < 2 || location.length > 100) {
    setFieldError('location', 'Location must be 2-100 characters')
    return false
  }
  
  setFieldValid('location')
  return true
}

const validatePurchaseDateField = (value: any): boolean => {
  if (!value) {
    setFieldValid('purchaseDate')
    return true
  }
  
  if (value > todayDate.value) {
    setFieldError('purchaseDate', 'Purchase date cannot be in the future')
    return false
  }
  
  setFieldValid('purchaseDate')
  return true
}

const validatePurchaseCostField = (value: any): boolean => {
  if (!value) {
    setFieldValid('purchaseCost')
    return true
  }
  
  const cost = Number.parseFloat(value.toString())
  if (Number.isNaN(cost) || cost < 0) {
    setFieldError('purchaseCost', 'Purchase cost must be a valid positive number')
    return false
  }
  
  if (cost > 1000000) {
    setFieldError('purchaseCost', 'Purchase cost cannot exceed ₹10,00,000')
    return false
  }
  
  setFieldValid('purchaseCost')
  return true
}

const validateWarrantyDateField = (fieldName: string, value: any): boolean => {
  if (!value) {
    setFieldValid(fieldName)
    return true
  }
  
  // Validate that warranty start date is not in the future
  if (fieldName === 'warrantyStartDate' && value > todayDate.value) {
    setFieldError(fieldName, 'Warranty start date cannot be in the future')
    return false
  }
  
  // Validate that warranty end date is not in the future
  if (fieldName === 'warrantyEndDate' && value > todayDate.value) {
    setFieldError(fieldName, 'Warranty end date cannot be in the future')
    return false
  }
  
  // Validate that warranty end date is after start date (if both are provided)
  if (fieldName === 'warrantyEndDate' && formData.warrantyStartDate && value < formData.warrantyStartDate) {
    setFieldError(fieldName, 'Warranty end date must be after start date')
    return false
  }
  
  // Validate that warranty start date is before end date (if both are provided)
  if (fieldName === 'warrantyStartDate' && formData.warrantyEndDate && value > formData.warrantyEndDate) {
    setFieldError(fieldName, 'Warranty start date must be before end date')
    return false
  }
  
  setFieldValid(fieldName)
  return true
}

const validateNotesField = (value: any): boolean => {
  if (!value) {
    setFieldValid('notes')
    return true
  }
  
  const notes = value.toString().trim()
  if (notes.length > 1000) {
    setFieldError('notes', 'Notes cannot exceed 1000 characters')
    return false
  }
  
  setFieldValid('notes')
  return true
}

// Legacy validation function (kept for backward compatibility)
const validateSerialNumber = async () => {
  await validateFieldInline('serialNumber')
}

// Helper functions for field validation
const validateRequiredDropdown = (fieldName: string, selectedValue: any) => {
  if (selectedValue) {
    (errors as any)[fieldName] = ''
    applyValidationToSearchableDropdown(fieldName, 'valid')
  } else {
    (errors as any)[fieldName] = `${getFieldDisplayName(fieldName)} is required`
    applyValidationToSearchableDropdown(fieldName, 'invalid')
  }
}

const validateLocation = (field: HTMLInputElement) => {
  if (!formData.location || formData.location.trim() === '') {
    errors.location = 'Location is required'
    field.classList.add('is-invalid')
    field.classList.remove('is-valid')
  } else if (formData.location.length < 2 || formData.location.length > 100) {
    errors.location = 'Location must be 2-100 characters'
    field.classList.add('is-invalid')
    field.classList.remove('is-valid')
  } else {
    errors.location = ''
    field.classList.remove('is-invalid')
    field.classList.add('is-valid')
  }
}

const validatePurchaseDate = (field: HTMLInputElement) => {
  if (formData.purchaseDate && formData.purchaseDate > todayDate.value) {
    errors.purchaseDate = 'Purchase date cannot be in the future'
    field.classList.add('is-invalid')
    field.classList.remove('is-valid')
  } else {
    errors.purchaseDate = ''
    field.classList.remove('is-invalid')
    if (formData.purchaseDate) field.classList.add('is-valid')
  }
}

const validatePurchaseCost = (field: HTMLInputElement) => {
  const isValid = !formData.purchaseCost || Number.parseFloat(formData.purchaseCost) <= 1000000
  
  if (isValid) {
    errors.purchaseCost = ''
    field.classList.remove('is-invalid')
    field.classList.add('is-valid')
  } else {
    errors.purchaseCost = 'Purchase cost cannot exceed ₹10,00,000'
    field.classList.add('is-invalid')
    field.classList.remove('is-valid')
  }
  
  // Also add validation class to search input container
  const searchContainer = field.closest('.search-input-container')
  if (searchContainer) {
    if (isValid) {
      searchContainer.classList.add('is-valid')
      searchContainer.classList.remove('is-invalid')
    } else {
      searchContainer.classList.add('is-invalid')
      searchContainer.classList.remove('is-valid')
    }
  }
}

const validateOptionalField = (fieldName: string, field: HTMLInputElement) => {
  (errors as any)[fieldName] = ''
  if (fieldName === 'notes') {
    const textarea = document.getElementById('notes') as HTMLTextAreaElement
    if (textarea) {
      textarea.classList.add('is-valid')
      textarea.classList.remove('is-invalid')
    } else {
      console.warn('Could not find notes textarea element')
    }
  } else {
    applyValidationToSearchableDropdown(fieldName, 'valid')
  }
}

// Validation configuration mapping
const validationHandlers = {
  serialNumber: async () => await validateSerialNumber(),
  assetCategory: () => validateRequiredDropdown('assetCategory', selectedCategory.value),
  assetType: () => validateRequiredDropdown('assetType', selectedType.value),
  brand: () => validateRequiredDropdown('brand', selectedBrand.value),
  model: () => validateRequiredDropdown('model', selectedModel.value),
  location: (field: HTMLInputElement) => validateLocation(field),
  condition: () => validateRequiredDropdown('condition', selectedCondition.value),
  vendor: (field: HTMLInputElement) => validateOptionalField('vendor', field),
  notes: (field: HTMLInputElement) => validateOptionalField('notes', field),
  purchaseDate: (field: HTMLInputElement) => validatePurchaseDate(field),
  purchaseCost: (field: HTMLInputElement) => validatePurchaseCost(field)
}

const validateField = async (fieldName: string) => {
  const field = document.getElementById(fieldName) as HTMLInputElement
  if (!field) return

  const handler = validationHandlers[fieldName as keyof typeof validationHandlers]
  if (handler) {
    await handler(field)
  }
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

const clearFieldError = (fieldName: string) => {
  if (errors[fieldName as keyof typeof errors]) {
    const field = document.getElementById(fieldName) as HTMLInputElement
    if (field && ((formData as any)[fieldName] || (uiFormData as any)[fieldName])) {
      field.classList.remove('is-invalid')
    }
    
    // Also clear validation for SearchableDropdown components
    const searchableDropdownFields = ['assetCategory', 'assetType', 'brand', 'model', 'condition', 'status', 'vendor']
    if (searchableDropdownFields.includes(fieldName)) {
      const wrapper = document.querySelector(`#${fieldName}`)?.closest('.form-searchable-dropdown')
      if (wrapper) {
        const input = wrapper.querySelector('.form-control') as HTMLInputElement
        if (input) {
          input.classList.remove('is-invalid')
        }
      }
    }
  }
}

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    serialNumber: 'Serial Number',
    assetCategory: 'Asset Category',
    assetType: 'Asset Type',
    brand: 'Brand',
    model: 'Model',
    purchaseDate: 'Purchase Date',
    purchaseCost: 'Purchase Cost',
    vendor: 'Vendor',
    warrantyStartDate: 'Warranty Start Date',
    warrantyEndDate: 'Warranty End Date',
    location: 'Location',
    condition: 'Condition',
    status: 'Status',
    notes: 'Additional Notes'
  }
  return displayNames[fieldName] || fieldName
}

// SearchableDropdown change handlers
const onCategoryChange = async (item: Item | null) => {
  selectedCategory.value = item
  
  // Reset dependent fields
  selectedType.value = null
  selectedBrand.value = null
  selectedModel.value = null
  uiFormData.assetType = ''
  uiFormData.brand = ''
  uiFormData.model = ''
  formData.assetTypeId = undefined
  formData.brandId = undefined
  formData.modelId = undefined
  
  // Clear dependent arrays
  assetTypes.value = []
  brands.value = []
  models.value = []
  
  // Update UI form data
  uiFormData.assetCategory = item && item.value ? item.value.toString() : ''
  
  // Load asset types for selected category
  if (item && item.value) {
    await loadAssetTypes(Number.parseInt(item.value.toString()))
  }
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('assetCategory')
  }
  
  validateFieldInline('assetCategory')
}

const onTypeChange = async (item: Item | null) => {
  selectedType.value = item
  
  // Reset dependent fields
  selectedBrand.value = null
  selectedModel.value = null
  uiFormData.brand = ''
  uiFormData.model = ''
  formData.brandId = undefined
  formData.modelId = undefined
  
  // Clear dependent arrays
  brands.value = []
  models.value = []
  
  // Update UI form data
  uiFormData.assetType = item && item.value ? item.value.toString() : ''
  formData.assetTypeId = item && item.value ? item.value.toString() : ''
  
  // Load ALL brands (not filtered by asset type)
  if (item) {
    await loadBrands()
  }
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('assetType')
  }
  
  validateFieldInline('assetType')
}

const onBrandChange = async (item: Item | null) => {
  selectedBrand.value = item
  
  // Reset dependent fields
  selectedModel.value = null
  uiFormData.model = ''
  formData.modelId = undefined
  
  // Clear models array
  models.value = []
  
  // Update UI form data
  uiFormData.brand = item && item.value ? item.value.toString() : ''
  formData.brandId = item && item.value ? item.value.toString() : ''
  
  // Load models for selected brand AND asset type
  if (item && item.value && selectedType.value && selectedType.value.value) {
    await loadModelsByBrandAndAssetType(Number.parseInt(item.value.toString()), Number.parseInt(selectedType.value.value.toString()))
  }
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('brand')
  }
  
  validateFieldInline('brand')
}

const onModelChange = async (item: Item | null) => {
  selectedModel.value = item
  
  // Update UI form data
  uiFormData.model = item && item.value ? item.value.toString() : ''
  formData.modelId = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('model')
  }
  
  validateFieldInline('model')
}

const onVendorChange = (item: Item | null) => {
  selectedVendor.value = item
  formData.vendorId = item && item.value ? item.value.toString() : undefined
  
  // Clear validation error when user makes a selection (vendor is optional)
  if (item) {
    clearFieldValidation('vendor')
  }
  
  validateFieldInline('vendor')
}

const onConditionChange = (item: Item | null) => {
  selectedCondition.value = item
  formData.condition = item && item.value ? item.value.toString() : 'NEW'
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('condition')
  }
  
  validateFieldInline('condition')
}

const onStatusChange = (item: Item | null) => {
  selectedStatus.value = item
  formData.status = item && item.value ? item.value.toString() : 'AVAILABLE'
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldValidation('status')
  }
  
  validateFieldInline('status')
}

// Helper function to get DatePicker input element
const getDatePickerInput = (elementId: string): HTMLInputElement | null => {
  const datePicker = document.getElementById(elementId)
  return datePicker?.querySelector('input') as HTMLInputElement || null
}

// Helper function to set DatePicker validation state
const setDatePickerValidation = (elementId: string, isValid: boolean, hasValue: boolean = false) => {
  const input = getDatePickerInput(elementId)
  if (!input) return
  
  if (isValid) {
    input.classList.remove('is-invalid')
    if (hasValue) input.classList.add('is-valid')
  } else {
    input.classList.add('is-invalid')
    input.classList.remove('is-valid')
  }
}

// Helper function to validate warranty date relationship
const isWarrantyDateRangeValid = (): boolean => {
  return !formData.warrantyStartDate || 
         !formData.warrantyEndDate || 
         formData.warrantyEndDate >= formData.warrantyStartDate
}

// Warranty date validation
const validateWarrantyDates = () => {
  if (!isWarrantyDateRangeValid()) {
    errors.warrantyEndDate = 'Warranty end date must be after start date'
    setDatePickerValidation('warrantyEndDate', false)
    return false
  }
  
  // Clear errors and set valid states
  errors.warrantyEndDate = ''
  errors.warrantyStartDate = ''
  setDatePickerValidation('warrantyEndDate', true, !!formData.warrantyEndDate)
  setDatePickerValidation('warrantyStartDate', true, !!formData.warrantyStartDate)
  return true
}

const expandNotesField = () => {
  if (!notesExpanded.value) {
    notesExpanded.value = true
    const textarea = document.getElementById('notes') as HTMLTextAreaElement
    if (textarea) {
      textarea.placeholder = 'Enter detailed notes about the asset...'
      textarea.focus()
    }
  }
}

const updateCharacterCount = () => {
  // Character count is computed automatically
}

const validateAllFields = async (): Promise<boolean> => {
  // Validate required fields (exclude asset identity fields if disabled)
  const requiredFields = ['serialNumber', 'location', 'condition']
  
  // Add asset identity fields only if not disabled
  if (!props.disableAssetIdentity) {
    requiredFields.push('assetCategory', 'assetType', 'brand', 'model')
  }
  
  const validationResults = await Promise.all(
    requiredFields.map((fieldName) => validateFieldInline(fieldName))
  )

  // Also validate optional fields to show green borders
  const optionalFields = ['vendor', 'notes', 'purchaseDate', 'purchaseCost', 'warrantyStartDate', 'warrantyEndDate']
  await Promise.all(
    optionalFields.map((fieldName) => validateFieldInline(fieldName))
  )

  // Validate warranty dates
  if (!validateWarrantyDates()) {
    return false
  }

  return validationResults.every(Boolean)
}

const markFormInvalidAndFocus = async () => {
  if (assetForm.value) {
    assetForm.value.classList.add('was-validated')
  }
  await nextTick()
  scrollToFirstError()
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

// Enter key navigation handler (following EmployeeForm pattern)
const handleEnterKey = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement
  
  if (target.tagName === 'TEXTAREA') {
    return
  }
  
  event.preventDefault()
  
  const form = assetForm.value
  if (!form) return
  
  const focusableElements = form.querySelectorAll(
    'input:not([readonly]):not([disabled]), select:not([disabled]), textarea:not([readonly]):not([disabled]), button:not([disabled])'
  ) as NodeListOf<HTMLElement>
  
  const currentIndex = Array.from(focusableElements).indexOf(target)
  const isLastField = currentIndex === focusableElements.length - 1
  
  if (isLastField || (target as HTMLInputElement).type === 'submit' || target.classList.contains('btn-primary')) {
    handleSubmit()
  } else {
    const nextElement = focusableElements[currentIndex + 1]
    if (nextElement) {
      nextElement.focus()
    }
  }
}

// Helper functions for form submission

const syncFormDataFromUI = () => {
  if (!formData.assetTypeId && uiFormData.assetType) {
    formData.assetTypeId = uiFormData.assetType
  }
  if (!formData.brandId && uiFormData.brand) {
    formData.brandId = uiFormData.brand
  }
  if (!formData.modelId && uiFormData.model) {
    formData.modelId = uiFormData.model
  }
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

const buildEditModeAssetData = (): any => {
  const original = originalAssetData.value
  const assetData: any = {}

  // Basic field changes
  const fieldMappings = [
    { formKey: 'serialNumber', dataKey: 'serialNumber' },
    { formKey: 'status', dataKey: 'status' },
    { formKey: 'condition', dataKey: 'condition' },
    { formKey: 'location', dataKey: 'location' },
    { formKey: 'purchaseDate', dataKey: 'purchaseDate', transform: (val: any) => val || undefined },
    { formKey: 'purchaseCost', dataKey: 'purchaseCost', transform: (val: any) => val ? Number.parseFloat(val.toString()) : undefined },
    { formKey: 'warrantyStartDate', dataKey: 'warrantyStartDate', transform: (val: any) => val || undefined },
    { formKey: 'warrantyEndDate', dataKey: 'warrantyEndDate', transform: (val: any) => val || undefined },
    { formKey: 'notes', dataKey: 'notes', transform: (val: any) => val || undefined }
  ]

  for (const { formKey, dataKey, transform } of fieldMappings) {
    const formValue = (formData as any)[formKey]
    const originalValue = (original as any)[formKey]
    
    if (hasChanged(formValue, originalValue)) {
      assetData[dataKey] = transform ? transform(formValue) : formValue
    }
  }

  // Handle vendorId separately
  const newVendorId = formData.vendorId ? Number.parseInt(formData.vendorId) : null
  const oldVendorId = original.vendorId || null
  if (newVendorId !== oldVendorId) {
    assetData.vendorId = newVendorId || undefined
  }

  // Asset identity fields (only if not disabled)
  if (!props.disableAssetIdentity) {
    const identityFields = [
      { formKey: 'assetTypeId', dataKey: 'assetTypeId' },
      { formKey: 'brandId', dataKey: 'brandId' },
      { formKey: 'modelId', dataKey: 'modelId' }
    ]

    for (const { formKey, dataKey } of identityFields) {
      const formValue = (formData as any)[formKey]
      const originalValue = (original as any)[formKey]
      
      if (hasChanged(formValue, originalValue)) {
        assetData[dataKey] = Number.parseInt(formValue)
      }
    }
  }

  return assetData
}

const buildAddModeAssetData = (): any => {
  const normalizeOptionalField = (val: any) => {
    return val && val.toString().trim() !== '' ? val : undefined
  }

  return {
    assetId: formData.assetId,
    serialNumber: formData.serialNumber,
    vendorId: formData.vendorId ? Number.parseInt(formData.vendorId) : undefined,
    status: 'AVAILABLE',
    condition: formData.condition as any,
    location: formData.location,
    purchaseDate: normalizeOptionalField(formData.purchaseDate),
    purchaseCost: formData.purchaseCost ? Number.parseFloat(formData.purchaseCost.toString()) : undefined,
    warrantyStartDate: normalizeOptionalField(formData.warrantyStartDate),
    warrantyEndDate: normalizeOptionalField(formData.warrantyEndDate),
    notes: normalizeOptionalField(formData.notes),
    assetTypeId: Number.parseInt(formData.assetTypeId!),
    brandId: Number.parseInt(formData.brandId!),
    modelId: Number.parseInt(formData.modelId!)
  }
}

const handleSubmit = async (event?: Event) => {
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
    syncFormDataFromUI()
    
    const assetData = props.isEditMode && originalAssetData.value 
      ? buildEditModeAssetData() 
      : buildAddModeAssetData()

    emit('submit', assetData)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

// API Loading Functions
const loadCategories = async () => {
  try {
    const response = await assetCategoryService.getAssetCategories({ limit: 100 })
    categories.value = response.data.assetCategories
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const loadAssetTypes = async (categoryId?: number) => {
  try {
    if (categoryId) {
      const response = await assetTypeService.getAssetTypesByCategory(categoryId)
      
      if (response.data.assetTypes) {
        assetTypes.value = response.data.assetTypes
      } else if (Array.isArray(response.data)) {
        assetTypes.value = response.data
      } else {
        assetTypes.value = []
      }
    } else {
      const response = await assetTypeService.getAssetTypes({ limit: 100 })
      assetTypes.value = response.data.assetTypes
    }
  } catch (error) {
    console.error('Error loading asset types:', error)
  }
}

const loadBrands = async () => {
  try {
    const response = await brandService.getBrands({ limit: 100 })
    brands.value = response.data.brands
  } catch (error) {
    console.error('Error loading brands:', error)
  }
}

const loadModelsByBrandAndAssetType = async (brandId: number, assetTypeId: number) => {
  try {
    const response = await modelService.getModelsByBrandAndAssetType(brandId, assetTypeId)
    
    if (response.data.models) {
      models.value = response.data.models
    } else {
      models.value = []
    }
  } catch (error) {
    console.error('Error loading models by brand and asset type:', error)
  }
}

const loadVendors = async () => {
  try {
    const response = await VendorApiService.getVendors({ 
      limit: 100,
      status: 'ACTIVE' as any
    })
    
    if (response.data.vendors) {
      vendors.value = response.data.vendors
    } else {
      vendors.value = []
    }
  } catch (error) {
    console.error('Error loading vendors:', error)
  }
}

const generateAssetId = async () => {
  try {
    formData.assetId = await assetService.generateAssetId()
  } catch (error) {
    console.error('Error generating asset ID:', error)
    // Fallback to timestamp-based ID if backend fails
    const timestamp = Date.now().toString().slice(-6)
    const random = (() => {
      try {
        if (typeof globalThis !== 'undefined' && (globalThis as any).crypto && 'getRandomValues' in (globalThis as any).crypto) {
          const buf = new Uint32Array(1)
          ;(globalThis as any).crypto.getRandomValues(buf)
          return (buf[0] % 1000).toString().padStart(3, '0')
        }
      } catch (error) {
        // Log the error for debugging but continue with fallback
        console.warn('Crypto API not available, using Math.random fallback:', error)
      }
      return Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    })()
    formData.assetId = `AST-${timestamp}${random}`
  }
}

// Helper functions for form initialization
const populateFormDataFromAsset = (asset: any) => {
  const { purchaseDate, warrantyStartDate, warrantyEndDate, ...assetDataWithoutDates } = asset
  Object.assign(formData, assetDataWithoutDates)
  
  // Handle dates separately to ensure proper formatting
  formData.purchaseDate = ensureDateFormat(purchaseDate)
  formData.warrantyStartDate = ensureDateFormat(warrantyStartDate)
  formData.warrantyEndDate = ensureDateFormat(warrantyEndDate)
}

const storeOriginalAssetData = (asset: any) => {
  originalAssetData.value = {
    serialNumber: asset.serialNumber,
    status: asset.status,
    condition: asset.condition,
    location: asset.location,
    purchaseDate: ensureDateFormat(asset.purchaseDate),
    purchaseCost: asset.purchaseCost,
    warrantyStartDate: ensureDateFormat(asset.warrantyStartDate),
    warrantyEndDate: ensureDateFormat(asset.warrantyEndDate),
    notes: asset.notes,
    vendorId: asset.vendorId,
    assetTypeId: asset.assetTypeId,
    brandId: asset.brandId,
    modelId: asset.modelId
  }
}

const setUIFormData = (asset: any) => {
  uiFormData.assetCategory = asset.assetType?.category?.id?.toString() || ''
  uiFormData.assetType = asset.assetType?.id?.toString() || ''
  uiFormData.brand = asset.brand?.id?.toString() || ''
  uiFormData.model = asset.model?.id?.toString() || ''
}

const createDropdownItem = (id: any, name: string): Item => ({
  id,
  name,
  value: id.toString()
})

const setSelectedDropdownItems = (asset: any) => {
  const dropdownMappings = [
    { condition: asset.assetType?.category, target: selectedCategory },
    { condition: asset.assetType, target: selectedType },
    { condition: asset.brand, target: selectedBrand },
    { condition: asset.model, target: selectedModel },
    { condition: asset.vendor, target: selectedVendor }
  ]

  for (const { condition, target } of dropdownMappings) {
    if (condition) {
      target.value = createDropdownItem(condition.id, condition.name)
    }
  }

  // Handle condition separately (special formatting)
  if (asset.condition) {
    selectedCondition.value = {
      id: asset.condition,
      name: asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1).toLowerCase(),
      value: asset.condition
    }
  }

  // Handle status separately (requires lookup)
  if (asset.status && props.isEditMode) {
    const statusOption = availableStatusOptions.value.find(opt => opt.value === asset.status)
    if (statusOption) {
      selectedStatus.value = createDropdownItem(statusOption.value, statusOption.label)
    }
  }
}

const loadDependentData = async (asset: any) => {
  const categoryId = asset.assetType?.category?.id
  if (categoryId) {
    await loadAssetTypes(categoryId)
  }
  await loadBrands()
  if (asset.brand?.id && asset.assetType?.id) {
    await loadModelsByBrandAndAssetType(asset.brand.id, asset.assetType.id)
  }
}

const initializeNewAsset = async () => {
  await generateAssetId()
  selectedCondition.value = createDropdownItem('NEW', 'New')
}

const initializeEditMode = async (asset: any) => {
  populateFormDataFromAsset(asset)
  storeOriginalAssetData(asset)
  setUIFormData(asset)
  setSelectedDropdownItems(asset)
  await loadDependentData(asset)
}

// Initialize form data if editing
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([loadCategories(), loadVendors()])

    if (props.isEditMode && props.asset) {
      await initializeEditMode(props.asset)
    } else {
      await initializeNewAsset()
    }
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    isLoading.value = false
  }
})

// Handle notes validation
const handleNotesValidation = (isValid: boolean, errorMessage?: string) => {
  if (!isValid && errorMessage) {
    errors.notes = errorMessage
    // Apply invalid class to notes textarea
    const textarea = document.getElementById('notes') as HTMLTextAreaElement
    if (textarea) {
      textarea.classList.add('is-invalid')
      textarea.classList.remove('is-valid')
    }
  } else {
    errors.notes = ''
    // Apply valid class to notes textarea
    const textarea = document.getElementById('notes') as HTMLTextAreaElement
    if (textarea) {
      textarea.classList.add('is-valid')
      textarea.classList.remove('is-invalid')
    }
  }
}
</script>

<style scoped>
/* Import form validation styles */
@import url('../../assets/styles/formValidation.css');


/* AssetForm-specific responsive adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem !important;
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
}
</style>
