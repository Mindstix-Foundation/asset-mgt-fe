<template>
  <div>
    <!-- Asset-specific Bulk Upload Modal -->
    <BulkUploadModal
      ref="bulkUploadModalRef"
      modal-id="bulkUploadAssetsModal"
      title="Bulk Upload Assets"
      entity-name="Assets"
      :columns="assetColumns"
      :template-data="[]"
      upload-button-text="Upload Assets"
      :always-validate="true"
      @upload="handleBulkUpload"
      @validate="handleValidation"
      @template-download="handleTemplateDownload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BulkUploadModal from '@/components/modals/BulkUploadModal.vue'
import { assetService } from '@/services/business/assetService'
import { useToastStore } from '@/stores/toast'

// Refs
const bulkUploadModalRef = ref()
const toastStore = useToastStore()

// Asset columns configuration
const assetColumns = ref([
  { key: 'assetId', label: 'Asset ID', required: true },
  { key: 'serialNumber', label: 'Serial Number', required: true },
  { key: 'assetTypeId', label: 'Asset Type ID', required: true },
  { key: 'brandId', label: 'Brand ID', required: true },
  { key: 'modelId', label: 'Model ID', required: true },
  { key: 'vendorId', label: 'Vendor ID', required: false },
  { key: 'status', label: 'Status', required: true },
  { key: 'condition', label: 'Condition', required: true },
  { key: 'location', label: 'Location', required: false },
  { key: 'purchaseDate', label: 'Purchase Date', required: false },
  { key: 'purchaseCost', label: 'Purchase Cost', required: false },
  { key: 'warrantyStartDate', label: 'Warranty Start Date', required: false },
  { key: 'warrantyEndDate', label: 'Warranty End Date', required: false },
  { key: 'notes', label: 'Notes', required: false }
])

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
  console.log('BulkAssetUpload: openModal called, bulkUploadModalRef:', bulkUploadModalRef.value)
  bulkUploadModalRef.value?.openModal()
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
