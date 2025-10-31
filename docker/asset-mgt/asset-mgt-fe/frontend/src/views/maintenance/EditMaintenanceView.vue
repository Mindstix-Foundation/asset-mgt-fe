<template>
  <div v-if="isLoading" class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-body text-center py-5">
            <div class="spinner-border text-primary">
              <span class="visually-hidden">Loading...</span>
            </div>
            <output class="mt-3 text-muted">Loading maintenance information...</output>
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
            <h4 class="mt-3 text-dark">Maintenance Not Found</h4>
            <p class="text-muted">The maintenance record you're trying to edit could not be found.</p>
            <button class="btn btn-primary" @click="goBack">
              <i class="fas fa-arrow-left me-2"></i>Back to Maintenance List
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <MaintenanceForm 
    v-else
    :is-edit-mode="true" 
    :maintenance-id="maintenanceId" 
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { maintenanceService } from '@/services/business/maintenanceService'
import { useToastStore } from '@/stores/toast'
import MaintenanceForm from '@/components/forms/MaintenanceForm.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Get maintenance ID from route
const maintenanceId = computed(() => route.params.id as string)

// State
const isLoading = ref(true)
const loadError = ref(false)

// Check if maintenance exists
const checkMaintenanceExists = async () => {
  if (!maintenanceId.value) {
    loadError.value = true
    isLoading.value = false
    return
  }

  try {
    await maintenanceService.getMaintenance(maintenanceId.value)
    loadError.value = false
  } catch (error: any) {
    console.error('Error loading maintenance:', error)
    loadError.value = true
    
    if (error.response?.status === 404) {
      toastStore.showError('Error', 'Maintenance record not found.')
    } else {
      toastStore.showError('Error', 'Failed to load maintenance data. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/app/maintenance')
}

onMounted(() => {
  checkMaintenanceExists()
})
</script> 