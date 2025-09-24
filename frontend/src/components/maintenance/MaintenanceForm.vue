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
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Loading maintenance data...</p>
            </div>
            
            <!-- Form -->
            <form v-else ref="maintenanceForm" class="needs-validation" @submit.prevent="submitForm" novalidate>
              
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
                      @change="handleAssetChange"
                      @blur="validateFieldInline('assetId')"
                      @focus="clearFieldValidation('assetId')"
                      :disabled="isEditMode"
                    >
                      <option value="">Choose an asset...</option>
                      <option 
                        v-for="asset in availableAssets" 
                        :key="asset.id" 
                        :value="asset.id"
                      >
                        {{ asset.assetId }} - {{ asset.assetName }}
                      </option>
                    </select>
                    <div class="form-text">Select asset that needs maintenance (required)</div>
                    <div v-if="fieldErrors.assetId" class="invalid-feedback">{{ fieldErrors.assetId }}</div>
                  </div>

                  <!-- Asset Information -->
                  <div class="col-md-6">
                    <label for="assetInfo" class="form-label">Asset Information</label>
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
              </fieldset>

              <!-- Section 2: Maintenance Details -->
              <fieldset class="form-fieldset">
                <legend class="form-legend">Maintenance Details</legend>
                <div class="row g-4">
                  <!-- Maintenance Type -->
                  <div class="col-md-6">
                    <label for="maintenanceTypeId" class="form-label">Maintenance Type <span class="text-danger">*</span></label>
                    <select 
                      class="form-select" 
                      id="maintenanceTypeId" 
                      v-model="formData.maintenanceTypeId"
                      :class="getFieldClass('maintenanceTypeId')"
                      required
                      @blur="validateFieldInline('maintenanceTypeId')"
                      @focus="clearFieldValidation('maintenanceTypeId')"
                      @input="handleFieldInput('maintenanceTypeId')"
                    >
                      <option value="">Choose maintenance type...</option>
                      <option 
                        v-for="type in maintenanceTypes" 
                        :key="type.id" 
                        :value="type.id"
                      >
                        {{ type.name }} - {{ type.description }}
                      </option>
                    </select>
                    <div class="form-text">Select the type of maintenance needed (required)</div>
                    <div v-if="fieldErrors.maintenanceTypeId" class="invalid-feedback">{{ fieldErrors.maintenanceTypeId }}</div>
                  </div>

                  <!-- Scheduled Date -->
                  <div class="col-md-6">
                    <label for="scheduledDate" class="form-label">Scheduled Date <span class="text-danger">*</span></label>
                    <input 
                      type="date" 
                      class="form-control" 
                      id="scheduledDate" 
                      v-model="formData.scheduledDate"
                      :class="getFieldClass('scheduledDate')"
                      required
                      @blur="validateFieldInline('scheduledDate')"
                      @focus="clearFieldValidation('scheduledDate')"
                      @input="handleFieldInput('scheduledDate')"
                    >
                    <div class="form-text">Date when maintenance should be performed (required)</div>
                    <div v-if="fieldErrors.scheduledDate" class="invalid-feedback">{{ fieldErrors.scheduledDate }}</div>
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
                      <span class="input-group-text"><i class="bi bi-currency-rupee"></i></span>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="estimatedCost" 
                        v-model="formData.estimatedCost"
                        :class="getFieldClass('estimatedCost')"
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

                  <!-- Vendor Assignment (Optional) -->
                  <div class="col-md-6" v-if="isEditMode">
                    <label for="vendorId" class="form-label">Assigned Vendor <span class="text-muted">(Optional)</span></label>
                    <select 
                      class="form-select" 
                      id="vendorId" 
                      v-model="formData.vendorId"
                      :class="getFieldClass('vendorId')"
                      @blur="validateFieldInline('vendorId')"
                      @focus="clearFieldValidation('vendorId')"
                      @input="handleFieldInput('vendorId')"
                    >
                      <option value="">Select vendor...</option>
                      <option 
                        v-for="vendor in availableVendors" 
                        :key="vendor.id" 
                        :value="vendor.id"
                      >
                        {{ vendor.name }}
                      </option>
                    </select>
                    <div class="form-text">Assign maintenance to a specific vendor</div>
                    <div v-if="fieldErrors.vendorId" class="invalid-feedback">{{ fieldErrors.vendorId }}</div>
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
                <button type="button" class="btn btn-outline-secondary px-4 py-2" @click="goBack">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-warning px-5 py-2" 
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
import { maintenanceService } from '@/services/maintenanceService'
import type { CreateMaintenanceData, UpdateMaintenanceData, Asset, MaintenanceType, Vendor } from '@/services/maintenanceService'
import { showToast, showErrorToast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()

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
const availableAssets = ref<Asset[]>([])
const maintenanceTypes = ref<MaintenanceType[]>([])
const availableVendors = ref<Vendor[]>([])

// Computed properties
const assetInfo = ref('')

// Template refs
const maintenanceForm = ref<HTMLFormElement>()

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

const validateFieldInline = async (fieldName: string) => {
  const value = formData[fieldName as keyof typeof formData]
  const element = document.getElementById(fieldName) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  
  if (!element) return true

  element.setCustomValidity('')

  const isRequired = element.hasAttribute('required')
  
  if (isRequired && (!value || value.toString().trim() === '')) {
    setFieldError(fieldName, '')
    return false
  }

  // Custom validations
  switch (fieldName) {
    case 'scheduledDate':
      if (value) {
        const today = new Date().toISOString().split('T')[0]
        if (value < today) {
          setFieldError(fieldName, 'Maintenance cannot be scheduled in the past')
          return false
        }
      }
      break
    
    case 'frequencyDays':
      if (value && (Number(value) < 1 || Number(value) > 365)) {
        setFieldError(fieldName, 'Frequency must be between 1 and 365 days')
        return false
      }
      break
    
    case 'estimatedCost':
      if (value && (Number(value) < 0 || Number(value) > 100000)) {
        setFieldError(fieldName, 'Estimated cost must be between ₹0 and ₹1,00,000')
        return false
      }
      break
    
    case 'description':
      if (value && typeof value === 'string' && (value.length < 10 || value.length > 1000)) {
        setFieldError(fieldName, 'Description must be between 10 and 1000 characters')
        return false
      }
      break
  }

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
const handleAssetChange = () => {
  const selectedAsset = availableAssets.value.find(asset => asset.id === formData.assetId)
  if (selectedAsset) {
    assetInfo.value = `${selectedAsset.assetType} - ${selectedAsset.brand} ${selectedAsset.model}`
  } else {
    assetInfo.value = ''
  }
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
  textareas.forEach(textarea => {
    if (textarea.value.trim()) {
      resizeTextarea(textarea)
    }
  })
}

const getCounterClass = (length: number, maxLength: number) => {
  const percentage = (length / maxLength) * 100
  if (percentage > 90) return 'text-danger'
  if (percentage > 75) return 'text-warning'
  return 'text-muted'
}

// Data loading
const loadInitialData = async () => {
  isLoading.value = true
  try {
    const [assetsResponse, typesResponse, vendorsResponse] = await Promise.all([
      maintenanceService.getAssets(),
      maintenanceService.getMaintenanceTypes(),
      maintenanceService.getVendors()
    ])

    availableAssets.value = assetsResponse.data.assets
    maintenanceTypes.value = typesResponse.data.maintenanceTypes
    availableVendors.value = vendorsResponse.data.vendors

    // Set default scheduled date to tomorrow
    if (!props.isEditMode) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      formData.scheduledDate = tomorrow.toISOString().split('T')[0]
    }
  } catch (error: any) {
    console.error('Error loading initial data:', error)
    showErrorToast('Failed to load form data. Please try again.')
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
    const selectedAsset = availableAssets.value.find(asset => asset.assetId === maintenance.assetId)
    if (selectedAsset) {
      formData.assetId = selectedAsset.id.toString() // Set the numeric id for the dropdown
      assetInfo.value = `${selectedAsset.assetType} - ${selectedAsset.brand} ${selectedAsset.model}`
    } else {
      console.warn('Asset not found for assetId:', maintenance.assetId)
      formData.assetId = ''
    }

    formData.maintenanceTypeId = maintenance.maintenanceTypeId
    formData.scheduledDate = maintenance.scheduledDate
    formData.frequencyDays = maintenance.frequencyDays
    formData.estimatedCost = maintenance.estimatedCost
    formData.description = maintenance.description
    formData.vendorId = maintenance.vendorId || ''

    // Auto-expand textareas
    nextTick(() => {
      resizeAllTextareas()
    })
  } catch (error: any) {
    console.error('Error loading maintenance data:', error)
    showErrorToast('Failed to load maintenance data. Please try again.')
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
  const requiredFields = ['assetId', 'maintenanceTypeId', 'scheduledDate', 'description']
  const allFields = Object.keys(formData)

  const validationResults = await Promise.all(
    allFields.map((fieldName) => validateFieldInline(fieldName))
  )
  isFormValid = validationResults.every(Boolean)

  if (!isFormValid) {
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
      // Update existing maintenance
      const maintenanceData: UpdateMaintenanceData = {
        assetId: Number(formData.assetId),
        maintenanceType: formData.maintenanceTypeId as 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'UPGRADE',
        scheduledDate: formData.scheduledDate,
        frequencyDays: formData.frequencyDays || undefined,
        estimatedCost: formData.estimatedCost || undefined,
        description: formData.description,
        vendorId: formData.vendorId ? Number(formData.vendorId) : undefined
      }

      await maintenanceService.updateMaintenance(props.maintenanceId, maintenanceData)
      showMaintenanceSuccessToast(generateMaintenanceDetails(), true)
    } else {
      // Create new maintenance
      const maintenanceData: CreateMaintenanceData = {
        assetId: Number(formData.assetId),
        maintenanceType: formData.maintenanceTypeId as 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'UPGRADE',
        scheduledDate: formData.scheduledDate,
        frequencyDays: formData.frequencyDays || undefined,
        estimatedCost: formData.estimatedCost || undefined,
        description: formData.description,
        vendorId: formData.vendorId ? Number(formData.vendorId) : undefined
      }

      await maintenanceService.createMaintenance(maintenanceData)
      showMaintenanceSuccessToast(generateMaintenanceDetails(), false)
    }
    
  } catch (error: any) {
    console.error(`Error ${props.isEditMode ? 'updating' : 'creating'} maintenance:`, error)
    
    let errorMsg = `An error occurred while ${props.isEditMode ? 'updating' : 'scheduling'} the maintenance. Please try again.`
    
    if (error.response?.status === 409) {
      errorMsg = 'Asset is not available for maintenance on the selected date.'
    } else if (error.response?.status === 400) {
      errorMsg = 'Server validation failed. Please check your data and try again.'
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    }
    
    showErrorToast(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

// Helper methods
const generateMaintenanceDetails = () => {
  const selectedAsset = availableAssets.value.find(asset => asset.id === formData.assetId)
  const selectedType = maintenanceTypes.value.find(type => type.id === formData.maintenanceTypeId)
  
  let details = ''
  if (selectedAsset) {
    details += `${selectedAsset.assetId} - ${selectedAsset.assetName}`
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

const showMaintenanceSuccessToast = (details: string, isEdit: boolean) => {
  const message = `
    <div class="mb-3">
      <strong>${details}</strong> has been ${isEdit ? 'updated' : 'scheduled'} successfully!
    </div>
    <div class="d-flex gap-2 justify-content-center">
      <button type="button" class="btn btn-sm btn-warning" onclick="scheduleAnotherMaintenance()">
        ${isEdit ? 'Edit Another' : 'Schedule Another'}
      </button>
      <button type="button" class="btn btn-sm btn-outline-warning" onclick="viewMaintenanceList()">
        View Maintenance
      </button>
    </div>
  `
  
  showToast(message, 'success')
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

// Global functions for toast buttons
;(window as any).scheduleAnotherMaintenance = () => {
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if ((window as any).bootstrap) {
      const toastInstance = (window as any).bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  if (props.isEditMode) {
    router.push('/app/maintenance/schedule')
  } else {
    // Reset form for another entry
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    formData.assetId = ''
    formData.maintenanceTypeId = ''
    formData.scheduledDate = tomorrow.toISOString().split('T')[0]
    formData.frequencyDays = undefined
    formData.estimatedCost = undefined
    formData.description = ''
    formData.vendorId = ''
    
    // Clear validation state
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])
    Object.keys(fieldValidation).forEach(key => delete fieldValidation[key])
    
    formSubmitted.value = false
    assetInfo.value = ''
    
    if (maintenanceForm.value) {
      maintenanceForm.value.classList.remove('was-validated')
    }

    nextTick(() => {
      const fields = document.querySelectorAll('.is-valid, .is-invalid')
      fields.forEach(field => {
        field.classList.remove('is-valid', 'is-invalid')
      })
      
      const textareas = document.querySelectorAll('.auto-expand-textarea') as NodeListOf<HTMLTextAreaElement>
      textareas.forEach(textarea => {
        textarea.style.height = '72px'
      })
      
      const firstField = document.getElementById('assetId')
      if (firstField) firstField.focus()
    })
    
    showToast('Ready to schedule another maintenance!', 'info')
  }
}

;(window as any).viewMaintenanceList = () => {
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if ((window as any).bootstrap) {
      const toastInstance = (window as any).bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  showToast('Redirecting to Maintenance List...', 'info')
  
  setTimeout(() => {
    router.push('/app/maintenance')
  }, 1500)
}

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
    const firstField = document.getElementById('assetId')
    if (firstField) firstField.focus()
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
</style> 