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
import { useToastStore } from '@/stores/toast'
import AssetForm from '@/components/forms/AssetForm.vue'

const router = useRouter()
const toastStore = useToastStore()

const handleSubmit = async (assetData: any) => {
  try {
    await assetService.createAsset(assetData)
    
    const assetDetails = generateAssetDetails(assetData)
    
    // Redirect to asset list immediately after success
    router.push('/app/assets')
    
    // Show success toast after redirect (with a small delay to ensure page loads)
    setTimeout(() => {
      toastStore.showSuccess('Success', `${assetDetails} has been registered successfully!`)
    }, 100)
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
    
    toastStore.showError('Error', errorMsg)
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
</script>
