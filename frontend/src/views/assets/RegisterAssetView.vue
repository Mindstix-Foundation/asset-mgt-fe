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
                {{ isEditMode ? 'Update asset information' : 'Register a new asset in the system' }}
              </p>
            </div>
          </div>
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Loading asset data...</p>
            </div>
            
            <!-- Form -->
            <form v-else ref="assetForm" class="needs-validation" @submit.prevent="submitForm" novalidate>
              
              <!-- Section 1: Basic Asset Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Basic Asset Information</legend>
                <div class="row g-4">
                  <!-- Asset ID -->
                  <div class="col-md-6">
                    <label for="assetId" class="form-label">Asset ID</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="assetId" 
                      v-model="formData.assetId"
                      readonly 
                      style="background-color: #F3F3F3;"
                    >
                    <div class="form-text">Auto-generated unique identifier</div>
                  </div>

                  <!-- Serial Number -->
                  <div class="col-md-6">
                    <label for="serialNumber" class="form-label">Serial Number <span class="text-danger">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="serialNumber" 
                      v-model="formData.serialNumber"
                      :class="getFieldClass('serialNumber')"
                      placeholder="Enter serial number" 
                      required 
                      pattern="[A-Za-z0-9\-_]{3,50}"
                      title="Serial number must be 3-50 characters (letters, numbers, hyphens, underscores only)"
                      @blur="validateFieldInline('serialNumber')"
                      @focus="clearFieldValidation('serialNumber')"
                      @input="handleFieldInput('serialNumber')"
                    >
                    <div class="form-text">3-50 characters (letters, numbers, hyphens, underscores only)</div>
                    <div v-if="fieldErrors.serialNumber" class="invalid-feedback">{{ fieldErrors.serialNumber }}</div>
                  </div>

                  <!-- Asset Category -->
                  <div class="col-md-6">
                    <label for="assetCategory" class="form-label">Asset Category <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="assetCategory" 
                      v-model="uiFormData.assetCategory"
                      :class="getFieldClass('assetCategory')"
                      required
                      @change="onCategoryChange"
                      @focus="clearFieldValidation('assetCategory')"
                    >
                      <option value="">Choose Category...</option>
                      <option v-for="category in categories" :key="category.id" :value="category.id.toString()">{{ category.name }}</option>
                    </select>
                    <div class="form-text">
                      Select the high-level category first. 
                      <router-link to="/app/assets/manage-categories" class="text-primary">
                        <i class="fas fa-cogs me-1"></i>Manage Categories
                      </router-link>
                    </div>
                    <div v-if="fieldErrors.assetCategory" class="invalid-feedback">{{ fieldErrors.assetCategory }}</div>
                  </div>

                  <!-- Asset Type -->
                  <div class="col-md-6">
                    <label for="assetType" class="form-label">Asset Type <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="assetType" 
                      v-model="uiFormData.assetType"
                      :class="getFieldClass('assetType')"
                      :disabled="!uiFormData.assetCategory"
                      required
                      @change="onTypeChange"
                      @focus="clearFieldValidation('assetType')"
                    >
                      <option value="">{{ uiFormData.assetCategory ? 'Choose Asset Type...' : 'Select category first...' }}</option>
                      <option v-if="availableTypes.length === 0 && uiFormData.assetCategory" disabled>
                        No types available for this category
                      </option>
                      <option v-for="type in availableTypes" :key="type.id" :value="type.id.toString()">{{ type.name }}</option>
                    </select>
                    <div class="form-text">
                      Select category above to unlock asset type options.
                      <span v-if="availableTypes.length === 0 && uiFormData.assetCategory">
                        <router-link to="/app/assets/manage-categories" class="text-primary">
                          <i class="fas fa-plus me-1"></i>Add asset types
                        </router-link>
                      </span>
                    </div>
                    <div v-if="fieldErrors.assetType" class="invalid-feedback">{{ fieldErrors.assetType }}</div>
                  </div>

                  <!-- Brand -->
                  <div class="col-md-6">
                    <label for="brand" class="form-label">Brand <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="brand" 
                      v-model="uiFormData.brand"
                      :class="getFieldClass('brand')"
                      :disabled="!uiFormData.assetType"
                      required
                      @change="onBrandChange"
                      @focus="clearFieldValidation('brand')"
                    >
                      <option value="">{{ uiFormData.assetType ? 'Choose Brand...' : 'Select asset type first...' }}</option>
                      <option v-if="availableBrands.length === 0 && uiFormData.assetType" disabled>
                        No brands available
                      </option>
                      <option v-for="brand in availableBrands" :key="brand.id" :value="brand.id.toString()">{{ brand.name }}</option>
                    </select>
                    <div class="form-text">
                      Select asset type above to unlock brand options.
                      <span v-if="availableBrands.length === 0 && uiFormData.assetType">
                        <router-link to="/app/assets/manage-categories" class="text-primary">
                          <i class="fas fa-plus me-1"></i>Add brands
                        </router-link>
                      </span>
                    </div>
                    <div v-if="fieldErrors.brand" class="invalid-feedback">{{ fieldErrors.brand }}</div>
                  </div>

                  <!-- Model -->
                  <div class="col-md-6">
                    <label for="model" class="form-label">Model <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="model" 
                      v-model="uiFormData.model"
                      :class="getFieldClass('model')"
                      :disabled="!uiFormData.brand"
                      required
                      @change="onModelChange"
                      @focus="clearFieldValidation('model')"
                    >
                      <option value="">{{ uiFormData.brand ? 'Choose Model...' : 'Select brand first...' }}</option>
                      <option v-if="availableModels.length === 0 && uiFormData.brand" disabled>
                        No models available for this brand/type combination
                      </option>
                      <option v-for="model in availableModels" :key="model.id" :value="model.id.toString()">{{ model.name }}</option>
                    </select>
                    <div class="form-text">
                      Select brand above to unlock model options.
                      <span v-if="availableModels.length === 0 && uiFormData.brand">
                        <router-link to="/app/assets/manage-categories" class="text-primary">
                          <i class="fas fa-plus me-1"></i>Add models
                        </router-link>
                      </span>
                    </div>
                    <div v-if="fieldErrors.model" class="invalid-feedback">{{ fieldErrors.model }}</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Purchase & Financial Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Purchase & Financial Information</legend>
                <div class="row g-4">
                  <!-- Purchase Date -->
                  <div class="col-md-6">
                    <label for="purchaseDate" class="form-label">Purchase Date <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="purchaseDate" 
                      v-model="formData.purchaseDate"
                      :class="getFieldClass('purchaseDate')"
                      :max="todayDate"
                      @blur="validateFieldInline('purchaseDate')"
                      @focus="clearFieldValidation('purchaseDate')"
                      @change="validateFieldInline('purchaseDate')"
                    >
                    <div class="form-text">Cannot be future date</div>
                    <div v-if="fieldErrors.purchaseDate" class="invalid-feedback">{{ fieldErrors.purchaseDate }}</div>
                  </div>

                  <!-- Purchase Cost -->
                  <div class="col-md-6">
                    <label for="purchaseCost" class="form-label">Purchase Cost <span class="text-muted">(Optional)</span></label>
                    <div class="input-group">
                      <span class="input-group-text">₹</span>
                      <input 
                        type="number" 
                        class="form-control" 
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
                    <div v-if="fieldErrors.purchaseCost" class="invalid-feedback">{{ fieldErrors.purchaseCost }}</div>
                  </div>

                  <!-- Vendor -->
                  <div class="col-12">
                    <label for="vendor" class="form-label">Vendor <span class="text-muted">(Optional)</span></label>
                    <select 
                      class="form-select" 
                      id="vendor" 
                      v-model="formData.vendorId"
                      :class="getFieldClass('vendor')"
                      @change="validateFieldInline('vendor')"
                      @focus="clearFieldValidation('vendor')"
                    >
                      <option value="">No Vendor Selected</option>
                      <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id.toString()">{{ vendor.name }}</option>
                    </select>
                    <div class="form-text">Select the vendor or supplier for this asset</div>
                    <div v-if="fieldErrors.vendor" class="invalid-feedback">{{ fieldErrors.vendor }}</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 3: Warranty Information -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Warranty Information</legend>
                <div class="row g-4">
                  <!-- Warranty Start Date -->
                  <div class="col-md-6">
                    <label for="warrantyStartDate" class="form-label">Warranty Start Date <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="warrantyStartDate" 
                      v-model="formData.warrantyStartDate"
                      :class="getFieldClass('warrantyStartDate')"
                      @blur="validateWarrantyDates"
                      @focus="clearFieldValidation('warrantyStartDate')"
                      @change="validateWarrantyDates"
                    >
                    <div class="form-text">When warranty coverage begins</div>
                    <div v-if="fieldErrors.warrantyStartDate" class="invalid-feedback">{{ fieldErrors.warrantyStartDate }}</div>
                  </div>

                  <!-- Warranty End Date -->
                  <div class="col-md-6">
                    <label for="warrantyEndDate" class="form-label">Warranty End Date <span class="text-muted">(Optional)</span></label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="warrantyEndDate" 
                      v-model="formData.warrantyEndDate"
                      :class="getFieldClass('warrantyEndDate')"
                      @blur="validateWarrantyDates"
                      @focus="clearFieldValidation('warrantyEndDate')"
                      @change="validateWarrantyDates"
                    >
                    <div class="form-text">When warranty coverage expires</div>
                    <div v-if="fieldErrors.warrantyEndDate" class="invalid-feedback">{{ fieldErrors.warrantyEndDate }}</div>
                  </div>
                </div>
              </fieldset>

              <!-- Section 4: Location & Status -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Location & Status</legend>
                <div class="row g-4">
                  <!-- Location -->
                  <div class="col-md-6">
                    <label for="location" class="form-label">Location <span class="text-danger">*</span></label>
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
                    <div v-if="fieldErrors.location" class="invalid-feedback">{{ fieldErrors.location }}</div>
                  </div>

                  <!-- Condition -->
                  <div class="col-md-6">
                    <label for="condition" class="form-label">Condition <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="condition" 
                      v-model="formData.condition"
                      :class="getFieldClass('condition')"
                      required
                      @change="validateFieldInline('condition')"
                      @focus="clearFieldValidation('condition')"
                    >
                      <option value="NEW">NEW</option>
                      <option value="GOOD">GOOD</option>
                      <option value="FAIR">FAIR</option>
                      <option value="POOR">POOR</option>
                      <option value="DAMAGED">DAMAGED</option>
                    </select>
                    <div class="form-text">Physical condition of the asset</div>
                    <div v-if="fieldErrors.condition" class="invalid-feedback">{{ fieldErrors.condition }}</div>
                  </div>

                  <!-- Status -->
                  <div class="col-md-6">
                    <label for="status" class="form-label">Status</label>
                    <div v-if="isEditMode">
                      <!-- Edit Mode: Dynamic status options based on current status -->
                      <select 
                        class="form-select" 
                        id="status" 
                        v-model="formData.status"
                        :class="getFieldClass('status')"
                        @change="validateFieldInline('status')"
                        @focus="clearFieldValidation('status')"
                      >
                        <option v-for="option in availableStatusOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <div class="form-text">Status changes for active assets should go through proper workflows (Issue/Collect/Maintenance)</div>
                    </div>
                    <div v-else>
                      <!-- New Asset Mode: Fixed AVAILABLE status -->
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
                    <div v-if="fieldErrors.status" class="invalid-feedback">{{ fieldErrors.status }}</div>
                  </div>

                  <!-- Notes -->
                  <div class="col-12">
                    <label for="notes" class="form-label">
                      Additional Notes <span class="text-muted">(Optional)</span>
                    </label>
                    <textarea 
                      class="form-control expandable-notes auto-expand-textarea" 
                      id="notes" 
                      v-model="formData.notes"
                      :class="getFieldClass('notes')"
                      rows="3"
                      placeholder="Click to expand and add detailed notes..."
                      @click="expandNotesField"
                      @input="autoExpandTextarea"
                      @blur="validateFieldInline('notes')"
                      @focus="clearFieldValidation('notes')"
                      maxlength="1000"
                      title="Notes cannot exceed 1000 characters"
                      style="white-space: pre-wrap; overflow-wrap: break-word;"
                    ></textarea>
                    <div class="form-text">
                      Click to expand for more space. Include special handling instructions, known issues, or other relevant information
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
              <!-- Action Buttons -->
              <div class="form-actions mt-4">
                <div class="d-flex justify-content-center gap-3">
                  <button type="button" class="btn btn-outline-secondary px-4 py-2" @click="goBack">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary px-5 py-2" 
                    :disabled="isSubmitting || isLoading"
                  >
                    <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                    {{ isSubmitting ? (isEditMode ? 'Updating Asset...' : 'Registering Asset...') : (isEditMode ? 'Update Asset' : 'Register Asset') }}
                  </button>
                </div>
                <div class="text-center mt-3">
                  <small class="text-muted">
                    Fields marked with <span class="text-danger">*</span> are required
                  </small>
                </div>
              </div>
            </form>
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
import { assetService } from '../../services/assetService'
import { assetCategoryService } from '../../services/assetCategoryService'
import { assetTypeService } from '../../services/assetTypeService'
import { brandService } from '../../services/brandService'
import { modelService } from '../../services/modelService'
import { VendorApiService } from '../../services/vendorApi'
import type { AssetCategory } from '../../services/assetCategoryService'
import type { AssetType } from '../../services/assetTypeService'
import type { Brand } from '../../services/brandService'
import type { Model } from '../../services/modelService'
import type { Vendor } from '../../types/vendor.types'

