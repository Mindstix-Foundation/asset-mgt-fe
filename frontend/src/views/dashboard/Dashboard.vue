<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Main Content -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Asset Management Dashboard</h1>
        <p class="text-gray-600 mt-2">Welcome to your asset management portal</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-laptop text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Assets</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalAssets || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-check-circle text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Available</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.available || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-user-clock text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Assigned</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.assigned || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <i class="fas fa-exclamation-triangle text-white text-sm"></i>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Maintenance</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.maintenance || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow rounded-lg border border-gray-200">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button class="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-plus text-white"></i>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-900">Add New Asset</div>
                <div class="text-sm text-gray-500">Register a new asset</div>
              </div>
            </button>

            <button class="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
              <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-hand-paper text-white"></i>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-900">Issue Asset</div>
                <div class="text-sm text-gray-500">Assign asset to employee</div>
              </div>
            </button>

            <button class="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
              <div class="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center mr-4">
                <i class="fas fa-tools text-white"></i>
              </div>
              <div class="text-left">
                <div class="font-medium text-gray-900">Schedule Maintenance</div>
                <div class="text-sm text-gray-500">Plan maintenance activities</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
          <i class="fas fa-spinner fa-spin text-purple-600 text-xl"></i>
          <span class="text-gray-700">Loading dashboard...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

interface DashboardStats {
  totalAssets: number
  available: number
  assigned: number
  maintenance: number
}

// Component state
const stats = ref<DashboardStats>({
  totalAssets: 0,
  available: 0,
  assigned: 0,
  maintenance: 0
})
const loading = ref(false)

// Fetch dashboard statistics
const fetchStats = async () => {
  loading.value = true
  try {
    const response = await api.get<DashboardStats>('/dashboard/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    // Keep default values on error
  } finally {
    loading.value = false
  }
}

// Initialize dashboard
onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
/* Component-specific styles if needed */
</style> 