<template>
  <div v-if="isLoading" class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-11 col-xl-10 col-xxl-9">
        <div class="card mx-auto" style="max-width: 100%; border-radius: 1.5rem !important; border: none !important; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;">
          <div class="card-body text-center py-5">
            <div class="spinner-border text-primary">
              <output class="visually-hidden">Loading...</output>
            </div>
            <p class="mt-3 text-muted">Loading employee information...</p>
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
            <h4 class="mt-3 text-dark">Employee Not Found</h4>
            <p class="text-muted">The employee you're trying to edit could not be found.</p>
            <button class="btn btn-primary" @click="goBack">
              <i class="fas fa-arrow-left me-2"></i>Back to Employee List
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <EmployeeForm 
    v-else
    :is-edit-mode="true" 
    :employee-id="employeeId" 
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { employeeService } from '@/services/business/employeeService'
import { useToastStore } from '@/stores/toast'
import EmployeeForm from '@/components/forms/EmployeeForm.vue'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

// Get employee ID from route
const employeeId = computed(() => route.params.id as string)

// State
const isLoading = ref(true)
const loadError = ref(false)

// Check if employee exists
const checkEmployeeExists = async () => {
  if (!employeeId.value) {
    loadError.value = true
    isLoading.value = false
    return
  }

  try {
    await employeeService.getEmployee(employeeId.value)
    loadError.value = false
  } catch (error: any) {
    console.error('Error loading employee:', error)
    loadError.value = true
    
    if (error.response?.status === 404) {
      toastStore.showError('Error', 'Employee not found.')
    } else {
      toastStore.showError('Error', 'Failed to load employee data. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/app/employees')
}

onMounted(() => {
  checkEmployeeExists()
})
</script>
