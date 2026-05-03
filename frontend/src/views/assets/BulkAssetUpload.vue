<template>
  <div>
    <!-- Asset Type Selection Modal (Step 1) -->
    <div class="modal fade" id="assetTypeSelectionModal" tabindex="-1" aria-labelledby="assetTypeSelectionModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="assetTypeSelectionModalLabel">
              <i class="fas fa-layer-group me-2"></i>Select Asset Type for Bulk Upload
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted mb-3">
              <i class="fas fa-info-circle me-1"></i>
              Choose the asset type to generate a customized upload template with the correct columns and specifications.
            </p>
            
            <!-- Asset Type Dropdown -->
            <div class="form-group">
              <label for="assetTypeSelect" class="form-label">Asset Type <span class="text-danger">*</span></label>
              <SearchableDropdown
                id="assetTypeSelect"
                label=""
                placeholder="Search and select asset type..."
                :items="assetTypeItems"
                v-model="selectedAssetType"
                :required="true"
              />
              <small class="text-muted">
                The template will include standard fields plus type-specific specifications
              </small>
            </div>

            <!-- Loading State -->
            <div v-if="isLoadingAssetType" class="text-center mt-3">
              <i class="fas fa-spinner fa-spin me-2"></i>Loading asset type details...
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-cancel btn-sm" data-bs-dismiss="modal">
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-purple btn-sm" 
              :disabled="!selectedAssetType || isLoadingAssetType"
              @click="proceedToBulkUpload"
            >
              <i class="fas fa-arrow-right me-2"></i>
              Continue to Upload
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Asset-specific Bulk Upload Modal (Step 2) -->
    <BulkUploadModal
      ref="bulkUploadModalRef"
      modal-id="bulkUploadAssetsModal"
      title="Bulk Upload Assets"
      entity-name="Assets"
      :columns="dynamicColumns"
      :template-data="templateSampleRows"
      upload-button-text="Upload Assets"
      :always-validate="true"
      :helper-notes="helperNotes"
      @upload="handleBulkUpload"
      @validate="handleValidation"
      @template-download="handleTemplateDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import BulkUploadModal from '@/components/modals/BulkUploadModal.vue'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import { assetService } from '@/services/business/assetService'
import { assetTypeService } from '@/services/api/assetTypeService'
import { useToastStore } from '@/stores/toast'
import type { AssetType } from '@/services/api/assetTypeService'

// Refs
const bulkUploadModalRef = ref()
const toastStore = useToastStore()
const assetTypes = ref<AssetType[]>([])
const selectedAssetType = ref<any>(null)
const selectedAssetTypeDetails = ref<AssetType | null>(null)
const isLoadingAssetType = ref(false)

// Base asset columns (always present)
const baseAssetColumns = [
  { key: 'assetId', label: 'Asset ID', required: true },
  { key: 'serialNumber', label: 'Serial Number', required: true },
  { key: 'assetTypeId', label: 'Asset Type ID', required: true },
  { key: 'brandId', label: 'Brand ID', required: true },
  { key: 'modelId', label: 'Model ID', required: true },
  { key: 'vendorId', label: 'Vendor ID', required: false },
  { key: 'status', label: 'Status', required: true },
  { key: 'condition', label: 'Condition', required: true },
  { key: 'location', label: 'Location', required: true },
  { key: 'purchaseDate', label: 'Purchase Date (DD-MM-YYYY)', required: false },
  { key: 'purchaseCost', label: 'Purchase Cost', required: false },
  { key: 'warrantyStartDate', label: 'Warranty Start Date (DD-MM-YYYY)', required: false },
  { key: 'warrantyEndDate', label: 'Warranty End Date (DD-MM-YYYY)', required: false },
  { key: 'notes', label: 'Notes', required: false }
]

// Dynamic columns based on selected asset type
const dynamicColumns = computed(() => {
  const columns = [...baseAssetColumns]
  
  // Add specification columns if asset type has a specification template
  if (selectedAssetTypeDetails.value?.specificationTemplate?.fields) {
    const specFields = selectedAssetTypeDetails.value.specificationTemplate.fields
    
    for (const field of specFields) {
      columns.push({
        key: `spec_${field.key}`,
        label: field.label,
        required: field.required || false
      })
    }
  }
  
  return columns
})

