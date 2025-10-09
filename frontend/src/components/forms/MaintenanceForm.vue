<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-header bg-light border-bottom text-center py-3 py-md-4" style="border-radius: 1.5rem 1.5rem 0 0; background: #F3F3F3 !important;">
            <div style="display: block;">
              <h4 class="card-title mb-3 fw-bold text-dark" style="display: block;">
                {{ isEditMode ? 'Edit Maintenance' : 'Schedule Maintenance' }}
              </h4>
              <p class="text-muted mb-0 small" style="display: block;">
                {{ isEditMode ? 'Update maintenance information' : 'Schedule maintenance activity for an asset' }}
              </p>
            </div>
          </div>
          <div class="card-body px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary">
                <output aria-live="polite">Loading...</output>
              </div>
              <p class="mt-3 text-muted">Loading maintenance data...</p>
            </div>
            
            <!-- Form -->
            <form v-else ref="maintenanceForm" class="needs-validation" @submit.prevent="submitForm" @keydown.enter="handleEnterKey" novalidate>
              
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
                      placeholder="Choose an asset..."
                      :items="assetItems"
                      v-model="selectedAssetItem"
                      :required="true"
                      :disabled="isEditMode || isSubmitting"
                      :class="getFieldClass('assetId')"
                      @change="onAssetChange"
                      @validated="() => validateFieldInline('assetId')"
                      />
                    </div>
                    <div class="form-text">Select asset that needs maintenance (required)</div>
                    <div v-if="fieldErrors.assetId" class="invalid-feedback">{{ fieldErrors.assetId }}</div>
                  </div>

                  <!-- Asset Information -->
                  <div class="col-md-6">
                    <label for="assetInfo" class="form-label">Asset Information <span class="text-danger required-placeholder">*</span></label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="assetInfo" 
                      v-model="assetInfo"
                      readonly 
                      style="background-color: #F3F3F3;" 
                      placeholder="Auto-filled from selection"
                    >
                    <div class="form-text">Asset type and brand will appear after selection</div>
                  </div>
                </div>
                
                <!-- Asset Specifications - Moved here from Maintenance Details -->
                <div v-if="selectedAssetSpecs" class="row g-4 mt-3">
                  <div class="col-12">
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
                </div>
              </fieldset>

              <!-- Section 2: Maintenance Details -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Maintenance Details</legend>
                <div class="row g-4">
                  <!-- Maintenance Type -->
                  <div class="col-md-6">
                    <div class="form-searchable-dropdown">
                      <SearchableDropdown
                      id="maintenanceTypeId"
                      label="Maintenance Type"
                      placeholder="Choose maintenance type..."
                      :items="maintenanceTypeItems"
                      v-model="selectedTypeItem"
                      :required="true"
                      :disabled="isSubmitting"
                      :class="getFieldClass('maintenanceTypeId')"
                      @change="onTypeChange"
                      @validated="() => validateFieldInline('maintenanceTypeId')"
                      />
                    </div>
                    <div class="form-text">Select the type of maintenance needed (required)</div>
                    <div v-if="fieldErrors.maintenanceTypeId" class="invalid-feedback">{{ fieldErrors.maintenanceTypeId }}</div>
                  </div>

                  <!-- Scheduled Date -->
                  <div class="col-md-6">
                    <DatePicker
                      :inputId="'scheduledDate'"
                      label="Scheduled Date *"
                      v-model="formData.scheduledDate"
                      :inputClass="getFieldClass('scheduledDate')"
                      :error-message="fieldErrors.scheduledDate"
                      help-text="Date when maintenance should be performed (required)"
                      :disabled="isSubmitting"
                      required
                      @change="validateFieldInline('scheduledDate')"
                      @blur="validateFieldInline('scheduledDate')"
                    />
                  </div>

                  <!-- Frequency -->
                  <div class="col-md-6">
                    <label for="frequencyDays" class="form-label">Frequency <span class="text-muted">(Optional)</span></label>
                    <div class="input-group">
                      <input 
                        type="number" 
                        class="form-control" 
                        id="frequencyDays" 
                        v-model="formData.frequencyDays"
                        :class="getFieldClass('frequencyDays')"
                        :disabled="isSubmitting"
                        placeholder="30" 
                        min="1" 
                        max="365"
                        @blur="validateFieldInline('frequencyDays')"
                        @focus="clearFieldValidation('frequencyDays')"
                        @input="handleFieldInput('frequencyDays')"
                      >
                      <span class="input-group-text">days</span>
                    </div>
                    <div class="form-text">Repeat every X days (e.g., 30 = monthly). Leave empty for one-time maintenance</div>
                    <div v-if="fieldErrors.frequencyDays" class="invalid-feedback">{{ fieldErrors.frequencyDays }}</div>
                  </div>

                  <!-- Estimated Cost -->
                  <div class="col-md-6">
                    <label for="estimatedCost" class="form-label">Estimated Cost <span class="text-muted">(Optional)</span></label>
                    <div class="input-group">
                      <span class="input-group-text">₹</span>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="estimatedCost" 
                        v-model="formData.estimatedCost"
                        :class="getFieldClass('estimatedCost')"
                        :disabled="isSubmitting"
                        placeholder="0.00" 
                        step="0.01" 
                        min="0" 
                        max="100000"
                        @blur="validateFieldInline('estimatedCost')"
                        @focus="clearFieldValidation('estimatedCost')"
                        @input="handleFieldInput('estimatedCost')"
                      >
                    </div>
                    <div class="form-text">Estimated cost for this maintenance activity (max ₹1,00,000)</div>
                    <div v-if="fieldErrors.estimatedCost" class="invalid-feedback">{{ fieldErrors.estimatedCost }}</div>
                  </div>

                  



                  <!-- Description -->
                  <div class="col-12">
                    <label for="description" class="form-label">
                      Maintenance Description <span class="text-danger">*</span>
                    </label>
                    <textarea 
                      class="form-control auto-expand-textarea" 
                      id="description" 
                      v-model="formData.description"
                      :class="getFieldClass('description')"
                      :disabled="isSubmitting"
                      rows="3" 
                      placeholder="Describe the maintenance activity, any special requirements, or known issues..." 
                      maxlength="1000" 
                      required 
                      minlength="10"
                      @input="autoExpandTextarea"
                      @blur="validateFieldInline('description')"
                      @focus="clearFieldValidation('description')"
                      style="white-space: pre-wrap; overflow-wrap: break-word;"
                    ></textarea>
                    <div class="form-text">
                      Describe what maintenance is needed, any special requirements, or known issues (10-1000 characters, required)
                    </div>
                    <div class="character-count text-end">
                      <small :class="getCounterClass(formData.description?.length || 0, 1000)">
                        {{ formData.description?.length || 0 }}/1000 characters
                      </small>
                    </div>
                    <div v-if="fieldErrors.description" class="invalid-feedback">{{ fieldErrors.description }}</div>
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
                  class="btn btn-cancel px-4 py-2" 
                  @click="goBack"
                  :disabled="isSubmitting || isLoading"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-orange px-5 py-2" 
                  :disabled="isSubmitting || isLoading"
                  @click="submitForm"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin me-2"></i>
                  {{ isSubmitting ? (isEditMode ? 'Updating...' : 'Scheduling...') : (isEditMode ? 'Update Maintenance' : 'Schedule Maintenance') }}
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
import { maintenanceService } from '@/services/business/maintenanceService'
import type { CreateMaintenanceData, UpdateMaintenanceData, MaintenanceType } from '@/services/business/maintenanceService'
import { useToastStore } from '@/stores/toast'
import SearchableDropdown, { type Item } from '@/components/common/SearchableDropdown.vue'
import { assetApiService, type Asset as AssetApiAsset } from '@/services/api/assetApi'
import NotesTextarea from '@/components/common/NotesTextarea.vue'
import DatePicker from '@/components/ui/date/DatePicker.vue'
import { formatDateForInput } from '@/utils/date'

