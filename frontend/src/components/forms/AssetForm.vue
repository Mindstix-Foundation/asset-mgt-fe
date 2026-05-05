<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto">
          <div class="card-header">
            <h4 class="card-title">
              {{ isEditMode ? 'Edit Asset' : 'Add New Asset' }}
            </h4>
            <p class="text-muted">
              {{ isEditMode ? 'Update asset information in your system' : 'Register a new asset in your system' }}
            </p>
          </div>
          
          <!-- Card Body -->
          <div class="card-body">
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
                        :label="'Asset Category'"
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
                        :label="'Asset Type'"
                        :placeholder="selectedCategory ? 'Search asset types...' : 'Select category first...'"
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
                        :label="'Brand'"
                        :placeholder="selectedType ? 'Search brands...' : 'Select asset type first...'"
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
                        :label="'Model'"
                        :placeholder="selectedBrand ? 'Search models...' : 'Select brand first...'"
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

              <!-- Asset Specifications (Dynamic) -->
              <fieldset class="form-fieldset" v-if="selectedType && specificationFields && specificationFields.length > 0">
                <legend class="form-legend">
                  Asset Specifications
                </legend>
                
                <!-- If specification template is defined -->
                <div class="row g-4">
                  <!-- Dynamic fields based on assetType.specificationTemplate -->
                  <div 
                    v-for="(field, index) in specificationFields" 
                    :key="field.key"
                    :class="getSpecFieldColumnClass(index, specificationFields, field.type)"
                  >
                    <!-- Text Input -->
                    <div v-if="field.type === 'text'">
                      <label :for="`spec-${field.key}`" class="form-label">
                        {{ field.label }}
                        <span v-if="field.required" class="text-danger">*</span>
                      </label>
                      <input 
                        type="text"
                        :id="`spec-${field.key}`"
                        class="form-control"
                        :class="getSpecFieldClass(field.key)"
                        v-model="formData.specifications[field.key]"
                        :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
                        :required="field.required"
                        :maxlength="50"
                        @blur="validateSpecField(field.key, field.type, field.required || false)"
                        @focus="clearSpecFieldValidation(field.key)"
                        @input="handleSpecFieldInput(field.key)"
                      />
                      <div class="form-text d-flex justify-content-between">
                        <span>{{ field.required ? 'Required field' : 'Optional' }}</span>
                        <span class="text-muted">
                          {{ (formData.specifications[field.key] || '').length }}/50
                        </span>
                      </div>
                      <div class="invalid-feedback">{{ getSpecFieldError(field.key) }}</div>
                    </div>
                    
                    <!-- Number Input -->
                    <div v-else-if="field.type === 'number'">
                      <label :for="`spec-${field.key}`" class="form-label">
                        {{ field.label }}
                        <span v-if="field.required" class="text-danger">*</span>
                      </label>
                      <input 
                        type="number"
                        :id="`spec-${field.key}`"
                        class="form-control"
                        :class="getSpecFieldClass(field.key)"
                        v-model.number="formData.specifications[field.key]"
                        :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
                        :required="field.required"
                        @blur="validateSpecField(field.key, field.type, field.required || false)"
                        @focus="clearSpecFieldValidation(field.key)"
                        @input="handleSpecFieldInput(field.key)"
                      />
                      <div class="form-text">
                        {{ field.required ? 'Required field' : 'Optional' }}
                      </div>
                      <div class="invalid-feedback">{{ getSpecFieldError(field.key) }}</div>
                    </div>
                    
                    <!-- Dropdown -->
                    <div v-else-if="field.type === 'dropdown'">
                      <div class="form-searchable-dropdown">
                        <SearchableDropdown
                          :id="`spec-${field.key}`"
                          :label="field.label"
                          :placeholder="field.placeholder || `Select ${field.label.toLowerCase()}...`"
                          :items="getSpecDropdownItems(field)"
                          :model-value="selectedSpecFields[field.key] ?? null"
                          :required="field.required"
                          label-key="label"
                          @update:model-value="(item) => onSpecFieldChange(field.key, item)"
                          @change="(item) => onSpecFieldChange(field.key, item)"
                        />
                      </div>
                      <div class="form-text">
                        {{ field.required ? 'Required field' : 'Optional' }}
                      </div>
                      <div class="invalid-feedback">{{ getSpecFieldError(field.key) }}</div>
                    </div>
                    
                    <!-- Textarea -->
                    <div v-else-if="field.type === 'textarea'">
                      <NotesTextarea
                        v-model="formData.specifications[field.key]"
                        :label="field.label"
                        :placeholder="field.placeholder || `Enter ${field.label.toLowerCase()}`"
                        :help-text="field.required ? 'Required field' : 'Optional'"
                        :max-length="1000"
                        :min-rows="3"
                        :required="field.required"
                        :show-label="true"
                        :input-id="`spec-${field.key}`"
                        @validation="(isValid, errorMessage) => handleSpecTextareaValidation(field.key, isValid, errorMessage)"
                      />
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
                      input-id="purchaseDate"
                      label="Purchase Date (Optional)"
                      v-model="formData.purchaseDate"
                      :max="todayDate"
                      help-text="Cannot be future date"
                      :error-message="errors.purchaseDate"
                      :input-class="getFieldClass('purchaseDate') as any"
                      @change="validateFieldInline('purchaseDate')"
                      @blur="validateFieldInline('purchaseDate')"
                      @focus="clearFieldValidation('purchaseDate')"
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
                      input-id="warrantyStartDate" 
                      label="Warranty Start Date (Optional)"
                      v-model="formData.warrantyStartDate"
                      help-text="When warranty coverage begins"
                      :error-message="errors.warrantyStartDate"
                      :input-class="getFieldClass('warrantyStartDate') as any"
                      @change="onWarrantyStartDateChange"
                      @blur="validateFieldInline('warrantyStartDate')"
                      @focus="clearFieldValidation('warrantyStartDate')"
                    />
                  </div>

                  <!-- Warranty End Date -->
                  <div class="col-md-6">
                    <DatePicker
                      input-id="warrantyEndDate" 
                      label="Warranty End Date (Optional)"
                      v-model="formData.warrantyEndDate"
                      :help-text="formData.warrantyStartDate ? 'When warranty coverage expires' : 'Select warranty start date first'"
                      :error-message="errors.warrantyEndDate"
                      :input-class="getFieldClass('warrantyEndDate') as any"
                      :min="warrantyEndDateMin"
                      :disabled="!formData.warrantyStartDate"
                      @change="validateFieldInline('warrantyEndDate')"
                      @blur="validateFieldInline('warrantyEndDate')"
                      @focus="clearFieldValidation('warrantyEndDate')"
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
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                        id="location"
                        label="Location"
                        placeholder="Select location..."
                        :items="locationItems"
                        v-model="selectedLocation"
                        required
                        @change="onLocationChange"
                      />
                    </div>
                    <div class="form-text">Inventory center where asset is currently stored</div>
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
          <div class="card-footer">
            <div class="form-actions">
              <!-- Footer Start -->
              <div class="container">
                <!-- Row 1: Buttons -->
                <div class="row">
                  <div class="col-12 d-flex justify-content-center gap-3 mb-3">
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
                      class="btn btn-purple" 
                      @click="handleSubmit"
                      :disabled="isSubmitting"
                    >
                      <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                      {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Registering...') : (isEditMode ? 'Update Asset' : 'Register Asset') }}
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
import { ref, reactive, computed, onMounted, nextTick, toRaw } from 'vue'
import { secureRandomInt } from '@/utils/random'
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
  location: '' as string,
  condition: 'NEW',
  status: 'NON_ASSIGNED',
  notes: '',
  // PROTOTYPE: Specifications
  specifications: {} as Record<string, any>,
  specificationsText: ''
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

// PROTOTYPE: Specification fields (dynamic based on asset type)
interface SpecDropdownOption {
  value: string
  deprecated?: boolean
}

interface SpecField {
  key: string
  label: string
  type: 'text' | 'number' | 'dropdown' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: (string | SpecDropdownOption)[]
}

const specificationFields = ref<SpecField[]>([])
const selectedSpecFields = reactive<Record<string, any>>({})

const getSpecDropdownItems = (field: SpecField): Item[] => {
  if (!field.options || field.type !== 'dropdown') {
    return []
  }

  return field.options
    .map((option) => {
      const value =
        typeof option === 'string'
          ? option
          : (option as SpecDropdownOption)?.value
      const deprecated =
        typeof option === 'string'
          ? false
          : Boolean((option as SpecDropdownOption)?.deprecated)

      if (!value) {
        return null
      }

      return {
        id: value,
        value,
        label: value,
        deprecated
      } as Item
    })
    .filter(
      (item): item is Item =>
        item !== null && !(item as any).deprecated
    )
}
const selectedVendor = ref<Item | null>(null)
const selectedCondition = ref<Item | null>(null)
const selectedStatus = ref<Item | null>(null)
const selectedLocation = ref<Item | null>(null)

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

// Warranty end date minimum (based on warranty start date)
const warrantyEndDateMin = computed(() => {
  return formData.warrantyStartDate || ''
})

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
    { id: 'WORKING_CONDITION', name: 'Working Condition', value: 'WORKING_CONDITION' },
    { id: 'SOFTWARE_ISSUE', name: 'Software Issue', value: 'SOFTWARE_ISSUE' },
    { id: 'HARDWARE_ISSUE', name: 'Hardware Issue', value: 'HARDWARE_ISSUE' },
    { id: 'NEEDS_REPAIR', name: 'Needs Repair', value: 'NEEDS_REPAIR' },
    { id: 'TRASH', name: 'Trash', value: 'TRASH' },
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

const locationItems = computed(() => {
  return [
    { id: 'PUNE_INVENTORY_CENTER', name: 'Pune Inventory Center', value: 'PUNE_INVENTORY_CENTER' },
    { id: 'THANE_INVENTORY_CENTER', name: 'Thane Inventory Center', value: 'THANE_INVENTORY_CENTER' }
  ]
})

const onLocationChange = (item: any) => {
  formData.location = item && item.value ? item.value.toString() : ''
  if (formData.location) {
    setFieldValid('location')
    applyValidationToSearchableDropdown('location', 'valid')
  } else {
    clearFieldValidation('location')
    applyValidationToSearchableDropdown('location', 'invalid')
  }
  validateFieldInline('location')
}

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
    case 'NON_ASSIGNED':
      return [
        { value: 'NON_ASSIGNED', label: 'Non Assigned (Current)' },
        { value: 'LOST', label: 'Lost' },
        { value: 'DONATED', label: 'Donated' }
      ]
    case 'ASSIGNED':
      return [
        { value: 'ASSIGNED', label: 'Assigned (Current)' },
        { value: 'LOST', label: 'Lost' }
      ]
    case 'IN_MAINTENANCE':
      return [
        { value: 'IN_MAINTENANCE', label: 'In Maintenance (Current)' },
        { value: 'NON_ASSIGNED', label: 'Non Assigned (Maintenance Complete)' },
        { value: 'ASSIGNED', label: 'Assigned (Return to Employee)' }
      ]
    case 'RETIRED':
      return [
        { value: 'RETIRED', label: 'Retired (Current)' },
        { value: 'NON_ASSIGNED', label: 'Non Assigned (Reactivated)' }
      ]
    case 'LOST':
      return [
        { value: 'LOST', label: 'Lost (Current)' },
        { value: 'NON_ASSIGNED', label: 'Non Assigned (Found)' }
      ]
    case 'DONATED':
      return [
        { value: 'DONATED', label: 'Donated (Current)' }
      ]
    default:
      return [
        { value: 'NON_ASSIGNED', label: 'Non Assigned' },
        { value: 'LOST', label: 'Lost' },
        { value: 'DONATED', label: 'Donated' }
      ]
  }
})

