<template>
  <div v-if="isLoading" class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-body text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading asset information...</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loadError" class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-body text-center py-5">
            <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
            <h4 class="mt-3 text-dark">Asset Not Found</h4>
            <p class="text-muted">The asset you're trying to edit could not be found.</p>
            <button class="btn btn-primary" @click="goBack">
              <i class="fas fa-arrow-left me-2"></i>Back to Asset List
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <AssetForm
      :is-edit-mode="true"
      :asset="asset"
      :disable-asset-identity="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { assetService } from '@/services/assetService'
import { useToastStore } from '@/stores/toast'
import AssetForm from '@/components/forms/AssetForm.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Get asset ID from route
const assetId = computed(() => parseInt(route.params.id as string))

// State
const isLoading = ref(false)
const loadError = ref(false)
const asset = ref<any>(null)

// Load asset data for editing
const loadAssetData = async () => {
  if (!assetId.value) {
    loadError.value = true
    return
  }

  isLoading.value = true
  try {
    const response = await assetService.getAssetById(assetId.value)
    asset.value = response.data.asset
  } catch (error: any) {
    console.error('Error loading asset data:', error)
    loadError.value = true
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (assetData: any) => {
  try {
    const response = await assetService.updateAsset(assetId.value, assetData)
    const updatedAsset = response.data.asset

    const assetName = `${updatedAsset.serialNumber || 'Asset'}`
    toastStore.showSuccess('Success', `${assetName} has been updated successfully!`)
    
    // Navigate back to assets list after successful update
    setTimeout(() => {
      router.push('/app/assets')
    }, 1500)
  } catch (error: any) {
    console.error('Error updating asset:', error)
    
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update asset. Please try again.'
    toastStore.showError('Error', errorMsg)
  }
}

const handleCancel = () => {
  router.push('/app/assets')
}

const goBack = () => {
  router.push('/app/assets')
}

onMounted(() => {
  loadAssetData()
})
</script>
