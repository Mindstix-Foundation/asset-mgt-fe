<template>
  <div>
    <!-- Employee-specific Bulk Upload Modal -->
    <BulkUploadModal
      ref="bulkUploadModalRef"
      modal-id="bulkUploadEmployeesModal"
      title="Bulk Upload Employees"
      entity-name="Employees"
      :columns="employeeColumns"
      :template-data="sampleRows"
      :helper-notes="helperNotes"
      upload-button-text="Upload Employees"
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
import { employeeService } from '@/services/business/employeeService'
import { useToastStore } from '@/stores/toast'

// Refs
const bulkUploadModalRef = ref()
const toastStore = useToastStore()

// Employee columns configuration
const employeeColumns = ref([
  { key: 'employeeId', label: 'Employee ID', required: true },
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'dateOfBirth', label: 'Date of Birth (YYYY-MM-DD)', required: false },
  { key: 'address', label: 'Address', required: false }
])

// Template sample row to guide users
const sampleRows = ref([
  { employeeId: '0001', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com', phone: '+91 9876543210', dateOfBirth: '1995-06-15', address: '123 Street, City' }
])

// Helper notes to display in modal
const helperNotes = ref([
  'Employee ID: exactly 4 digits (0001–9999). Must be unique.',
  'Email: must be a valid format and unique.',
  "Phone (optional): format '+91 9999999999'.",
  'Date of Birth (optional): format YYYY-MM-DD; must be at least 16 years old.'
])

// Enhanced employee validation using backend API
const validateEmployeeFile = async (file: File) => {
  try {
    const result = await employeeService.validateBulkUpload(file)
    return result
  } catch (error: any) {
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
    // Always call validation API for comprehensive validation
    const validationResult = await validateEmployeeFile(file)
    
    // Pass result back to BulkUploadModal - the result.data contains the actual validation data
    bulkUploadModalRef.value?.handleValidationResult(validationResult.data)
    
  } catch (error: any) {
    // Check if this is a validation error with specific error details
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      // This is a validation error with specific row errors
      const validationResult = {
        errors: error.response.data.errors,
        totalRows: error.response.data.totalRows || error.response.data.errors.length
      }
      
      // Pass validation result back to BulkUploadModal
      bulkUploadModalRef.value?.handleValidationResult(validationResult)
      return
    }
    
    // Handle other types of errors (file format, network, etc.)
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
    } else if (errorMessage.includes('File is required')) {
      errorMessage = 'No file was uploaded. Please select a file to upload.'
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
    toastStore.showInfo('Uploading Employees', 'Please wait while we upload your employees...')
    
    // Proceed with actual upload (validation already completed)
    const result = await employeeService.bulkUploadEmployees(file, false)
    
    toastStore.showSuccess(
      'Bulk Upload Successful', 
      `Successfully uploaded ${result.data.imported} employees`
    )
    
    // Emit event to refresh parent component
    emit('upload-success', result)
    
  } catch (error: any) {
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
/* Employee-specific styles can be added here */
</style>