// Validation system (following IssueAssetView/CollectAssetView pattern)
const getFieldClass = (fieldName: string) => {
  // Don't apply validation classes to disabled asset identity fields
  if (props.disableAssetIdentity && ['assetCategory', 'assetType', 'brand', 'model'].includes(fieldName)) {
    return {}
  }
  
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return {}
  }
  
  return {
    'is-valid': fieldValidation[fieldName] === true,
    'is-invalid': fieldValidation[fieldName] === false || (errors[fieldName as keyof typeof errors] && errors[fieldName as keyof typeof errors].trim() !== '')
  }
}

// Helper function to apply validation classes to SearchableDropdown components
const applyValidationToSearchableDropdown = (fieldName: string, validationType: 'valid' | 'invalid') => {
  // Don't apply validation classes to disabled asset identity fields
  if (props.disableAssetIdentity && ['assetCategory', 'assetType', 'brand', 'model'].includes(fieldName)) {
    return
  }
  
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

// Helper functions for field validation
const validateRequiredField = (fieldName: string, value: any, element: HTMLElement): boolean => {
  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '')) {
    setFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`)
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

const setFieldError = (fieldName: string, message: string) => {
  // Don't apply validation to disabled asset identity fields
  if (props.disableAssetIdentity && ['assetCategory', 'assetType', 'brand', 'model'].includes(fieldName)) {
    return
  }
  
  errors[fieldName as keyof typeof errors] = message
  fieldValidation[fieldName] = false
  
  const element = document.getElementById(fieldName) as FormElement
  if (element && 'setCustomValidity' in element) {
    element.setCustomValidity(message)
  }
  
  // Apply validation classes to SearchableDropdown fields
  const searchableDropdownFields = ['assetCategory', 'assetType', 'brand', 'model', 'condition', 'status', 'vendor', 'location']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'invalid')
  }
}

const setFieldValid = (fieldName: string) => {
  // Don't apply validation to disabled asset identity fields
  if (props.disableAssetIdentity && ['assetCategory', 'assetType', 'brand', 'model'].includes(fieldName)) {
    return
  }
  
  delete errors[fieldName as keyof typeof errors]
  fieldValidation[fieldName] = true
  
  const element = document.getElementById(fieldName) as FormElement
  if (element && 'setCustomValidity' in element) {
    element.setCustomValidity('')
  }
  
  // Apply validation classes to SearchableDropdown fields
  const searchableDropdownFields = ['assetCategory', 'assetType', 'brand', 'model', 'condition', 'status', 'vendor', 'location']
  if (searchableDropdownFields.includes(fieldName)) {
    applyValidationToSearchableDropdown(fieldName, 'valid')
  }
}

const clearFieldValidation = (fieldName: string) => {
  // Don't clear validation for disabled asset identity fields
  if (props.disableAssetIdentity && ['assetCategory', 'assetType', 'brand', 'model'].includes(fieldName)) {
    return
  }
  
  // Only clear validation if form hasn't been submitted yet
  if (!formSubmitted.value) {
    fieldValidation[fieldName] = null
    delete errors[fieldName as keyof typeof errors]
    
    // Also clear validation for SearchableDropdown components
    const searchableDropdownFields = ['assetCategory', 'assetType', 'brand', 'model', 'condition', 'status', 'vendor', 'location']
    if (searchableDropdownFields.includes(fieldName)) {
      const input = document.getElementById(fieldName) as HTMLInputElement
      if (input) {
        input.classList.remove('is-invalid', 'is-valid')
      }
    }
  }
}

// Helper function to get selected value for a field
const getSelectedValueForField = (fieldName: string) => {
  switch (fieldName) {
    case 'assetCategory':
      return selectedCategory.value
    case 'assetType':
      return selectedType.value
    case 'brand':
      return selectedBrand.value
    case 'model':
      return selectedModel.value
    case 'condition':
      return selectedCondition.value
    case 'status':
      return selectedStatus.value
    case 'vendor':
      return selectedVendor.value
    default:
      return null
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
  
  if (!element) {
    console.log(`Element not found for field: ${fieldName}`)
    return false
  }

  // Clear previous custom validity
  element.setCustomValidity('')

  // Handle specific field validations first
  const handler = validationHandlers[fieldName as keyof typeof validationHandlers]
  if (handler) {
    console.log(`Using specific handler for field: ${fieldName}`)
    if (['purchaseDate', 'purchaseCost', 'warrantyStartDate', 'warrantyEndDate'].includes(fieldName)) {
      return (handler as (value: any) => boolean)(value)
    } else {
      return (handler as () => boolean)()
    }
  }

  // For SearchableDropdown fields, use the dropdown validation
  const searchableDropdownFields = ['assetCategory', 'assetType', 'brand', 'model', 'condition', 'status', 'vendor', 'location']
  if (searchableDropdownFields.includes(fieldName)) {
    console.log(`Field ${fieldName} is a SearchableDropdown, using dropdown validation`)
    // For SearchableDropdown, check if it's required and has a value
    const isRequired = !props.disableAssetIdentity || fieldName === 'condition'
    if (isRequired) {
      const selectedValue = getSelectedValueForField(fieldName)
      return validateRequiredDropdown(fieldName, selectedValue)
    } else {
      // Optional field, always valid
      setFieldValid(fieldName)
      return true
    }
  }

  // Check for custom field types that need API validation (serialNumber, location, notes)
  // Note: purchaseDate, purchaseCost, warrantyStartDate, warrantyEndDate are handled by validationHandlers above
  const customValidationFields = ['serialNumber', 'notes']
  if (customValidationFields.includes(fieldName)) {
    console.log(`Field ${fieldName} uses custom validation, calling validateFieldType`)
    return await validateFieldType(fieldName, value)
  }

  // Check if field is required for standard fields
  if (!validateRequiredField(fieldName, value, element)) {
    console.log(`Field ${fieldName} failed required validation`)
    return false
  }

  // Use native validation for other fields
  console.log(`Using standard validation for field: ${fieldName}`)
  return validateStandardField(fieldName, element)
}

// Validation configuration mapping
const validationHandlers = {
  assetCategory: () => validateRequiredDropdown('assetCategory', selectedCategory.value),
  assetType: () => validateRequiredDropdown('assetType', selectedType.value),
  brand: () => validateRequiredDropdown('brand', selectedBrand.value),
  model: () => validateRequiredDropdown('model', selectedModel.value),
  condition: () => validateRequiredDropdown('condition', selectedCondition.value),
  location: () => validateRequiredDropdown('location', selectedLocation.value),
  vendor: () => validateOptionalDropdown('vendor', selectedVendor.value),
  status: () => validateOptionalDropdown('status', selectedStatus.value),
  purchaseDate: (value: any) => validatePurchaseDateField(value),
  purchaseCost: (value: any) => validatePurchaseCostField(value),
  warrantyStartDate: (value: any) => validateWarrantyDateField('warrantyStartDate', value),
  warrantyEndDate: (value: any) => validateWarrantyDateField('warrantyEndDate', value)
}

const validateFieldType = async (fieldName: string, value: any): Promise<boolean> => {
  switch (fieldName) {
    case 'serialNumber':
      return await validateSerialNumberField(value)
    case 'location':
      return validateRequiredDropdownField('location', selectedLocation.value)
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

const validateOptionalDropdown = (fieldName: string, selectedValue: any): boolean => {
  // Optional fields are always valid
  setFieldValid(fieldName)
  return true
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

const VALID_LOCATIONS = new Set(['PUNE_INVENTORY_CENTER', 'THANE_INVENTORY_CENTER'])

const validateLocationField = (value: any): boolean => {
  if (!value || value.toString().trim() === '') {
    setFieldError('location', 'Location is required')
    return false
  }

  const location = value.toString().trim()
  if (!VALID_LOCATIONS.has(location)) {
    setFieldError('location', 'Location must be one of the allowed inventory centers')
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

// Legacy validation functions removed - using new comprehensive validation system

const validateLocation = (field: HTMLInputElement) => {
  if (!formData.location || !VALID_LOCATIONS.has(formData.location)) {
    errors.location = 'Location is required'
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

// Old validation functions removed - using new comprehensive validation system

const clearFieldError = (fieldName: string) => {
  if (errors[fieldName as keyof typeof errors]) {
    const field = document.getElementById(fieldName) as HTMLInputElement
    if (field && ((formData as any)[fieldName] || (uiFormData as any)[fieldName])) {
      field.classList.remove('is-invalid')
    }
    
    // Also clear validation for SearchableDropdown components
    const searchableDropdownFields = ['assetCategory', 'assetType', 'brand', 'model', 'condition', 'status', 'vendor', 'location']
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
  
  // Handle validation when user makes a selection
  if (item) {
    setFieldValid('assetCategory')
    applyValidationToSearchableDropdown('assetCategory', 'valid')
  } else {
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
  
  // PROTOTYPE: Load specification template for this asset type
  if (item && item.value) {
    await loadAssetTypeTemplate(item.value as number)
  } else {
    specificationFields.value = []
  }
  
  // Load ALL brands (not filtered by asset type)
  if (item) {
    await loadBrands()
  }
  
  // Handle validation when user makes a selection
  if (item) {
    setFieldValid('assetType')
    applyValidationToSearchableDropdown('assetType', 'valid')
  } else {
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
  
  // Handle validation when user makes a selection
  if (item) {
    setFieldValid('brand')
    applyValidationToSearchableDropdown('brand', 'valid')
  } else {
    clearFieldValidation('brand')
  }
  
  validateFieldInline('brand')
}

const onModelChange = async (item: Item | null) => {
  selectedModel.value = item
  
  // Update UI form data
  uiFormData.model = item && item.value ? item.value.toString() : ''
  formData.modelId = item && item.value ? item.value.toString() : ''
  
  // Handle validation when user makes a selection
  if (item) {
    setFieldValid('model')
    applyValidationToSearchableDropdown('model', 'valid')
  } else {
    clearFieldValidation('model')
  }
  
  validateFieldInline('model')
}

const onVendorChange = (item: Item | null) => {
  selectedVendor.value = item
  formData.vendorId = item && item.value ? item.value.toString() : undefined
  
  // Handle validation when user makes a selection (vendor is optional)
  if (item) {
    setFieldValid('vendor')
    applyValidationToSearchableDropdown('vendor', 'valid')
  } else {
    clearFieldValidation('vendor')
  }
  
  validateFieldInline('vendor')
}

const onConditionChange = (item: Item | null) => {
  selectedCondition.value = item
  formData.condition = item && item.value ? item.value.toString() : 'NEW'
  
  // Handle validation when user makes a selection
  if (item) {
    setFieldValid('condition')
    applyValidationToSearchableDropdown('condition', 'valid')
  } else {
    clearFieldValidation('condition')
  }
  
  validateFieldInline('condition')
}

const onStatusChange = (item: Item | null) => {
  selectedStatus.value = item
  formData.status = item && item.value ? item.value.toString() : 'NON_ASSIGNED'
  
  // Handle validation when user makes a selection
  if (item) {
    setFieldValid('status')
    applyValidationToSearchableDropdown('status', 'valid')
  } else {
    clearFieldValidation('status')
  }
  
  validateFieldInline('status')
}

// Warranty start date change handler
const onWarrantyStartDateChange = (value: string) => {
  formData.warrantyStartDate = value
  
  // If warranty end date exists and is before the new start date, clear it
  if (formData.warrantyEndDate && value && formData.warrantyEndDate < value) {
    formData.warrantyEndDate = ''
    // Clear any validation errors for warranty end date
    clearFieldValidation('warrantyEndDate')
  }
  
  // Validate warranty start date
  validateFieldInline('warrantyStartDate')
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
  // Mark form as submitted to enable validation styling
  formSubmitted.value = true
  
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

  // Validate specification fields
  const specFieldsValid = await validateAllSpecFields()

  return validationResults.every(Boolean) && specFieldsValid
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

const processFieldMappings = (original: any, assetData: any) => {
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
}

const processVendorId = (original: any, assetData: any) => {
  const newVendorId = formData.vendorId ? Number.parseInt(formData.vendorId) : null
  const oldVendorId = original.vendorId || null
  if (newVendorId !== oldVendorId) {
    assetData.vendorId = newVendorId || undefined
  }
}

const processIdentityFields = (original: any, assetData: any) => {
  if (props.disableAssetIdentity) return

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

const processSpecifications = (original: any, assetData: any) => {
  const originalSpecs = normalizeSpecifications(original?.specifications)
  const newSpecs = normalizeSpecifications(buildSpecificationsData())
  const originalSpecsSerialized = originalSpecs ? JSON.stringify(originalSpecs) : null
  const newSpecsSerialized = newSpecs ? JSON.stringify(newSpecs) : null

  if (originalSpecsSerialized !== newSpecsSerialized) {
    assetData.specifications = newSpecs ?? {}
  }
}

const buildEditModeAssetData = (): any => {
  const original = originalAssetData.value
  const assetData: any = {}

  processFieldMappings(original, assetData)
  processVendorId(original, assetData)
  processIdentityFields(original, assetData)
  processSpecifications(original, assetData)

  return assetData
}

const buildAddModeAssetData = (): any => {
  const normalizeOptionalField = (val: any) => {
    return val && val.toString().trim() !== '' ? val : undefined
  }

  // Build specifications data
  const specificationsData = buildSpecificationsData()
  
  // Log specifications
  if (specificationsData) {
    console.log('====================================')
    console.log('Asset Specifications')
    console.log('====================================')
    console.log('Specifications:', JSON.stringify(specificationsData, null, 2))
    console.log('====================================')
  }

  return {
    assetId: formData.assetId,
    serialNumber: formData.serialNumber,
    vendorId: formData.vendorId ? Number.parseInt(formData.vendorId) : undefined,
    status: 'NON_ASSIGNED',
    condition: formData.condition as any,
    location: formData.location,
    purchaseDate: normalizeOptionalField(formData.purchaseDate),
    purchaseCost: formData.purchaseCost ? Number.parseFloat(formData.purchaseCost.toString()) : undefined,
    warrantyStartDate: normalizeOptionalField(formData.warrantyStartDate),
    warrantyEndDate: normalizeOptionalField(formData.warrantyEndDate),
    notes: normalizeOptionalField(formData.notes),
    assetTypeId: Number.parseInt(formData.assetTypeId!),
    brandId: Number.parseInt(formData.brandId!),
    modelId: Number.parseInt(formData.modelId!),
    // Include specifications
    ...(specificationsData ? { specifications: specificationsData } : {})
  }
}

// ============================================
// SPECIFICATION HANDLING
// ============================================

const initializeSpecFieldValue = (field: SpecField) => {
  const hasValue = field.key in formData.specifications &&
    formData.specifications[field.key] !== null &&
    formData.specifications[field.key] !== undefined
  if (!hasValue) {
    formData.specifications[field.key] = ''
  }
}

const initializeDropdownSelection = (field: SpecField) => {
  const dropdownItems = getSpecDropdownItems(field)
  const rawValue = formData.specifications[field.key]
  const existingValue =
    rawValue !== undefined && rawValue !== null ? String(rawValue).trim() : ''

  if (!existingValue) {
    selectedSpecFields[field.key] = selectedSpecFields[field.key] ?? null
    return
  }

  const normalize = (v: string) => v.replaceAll(/\s+/g, '').toLowerCase()
  const matchedItem =
    dropdownItems.find(
      (item) => normalize(String(item.value)) === normalize(existingValue)
    ) || null

  if (matchedItem) {
    formData.specifications[field.key] = matchedItem.value
    selectedSpecFields[field.key] = matchedItem
    return
  }

  selectedSpecFields[field.key] = {
    id: existingValue,
    value: existingValue,
    label: existingValue
  } as Item
}

const applySpecificationTemplate = (template: any) => {
  specificationFields.value = template.fields || []

  for (const field of specificationFields.value) {
    initializeSpecFieldValue(field)
    if (field.type === 'dropdown') {
      initializeDropdownSelection(field)
    }
    fieldValidation[`spec_${field.key}`] = null
  }

  console.log('Loaded specification template from backend:', template)
}

const clearSpecificationTemplate = (assetTypeId: number) => {
  specificationFields.value = []
  for (const key of Object.keys(specFieldErrors)) {
    delete specFieldErrors[key]
  }
  console.log('No specification template found for asset type:', assetTypeId)
}

// Load specification template from asset type
const loadAssetTypeTemplate = async (assetTypeId: number) => {
  try {
    const response = await assetTypeService.getAssetTypeById(assetTypeId)
    const assetType = response.data.assetType
    const template = assetType.specificationTemplate

    if (template?.fields) {
      applySpecificationTemplate(template)
    } else {
      clearSpecificationTemplate(assetTypeId)
    }
  } catch (error) {
    console.error('Error loading asset type template:', error)
    specificationFields.value = []
  }
}

// Handle spec field changes (for dropdowns)
const onSpecFieldChange = (key: string, item: any) => {
  // Ensure we always set to null if item is null/undefined, not undefined
  selectedSpecFields[key] = item || null
  formData.specifications[key] = item?.value || ''
  
  // Validate dropdown field after selection
  const field = specificationFields.value.find(f => f.key === key)
  if (field) {
    // Use nextTick to ensure reactive updates are complete before validation
    nextTick(() => {
      validateSpecField(key, field.type, field.required || false)
    })
  }
}

// Parse free-form specifications (key-value pairs or free text)
const parseSpecifications = (specsInput: string) => {
  if (!specsInput || !specsInput.trim()) return undefined
  
  const specs: Record<string, string> = {}
  const lines = specsInput.split('\n')
  let hasKeyValuePairs = false
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      hasKeyValuePairs = true
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      if (key && value) {
        specs[key] = value
      }
    }
  }
  
  // If no key-value pairs, store as description
  if (!hasKeyValuePairs && specsInput.trim()) {
    return { description: specsInput.trim() }
  }
  
  return Object.keys(specs).length > 0 ? specs : undefined
}

// Build specifications data for submission
const buildSpecificationsData = () => {
  // If template exists and fields are filled
  if (specificationFields.value.length > 0) {
    const specs: Record<string, any> = {}
    for (const field of specificationFields.value) {
      const value = formData.specifications[field.key]
      if (value !== undefined && value !== null && value !== '') {
        specs[field.key] = value
      }
    }
    return Object.keys(specs).length > 0 ? specs : undefined
  }
  
  // If no template, parse free-form text
  if (formData.specificationsText) {
    return parseSpecifications(formData.specificationsText)
  }
  
  return undefined
}

function normalizeSpecifications(specs: any): Record<string, any> | undefined {
  if (!specs || typeof specs !== 'object') {
    return undefined
  }

  const normalized: Record<string, any> = {}

  const sortedEntries = Object.entries(specs)
    .sort(([a], [b]) => a.localeCompare(b))
  
  for (const [key, value] of sortedEntries) {
    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'string') {
      if (value.trim() === '') {
        continue
      }
      normalized[key] = value
      continue
    }

    normalized[key] = value
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

// Get column class for specification fields (2 per row, last field full width if odd number, textarea always full width)
const getSpecFieldColumnClass = (index: number, allFields: SpecField[], fieldType: string): string => {
  // Textarea fields always take full width
  if (fieldType === 'textarea') {
    return 'col-12'
  }
  
  // Filter out textarea fields to calculate pairing for non-textarea fields only
  const nonTextareaFields = allFields.filter(f => f.type !== 'textarea')
  const nonTextareaCount = nonTextareaFields.length
  
  // Find the index of current field in the non-textarea array
  // Count how many non-textarea fields are before the current index
  let nonTextareaIndex = 0
  for (let i = 0; i < index; i++) {
    if (allFields[i].type !== 'textarea') {
      nonTextareaIndex++
    }
  }
  
  // If it's the last non-textarea field and count is odd, make it full width
  if (nonTextareaIndex === nonTextareaCount - 1 && nonTextareaCount % 2 !== 0) {
    return 'col-12'
  }
  
  // Otherwise, 2 fields per row
  return 'col-md-6'
}

// ============================================
// SPECIFICATION FIELD VALIDATION
// ============================================

// Reactive object to store specification field errors
const specFieldErrors = reactive<Record<string, string>>({})

// Get validation class for specification field
const getSpecFieldClass = (fieldKey: string) => {
  const validationKey = `spec_${fieldKey}`
  
  if (!formSubmitted.value && fieldValidation[validationKey] === null) {
    return {}
  }
  
  return {
    'is-valid': fieldValidation[validationKey] === true,
    'is-invalid': fieldValidation[validationKey] === false || (specFieldErrors[fieldKey] && specFieldErrors[fieldKey].trim() !== '')
  }
}

// Get error message for specification field
const getSpecFieldError = (fieldKey: string): string => {
  return specFieldErrors[fieldKey] || ''
}

// Set error for specification field
const setSpecFieldError = (fieldKey: string, message: string) => {
  const validationKey = `spec_${fieldKey}`
  specFieldErrors[fieldKey] = message
  fieldValidation[validationKey] = false
  
  const element = document.getElementById(`spec-${fieldKey}`) as FormElement
  if (element && 'setCustomValidity' in element) {
    element.setCustomValidity(message)
  }
  
  // Always apply validation classes to SearchableDropdown fields
  applyValidationToSearchableDropdown(`spec-${fieldKey}`, 'invalid')
}

// Set valid for specification field
const setSpecFieldValid = (fieldKey: string) => {
  const validationKey = `spec_${fieldKey}`
  delete specFieldErrors[fieldKey]
  fieldValidation[validationKey] = true
  
  const element = document.getElementById(`spec-${fieldKey}`) as FormElement
  if (element && 'setCustomValidity' in element) {
    element.setCustomValidity('')
  }
  
  // Always apply validation classes to SearchableDropdown fields (even if element not found)
  applyValidationToSearchableDropdown(`spec-${fieldKey}`, 'valid')
}

// Clear validation for specification field
const clearSpecFieldValidation = (fieldKey: string) => {
  const validationKey = `spec_${fieldKey}`
  
  // Only clear validation if form hasn't been submitted yet
  if (!formSubmitted.value) {
    fieldValidation[validationKey] = null
    delete specFieldErrors[fieldKey]
    
    const element = document.getElementById(`spec-${fieldKey}`) as FormElement
    if (element && 'setCustomValidity' in element) {
      element.setCustomValidity('')
    }
    
    // Clear validation classes for regular inputs
    const input = document.getElementById(`spec-${fieldKey}`) as HTMLInputElement
    if (input) {
      input.classList.remove('is-invalid', 'is-valid')
    }
    
    // Also clear validation for SearchableDropdown (for dropdown fields)
    const field = specificationFields.value.find(f => f.key === fieldKey)
    if (field && field.type === 'dropdown') {
      // Find the SearchableDropdown input and clear classes
      const dropdownInput = document.getElementById(`spec-${fieldKey}`) as HTMLInputElement
      if (dropdownInput) {
        dropdownInput.classList.remove('is-invalid', 'is-valid')
      }
    }
  }
}

// Handle input for specification field
const handleSpecFieldInput = (fieldKey: string) => {
  const validationKey = `spec_${fieldKey}`
  if (fieldValidation[validationKey] === false && formData.specifications[fieldKey]?.toString().trim()) {
    const field = specificationFields.value.find(f => f.key === fieldKey)
    if (field) {
      validateSpecField(fieldKey, field.type, field.required || false)
    }
  }
}

// Validate specification field
const validateSpecField = (fieldKey: string, fieldType: string, required: boolean): boolean => {
  const value = formData.specifications[fieldKey]
  const fieldId = `spec-${fieldKey}`
  const element = document.getElementById(fieldId) as FormElement
  
  // Handle dropdown fields separately
  if (fieldType === 'dropdown') {
    const selectedValue = selectedSpecFields[fieldKey]
    if (required && (!selectedValue || selectedValue === null)) {
      const field = specificationFields.value.find(f => f.key === fieldKey)
      setSpecFieldError(fieldKey, `${field?.label || 'This field'} is required`)
      return false
    }
    // Value is selected or optional field with no value, mark as valid
    setSpecFieldValid(fieldKey)
    return true
  }
  
  // For other field types, check if element exists
  if (!element) {
    return true
  }
  
  // Check required validation
  if (required) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      const field = specificationFields.value.find(f => f.key === fieldKey)
      setSpecFieldError(fieldKey, `${field?.label || 'This field'} is required`)
      return false
    }
  }

  // Enforce 50-character cap on text fields (defends against paste / programmatic input).
  if (fieldType === 'text' && typeof value === 'string' && value.length > 50) {
    const field = specificationFields.value.find(f => f.key === fieldKey)
    setSpecFieldError(
      fieldKey,
      `${field?.label || 'This field'} must be 50 characters or fewer`,
    )
    return false
  }
  
  // Use native validation for standard fields
  if (element.checkValidity()) {
    setSpecFieldValid(fieldKey)
    return true
  } else {
    setSpecFieldError(fieldKey, element.validationMessage || `${specificationFields.value.find(f => f.key === fieldKey)?.label || 'This field'} is invalid`)
    return false
  }
}

// Validate all specification fields
const validateAllSpecFields = async (): Promise<boolean> => {
  const validationResults: boolean[] = []
  
  for (const field of specificationFields.value) {
    if (field.required) {
      const isValid = validateSpecField(field.key, field.type, field.required || false)
      validationResults.push(isValid)
    } else {
      // Validate optional fields to show green borders
      validateSpecField(field.key, field.type, field.required || false)
    }
  }
  
  return validationResults.every(Boolean)
}

// Handle validation for specification textarea fields
const handleSpecTextareaValidation = (fieldKey: string, isValid: boolean, errorMessage?: string) => {
  if (isValid) {
    setSpecFieldValid(fieldKey)
  } else if (errorMessage) {
    setSpecFieldError(fieldKey, errorMessage)
  } else {
    const field = specificationFields.value.find(f => f.key === fieldKey)
    setSpecFieldError(fieldKey, `${field?.label || 'This field'} is required`)
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
    const random = secureRandomInt(1000).toString().padStart(3, '0')
    formData.assetId = `AST-${timestamp}${random}`
  }
}

// Helper functions for form initialization
const cloneJsonLike = <T extends Record<string, unknown>>(obj: object): T =>
  structuredClone(toRaw(obj)) as T

const populateFormDataFromAsset = (asset: any) => {
  const { purchaseDate, warrantyStartDate, warrantyEndDate, ...assetDataWithoutDates } = asset
  Object.assign(formData, assetDataWithoutDates)
  
  // Handle dates separately to ensure proper formatting
  formData.purchaseDate = ensureDateFormat(purchaseDate)
  formData.warrantyStartDate = ensureDateFormat(warrantyStartDate)
  formData.warrantyEndDate = ensureDateFormat(warrantyEndDate)
  
  // Convert null values to empty strings for string fields
  formData.notes = formData.notes ?? ''
  formData.location = formData.location ?? ''
  formData.serialNumber = formData.serialNumber ?? ''
  formData.assetId = formData.assetId ?? ''
  
  // Handle specifications - ensure it's an object, not null
  if (!formData.specifications || typeof formData.specifications !== 'object') {
    formData.specifications = {}
  }
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
    modelId: asset.modelId,
    specifications: asset.specifications && typeof asset.specifications === 'object'
      ? cloneJsonLike(asset.specifications as object)
      : undefined
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

const CONDITION_LABEL_MAP: Record<string, string> = {
  NEW: 'New',
  WORKING_CONDITION: 'Working Condition',
  SOFTWARE_ISSUE: 'Software Issue',
  HARDWARE_ISSUE: 'Hardware Issue',
  NEEDS_REPAIR: 'Needs Repair',
  TRASH: 'Trash',
  REFURBISHED: 'Refurbished'
}

const LOCATION_LABEL_MAP: Record<string, string> = {
  PUNE_INVENTORY_CENTER: 'Pune Inventory Center',
  THANE_INVENTORY_CENTER: 'Thane Inventory Center'
}

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

  // Handle condition separately (using friendly label)
  if (asset.condition) {
    selectedCondition.value = {
      id: asset.condition,
      name: CONDITION_LABEL_MAP[asset.condition] || asset.condition,
      value: asset.condition
    }
  }

  // Handle location (now an enum value)
  if (asset.location) {
    selectedLocation.value = {
      id: asset.location,
      name: LOCATION_LABEL_MAP[asset.location] || asset.location,
      value: asset.location
    }
    formData.location = asset.location
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
  
  // Wait for DOM to be updated before applying validation
  await nextTick()
  
  // Set condition as valid since it has a default value
  setFieldValid('condition')
  applyValidationToSearchableDropdown('condition', 'valid')
}

const restoreSpecificationValue = (key: string, value: any, field: SpecField | undefined) => {
  const normalizedValue = value === null || value === undefined ? '' : value

  // Dropdown values are already reconciled in loadAssetTypeTemplate against
  // the template's options (with normalization + legacy fallback). Skipping here
  // prevents overwriting selectedSpecFields with a non-matching item.
  if (field?.type === 'dropdown') {
    return
  }

  if (field?.type === 'textarea') {
    formData.specifications[key] = normalizedValue ?? ''
    return
  }

  if (normalizedValue !== '' && normalizedValue !== undefined && normalizedValue !== null) {
    formData.specifications[key] = normalizedValue
  } else if (field) {
    formData.specifications[key] = ''
  }
}

const restoreSpecifications = (existingSpecs: Record<string, any>) => {
  if (!existingSpecs || typeof existingSpecs !== 'object' || Object.keys(existingSpecs).length === 0) {
    return
  }
  
  console.log('Restoring specifications after template load:', existingSpecs)
  
  for (const key of Object.keys(existingSpecs)) {
    const value = existingSpecs[key]
    const field = specificationFields.value.find(f => f.key === key)
    restoreSpecificationValue(key, value, field)
  }
  
  console.log('Form data specifications after restoration:', formData.specifications)
}

const loadAndRestoreAssetTypeTemplate = async (assetTypeId: number) => {
  const existingSpecs = formData.specifications && typeof formData.specifications === 'object' 
    ? { ...formData.specifications } 
    : {}
  
  console.log('Preserved existing specifications before loading template:', existingSpecs)
  
  await loadAssetTypeTemplate(assetTypeId)
  restoreSpecifications(existingSpecs)
}

const initializeEditMode = async (asset: any) => {
  populateFormDataFromAsset(asset)
  storeOriginalAssetData(asset)
  setUIFormData(asset)
  setSelectedDropdownItems(asset)
  await loadDependentData(asset)

  if (asset.assetType?.id) {
    await loadAndRestoreAssetTypeTemplate(asset.assetType.id)
  }

  // Intentionally do NOT mark pre-populated dropdowns as "valid" here — we want
  // untouched fields to render with a neutral border until the user interacts
  // with them (or until the form is submitted).
  await nextTick()
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
/* Import unified form styles */
@import url('../../assets/unified-form-styles.css');

/* Component-specific responsive adjustments only */
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
