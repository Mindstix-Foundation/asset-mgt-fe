<template>
  <div v-if="isLoading" class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-body text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading vendor information...</p>
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
            <h4 class="mt-3 text-dark">Vendor Not Found</h4>
            <p class="text-muted">The vendor you're trying to edit could not be found.</p>
            <button class="btn btn-primary" @click="goBack">
              <i class="fas fa-arrow-left me-2"></i>Back to Vendor List
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <VendorForm
      :is-edit-mode="true"
      :vendor="vendor"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VendorApiService from '@/services/vendorApi'
import { useToastStore } from '@/stores/toast'
import VendorForm from '@/components/forms/VendorForm.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Get vendor ID from route
const vendorId = computed(() => parseInt(route.params.id as string))

// State
const isLoading = ref(false)
const loadError = ref(false)
const vendor = ref<any>(null)

// Load vendor data for editing
const loadVendorData = async () => {
  if (!vendorId.value) {
    loadError.value = true
    return
  }

  isLoading.value = true
  try {
    const response = await VendorApiService.getVendorById(vendorId.value)
    vendor.value = response.data.vendor
  } catch (error: any) {
    console.error('Error loading vendor data:', error)
    loadError.value = true
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async (vendorData: any) => {
  try {
    const response = await VendorApiService.updateVendor(vendorId.value, vendorData)
    const updatedVendor = response.data.vendor

    const vendorName = `${updatedVendor.name || 'Vendor'}`
    
    // Navigate back to vendors list with success message
    router.push({
      path: '/app/vendors',
      query: {
        toastType: 'success',
        toastTitle: 'Vendor Updated',
        toastMessage: `${vendorName} has been updated successfully!`
      }
    })
  } catch (error: any) {
    console.error('Error updating vendor:', error)
    
    const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update vendor. Please try again.'
    toastStore.showError('Error', errorMsg)
  }
}

const handleCancel = () => {
  router.push('/app/vendors')
}

const goBack = () => {
  router.push('/app/vendors')
}

onMounted(() => {
  loadVendorData()
})
</script>