// Alias for form field elements to improve readability and reuse
type FormFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Type aliases
type MaintenanceTypeLiteral = 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'UPGRADE'

// Props
interface Props {
  isEditMode?: boolean
  maintenanceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  maintenanceId: undefined
})

// Form data
const formData = reactive({
  assetId: '',
  maintenanceTypeId: '',
  scheduledDate: '',
  frequencyDays: undefined as number | undefined,
  estimatedCost: undefined as number | undefined,
  description: '',
  vendorId: ''
})

// Form state
const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({})
const isSubmitting = ref(false)
const isLoading = ref(false)
const formSubmitted = ref(false)

// Data sources
const availableAssets = ref<AssetApiAsset[]>([])
const maintenanceTypes = ref<MaintenanceType[]>([])
// Vendors removed

// Computed properties
const assetInfo = ref('')

// Template refs
const maintenanceForm = ref<HTMLFormElement>()

// SearchableDropdown adapters
const assetItems = computed<Item[]>(() =>
  availableAssets.value.map(a => ({
    id: a.id.toString(),
    name: `${a.assetId}${a.serialNumber ? ' - ' + a.serialNumber : ''}`.trim(),
    value: a.id.toString()
  }))
)
const maintenanceTypeItems = computed<Item[]>(() =>
  maintenanceTypes.value.map(t => ({ id: t.id, name: `${t.name} - ${t.description}`, value: t.id }))
)
// Vendor items removed

