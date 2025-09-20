/**
 * Toast Usage Examples
 * 
 * This file demonstrates how to use the toast utility in different scenarios.
 * Import the functions you need from '@/utils/toast'
 */

import { showToast, showToastWithButtons, showErrorToast, showVendorSuccessToast } from './toast'

// Example 1: Simple success toast
export const showSimpleSuccess = () => {
  showToast('Operation completed successfully!', 'success')
}

// Example 2: Simple error toast
export const showSimpleError = () => {
  showToast('Something went wrong. Please try again.', 'error')
}

// Example 3: Warning toast
export const showWarning = () => {
  showToast('Please review your input before proceeding.', 'warning')
}

// Example 4: Info toast
export const showInfo = () => {
  showToast('New features are available in the latest update.', 'info')
}

// Example 5: Error toast with Find Errors button (requires global scrollToFirstError function)
export const showFormValidationError = () => {
  showErrorToast('Please fix the validation errors below.')
}

// Example 6: Custom toast with buttons
export const showCustomActionToast = () => {
  const message = `
    <div class="mb-3">
      <strong>Data Export Ready</strong>
    </div>
    <div class="text-muted mb-3">
      Your export has been generated successfully.
    </div>
    <div class="d-flex gap-2 justify-content-center">
      <button type="button" class="btn btn-sm btn-primary" onclick="window.open('/downloads/export.csv')">
        Download
      </button>
      <button type="button" class="btn btn-sm btn-outline-primary" onclick="alert('Email sent!')">
        Email Me
      </button>
    </div>
  `
  showToastWithButtons(message, 'success')
}

// Example 7: Vendor success toast (specific to vendor operations)
export const showVendorCreated = () => {
  showVendorSuccessToast('Acme Corporation (Supplier)', false) // false = create mode
}

export const showVendorUpdated = () => {
  showVendorSuccessToast('Acme Corporation (Supplier)', true) // true = edit mode
}

// Example 8: Asset success toast (you can create similar utilities for other entities)
export const showAssetSuccessToast = (assetName: string, isEdit: boolean = false) => {
  const message = `<div class="mb-3">
    <strong>${assetName}</strong> has been ${isEdit ? 'updated' : 'added'} successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    ${!isEdit ? `
    <button type="button" class="btn btn-sm btn-primary" onclick="addAnotherAsset()">
      Add Another
    </button>
    ` : ''}
    <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.location.href='/app/assets'">
      View Assets
    </button>
  </div>`
  showToastWithButtons(message, 'success')
}

// Example 9: Employee success toast
export const showEmployeeSuccessToast = (employeeName: string, isEdit: boolean = false) => {
  const message = `<div class="mb-3">
    <strong>${employeeName}</strong> has been ${isEdit ? 'updated' : 'added'} successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    ${!isEdit ? `
    <button type="button" class="btn btn-sm btn-primary" onclick="addAnotherEmployee()">
      Add Another
    </button>
    ` : ''}
    <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.location.href='/app/employees'">
      View Employees
    </button>
  </div>`
  showToastWithButtons(message, 'success')
}

/**
 * Usage in Vue Components:
 * 
 * <script setup lang="ts">
 * import { showToast, showErrorToast } from '@/utils/toast'
 * 
 * const handleSubmit = async () => {
 *   try {
 *     await submitForm()
 *     showToast('Form submitted successfully!', 'success')
 *   } catch (error) {
 *     showErrorToast('Please check your input and try again.')
 *   }
 * }
 * </script>
 * 
 * Remember to make any callback functions available globally if using buttons:
 * 
 * onMounted(() => {
 *   ;(window as any).addAnotherAsset = addAnotherAsset
 *   ;(window as any).scrollToFirstError = scrollToFirstError
 * })
 */ 