// Helper notes for the upload modal
const helperNotes = computed(() => {
  const notes = [
    'Asset Type ID must match the selected asset type: ' + (selectedAssetTypeDetails.value?.id || 'N/A'),
    'Status values: NON_ASSIGNED (Note: only NON_ASSIGNED is allowed for bulk upload)',
    'Condition values: NEW, WORKING_CONDITION, SOFTWARE_ISSUE, HARDWARE_ISSUE, NEEDS_REPAIR, TRASH, REFURBISHED',
    'Location values: PUNE_INVENTORY_CENTER, THANE_INVENTORY_CENTER',
    'Date format: DD-MM-YYYY (e.g., 15-01-2024)',
    'IDs (assetTypeId, brandId, modelId, vendorId) must be valid numeric IDs from the system'
  ]
  
  if (selectedAssetTypeDetails.value?.specificationTemplate?.fields) {
    const specFields = selectedAssetTypeDetails.value.specificationTemplate.fields
    const specFieldNames = specFields.map((f: any) => f.label).join(', ')
    notes.push(`Specification fields for ${selectedAssetTypeDetails.value.name}: ${specFieldNames}`)
  }
  
  return notes
})

// Sample row used in template downloads to show acceptable values
const templateSampleRows = computed(() => {
  const sample: Record<string, string> = {
    assetId: 'AST-1001',
    serialNumber: 'SN-1001-EXAMPLE',
    assetTypeId: String(selectedAssetTypeDetails.value?.id ?? ''),
    brandId: '1',
    modelId: '1',
    vendorId: '',
    status: 'NON_ASSIGNED',
    condition: 'NEW',
    location: 'PUNE_INVENTORY_CENTER',
    purchaseDate: '15-01-2024',
    purchaseCost: '50000',
    warrantyStartDate: '15-01-2024',
    warrantyEndDate: '15-01-2027',
    notes: 'Example asset',
  }

  // Provide blank placeholders for any specification columns
  if (selectedAssetTypeDetails.value?.specificationTemplate?.fields) {
    for (const field of selectedAssetTypeDetails.value.specificationTemplate.fields) {
      sample[`spec_${field.key}`] = ''
    }
  }

  return [sample]
})

// Asset type items for dropdown
const assetTypeItems = computed(() => {
  return assetTypes.value.map(type => ({
    id: type.id,
    name: type.name,
    value: type.id.toString()
  }))
})

// Load asset types on mount
onMounted(async () => {
  await loadAssetTypes()
})

// Load all active asset types
const loadAssetTypes = async () => {
  try {
    const response = await assetTypeService.getAssetTypes({ isActive: true })
    assetTypes.value = response.data.assetTypes
  } catch (error: any) {
    console.error('Error loading asset types:', error)
    toastStore.showError('Failed to Load Asset Types', error.message || 'Could not load asset types')
  }
}

// Proceed to bulk upload after asset type selection
const proceedToBulkUpload = async () => {
  if (!selectedAssetType.value) {
    toastStore.showError('Asset Type Required', 'Please select an asset type to continue')
    return
  }
  
  isLoadingAssetType.value = true
  
  try {
    // Fetch detailed asset type information including specification template
    const response = await assetTypeService.getAssetTypeById(Number(selectedAssetType.value.value))
    selectedAssetTypeDetails.value = response.data.assetType
    
    console.log('Loaded asset type details:', selectedAssetTypeDetails.value)
    
    // Close asset type selection modal
    const assetTypeModal = Modal.getInstance(document.getElementById('assetTypeSelectionModal')!)
    if (assetTypeModal) {
      assetTypeModal.hide()
    }
    
    // Open bulk upload modal after a short delay
    setTimeout(() => {
      bulkUploadModalRef.value?.openModal()
    }, 300)
    
  } catch (error: any) {
    console.error('Error loading asset type details:', error)
    toastStore.showError('Failed to Load Asset Type', error.message || 'Could not load asset type details')
  } finally {
    isLoadingAssetType.value = false
  }
}

// Enhanced asset validation using backend API
const validateAssetFile = async (file: File) => {
  try {
    console.log('validateAssetFile: Starting validation for file:', file.name)
    const result = await assetService.validateBulkUpload(file)
    console.log('validateAssetFile: API response:', result)
    return result
  } catch (error: any) {
    console.error('validateAssetFile: Validation error:', error)
    throw new Error(error.message || 'File validation failed')
  }
}