const selectedAssetItem = ref<Item | null>(null)
const selectedTypeItem = ref<Item | null>(null)
// Vendor selection removed

// Tracks if asset was preselected via reschedule flow
const preselectedAsset = ref(false)

// Selected asset details for display
const selectedAssetDetails = reactive({
  serialNumber: '',
  condition: '',
  location: '',
  notes: '',
  brandModel: '',
  assetType: '',
  assetCategory: '',
  vendor: '',
  purchaseDate: '',
  purchaseCost: '',
  warrantyStartDate: '',
  warrantyEndDate: ''
})
const selectedAssetSpecs = ref<string | null>(null)

const onAssetChange = (item: Item | null) => {
  formData.assetId = (item?.value as string) || ''
  handleAssetChange()
  // Load full asset details for display
  if (formData.assetId) {
    const assetDbId = Number.parseInt(formData.assetId)
    if (!Number.isNaN(assetDbId)) {
      loadAssetDetails(assetDbId)
    }
  } else {
    clearAssetDetails()
  }
}

const onTypeChange = async (item: Item | null) => {
  formData.maintenanceTypeId = (item?.value as string) || ''
  handleFieldInput('maintenanceTypeId')
  await nextTick()
  validateFieldInline('maintenanceTypeId')
}

// Vendor change handler removed

const clearAssetDetails = () => {
  selectedAssetDetails.serialNumber = ''
  selectedAssetDetails.condition = ''
  selectedAssetDetails.location = ''
  selectedAssetDetails.notes = ''
  selectedAssetDetails.brandModel = ''
  selectedAssetDetails.assetType = ''
  selectedAssetDetails.assetCategory = ''
  selectedAssetDetails.vendor = ''
  selectedAssetDetails.purchaseDate = ''
  selectedAssetDetails.purchaseCost = ''
  selectedAssetDetails.warrantyStartDate = ''
  selectedAssetDetails.warrantyEndDate = ''
  selectedAssetSpecs.value = null
}

// Helper function to parse asset specifications
const parseAssetSpecs = (specs: any): string | null => {
  if (!specs) {
    return null
  }
  
  if (typeof specs === 'object') {
    return formatSpecsObject(specs)
  }
  
  if (typeof specs === 'string') {
    return parseSpecsString(specs)
  }
  
  return null
}

// Helper function to format specs object into display string
const formatSpecsObject = (specs: Record<string, any>): string => {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
}

// Helper function to parse specs string (may be JSON)
const parseSpecsString = (specs: string): string => {
  try {
    const parsed = JSON.parse(specs)
    if (parsed && typeof parsed === 'object') {
      return formatSpecsObject(parsed)
    }
  } catch {
    // If parsing fails, return the string as-is
  }
  return specs
}

