<template>
  <AssetForm
    :is-edit-mode="false"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { assetService } from '@/services/assetService'
import { showToast, showErrorToast } from '@/utils/toast'
import AssetForm from '@/components/forms/AssetForm.vue'

const router = useRouter()

const handleSubmit = async (assetData: any) => {
  try {
    await assetService.createAsset(assetData)
    
    const assetDetails = generateAssetDetails(assetData)
    showAssetSuccessToast(assetDetails)
  } catch (error: any) {
    console.error('Error creating asset:', error)
    
    let errorMsg = 'An error occurred while adding the asset. Please try again.'
    
    if (error.response?.status === 409) {
      errorMsg = 'An asset with this serial number already exists.'
    } else if (error.response?.status === 400) {
      errorMsg = 'Server validation failed. Please check your data and try again.'
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    }
    
    showErrorToast(errorMsg)
  }
}

const handleCancel = () => {
  router.push('/app/assets')
}

const generateAssetDetails = (assetData: any) => {
  let details = ''
  
  if (assetData.serialNumber) {
    details += `Asset ${assetData.serialNumber}`
  } else {
    details += 'Asset'
  }
  
  return details
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

// Make functions available globally for toast buttons
const addAnotherAsset = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if ((window as any).bootstrap) {
      const toastInstance = (window as any).bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  showToast('Ready to add another asset!', 'info')
  
  // Reload the page to reset the form
  window.location.reload()
}

const viewAssetList = () => {
  // Hide any existing toasts
  const existingToasts = document.querySelectorAll('.toast')
  existingToasts.forEach(toast => {
    if ((window as any).bootstrap) {
      const toastInstance = (window as any).bootstrap.Toast.getInstance(toast)
      if (toastInstance) toastInstance.hide()
    }
  })
  
  showToast('Redirecting to Asset List...', 'info')
  
  setTimeout(() => {
    router.push('/app/assets')
  }, 1500)
}

// Make functions available globally
;(window as any).addAnotherAsset = addAnotherAsset
;(window as any).viewAssetList = viewAssetList
</script>
