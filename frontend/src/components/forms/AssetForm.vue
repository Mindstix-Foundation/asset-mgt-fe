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
            <form v-else @submit.prevent="handleSubmit" class="needs-validation" :class="{ 'was-validated': wasValidated }" novalidate>
              
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
                      placeholder="Enter serial number" 
                      required 
                      minlength="3" 
                      maxlength="50" 
                      pattern="[A-Za-z0-9\-_]{3,50}"
                      title="Serial number must be 3-50 characters (letters, numbers, hyphens, underscores only)"
                      @blur="validateSerialNumber"
                      @input="clearFieldError('serialNumber')"
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
                    <DateInput
                      id="purchaseDate"
                      label="Purchase Date (Optional)"
                      v-model="formData.purchaseDate"
                      :max="todayDate"
                      help-text="Cannot be future date"
                      @change="clearFieldError('purchaseDate')"
                      @blur="validateField('purchaseDate')"
                    />
                  </div>

                  <!-- Purchase Cost -->
                  <div class="col-md-6">
                    <label for="purchaseCost" class="form-label">
                      Purchase Cost <span class="text-muted">(Optional)</span>
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">₹</span>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="purchaseCost" 
                        v-model="formData.purchaseCost"
                        placeholder="0.00" 
                        step="0.01" 
                        min="0" 
                        max="1000000"
                        title="Purchase cost cannot exceed ₹10,00,000"
                        @blur="validateField('purchaseCost')"
                        @input="clearFieldError('purchaseCost')"
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
                    <label for="warrantyStartDate" class="form-label">
                      Warranty Start Date <span class="text-muted">(Optional)</span>
                    </label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="warrantyStartDate" 
                      v-model="formData.warrantyStartDate"
                      @blur="validateWarrantyDates"
                      @input="clearFieldError('warrantyStartDate')"
                    >
                    <div class="form-text">When warranty coverage begins</div>
                    <div class="invalid-feedback">{{ errors.warrantyStartDate }}</div>
                  </div>

                  <!-- Warranty End Date -->
                  <div class="col-md-6">
                    <label for="warrantyEndDate" class="form-label">
                      Warranty End Date <span class="text-muted">(Optional)</span>
                    </label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="warrantyEndDate" 
                      v-model="formData.warrantyEndDate"
                      @blur="validateWarrantyDates"
                      @input="clearFieldError('warrantyEndDate')"
                    >
                    <div class="form-text">When warranty coverage expires</div>
                    <div class="invalid-feedback">{{ errors.warrantyEndDate }}</div>
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
                      placeholder="e.g., Warehouse A, Shelf B2" 
                      required 
                      minlength="2" 
                      maxlength="100"
                      title="Location must be 2-100 characters"
                      @blur="validateField('location')"
                      @input="clearFieldError('location')"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { assetService } from '@/services/assetService'
import NotesTextarea from '../common/NotesTextarea.vue'
import SearchableDropdown, { type Item } from '../common/SearchableDropdown.vue'
import DateInput from '../common/DateInput.vue'
import { assetCategoryService } from '@/services/assetCategoryService'
import { assetTypeService } from '@/services/assetTypeService'
import { brandService } from '@/services/brandService'
import { modelService } from '@/services/modelService'
import { VendorApiService } from '@/services/vendorApi'
import type { AssetCategory } from '@/services/assetCategoryService'
import type { AssetType } from '@/services/assetTypeService'
import type { Brand } from '@/services/brandService'
import type { Model } from '@/services/modelService'
import type { Vendor } from '@/types/vendor.types'

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

const wasValidated = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(false)
const notesExpanded = ref(false)

// Store original asset data for comparison (only in edit mode)
const originalAssetData = ref<any>(null)

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

// Methods
const validateSerialNumber = async () => {
  const field = document.getElementById('serialNumber') as HTMLInputElement
  if (!field) return

  // Clear previous validation state
  field.classList.remove('is-invalid', 'is-valid')
  errors.serialNumber = ''

  // Basic validation first
  if (!formData.serialNumber || formData.serialNumber.trim() === '') {
    errors.serialNumber = 'Serial number is required'
    field.classList.add('is-invalid')
    return
  }

  if (formData.serialNumber.length < 3 || formData.serialNumber.length > 50) {
    errors.serialNumber = 'Serial number must be 3-50 characters'
    field.classList.add('is-invalid')
    return
  }

  if (!/^[A-Za-z0-9\-_]{3,50}$/.test(formData.serialNumber)) {
    errors.serialNumber = 'Serial number must be 3-50 characters (letters, numbers, hyphens, underscores only)'
    field.classList.add('is-invalid')
    return
  }

  // Check uniqueness via API
  try {
    const excludeAssetId = props.isEditMode && props.asset ? props.asset.id : undefined
    const result = await assetService.checkSerialNumberUnique(formData.serialNumber.trim(), excludeAssetId)
    
    if (result.isUnique) {
      errors.serialNumber = ''
      field.classList.add('is-valid')
    } else {
      errors.serialNumber = `Serial number '${formData.serialNumber}' is already in use by asset ${result.existingAsset?.assetId || 'unknown'}`
      field.classList.add('is-invalid')
    }
  } catch (error) {
    console.error('Error checking serial number uniqueness:', error)
    // On error, assume it's valid to avoid blocking the user
    errors.serialNumber = ''
    field.classList.add('is-valid')
  }
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
  
  // Also add validation class to input group
  const inputGroup = field.closest('.input-group')
  if (inputGroup) {
    if (isValid) {
      inputGroup.classList.add('is-valid')
      inputGroup.classList.remove('is-invalid')
    } else {
      inputGroup.classList.add('is-invalid')
      inputGroup.classList.remove('is-valid')
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
    clearFieldError('assetCategory')
  }
  
  validateField('assetCategory')
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
    clearFieldError('assetType')
  }
  
  validateField('assetType')
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
    clearFieldError('brand')
  }
  
  validateField('brand')
}