// Helper function to populate asset details from API response
const populateAssetDetails = (asset: any) => {
  selectedAssetDetails.serialNumber = asset.serialNumber || ''
  selectedAssetDetails.condition = asset.condition || ''
  selectedAssetDetails.location = asset.location || ''
  selectedAssetDetails.notes = asset.notes || ''
  selectedAssetDetails.brandModel = asset.brand && asset.model ? `${asset.brand.name} ${asset.model.name}` : ''
  selectedAssetDetails.assetType = asset.assetType?.name || ''
  selectedAssetDetails.assetCategory = asset.assetType?.category?.name || ''
  selectedAssetDetails.vendor = asset.vendor?.name || ''
  selectedAssetDetails.purchaseDate = asset.purchaseDate || ''
  selectedAssetDetails.purchaseCost = asset.purchaseCost ? String(asset.purchaseCost) : ''
  selectedAssetDetails.warrantyStartDate = asset.warrantyStartDate || ''
  selectedAssetDetails.warrantyEndDate = asset.warrantyEndDate || ''
  selectedAssetSpecs.value = parseAssetSpecs(asset.model?.specifications)
}

const loadAssetDetails = async (assetIdNumber: number) => {
  try {
    const response = await assetApiService.getAssetById(assetIdNumber)
    const asset = response.data.asset
    
    if (asset) {
      populateAssetDetails(asset)
    } else {
      clearAssetDetails()
    }
  } catch (error) {
    console.error('Error loading asset details:', error)
    clearAssetDetails()
  }
}

// Validation system
const getFieldClass = (fieldName: string) => {
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return {}
  }
  
  return {
    'is-valid': fieldValidation[fieldName] === true,
    'is-invalid': fieldValidation[fieldName] === false || fieldErrors[fieldName]
  }
}

// Field-specific validators returning an error message or null when valid
const fieldValidators: Record<string, (value: unknown) => string | null> = {
  scheduledDate: (value: unknown) => {
    if (!value) return null
    const today = new Date().toISOString().split('T')[0]
    return (String(value) < today) ? 'Maintenance cannot be scheduled in the past' : null
  },
  frequencyDays: (value: unknown) => {
    if (value === undefined || value === null || String(value) === '') return null
    const num = Number(value)
    return (num < 1 || num > 365) ? 'Frequency must be between 1 and 365 days' : null
  },
  estimatedCost: (value: unknown) => {
    if (value === undefined || value === null || String(value) === '') return null
    const num = Number(value)
    return (num < 0 || num > 100000) ? 'Estimated cost must be between ₹0 and ₹1,00,000' : null
  },
  description: (value: unknown) => {
    if (!value || typeof value !== 'string') return null
    const len = value.length
    return (len < 10 || len > 1000) ? 'Description must be between 10 and 1000 characters' : null
  }
}

const validateFieldInline = async (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as FormFieldElement
  
  if (!element) return true

  // Guard: only call on native controls
  if ('setCustomValidity' in element && typeof (element as any).setCustomValidity === 'function') {
    ;(element as any).setCustomValidity('')
  }

  const isRequired = element.hasAttribute('required')
  const isEmpty = value === undefined || value === null || value.toString().trim() === ''
  if (isRequired && isEmpty) {
    setFieldError(fieldName, '')
    return false
  }

  const validator = fieldValidators[fieldName]
  if (validator) {
    const message = validator(value)
    if (message) {
      setFieldError(fieldName, message)
      return false
    }
  }

  if ('checkValidity' in element && typeof (element as any).checkValidity === 'function') {
    if ((element as any).checkValidity()) {
      setFieldValid(fieldName)
      return true
    }
    setFieldError(fieldName, (element as any).validationMessage || `${getFieldDisplayName(fieldName)} is invalid`)
    return false
  }

  // Non-native elements: treat as valid if our custom validation passed
  setFieldValid(fieldName)
  return true
}

const setFieldError = (fieldName: string, message: string) => {
  fieldErrors[fieldName] = message
  fieldValidation[fieldName] = false
  
  const element = document.getElementById(fieldName) as FormFieldElement
  if (element && 'setCustomValidity' in element && typeof (element as any).setCustomValidity === 'function') {
    ;(element as any).setCustomValidity(message)
  }
}

const setFieldValid = (fieldName: string) => {
  delete fieldErrors[fieldName]
  fieldValidation[fieldName] = true
  
  const element = document.getElementById(fieldName) as FormFieldElement
  if (element && 'setCustomValidity' in element && typeof (element as any).setCustomValidity === 'function') {
    ;(element as any).setCustomValidity('')
  }
}

