<template>
  <VendorForm
    :is-edit-mode="false"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import VendorApiService from '@/services/vendorApi'
import { showToast, showErrorToast } from '@/utils/toast'
import VendorForm from '@/components/forms/VendorForm.vue'

const router = useRouter()

const handleSubmit = async (vendorData: any) => {
  try {
      await VendorApiService.createVendor(vendorData)
    
    const vendorDetails = generateVendorDetails(vendorData)
    showVendorSuccessToast(vendorDetails)
  } catch (error: any) {
    console.error('Error creating vendor:', error)
    
    let errorMsg = 'An error occurred while adding the vendor. Please try again.'
    
    if (error.response?.status === 409) {
      errorMsg = 'A vendor with this name or email already exists.'
    } else if (error.response?.status === 400) {
      errorMsg = 'Server validation failed. Please check your data and try again.'
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    }
    
    showErrorToast(errorMsg)
  }
}

const handleCancel = () => {
  router.push('/app/vendors')
}

const generateVendorDetails = (vendorData: any) => {
  let details = ''
  
  if (vendorData.name) {
    details += `Vendor ${vendorData.name}`
  } else {
    details += 'Vendor'
  }
  
  if (vendorData.vendorType) {
    const typeLabels: Record<string, string> = {
      SUPPLIER: 'Supplier',
      SERVICE: 'Service Provider',
      MANUFACTURER: 'Manufacturer',
      DISTRIBUTOR: 'Distributor',
      CONTRACTOR: 'Contractor',
      BOTH: 'Supplier & Service Provider'
    }
    details += ` (${typeLabels[vendorData.vendorType]})`
  }
  
  return details
}

const showVendorSuccessToast = (vendorDetails: string) => {
  const message = `<div class="mb-3">
    <strong>${vendorDetails}</strong> has been registered successfully!
  </div>
  <div class="d-flex gap-2 justify-content-center">
    <button type="button" class="btn btn-sm btn-primary" onclick="addAnotherVendor()">
      Add Another Vendor
    </button>
    <button type="button" class="btn btn-sm btn-outline-primary" onclick="viewVendorList()">
      View Vendors
    </button>
  </div>`
  
  showToast(message, 'success')
}

// Make functions available globally for toast buttons
const addAnotherVendor = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if ((window as any).bootstrap) {
      const toastInstance = (window as any).bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  showToast('Ready to add another vendor!', 'info')
  
  // Reload the page to reset the form
  window.location.reload()
}

const viewVendorList = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if ((window as any).bootstrap) {
      const toastInstance = (window as any).bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  showToast('Redirecting to Vendor List...', 'info')
  
  setTimeout(() => {
    router.push('/app/vendors')
  }, 1500)
}

// Make functions available globally
  ;(window as any).addAnotherVendor = addAnotherVendor
;(window as any).viewVendorList = viewVendorList
</script>