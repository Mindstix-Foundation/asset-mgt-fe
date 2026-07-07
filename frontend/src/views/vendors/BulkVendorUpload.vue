<template>
  <div>
    <!-- Vendor-specific Bulk Upload Modal -->
    <BulkUploadModal
      ref="bulkUploadModalRef"
      modal-id="bulkUploadVendorsModal"
      title="Bulk Upload Vendors"
      entity-name="Vendors"
      :columns="vendorColumns"
      :template-data="[]"
      upload-button-text="Upload Vendors"
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
import VendorApiService from '@/services/api/vendorApi'
import { useToastStore } from '@/stores/toast'

// Refs
const bulkUploadModalRef = ref()
const toastStore = useToastStore()

// Vendor columns configuration
const vendorColumns = ref([
  { key: 'name', label: 'Vendor Name', required: true },
  { key: 'contactPerson', label: 'Contact Person', required: false },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'address', label: 'Address', required: false },
  { key: 'vendorType', label: 'Type', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'taxId', label: 'Tax ID', required: false },
  { key: 'panNumber', label: 'PAN Number', required: false },
  { key: 'notes', label: 'Notes', required: false }
])

// Enhanced vendor validation using backend API
const validateVendorFile = async (file: File) => {
  try {
    const result = await VendorApiService.validateBulkUpload(file)
    return result
  } catch (error: any) {
    console.error('validateVendorFile: Validation error:', error)
    throw error // Don't wrap the error, let it bubble up with original response data
  }
}

// Display validation results with proper formatting
const formatValidationErrors = (errors: any[]) => {
  // Show top 5 errors with detailed messages
  const topErrors = errors.slice(0, 5)
  
  const formattedErrors = topErrors.map(error => {
    const rowInfo = `Row ${error.row}`
    const fieldInfo = error.field === 'general' ? '' : ` (${error.field})`
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
    // Call validation API
    const validationResult = await validateVendorFile(file)
    
    // Transform the result to match BulkUploadModal expectations
    const transformedResult = {
      errors: validationResult.data.errors || [],
      totalRows: validationResult.data.summary?.totalRows || 0,
      validRows: validationResult.data.summary?.successfulImports || 0
    }
    
    // Pass transformed result back to BulkUploadModal
    bulkUploadModalRef.value?.handleValidationResult(transformedResult)
    
  } catch (error: any) {
    console.error('BulkVendorUpload: Validation error:', error)
    console.error('BulkVendorUpload: Error response:', error.response)
    console.error('BulkVendorUpload: Error response data:', error.response?.data)
    
    // Extract the actual error message from the backend response
    let errorMessage = 'Validation failed'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
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
    
    // Pass error result back to BulkUploadModal
    bulkUploadModalRef.value?.handleValidationResult(errorResult)
  }
}

// Handle bulk upload (validation already completed)
const handleBulkUpload = async (file: File) => {
  try {
    // Show loading state
    toastStore.showInfo('Uploading Vendors', 'Please wait while we upload your vendors...')
    
    // Proceed with actual upload (validation already completed)
    const result = await VendorApiService.bulkUploadVendors(file, false) // false for actual upload
    
    toastStore.showSuccess(
      'Bulk Upload Successful', 
      `Successfully uploaded ${result.data.imported} vendors`
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
/* Vendor-specific styles can be added here */
</style>