const clearFieldValidation = (fieldName: string) => {
  if (fieldValidation[fieldName] === false) {
    fieldValidation[fieldName] = null
    delete fieldErrors[fieldName]
  }
}

const handleFieldInput = (fieldName: string) => {
  if (fieldValidation[fieldName] === false && formData[fieldName as keyof typeof formData]?.toString().trim()) {
    validateFieldInline(fieldName)
  }
}

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    assetId: 'Asset ID',
    maintenanceTypeId: 'Maintenance Type',
    scheduledDate: 'Scheduled Date',
    frequencyDays: 'Frequency',
    estimatedCost: 'Estimated Cost',
    description: 'Description',
    vendorId: 'Vendor'
  }
  return displayNames[fieldName] || fieldName
}

// Asset handling
const handleAssetChange = async () => {
  const selectedAsset = availableAssets.value.find(asset => asset.id.toString() === formData.assetId)
  if (selectedAsset) {
    const typeName = selectedAsset.assetType?.name || ''
    const brandName = selectedAsset.brand?.name || ''
    const modelName = selectedAsset.model?.name || ''
    const brandModel = [brandName, modelName].filter(Boolean).join(' ')
    assetInfo.value = [typeName, brandModel].filter(Boolean).join(' - ')
  } else {
    assetInfo.value = ''
  }
  await nextTick()
  validateFieldInline('assetId')
}

// Auto-expanding textarea functionality
const autoExpandTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  resizeTextarea(textarea)
}

const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  if (!textarea) return
  
  textarea.style.height = 'auto'
  const newHeight = Math.max(textarea.scrollHeight, 72)
  textarea.style.height = newHeight + 'px'
}

const resizeAllTextareas = () => {
  const textareas = document.querySelectorAll('.auto-expand-textarea') as NodeListOf<HTMLTextAreaElement>
  for (const textarea of textareas) {
    if (textarea.value.trim()) {
      resizeTextarea(textarea)
    }
  }
}

const getCounterClass = (length: number, maxLength: number) => {
  const percentage = (length / maxLength) * 100
  if (percentage > 90) return 'text-danger'
  if (percentage > 75) return 'text-warning'
  return 'text-muted'
}

// Helper function to find asset by assetId, with fallback fetch if needed
const findAssetByExternalId = async (assetId: string): Promise<AssetApiAsset | null> => {
  let match = availableAssets.value.find(a => a.assetId === assetId)
  
  if (match) {
    return match
  }
  
  // Asset may not be in the AVAILABLE-filtered list; fetch from general assets and merge
  try {
    const resp = await assetApiService.getAssets({ search: assetId, limit: 5 }) as any
    const found = (resp?.data?.assets || resp?.data?.data?.assets || []).find((a: any) => a.assetId === assetId)
    
    if (found && !availableAssets.value.some(a => a.id === found.id)) {
      availableAssets.value = [found, ...availableAssets.value]
    }
    
    return found || null
  } catch {
    return null
  }
}

// Helper function to preselect asset from query parameter
const preselectAssetFromQuery = async () => {
  const preselectExternalAssetId = (route.query.assetId as string) || ''
  if (!preselectExternalAssetId) {
    return
  }
  
  const match = await findAssetByExternalId(preselectExternalAssetId)
  if (!match) {
    return
  }
  
  const item = { 
    id: match.id.toString(), 
    name: `${match.assetId}${match.serialNumber ? ' - ' + match.serialNumber : ''}`.trim(), 
    value: match.id.toString() 
  } as Item
  
  selectedAssetItem.value = item
  formData.assetId = match.id.toString()
  await nextTick()
  onAssetChange(item)
  preselectedAsset.value = true
  delete fieldErrors.assetId
  fieldValidation.assetId = true
  await nextTick()
  validateFieldInline('assetId')
}