// Display validation results with proper formatting
const formatValidationErrors = (errors: any[]) => {
  // Show top 5 errors with detailed messages
  const topErrors = errors.slice(0, 5)
  
  const formattedErrors = topErrors.map(error => {
    const rowInfo = `Row ${error.row}`
    const fieldInfo = error.field === 'multiple' ? '' : ` (${error.field})`
    const valueInfo = error.value ? ` - Value: ${error.value}` : ''
    return `${rowInfo}${fieldInfo}: ${error.message}${valueInfo}`
  })
  
  // Add total error count if there are more than 5 errors
  if (errors.length > 5) {
    formattedErrors.push(`... and ${errors.length - 5} more errors`)
  }
  
  return formattedErrors.join('\n')
}

// Handle validation request from BulkUploadModal
const handleValidation = async (file: File) => {
  try {
    console.log('BulkAssetUpload: Validation requested for file:', file.name)
    
    // Always call validation API for comprehensive validation
    const validationResult = await validateAssetFile(file)
    console.log('BulkAssetUpload: Validation result:', validationResult)
    
    // Pass result back to BulkUploadModal
    bulkUploadModalRef.value?.handleValidationResult(validationResult.data)
    
  } catch (error: any) {
    console.error('BulkAssetUpload: Validation error:', error)
    console.error('BulkAssetUpload: Error response:', error.response)
    console.error('BulkAssetUpload: Error response data:', error.response?.data)
    
    // Extract the actual error message from the backend response
    let errorMessage = 'Validation failed'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
      console.log('BulkAssetUpload: Using response message:', errorMessage)
    } else if (error.message) {
      errorMessage = error.message
      console.log('BulkAssetUpload: Using error message:', errorMessage)
    }
    
    // Make error message more user-friendly
    if (errorMessage.includes('Missing required headers')) {
      errorMessage = 'Invalid file format. Please check the column headers match the template.'
    } else if (errorMessage.includes('Bad Request')) {
      errorMessage = 'Invalid file format. Please check your file structure.'
    }
    
    const errorResult = {
      errors: [{ row: 0, field: 'system', message: errorMessage }],
      totalRows: 0
    }
    
    console.log('BulkAssetUpload: Passing error result to modal:', errorResult)
    
    // Pass error result back to BulkUploadModal
    bulkUploadModalRef.value?.handleValidationResult(errorResult)
  }
}

// Handle bulk upload (validation already completed)
const handleBulkUpload = async (file: File) => {
  try {
    console.log('BulkAssetUpload: Starting upload for file:', file.name)
    
    // Show loading state
    toastStore.showInfo('Uploading Assets', 'Please wait while we upload your assets...')
    
    // Proceed with actual upload (validation already completed)
    const result = await assetService.bulkUploadAssets(file, false)
    
    toastStore.showSuccess(
      'Bulk Upload Successful', 
      `Successfully uploaded ${result.data.imported} assets`
    )
    
    // Emit event to refresh parent component
    emit('upload-success', result)
    
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    toastStore.showError('Bulk Upload Failed', error.message || 'An error occurred during bulk upload')
  }
}

// Handle template download
const handleTemplateDownload = (type: 'csv' | 'excel') => {
  try {
    // The template download is handled by the BulkUploadModal component
    // This is just for logging/notification purposes
    toastStore.showSuccess('Template Downloaded', `${type.toUpperCase()} template downloaded successfully`)
  } catch (error: any) {
    console.error('Template download error:', error)
    toastStore.showError('Download Failed', error.message || 'Failed to download template')
  }
}

// Public methods
const openModal = () => {
  console.log('BulkAssetUpload: openModal called')
  
  // Reset selection
  selectedAssetType.value = null
  selectedAssetTypeDetails.value = null
  
  // Show asset type selection modal first
  const assetTypeModalEl = document.getElementById('assetTypeSelectionModal')
  if (assetTypeModalEl) {
    const modal = Modal.getInstance(assetTypeModalEl) || new Modal(assetTypeModalEl)
    modal.show()
    console.log('BulkAssetUpload: Asset type selection modal shown')
  } else {
    console.error('BulkAssetUpload: Asset type selection modal element not found')
  }
}

// Emits
const emit = defineEmits<{
  'upload-success': [result: any]
}>()

// Expose methods to parent
defineExpose({
  openModal
})
</script>

<style scoped>
/* Asset-specific styles can be added here */
</style>

<style>
@import '@/assets/styles/pages/assets.css';
</style>