const router = useRouter()
const route = useRoute()

// Check if we're in edit mode
const isEditMode = computed(() => route.name === 'edit-asset')
const assetId = computed(() => isEditMode.value ? parseInt(route.params.id as string) : null)

// Form data - matching the backend API structure
const formData = reactive({
  assetId: '',
  serialNumber: '',
  assetTypeId: '',
  brandId: '',
  modelId: '',
  vendorId: '',
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

// Form state - Enhanced validation system like the prototype
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({}) // null = not validated, true = valid, false = invalid
const isSubmitting = ref(false)
const isLoading = ref(false)
const formSubmitted = ref(false) // Track if form has been submitted

// Template refs
const assetForm = ref<HTMLFormElement>()


// API Data
const categories = ref<AssetCategory[]>([])
const assetTypes = ref<AssetType[]>([])
const brands = ref<Brand[]>([])
const models = ref<Model[]>([])
const vendors = ref<Vendor[]>([])

// Computed properties for cascading dropdowns
const availableTypes = computed(() => {
  if (!uiFormData.assetCategory || uiFormData.assetCategory === 'add_new') {
    return []
  }
  // The API call to /asset-types/by-category/{categoryId} already returns filtered types
  // So we just return all loaded asset types
  return assetTypes.value
})

const availableBrands = computed(() => {
  if (!uiFormData.assetType || uiFormData.assetType === 'add_new') {
    return []
  }
  
  // Return all loaded brands since brands are independent of asset types
  // The filtering happens at the model level: Brand + AssetType = Model
  return brands.value
})

const availableModels = computed(() => {
  if (!uiFormData.brand || uiFormData.brand === 'add_new') return []
  
  // Models are already filtered by brand and asset type via API call
  // No need for client-side filtering since loadModelsByBrandAndAssetType handles this
  return models.value
})

// Today's date for date validation
const todayDate = computed(() => new Date().toISOString().split('T')[0])

// Available status options based on current status (Edit mode only)
const availableStatusOptions = computed(() => {
  if (!isEditMode.value) return []
  
  const currentStatus = formData.status
  
  switch (currentStatus) {
    case 'AVAILABLE':
      return [
        { value: 'AVAILABLE', label: 'AVAILABLE (Current)' },
        { value: 'RETIRED', label: 'RETIRED' },
        { value: 'LOST', label: 'LOST' }
      ]
    case 'ASSIGNED':
      return [
        { value: 'ASSIGNED', label: 'ASSIGNED (Current)' },
        { value: 'RETIRED', label: 'RETIRED' },
        { value: 'LOST', label: 'LOST' }
      ]
    case 'IN_MAINTENANCE':
      return [
        { value: 'IN_MAINTENANCE', label: 'IN_MAINTENANCE (Current)' },
        { value: 'RETIRED', label: 'RETIRED' }
      ]
    case 'RETIRED':
      return [
        { value: 'RETIRED', label: 'RETIRED (Current - No changes allowed)' }
      ]
    case 'LOST':
      return [
        { value: 'LOST', label: 'LOST (Current - No changes allowed)' }
      ]
    default:
      return [
        { value: 'AVAILABLE', label: 'AVAILABLE' },
        { value: 'RETIRED', label: 'RETIRED' },
        { value: 'LOST', label: 'LOST' }
      ]
  }
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

const validateFieldInline = (fieldName: string) => {
  // Get value from either formData or uiFormData
  let value = (formData as any)[fieldName] || (uiFormData as any)[fieldName]
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
  if (!element) return false

  // Clear previous custom validity
  element.setCustomValidity('')

  // Check if field is required
  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '' || value.toString().trim() === 'add_new')) {
    setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
    return false
  }

  // Additional custom validations based on field type
  switch (fieldName) {
    case 'serialNumber':
      if (value && value.length < 3) {
        setFieldError(fieldName, 'Serial number must be at least 3 characters')
        return false
      }
      if (value && !/^[A-Za-z0-9\-_]{3,50}$/.test(value)) {
        setFieldError(fieldName, 'Serial number must be 3-50 characters (letters, numbers, hyphens, underscores only)')
        return false
      }
      break
    
    case 'location':
      if (value && value.length < 2) {
        setFieldError(fieldName, 'Location must be at least 2 characters')
        return false
      }
      if (value && value.length > 100) {
        setFieldError(fieldName, 'Location cannot exceed 100 characters')
        return false
      }
      break
    
    case 'purchaseDate':
      if (value && value > todayDate.value) {
        setFieldError(fieldName, 'Purchase date cannot be in the future')
        return false
      }
      break
    
    case 'purchaseCost':
      if (value && parseFloat(value) > 1000000) {
        setFieldError(fieldName, 'Purchase cost cannot exceed ₹10,00,000')
        return false
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
  const value = (formData as any)[fieldName] || (uiFormData as any)[fieldName]
  if (fieldValidation[fieldName] === false && value?.toString().trim()) {
    validateFieldInline(fieldName)
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
    status: isEditMode.value ? 'Status' : 'Status (Auto-set to AVAILABLE)',
    notes: 'Additional Notes'
  }
  return displayNames[fieldName] || fieldName
}


// Cascading dropdown handlers
const onCategoryChange = async () => {
  // Reset dependent fields
  uiFormData.assetType = ''
  uiFormData.brand = ''
  uiFormData.model = ''
  formData.assetTypeId = ''
  formData.brandId = ''
  formData.modelId = ''
  
  // Clear dependent arrays
  assetTypes.value = []
  models.value = []
  
  // Load asset types for selected category
  if (uiFormData.assetCategory) {
    await loadAssetTypes(parseInt(uiFormData.assetCategory))
  }
  
  validateFieldInline('assetCategory')
}

const onTypeChange = async () => {
  // Reset dependent fields
  uiFormData.brand = ''
  uiFormData.model = ''
  formData.brandId = ''
  formData.modelId = ''
  
  // Clear dependent arrays
  brands.value = []
  models.value = []
  
  // Set the actual form data
  formData.assetTypeId = uiFormData.assetType
  
  // Load ALL brands (not filtered by asset type) - this is the correct approach
  if (uiFormData.assetType) {
    await loadBrands() // Load all brands, no filtering
  }
  
  validateFieldInline('assetType')
}

const onBrandChange = async () => {
  // Reset dependent fields
  uiFormData.model = ''
  formData.modelId = ''
  
  // Clear models array
  models.value = []
  
  // Set the actual form data
  formData.brandId = uiFormData.brand
  
  // Load models for selected brand AND asset type - this is the correct approach
  if (uiFormData.brand && uiFormData.assetType) {
    await loadModelsByBrandAndAssetType(parseInt(uiFormData.brand), parseInt(uiFormData.assetType))
  }
  
  validateFieldInline('brand')
}

const onModelChange = async () => {
  // Set the actual form data
  formData.modelId = uiFormData.model
  
  validateFieldInline('model')
}

// Warranty date validation
const validateWarrantyDates = () => {
  if (formData.warrantyStartDate && formData.warrantyEndDate && formData.warrantyEndDate < formData.warrantyStartDate) {
    setFieldError('warrantyEndDate', 'Warranty end date must be after start date')
    return false
  } else {
    setFieldValid('warrantyEndDate')
    setFieldValid('warrantyStartDate')
    return true
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
  const requiredFields = ['serialNumber', 'assetCategory', 'assetType', 'brand', 'model', 'location', 'condition']
  
  // Only include status in required fields for edit mode
  if (isEditMode.value) {
    requiredFields.push('status')
  }
  
  // Validate required fields specifically
  requiredFields.forEach(fieldName => {
    const isValid = validateFieldInline(fieldName)
    if (!isValid) {
      isFormValid = false
    }
  })
  
  // Validate other optional fields that have values
  Object.keys(formData).forEach(fieldName => {
    if (!requiredFields.includes(fieldName) && formData[fieldName as keyof typeof formData]) {
      validateFieldInline(fieldName)
    }
  })

  // Additional cascading validation
  if (!validateWarrantyDates()) {
    isFormValid = false
  }

  if (!isFormValid) {
    scrollToFirstError()
    if (assetForm.value) {
      assetForm.value.classList.add('was-validated')
    }
    return
  }

  isSubmitting.value = true

  try {
    // Ensure all required fields are populated in formData from uiFormData
    if (!formData.assetTypeId && uiFormData.assetType) {
      formData.assetTypeId = uiFormData.assetType
    }
    if (!formData.brandId && uiFormData.brand) {
      formData.brandId = uiFormData.brand
    }
    if (!formData.modelId && uiFormData.model) {
      formData.modelId = uiFormData.model
    }
    
    // Prepare asset data for API
    const assetData = {
      assetId: formData.assetId,
      serialNumber: formData.serialNumber,
      assetTypeId: parseInt(formData.assetTypeId),
      brandId: parseInt(formData.brandId),
      modelId: parseInt(formData.modelId),
      vendorId: formData.vendorId ? parseInt(formData.vendorId) : undefined,
      status: isEditMode.value ? (formData.status as any) : 'AVAILABLE', // Always AVAILABLE for new assets
      condition: formData.condition as any, // Cast to enum type
      location: formData.location,
      purchaseDate: formData.purchaseDate || undefined,
      purchaseCost: formData.purchaseCost ? parseFloat(formData.purchaseCost) : undefined,
      warrantyStartDate: formData.warrantyStartDate || undefined,
      warrantyEndDate: formData.warrantyEndDate || undefined,
      notes: formData.notes || undefined
    }

    
    if (isEditMode.value && assetId.value) {
      // Update existing asset
      await assetService.updateAsset(assetId.value, assetData)
    const assetDetails = generateAssetDetails()
      showToast(`${assetDetails} has been updated successfully!`, 'success')
      // Navigate back to assets list after successful update
      setTimeout(() => {
        router.push('/app/assets')
      }, 1500)
    } else {
      // Create new asset
      await assetService.createAsset(assetData)
      const assetDetails = generateAssetDetails()
    // Show success toast with asset registration actions
    showAssetSuccessToast(assetDetails)
    }
    
  } catch (error: any) {
    console.error('Error registering asset:', error)
    const errorMessage = error.message || 'An error occurred while registering the asset. Please try again.'
    showErrorToast(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Helper methods
const generateAssetDetails = () => {
  let details = ''
  
  // Get type name
  const type = assetTypes.value.find(t => t.id.toString() === uiFormData.assetType)
  if (type) {
    details += type.name
  } else {
    const category = categories.value.find(c => c.id.toString() === uiFormData.assetCategory)
    details += category?.name || 'Asset'
  }
  
  // Get brand and model names
  const brand = brands.value.find(b => b.id.toString() === uiFormData.brand)
  if (brand) {
    details += ` (${brand.name}`
    const model = models.value.find(m => m.id.toString() === uiFormData.model)
    if (model) {
      details += ` ${model.name}`
    }
    details += ')'
  }
  
  if (formData.serialNumber) {
    details += ` - SN: ${formData.serialNumber}`
  }
  
  return details
}

const loadVendors = async () => {
  try {
    const response = await VendorApiService.getVendors({ 
      limit: 100,
      status: 'ACTIVE' as any // Only load active vendors
    })
    
    if (response.data.vendors) {
      vendors.value = response.data.vendors
    } else {
      console.error('Unexpected response structure:', response)
      vendors.value = []
    }
  } catch (error) {
    console.error('Error loading vendors:', error)
    showErrorToast('Failed to load vendors')
  }
}

const showAssetSuccessToast = (assetDetails: string) => {
  const message = `<div class="mb-3">
    <strong>${assetDetails}</strong> has been registered successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    <button type="button" class="btn btn-sm btn-primary" onclick="addAnotherAsset()">
      Add Another Asset
    </button>
    <button type="button" class="btn btn-sm btn-outline-primary" onclick="viewAssetList()">
      View Assets
    </button>
  </div>`
  
  showToast(message, 'success')
}

const resetForm = () => {
  // Reset form data
  formData.assetId = ''
  formData.serialNumber = ''
  formData.assetTypeId = ''
  formData.brandId = ''
  formData.modelId = ''
  formData.vendorId = ''
  formData.purchaseDate = ''
  formData.purchaseCost = ''
  formData.warrantyStartDate = ''
  formData.warrantyEndDate = ''
  formData.location = ''
  formData.condition = 'NEW'
  formData.status = 'AVAILABLE' // Always reset to AVAILABLE for new assets
  formData.notes = ''
  
  // Reset UI form data
  uiFormData.assetCategory = ''
  uiFormData.assetType = ''
  uiFormData.brand = ''
  uiFormData.model = ''
  uiFormData.vendor = ''
  
  // Clear validation state
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])
  Object.keys(fieldValidation).forEach(key => delete fieldValidation[key])
  
  // Reset form state
  formSubmitted.value = false
  
  if (assetForm.value) {
    assetForm.value.classList.remove('was-validated')
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
const expandNotesField = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  if (!textarea.classList.contains('expanded')) {
    textarea.classList.add('expanded')
    textarea.style.height = '120px'
    textarea.rows = 6
    textarea.placeholder = 'Enter detailed notes about the asset...'
    textarea.focus()
  }
}

const autoExpandTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  resizeTextarea(textarea)
}

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  if (!textarea) return
  
  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto'
  
  // Set the height to match the content
  const newHeight = Math.max(textarea.scrollHeight, 72) // Minimum 3 rows (24px per row)
  textarea.style.height = newHeight + 'px'
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

const addAnotherAsset = async () => {
  resetForm()
  await generateAssetId() // Generate new asset ID
  showToast('Ready to add another asset!', 'info')
  
  // Focus on first field
  nextTick(() => {
    const firstField = document.getElementById('serialNumber')
    if (firstField) firstField.focus()
  })
}

const viewAssetList = () => {
  router.push('/app/assets')
}

const scrollToFirstError = () => {
  const firstInvalid = document.querySelector('input.is-invalid, select.is-invalid, textarea.is-invalid, input:invalid, select:invalid, textarea:invalid') as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
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

// Helper functions for modal displays
const getCategoryName = (categoryId: number) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Unknown Category'
}

const getTypeName = (typeId: number) => {
  const type = assetTypes.value.find(t => t.id === typeId)
  return type?.name || 'Unknown Type'
}

const getBrandName = (brandId: number) => {
  const brand = brands.value.find(b => b.id === brandId)
  return brand?.name || 'Unknown Brand'
}

// Helper function to parse specifications input
const parseSpecifications = (specsInput: string) => {
  if (!specsInput.trim()) return undefined
  
  try {
    // Try to parse as JSON first
    return JSON.parse(specsInput)
  } catch {
    // If not JSON, parse as key-value pairs
    const specs: Record<string, string> = {}
    const lines = specsInput.split('\n')
    
    lines.forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        if (key && value) {
          specs[key] = value
        }
      }
    })
    
    return Object.keys(specs).length > 0 ? specs : undefined
  }
}

// Removed modal functions - now handled by ManageAssetCategoriesView.vue

// Removed edit modal functions - now handled by ManageAssetCategoriesView.vue

// Removed update functions - now handled by ManageAssetCategoriesView.vue

// Removed duplicate detection and merge functions - now handled by ManageAssetCategoriesView.vue

// Removed enhanced add functions with duplicate detection - now handled by ManageAssetCategoriesView.vue

// Removed all modal-related input handlers and duplicate detection functions - now handled by ManageAssetCategoriesView.vue

// Watchers for textarea auto-expansion
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

// Removed waitForBootstrap function - no longer needed

// API Loading Functions
const loadCategories = async () => {
  try {
    const response = await assetCategoryService.getAssetCategories({ limit: 100 })
    categories.value = response.data.assetCategories
  } catch (error) {
    console.error('Error loading categories:', error)
    showErrorToast('Failed to load asset categories')
  }
}

const loadAssetTypes = async (categoryId?: number) => {
  try {
    if (categoryId) {
      const response = await assetTypeService.getAssetTypesByCategory(categoryId)
      
      // Handle both paginated and non-paginated responses
      if (response.data.assetTypes) {
        assetTypes.value = response.data.assetTypes
      } else if (Array.isArray(response.data)) {
        assetTypes.value = response.data
      } else {
        console.error('Unexpected response structure:', response)
        assetTypes.value = []
      }
    } else {
      const response = await assetTypeService.getAssetTypes({ limit: 100 })
      assetTypes.value = response.data.assetTypes
    }
  } catch (error) {
    console.error('Error loading asset types:', error)
    showErrorToast('Failed to load asset types')
  }
}

const loadBrands = async (assetTypeId?: number) => {
  try {
    // Always load ALL brands - brands are independent of asset types
    // The connection is through models: Brand + AssetType = Model
    const response = await brandService.getBrands({ limit: 100 })
    brands.value = response.data.brands
  } catch (error) {
    console.error('Error loading brands:', error)
    showErrorToast('Failed to load brands')
  }
}

const loadModels = async (brandId?: number) => {
  try {
    if (brandId) {
      const response = await modelService.getModelsByBrand(brandId)
      
      if (response.data.models) {
        models.value = response.data.models
      } else {
        console.error('Unexpected response structure:', response)
        models.value = []
      }
    } else {
      const response = await modelService.getModels({ limit: 100 })
      models.value = response.data.models
    }
  } catch (error) {
    console.error('Error loading models:', error)
    showErrorToast('Failed to load models')
  }
}

const loadModelsByBrand = async (brandId: number) => {
  try {
    const response = await modelService.getModelsByBrand(brandId)
    
    if (response.data.models) {
      models.value = response.data.models
    } else {
      console.error('Unexpected response structure:', response)
      models.value = []
    }
  } catch (error) {
    console.error('Error loading models by brand:', error)
    showErrorToast('Failed to load models')
  }
}

const loadModelsByBrandAndAssetType = async (brandId: number, assetTypeId: number) => {
  try {
    const response = await modelService.getModelsByBrandAndAssetType(brandId, assetTypeId)
    
    if (response.data.models) {
      models.value = response.data.models
    } else {
      console.error('Unexpected response structure:', response)
      models.value = []
    }
  } catch (error) {
    console.error('Error loading models by brand and asset type:', error)
    showErrorToast('Failed to load models')
  }
}

const loadAssetData = async () => {
  if (!isEditMode.value || !assetId.value) return

  isLoading.value = true
  try {
    const response = await assetService.getAssetById(assetId.value)
    const asset = response.data.asset

    // Populate form with existing data
    formData.assetId = asset.assetId
    formData.serialNumber = asset.serialNumber
    formData.assetTypeId = asset.assetType?.id?.toString() || ''
    formData.brandId = asset.brand?.id?.toString() || ''
    formData.modelId = asset.model?.id?.toString() || ''
    formData.vendorId = asset.vendor?.id?.toString() || ''
    formData.status = asset.status
    formData.condition = asset.condition
    formData.location = asset.location
    formData.purchaseDate = asset.purchaseDate ? asset.purchaseDate.split('T')[0] : ''
    formData.purchaseCost = asset.purchaseCost?.toString() || ''
    formData.warrantyStartDate = asset.warrantyStartDate ? asset.warrantyStartDate.split('T')[0] : ''
    formData.warrantyEndDate = asset.warrantyEndDate ? asset.warrantyEndDate.split('T')[0] : ''
    formData.notes = asset.notes || ''

    // Set UI form data for cascading dropdowns - with safe access
    uiFormData.assetCategory = asset.assetType?.category?.id?.toString() || ''
    uiFormData.assetType = asset.assetType?.id?.toString() || ''
    uiFormData.brand = asset.brand?.id?.toString() || ''
    uiFormData.model = asset.model?.id?.toString() || ''

    // Load dependent data in sequence - with safe access
    const categoryId = asset.assetType?.category?.id
    if (categoryId) {
      await loadAssetTypes(categoryId)
    }
    await loadBrands()
    if (asset.brand?.id && asset.assetType?.id) {
      await loadModelsByBrandAndAssetType(asset.brand.id, asset.assetType.id)
    }

  } catch (error: any) {
    console.error('Error loading asset data:', error)
    showErrorToast('Failed to load asset data. Please try again.')
    router.push('/app/assets')
  } finally {
    isLoading.value = false
  }
}

const generateAssetId = async () => {
  try {
    // Generate asset ID from backend API
    formData.assetId = await assetService.generateAssetId()
  } catch (error) {
    console.error('Error generating asset ID:', error)
    // Fallback to timestamp-based ID if backend fails
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    formData.assetId = `AST-${timestamp}${random}`
  }
}

// Lifecycle
onMounted(async () => {
  // Make functions available globally for toast buttons
  ;(window as any).addAnotherAsset = addAnotherAsset
  ;(window as any).viewAssetList = viewAssetList
  ;(window as any).scrollToFirstError = scrollToFirstError
  
  // Load initial data
  isLoading.value = true
  try {
    if (isEditMode.value) {
      // In edit mode, load asset data first
      await Promise.all([
        loadCategories(),
        loadVendors()
      ])
      await loadAssetData()
    } else {
      // In create mode, load basic data and generate ID
    await Promise.all([
      loadCategories(),
      loadVendors(),
      generateAssetId()
    ])
    }
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    isLoading.value = false
  }
  
  // Focus on first field
  nextTick(() => {
    const firstField = document.getElementById('serialNumber')
    if (firstField) firstField.focus()
  })
})
</script> 

<style scoped>
/* Import the unified form styles */
@import url('../../assets/unified-form-styles.css');

/* Additional component-specific styles matching the prototype */
.auto-expand-textarea {
  transition: height 0.2s ease, border-color 0.2s ease;
  resize: none;
  overflow: hidden;
  min-height: 72px; /* 3 rows minimum */
}

.auto-expand-textarea:hover {
  border-color: #999999;
}

.expandable-notes {
  transition: height 0.3s ease, border-color 0.2s ease;
  cursor: pointer;
  resize: none;
}

.expandable-notes:hover {
  border-color: #999999;
}

.expandable-notes.expanded {
  cursor: text;
  resize: vertical;
}

.expandable-notes:focus {
  cursor: text;
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
  border-radius: 0.375rem !important;
  margin-bottom: 1rem !important;
  box-shadow: 0 1px 3px rgba(10, 10, 10, 0.1);
  width: auto !important;
  float: none !important;
}

/* Enhanced form controls */
.form-control, .form-select {
  border: 2px solid #999999;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.2s ease;
  color: #0A0A0A;
}

.form-control::placeholder {
  color: #666666 !important;
  opacity: 1;
}

.form-control:focus, .form-select:focus {
  border-color: #331FEA;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  outline: 2px solid transparent;
}

.form-control:hover, .form-select:hover {
  border-color: #666666;
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
.input-group-text {
  background-color: #F3F3F3;
  border: 2px solid #999999;
  border-right: none;
  color: #666666;
  font-weight: 600;
}

.input-group .form-control {
  border-left: none;
}

.input-group:focus-within .input-group-text {
  border-color: #331FEA;
  background-color: #F3F3F3;
}

.input-group:hover .input-group-text {
  border-color: #666666;
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

/* Merge and Duplicate Detection Styles */
.merge-item {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 0.375rem;
  background-color: #f8f9fa;
}

.merge-item.source {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.merge-item.target {
  border-color: #198754;
  background-color: #d1e7dd;
}

.merge-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 0.25rem;
}

.duplicate-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background-color: #f8f9fa;
}

.duplicate-list {
  margin-top: 0.75rem;
}

.duplicate-item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background-color: white;
  transition: all 0.2s ease;
}

.duplicate-item:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-color: #007bff;
}

.duplicate-actions {
  display: flex;
  gap: 0.5rem;
}

.impact-analysis {
  padding: 1rem;
  border: 1px solid #b6d7ff;
  border-radius: 0.375rem;
  background-color: #e7f3ff;
}

.confirmation-text {
  padding: 1rem;
  border: 1px solid #ffc107;
  border-radius: 0.375rem;
  background-color: #fff3cd;
}

/* Warning indicators for potential duplicates */
.duplicate-warning {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ffc107;
  color: #212529;
  padding: 0.25rem 0.5rem;
  border-radius: 0 0.375rem 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.form-control.has-duplicates {
  border-color: #ffc107;
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
}

.duplicate-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #dee2e6;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-height: 200px;
  overflow-y: auto;
}

.duplicate-suggestion {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;
}

.duplicate-suggestion:hover {
  background-color: #f8f9fa;
}

.duplicate-suggestion:last-child {
  border-bottom: none;
}

.suggestion-name {
  font-weight: 500;
  color: #495057;
}

.suggestion-meta {
  font-size: 0.875rem;
  color: #6c757d;
}

/* Enhanced input groups with warning indicators */
.input-group-enhanced {
  position: relative;
}

.warning-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
  background-color: #ffc107;
  color: #212529;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}
</style> 