const onModelChange = async (item: Item | null) => {
  selectedModel.value = item
  
  // Update UI form data
  uiFormData.model = item && item.value ? item.value.toString() : ''
  formData.modelId = item && item.value ? item.value.toString() : ''
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldError('model')
  }
  
  validateField('model')
}

const onVendorChange = (item: Item | null) => {
  selectedVendor.value = item
  formData.vendorId = item && item.value ? item.value.toString() : undefined
  
  // Clear validation error when user makes a selection (vendor is optional)
  if (item) {
    clearFieldError('vendor')
  }
  
  validateField('vendor')
}

const onConditionChange = (item: Item | null) => {
  selectedCondition.value = item
  formData.condition = item && item.value ? item.value.toString() : 'NEW'
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldError('condition')
  }
  
  validateField('condition')
}

const onStatusChange = (item: Item | null) => {
  selectedStatus.value = item
  formData.status = item && item.value ? item.value.toString() : 'AVAILABLE'
  
  // Clear validation error when user makes a selection
  if (item) {
    clearFieldError('status')
  }
  
  validateField('status')
}

// Warranty date validation
const validateWarrantyDates = () => {
  if (formData.warrantyStartDate && formData.warrantyEndDate && formData.warrantyEndDate < formData.warrantyStartDate) {
    errors.warrantyEndDate = 'Warranty end date must be after start date'
    const field = document.getElementById('warrantyEndDate') as HTMLInputElement
    if (field) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')
    }
    return false
  } else {
    errors.warrantyEndDate = ''
    errors.warrantyStartDate = ''
    const endField = document.getElementById('warrantyEndDate') as HTMLInputElement
    const startField = document.getElementById('warrantyStartDate') as HTMLInputElement
    if (endField) {
      endField.classList.remove('is-invalid')
      if (formData.warrantyEndDate) endField.classList.add('is-valid')
    }
    if (startField) {
      startField.classList.remove('is-invalid')
      if (formData.warrantyStartDate) startField.classList.add('is-valid')
    }
    return true
  }
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

const validateForm = async (): Promise<boolean> => {
  let isValid = true
  
  // Validate required fields (exclude asset identity fields if disabled)
  const requiredFields = ['serialNumber', 'location', 'condition']
  
  // Add asset identity fields only if not disabled
  if (!props.disableAssetIdentity) {
    requiredFields.push('assetCategory', 'assetType', 'brand', 'model')
  }
  
  for (const fieldName of requiredFields) {
    await validateField(fieldName)
    if (errors[fieldName as keyof typeof errors]) {
      isValid = false
    }
  }

  // Also validate optional fields to show green borders
  const optionalFields = ['vendor', 'notes', 'purchaseDate', 'purchaseCost']
  for (const fieldName of optionalFields) {
    await validateField(fieldName)
  }

  // Validate warranty dates
  if (!validateWarrantyDates()) {
    isValid = false
  }

  return isValid
}

