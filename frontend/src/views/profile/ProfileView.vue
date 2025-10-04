<template>
  <div class="profile-page">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">
            <i class="fas fa-user-circle me-2"></i>
            My Profile
          </h2>
          <p class="text-muted mb-0">View and manage your account information</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-5">
        <div class="alert alert-danger d-inline-block">
          <i class="fas fa-exclamation-circle me-2"></i>
          {{ error }}
        </div>
        <div class="mt-3">
          <button @click="fetchUserData" class="btn btn-modern btn-primary">
            <i class="fas fa-redo me-2"></i>
            Retry
          </button>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else class="row">
        <!-- Profile Summary Card -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center flex-wrap">
                <div class="profile-avatar-large me-4 mb-3 mb-md-0">
                  <i class="fas fa-user"></i>
                </div>
                <div class="flex-grow-1 mb-3 mb-md-0">
                  <h3 class="mb-1" style="color: var(--primary-black);">{{ userData.name || 'N/A' }}</h3>
                  <div class="d-flex flex-wrap gap-2">
                    <span v-for="role in userData.roles" :key="role" class="badge bg-primary">
                      {{ role }}
                    </span>
                    <span v-if="!userData.roles || userData.roles.length === 0" class="badge bg-secondary">No Roles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Information Card -->
        <div class="col-12 col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0" style="color: var(--primary-black);">
                <i class="fas fa-info-circle me-2"></i>
                Personal Information
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Full Name</label>
                  <p class="mb-0" style="color: var(--primary-black);">{{ userData.name || 'N/A' }}</p>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Email Address</label>
                  <p class="mb-0" style="color: var(--primary-black);">{{ userData.email || 'N/A' }}</p>
                </div>
                <div class="col-12 col-md-6" v-if="userData.employee?.phone">
                  <label class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Phone Number</label>
                  <p class="mb-0" style="color: var(--primary-black);">{{ userData.employee.phone }}</p>
                </div>
                <div class="col-12 col-md-6" v-if="userData.employee?.dateOfBirth">
                  <label class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Date of Birth</label>
                  <p class="mb-0" style="color: var(--primary-black);">{{ formatDate(userData.employee.dateOfBirth) }}</p>
                </div>
                <div class="col-12" v-if="userData.employee?.address">
                  <label class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Address</label>
                  <p class="mb-0" style="color: var(--primary-black);">{{ userData.employee.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Information Card -->
        <div class="col-12 col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0" style="color: var(--primary-black);">
                <i class="fas fa-shield-alt me-2"></i>
                Account Information
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-12" v-if="userData.lastLogin">
                  <label class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Last Login</label>
                  <p class="mb-0" style="color: var(--primary-black);">{{ formatDateTime(userData.lastLogin) }}</p>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Assigned Roles</label>
                  <div class="d-flex flex-wrap gap-2">
                    <span v-for="role in userData.roles" :key="role" class="badge bg-primary">
                      {{ role }}
                    </span>
                    <span v-if="!userData.roles || userData.roles.length === 0" class="badge bg-secondary">No Roles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="col-12 mb-4">
          <div class="d-flex gap-2 flex-wrap justify-content-end">
            <button 
              v-if="userData?.roles?.includes('ADMIN')"
              @click="handleManageAdmins" 
              class="btn btn-modern btn-outline-success"
              :disabled="loading"
            >
              <i class="fas fa-users-cog me-2"></i>
              Manage Admins
            </button>
            <button @click="handleChangePassword" class="btn btn-modern btn-outline-secondary">
              <i class="fas fa-key me-2"></i>
              Change Password
            </button>
            <button @click="showLogoutModal" class="btn btn-modern btn-danger">
              <i class="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="logoutModalLabel" style="color: var(--primary-black);">
              <i class="fas fa-exclamation-triangle me-2" style="color: var(--secondary-orange);"></i>
              Confirm Logout
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0" style="color: var(--primary-dark-gray);">
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern btn-outline-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button type="button" class="btn btn-modern btn-danger" @click="handleLogout">
              <i class="fas fa-sign-out-alt me-2"></i>
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { authAxios } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

interface EmployeeData {
  id: number
  firstName: string
  lastName: string
  email: string
  employeeId: string
  phone: string | null
  dateOfBirth: string | null
  address: string | null
  status: boolean
}

interface UserData {
  id: number
  username: string
  email: string
  name: string
  employeeId: string
  employee: EmployeeData | null
  roles: string[]
  lastLogin: string | null
  createdAt: string
  updatedAt: string
  isActive: boolean
}

const loading = ref(true)
const error = ref<string | null>(null)
const userData = ref<UserData>({
  id: 0,
  username: '',
  email: '',
  name: '',
  employeeId: '',
  employee: null,
  roles: [],
  lastLogin: null,
  createdAt: '',
  updatedAt: '',
  isActive: true,
})

let logoutModal: Modal | null = null

const fetchUserData = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await authAxios.get('/auth/profile')
    
    if (response.data.success) {
      userData.value = response.data.data
    } else {
      throw new Error('Failed to load profile data')
    }
  } catch (err: any) {
    console.error('Error fetching user data:', err)
    error.value = err.response?.data?.message || 'Failed to load profile data. Please try again later.'
    
    // If auth error, redirect to login
    if (err.response?.status === 401) {
      toast.showError('Error', 'Session expired. Please login again.')
      authStore.logout()
      router.push({ name: 'login' })
    }
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  const date = parseBackendDate(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  const date = parseBackendDate(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const parseBackendDate = (dateString: string): Date => {
  // Backend sends dates in DD/MM/YYYY format
  // Split by comma to separate date and time
  const [datePart, timePart] = dateString.split(', ')
  
  if (datePart && timePart) {
    // Parse DD/MM/YYYY format
    const [day, month, year] = datePart.split('/')
    // Create date with MM/DD/YYYY format for JavaScript Date constructor
    return new Date(`${month}/${day}/${year} ${timePart}`)
  }
  
  // Fallback to original parsing if format is different
  return new Date(dateString)
}

const handleChangePassword = () => {
  router.push({ name: 'change-password' })
}

const handleManageAdmins = () => {
  router.push({ name: 'manage-admins' })
}

const showLogoutModal = () => {
  if (logoutModal) {
    logoutModal.show()
  }
}

const handleLogout = async () => {
  try {
    if (logoutModal) {
      logoutModal.hide()
    }
    await authStore.logout()
    toast.showSuccess('Success', 'Logged out successfully')
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Error during logout:', error)
    // Even if logout fails, redirect to login
    authStore.logout()
    router.push({ name: 'login' })
  }
}

onMounted(() => {
  fetchUserData()
  
  const modalElement = document.getElementById('logoutModal')
  if (modalElement) {
    logoutModal = new Modal(modalElement)
  }
})
</script>

<style scoped>
.profile-page {
  background: var(--primary-white);
  min-height: 100vh;
}

.profile-avatar-large {
  width: 80px;
  height: 80px;
  background-color: var(--primary-light-gray);
  border: 2px solid var(--element-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--primary-dark-gray);
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-page .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .profile-page .d-flex.gap-2 .btn {
    width: 100%;
  }
  
  .profile-avatar-large {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .profile-page .card-body {
    padding: 1.5rem;
  }
}
</style>
