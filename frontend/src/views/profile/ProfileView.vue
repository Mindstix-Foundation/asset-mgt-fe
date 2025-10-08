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
        <div class="spinner-border text-primary">
          <output class="visually-hidden">Loading...</output>
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
                  <span class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Full Name</span>
                  <p class="mb-0" style="color: var(--primary-black);">{{ userData.name || 'N/A' }}</p>
                </div>
                <div class="col-12 col-md-6">
                  <span class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Email Address</span>
                  <p class="mb-0" style="color: var(--primary-black);">{{ userData.email || 'N/A' }}</p>
                </div>
                <div class="col-12 col-md-6" v-if="userData.employee?.phone">
                  <span class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Phone Number</span>
                  <p class="mb-0" style="color: var(--primary-black);">{{ userData.employee.phone }}</p>
                </div>
                <div class="col-12 col-md-6" v-if="userData.employee?.dateOfBirth">
                  <span class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Date of Birth</span>
                  <p class="mb-0" style="color: var(--primary-black);">{{ formatDate(userData.employee.dateOfBirth) }}</p>
                </div>
                <div class="col-12" v-if="userData.employee?.address">
                  <span class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Address</span>
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
                  <span class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Last Login</span>
                  <p class="mb-0" style="color: var(--primary-black);">{{ formatDateTime(userData.lastLogin) }}</p>
                </div>
                <div class="col-12">
                  <span class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">Assigned Roles</span>
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
              class="btn btn-modern btn-green"
              :disabled="loading"
            >
              <i class="fas fa-users-cog me-2"></i>
              Manage Admins
            </button>
            <button @click="handleChangePassword" class="btn btn-modern btn-gray">
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
import { authAxios } from '@/services/core/authService'
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
  
  .profile-avatar-large {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
}

/* Migrated from assets/styles/pages/profile.css */
/* Profile Container */
.profile-container {
  background-color: var(--primary-white) !important;
  border: 1px solid var(--element-gray) !important;
  border-radius: 0.75rem !important;
  padding: 2rem !important;
  margin-bottom: 2rem !important;
  box-shadow: 0 4px 20px rgba(10, 10, 10, 0.08) !important;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--element-gray);
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--secondary-purple);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 600;
  flex-shrink: 0;
  position: relative;
  border: 4px solid var(--primary-white);
  box-shadow: 0 4px 12px rgba(51, 31, 234, 0.2);
}

.profile-avatar.online::after {
  content: '';
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background-color: var(--secondary-green);
  border: 3px solid white;
  border-radius: 50%;
}

.profile-info h2 {
  color: var(--primary-black) !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  margin-bottom: 0.5rem !important;
}

.profile-info p {
  color: var(--primary-mid-gray) !important;
  font-size: 1.125rem !important;
  margin: 0 !important;
}

.profile-actions {
  margin-left: auto;
  display: flex;
  gap: 0.75rem;
}

/* Profile Sections */
.profile-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.profile-section {
  background-color: var(--primary-light-gray);
  border: 1px solid var(--element-gray);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--element-gray);
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--secondary-purple);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.section-title {
  color: var(--primary-black) !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  margin: 0 !important;
}

/* Profile Details */
.profile-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--primary-white);
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem;
}

.detail-label {
  color: var(--primary-mid-gray) !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
}

.detail-value {
  color: var(--primary-black) !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: var(--primary-black) !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
}

.form-control {
  border: 2px solid var(--element-gray) !important;
  border-radius: 0.375rem !important;
  padding: 0.75rem !important;
  font-size: 0.875rem !important;
  transition: all 0.2s ease !important;
}

.form-control:focus {
  border-color: var(--secondary-purple) !important;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25) !important;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--element-gray);
}

/* Activity Timeline */
.activity-timeline {
  position: relative;
  padding-left: 2rem;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--element-gray);
}

.activity-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.activity-item:last-child { 
  margin-bottom: 0; 
}

.activity-marker {
  position: absolute;
  left: -2.25rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--primary-white);
  background: var(--secondary-purple);
}

.activity-content {
  background-color: var(--primary-white);
  border: 1px solid var(--element-gray);
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.activity-title {
  color: var(--primary-black) !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  margin-bottom: 0.25rem !important;
}

.activity-time {
  color: var(--primary-mid-gray) !important;
  font-size: 0.75rem !important;
  margin: 0 !important;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--primary-white);
  border: 1px solid var(--element-gray);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--secondary-purple);
  box-shadow: 0 2px 8px rgba(51, 31, 234, 0.1);
}

.stat-number {
  color: var(--secondary-purple);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--primary-mid-gray);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin: 0;
}

/* Responsive Design from profile.css */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-actions {
    margin-left: 0;
    justify-content: center;
  }
  
  .profile-sections {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }
}

@media (max-width: 576px) {
  .profile-container {
    padding: 1.5rem !important;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  .profile-info h2 {
    font-size: 1.5rem !important;
  }
  
  .profile-info p {
    font-size: 1rem !important;
  }
  
  .profile-section {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