// Helper functions for form submission
const scrollToFirstError = () => {
  const firstInvalid = document.querySelector('.is-invalid') as HTMLElement
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => firstInvalid.focus(), 300)
  }
}

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

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  wasValidated.value = true

  if (!(await validateForm())) {
    scrollToFirstError()
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
/* Import the unified form styles */
@import url('../../assets/unified-form-styles.css');

/* Additional component-specific styles */
.expandable-notes {
  transition: height 0.3s ease, border-color 0.2s ease;
  cursor: pointer;
  resize: none;
}

.expandable-notes:hover {
  border-color: #999999;
}

.expandable-notes:focus {
  cursor: text;
  resize: vertical;
}

.character-count {
  margin-top: 0.25rem;
  transition: color 0.3s ease;
}

.character-count .text-warning {
  color: #FFC000 !important;
}

.character-count .text-danger {
  color: #E97676 !important;
  font-weight: 600;
}

/* Form fieldset styling */
.form-fieldset {
  border: 1px solid #B7B7B7 !important;
  border-radius: 0.5rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
  background: rgba(243, 243, 243, 0.3);
  position: relative;
  width: 100% !important;
  box-sizing: border-box !important;
}

.form-fieldset:hover {
  border-color: #B7B7B7 !important;
  background: rgba(243, 243, 243, 0.5);
  transition: all 0.2s ease;
}

.form-legend {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #666666 !important;
  background-color: #FFFFFF !important;
  padding: 0.375rem 0.75rem !important;
  border: 1px solid #B7B7B7 !important;
  border-radius: 0.5rem !important;
  margin-bottom: 1rem !important;
  box-shadow: 0 1px 3px rgba(10, 10, 10, 0.1);
  width: auto !important;
  float: none !important;
}

/* Enhanced form controls */
.form-control, .form-select {
  border: 2px solid #E0E0E0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  color: #0A0A0A;
}

.form-control::placeholder {
  color: #999999 !important;
  opacity: 1;
}

.form-control:focus, .form-select:focus {
  border-color: #331FEA;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  outline: 2px solid transparent;
}

.form-control:hover, .form-select:hover {
  border-color: #E0E0E0;
}

/* Enhanced validation styling */
.was-validated .form-control:valid,
.was-validated .form-select:valid {
  border-color: #21AF65 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
}

.was-validated .form-control:invalid,
.was-validated .form-select:invalid,
.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
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
  color: #E97676;
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
  color: #E97676 !important;
  font-weight: 700;
  font-size: 1.1em;
}

.text-muted {
  color: #666666 !important;
  font-weight: 600;
  font-size: 0.9em;
}

/* Input group styling */
.input-group {
  align-items: stretch;
}

.input-group-text {
  background-color: #F3F3F3;
  border: 2px solid #E0E0E0;
  border-right: none;
  border-radius: 0.5rem 0 0 0.5rem;
  color: #666666;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(0.75rem * 2 + 1.5rem + 4px); /* Match form-control height */
}

.input-group .form-control {
  border-left: none;
  border-radius: 0 0.5rem 0.5rem 0;
  display: flex;
  align-items: center;
}

.input-group:focus-within .input-group-text {
  border-color: #331FEA;
  background-color: #F3F3F3;
}

.input-group:hover .input-group-text {
  border-color: #E0E0E0;
}

/* Input group validation styling */
/* When input-group has validation classes */
.input-group.is-valid .input-group-text {
  border-color: #21AF65 !important;
  border: 2px solid #21AF65 !important;
  border-right: none !important;
  border-radius: 0.5rem 0 0 0.5rem !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: calc(0.75rem * 2 + 1.5rem + 4px) !important;
}

.input-group.is-invalid .input-group-text {
  border-color: #E97676 !important;
  border: 2px solid #E97676 !important;
  border-right: none !important;
  border-radius: 0.5rem 0 0 0.5rem !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: calc(0.75rem * 2 + 1.5rem + 4px) !important;
}

/* Ensure the form-control border connects properly */
.input-group.is-valid .form-control {
  border-color: #21AF65 !important;
  border: 2px solid #21AF65 !important;
  border-left: none !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
  display: flex !important;
  align-items: center !important;
}

.input-group.is-invalid .form-control {
  border-color: #E97676 !important;
  border: 2px solid #E97676 !important;
  border-left: none !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
  animation: subtle-shake 0.3s ease-in-out !important;
  display: flex !important;
  align-items: center !important;
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
    border-radius: 0.5rem !important;
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
    border-radius: 0.5rem !important;
  }
  
  .form-legend {
    font-size: 0.85rem !important;
    padding: 0.2rem 0.4rem !important;
    margin-bottom: 0.5rem !important;
  }
}

/* Disabled field styling */
.form-searchable-dropdown .form-control:disabled {
  background-color: #F8F9FA !important;
  border-color: #DEE2E6 !important;
  color: #6C757D !important;
  cursor: not-allowed !important;
  opacity: 0.7;
}

.form-searchable-dropdown .form-control:disabled::placeholder {
  color: #ADB5BD !important;
  font-style: italic;
}

/* Disabled field label styling */
.form-label.disabled-label {
  color: #6C757D !important;
  font-weight: 500;
}

/* 
  SearchableDropdown Form Integration:
  
  To use SearchableDropdown in any form with consistent styling:
  1. Import: @import url('../../assets/unified-form-styles.css');
  2. Wrap SearchableDropdown with: <div class="form-searchable-dropdown">
  3. The wrapper will automatically match form input styling
  
  Example:
  <div class="form-searchable-dropdown">
    <SearchableDropdown 
      id="example"
      label="Example Field"
      placeholder="Search..."
      :items="items"
      v-model="selectedItem"
      @change="onChange"
    />
  </div>
*/
</style>
