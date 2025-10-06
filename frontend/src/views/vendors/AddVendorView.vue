<template>
  <VendorForm
    :is-edit-mode="false"
    :disable-status="true"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import VendorApiService from '@/services/vendorApi'
import { useToastStore } from '@/stores/toast'
import VendorForm from '@/components/forms/VendorForm.vue'

const router = useRouter()
const toastStore = useToastStore()

const handleSubmit = async (vendorData: any) => {
  try {
    const response = await VendorApiService.createVendor(vendorData)
    
    const vendorDetails = generateVendorDetails(vendorData)
    
    // Navigate back to vendors list with success message
    router.push({
      path: '/app/vendors',
      query: {
        toastType: 'success',
        toastTitle: 'Vendor Added',
        toastMessage: `${vendorDetails} has been registered successfully!`
      }
    })
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
    
    toastStore.showError('Error', errorMsg)
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
</script>