// Helper function to preselect maintenance type from query parameter
const preselectMaintenanceTypeFromQuery = async () => {
  const qsTypeId = (route.query.maintenanceTypeId as string) || ''
  const qsTypeName = (route.query.maintenanceTypeName as string) || ''
  
  if (!qsTypeId && !qsTypeName) {
    return
  }
  
  const typeMatch = maintenanceTypes.value.find(t => 
    (qsTypeId && t.id === qsTypeId) || 
    (qsTypeName && t.name.toLowerCase() === qsTypeName.toLowerCase())
  )
  
  if (!typeMatch) {
    return
  }
  
  const typeItem = { 
    id: typeMatch.id, 
    name: `${typeMatch.name} - ${typeMatch.description}`, 
    value: typeMatch.id 
  } as Item
  
  selectedTypeItem.value = typeItem
  formData.maintenanceTypeId = typeMatch.id
  await nextTick()
  onTypeChange(typeItem)
  delete fieldErrors.maintenanceTypeId
  fieldValidation.maintenanceTypeId = true
}

// Helper function to set default scheduled date
const setDefaultScheduledDate = () => {
  if (props.isEditMode) {
    return
  }
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  formData.scheduledDate = tomorrow.toISOString().split('T')[0]
}

// Data loading
const loadInitialData = async () => {
  isLoading.value = true
  try {
    const [assetsDropdownResponse, typesResponse] = await Promise.all([
      assetApiService.getAssetsForDropdowns(props.isEditMode ? {} : { status: 'AVAILABLE' }),
      maintenanceService.getMaintenanceTypes()
    ])

    availableAssets.value = assetsDropdownResponse.data.assets
    maintenanceTypes.value = typesResponse.data.maintenanceTypes
    
    // Handle query parameter preselections
    await preselectAssetFromQuery()
    await preselectMaintenanceTypeFromQuery()
    setDefaultScheduledDate()
  } catch (error: any) {
    console.error('Error loading initial data:', error)
    toastStore.showError('Error', 'Failed to load form data. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Load maintenance data for editing
const loadMaintenanceData = async () => {
  if (!props.isEditMode || !props.maintenanceId) return

  try {
    const response = await maintenanceService.getMaintenance(props.maintenanceId)
    const maintenance = response.data.maintenance

    // Find the asset by assetId string to get the numeric id
    let selectedAsset = availableAssets.value.find(asset => asset.assetId === maintenance.assetId)
    if (!selectedAsset) {
      // Fallback: query main assets endpoint by search string
      try {
        const listResp = await assetApiService.getAssets({ search: maintenance.assetId, limit: 5 }) as any
        const found = (listResp?.data?.assets || listResp?.data?.data?.assets || []).find((a: any) => a.assetId === maintenance.assetId)
        if (found) {
          selectedAsset = found
          if (!availableAssets.value.some(a => a.id === found.id)) {
            availableAssets.value = [found, ...availableAssets.value]
          }
        }
      } catch (error) {
        console.debug('Fallback search for asset by assetId failed', error)
      }
    }
    if (selectedAsset) {
      formData.assetId = selectedAsset.id.toString() // Set the numeric id for the dropdown
      const item = { id: selectedAsset.id.toString(), name: `${selectedAsset.assetId}${selectedAsset.serialNumber ? ' - ' + selectedAsset.serialNumber : ''}`.trim(), value: selectedAsset.id.toString() } as Item
      selectedAssetItem.value = item
      await nextTick()
      onAssetChange(item)
      delete fieldErrors.assetId
      fieldValidation.assetId = true
    } else {
      console.warn('Asset not found for assetId:', maintenance.assetId)
      formData.assetId = ''
    }

    formData.maintenanceTypeId = maintenance.maintenanceTypeId
    // Preselect maintenance type item in dropdown
    const typeMatch = maintenanceTypes.value.find(t => t.id === maintenance.maintenanceTypeId)
    if (typeMatch) {
      const typeItem = { id: typeMatch.id, name: `${typeMatch.name} - ${typeMatch.description}`, value: typeMatch.id } as Item
      selectedTypeItem.value = typeItem
      await nextTick()
      onTypeChange(typeItem)
      delete fieldErrors.maintenanceTypeId
      fieldValidation.maintenanceTypeId = true
    }
    // Vendor selection removed
    formData.scheduledDate = formatDateForInput(maintenance.scheduledDate)
    formData.frequencyDays = maintenance.frequencyDays
    formData.estimatedCost = maintenance.estimatedCost
    formData.description = maintenance.description
    // vendorId removed

    // Auto-expand textareas
    nextTick(() => {
      resizeAllTextareas()
    })
  } catch (error: any) {
    console.error('Error loading maintenance data:', error)
    toastStore.showError('Error', 'Failed to load maintenance data. Please try again.')
    router.push('/app/maintenance')
  }
}

// Form submission
const submitForm = async (event?: Event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  formSubmitted.value = true

  // Validate all fields
  let isFormValid = true
  const allFields = Object.keys(formData)

  const validationResults = await Promise.all(
    allFields.map((fieldName) => validateFieldInline(fieldName))
  )
  isFormValid = validationResults.every(Boolean)

  if (isFormValid === false) {
    if (maintenanceForm.value) {
      maintenanceForm.value.classList.add('was-validated')
    }

    await nextTick()
    scrollToFirstError()
    return
  }

  isSubmitting.value = true

  try {
    if (props.isEditMode && props.maintenanceId) {
      const payload: UpdateMaintenanceData = {
        assetId: Number(formData.assetId),
        maintenanceType: formData.maintenanceTypeId as MaintenanceTypeLiteral,
        scheduledDate: formData.scheduledDate,
        frequencyDays: formData.frequencyDays || undefined,
        estimatedCost: formData.estimatedCost || undefined,
        description: formData.description
      }
      await maintenanceService.updateMaintenance(props.maintenanceId, payload)
      const successMessage = generateMaintenanceDetails()
      router.push('/app/maintenance?refreshStats=true')
      setTimeout(() => {
        toastStore.showSuccess('Success', `${successMessage} has been updated successfully!`)
      }, 100)
    } else {
      const payload: CreateMaintenanceData = {
        assetId: Number(formData.assetId),
        maintenanceType: formData.maintenanceTypeId as MaintenanceTypeLiteral,
        scheduledDate: formData.scheduledDate,
        frequencyDays: formData.frequencyDays || undefined,
        estimatedCost: formData.estimatedCost || undefined,
        description: formData.description
      }
      await maintenanceService.createMaintenance(payload)
      const successMessage = generateMaintenanceDetails()
      router.push('/app/maintenance?refreshStats=true')
      setTimeout(() => {
        toastStore.showSuccess('Success', `${successMessage} has been scheduled successfully!`)
      }, 100)
    }
    
  } catch (error: any) {
    console.error(`Error ${props.isEditMode ? 'updating' : 'creating'} maintenance:`, error)
    
    const defaultMsg = `An error occurred while ${props.isEditMode ? 'updating' : 'scheduling'} the maintenance. Please try again.`
    const statusToMessage: Record<number, string> = {
      409: 'Asset is not available for maintenance on the selected date.',
      400: 'Server validation failed. Please check your data and try again.'
    }
    const status = error.response?.status as number | undefined
    const mapped = (typeof status === 'number') ? statusToMessage[status] : undefined
    const serverMsg = error.response?.data?.message as string | undefined
    const errorMsg = mapped || serverMsg || defaultMsg
    
    toastStore.showError('Error', errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

// Helper methods
const generateMaintenanceDetails = () => {
  const selectedAsset = availableAssets.value.find(asset => asset.id.toString() === formData.assetId)
  const selectedType = maintenanceTypes.value.find(type => type.id === formData.maintenanceTypeId)
  
  let details = ''
  if (selectedAsset) {
    const assetName = selectedAsset.model?.name || ''
    details += `${selectedAsset.assetId}${assetName ? ' - ' + assetName : ''}`
  }
  if (selectedType) {
    details += ` - ${selectedType.name} maintenance`
  }
  if (formData.scheduledDate) {
    const formattedDate = new Date(formData.scheduledDate).toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
    details += ` on ${formattedDate}`
  }
  
  return details || 'Maintenance'
}


const goBack = () => {
  router.push('/app/maintenance')
}

const scrollToFirstError = () => {
  const firstInvalid = document.querySelector('.is-invalid, :invalid') as HTMLElement
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

// Keyboard navigation handler
const handleEnterKey = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement
  
  // Don't submit if user is in a textarea (allow Enter for new lines)
  if (target.tagName === 'TEXTAREA') {
    return
  }
  
  // Don't submit if user is in a dropdown (allow Enter to select)
  if (target.classList.contains('searchable-dropdown-input')) {
    return
  }
  
  // Prevent default Enter behavior
  event.preventDefault()
  
  // If it's the last field or submit button, submit the form
  const form = maintenanceForm.value
  if (!form) return
  
  const focusableElements = form.querySelectorAll(
    'input:not([readonly]):not([disabled]), select:not([disabled]), textarea:not([readonly]):not([disabled]), button:not([disabled])'
  ) as NodeListOf<HTMLElement>
  
  const currentIndex = Array.from(focusableElements).indexOf(target)
  const isLastField = currentIndex === focusableElements.length - 1
  
  if (isLastField || (target as HTMLInputElement).type === 'submit' || target.classList.contains('btn-orange')) {
    // Submit the form
    submitForm()
  } else {
    // Move to next field
    const nextElement = focusableElements[currentIndex + 1]
    if (nextElement) {
      nextElement.focus()
    }
  }
}

// Removed global functions - no longer needed with simple toast notifications

// Removed global functions for toast buttons - using simple toast notifications

// Watchers for textarea auto-expansion
watch(() => formData.description, (newValue) => {
  if (newValue) {
    nextTick(() => {
      const textarea = document.getElementById('description') as HTMLTextAreaElement
      if (textarea) {
        resizeTextarea(textarea)
      }
    })
  }
})

// Lifecycle
onMounted(async () => {
  await loadInitialData()
  if (props.isEditMode) {
    await loadMaintenanceData()
  }
  
  // Focus on first field
  nextTick(() => {
    if (preselectedAsset.value) {
      // When asset is preselected, focus on maintenance type (first field in Maintenance Details section)
      const nextField = document.getElementById('maintenanceTypeId') as HTMLElement | null
      if (nextField) nextField.focus()
    } else {
      const firstField = document.getElementById('assetId') as HTMLElement | null
      if (firstField) firstField.click()
    }
  })
})
</script>

<style scoped>
/* Import unified form styles (replaces old formValidation.css) */
@import url('../../assets/unified-form-styles.css');

/* Additional component-specific styles */
.auto-expand-textarea {
  transition: height 0.2s ease, border-color 0.2s ease;
  resize: none;
  overflow: hidden;
  min-height: 72px;
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

/* Reserve space for required asterisk on non-required labels to align rows */
.required-placeholder {
  visibility: hidden;
  display: inline-block;
  width: 0.5ch;
}

/* Standardize label sizes across this form */
.form-label {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #666666 !important;
}

:deep(.searchable-dropdown-wrapper .form-label) {
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: #666666 !important;
}

/* Normalize required asterisk in labels so headings look consistent */
.form-label .text-danger {
  font-weight: 600 !important; /* match label */
  font-size: 1em !important;  /* same size as label text */
}

:deep(.searchable-dropdown-wrapper .form-label .text-danger) {
  font-weight: 600 !important;
  font-size: 1em !important;
}

/* Using unified-form-styles for control sizing; no local height overrides */

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
/* Validation styles removed; using unified-form-styles.css */

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

/* Input group styling */
.input-group .input-group-text {
  background-color: #F3F3F3 !important;
  border: 2px solid #999999 !important;
  color: #666666 !important;
  font-weight: 600 !important;
}

.input-group .form-control {
  border-left: none !important;
}

.input-group .input-group-text:first-child {
  border-right: none !important;
  border-radius: 0.5rem 0 0 0.5rem !important;
}

.input-group .form-control:last-child {
  border-radius: 0 0.5rem 0.5rem 0 !important;
}

.input-group .form-control:first-child {
  border-right: none !important;
  border-radius: 0.5rem 0 0 0.5rem !important;
}

.input-group .input-group-text:last-child {
  border-left: none !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
}

/* Focus states for input groups */
.input-group:focus-within .input-group-text {
  border-color: #331FEA !important;
}

.input-group:focus-within .form-control {
  border-color: #331FEA !important;
}

/* Form labels - styles moved to unified-form-styles.css */

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

.btn-warning {
  background-color: #FF8C61 !important;
  border-color: #FF8C61 !important;
  color: #FFFFFF !important;
}

.btn-warning:hover {
  background-color: #e67d4d !important;
  border-color: #e67d4d !important;
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
</style> 