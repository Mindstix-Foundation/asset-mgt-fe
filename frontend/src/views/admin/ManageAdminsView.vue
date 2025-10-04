<template>
  <div class="container-fluid py-4">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="h3 mb-1" style="color: var(--primary-black); font-weight: 600;">
              <i class="fas fa-users-cog me-2" style="color: var(--primary-color);"></i>
              Manage Admins
            </h2>
            <p class="text-muted mb-0">Manage admin users and their permissions</p>
          </div>
          <button
            @click="showAddAdminModal"
            class="btn btn-modern btn-primary"
            :disabled="isLoading"
          >
            <i class="fas fa-plus me-2"></i>
            Add Admin
          </button>
        </div>
      </div>
    </div>

    <!-- Admins List -->
    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header" style="background: transparent; border-bottom: none;">
            <h5 class="card-title mb-0" style="color: var(--primary-black);">
              <i class="fas fa-user-shield me-2"></i>
              Admin Users
            </h5>
          </div>
          <div class="card-body p-0">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading admins...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger m-3" role="alert">
              <i class="fas fa-exclamation-circle me-2"></i>
              {{ error }}
            </div>

            <!-- Admins Table -->
            <div v-else-if="admins.length > 0" class="table-responsive">
              <table class="table table-hover mb-0 admin-table">
                <thead class="table-light">
                  <tr>
                    <th class="border-0">Admin</th>
                    <th class="border-0">Email</th>
                    <th class="border-0">Employee ID</th>
                    <th class="border-0">Status</th>
                    <th class="border-0">Last Login</th>
                    <th class="border-0 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="admin in admins" :key="admin.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div 
                          class="avatar-sm text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                          :style="{ backgroundColor: getEmployeeIconColor(admin.employee?.employeeId || admin.username), flexShrink: 0 }"
                        >
                          <i class="fas fa-user"></i>
                        </div>
                        <div class="flex-grow-1 min-width-0">
                          <div class="fw-semibold text-truncate">{{ admin.employee?.firstName }} {{ admin.employee?.lastName }}</div>
                          <small class="text-muted text-truncate d-block">{{ admin.username }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="text-muted text-truncate d-block">{{ admin.employee?.email }}</span>
                    </td>
                    <td>
                      <span class="badge bg-light text-dark">{{ admin.employee?.employeeId }}</span>
                    </td>
                    <td>
                      <span 
                        :class="admin.isActive ? 'badge bg-success' : 'badge bg-danger'"
                      >
                        {{ admin.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>
                      <span class="text-muted d-flex flex-column">
                        <span>{{ admin.lastLogin ? formatDate(admin.lastLogin) : 'Never' }}</span>
                        <small v-if="admin.lastLogin" class="text-muted">{{ formatTime(admin.lastLogin) }}</small>
                      </span>
                    </td>
                    <td class="text-center">
                      <div class="btn-group" role="group">
                        
                        <button
                          v-if="admin.id !== currentUserId"
                          @click="removeAdmin(admin)"
                          class="btn btn-outline-danger btn-sm"
                          :disabled="isLoading"
                          title="Remove Admin"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-5">
              <i class="fas fa-user-shield text-muted" style="font-size: 3rem;"></i>
              <h5 class="mt-3 text-muted">No Admin Users Found</h5>
              <p class="text-muted">Start by adding your first admin user.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Admin Modal -->
    <div class="modal fade" id="addAdminModal" tabindex="-1" aria-labelledby="addAdminModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addAdminModalLabel">
              <i class="fas fa-user-plus me-2"></i>
              Add New Admin
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleAddAdmin">
              <!-- Employee Selection -->
              <div class="mb-3">
                <SearchableDropdown
                  id="employeeSelect"
                  label="Select Employee"
                  placeholder="Search employees..."
                  :items="employeeItems"
                  v-model="selectedEmployee"
                  :required="true"
                  :class="getFieldClass('employeeId')"
                  @change="onEmployeeChange"
                />
                <div v-if="errors.employeeId" class="invalid-feedback d-block">
                  {{ errors.employeeId }}
                </div>
              </div>

              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label fw-semibold">
                  <i class="fas fa-at me-2"></i>Username
                </label>
                <input
                  type="text"
                  id="username"
                  v-model="newAdmin.username"
                  class="form-control"
                  :class="getFieldClass('username')"
                  placeholder="Enter username"
                  required
                  @input="clearFieldValidation('username')"
                />
                <div v-if="errors.username" class="invalid-feedback">
                  {{ errors.username }}
                </div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label fw-semibold">
                  <i class="fas fa-lock me-2"></i>Password
                </label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="newAdmin.password"
                    class="form-control"
                    :class="getFieldClass('password')"
                    placeholder="Enter password"
                    required
                    @input="validatePassword"
                    @focus="clearFieldValidation('password')"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="togglePasswordVisibility"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
                <div v-if="passwordStrength" class="mt-2">
                  <div class="password-strength">
                    <div class="strength-item" :class="{ 'valid': passwordStrength.length }">
                      <i class="fas" :class="passwordStrength.length ? 'fa-check text-success' : 'fa-times text-danger'"></i>
                      <span>At least 8 characters</span>
                    </div>
                    <div class="strength-item" :class="{ 'valid': passwordStrength.uppercase }">
                      <i class="fas" :class="passwordStrength.uppercase ? 'fa-check text-success' : 'fa-times text-danger'"></i>
                      <span>One uppercase letter</span>
                    </div>
                    <div class="strength-item" :class="{ 'valid': passwordStrength.lowercase }">
                      <i class="fas" :class="passwordStrength.lowercase ? 'fa-check text-success' : 'fa-times text-danger'"></i>
                      <span>One lowercase letter</span>
                    </div>
                    <div class="strength-item" :class="{ 'valid': passwordStrength.number }">
                      <i class="fas" :class="passwordStrength.number ? 'fa-check text-success' : 'fa-times text-danger'"></i>
                      <span>One number</span>
                    </div>
                    <div class="strength-item" :class="{ 'valid': passwordStrength.special }">
                      <i class="fas" :class="passwordStrength.special ? 'fa-check text-success' : 'fa-times text-danger'"></i>
                      <span>One special character</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="mb-3">
                <label for="confirmPassword" class="form-label fw-semibold">
                  <i class="fas fa-lock me-2"></i>Confirm Password
                </label>
                <div class="input-group">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    v-model="newAdmin.confirmPassword"
                    class="form-control"
                    :class="getFieldClass('confirmPassword')"
                    placeholder="Confirm password"
                    required
                    @input="validatePasswordMatch"
                    @focus="clearFieldValidation('confirmPassword')"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="toggleConfirmPasswordVisibility"
                    :title="showConfirmPassword ? 'Hide password' : 'Show password'"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                  {{ errors.confirmPassword }}
                </div>
                <div v-else-if="passwordsMatch" class="valid-feedback d-block">
                  <i class="fas fa-check text-success me-1"></i>
                  Passwords match
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern btn-outline-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              @click="handleAddAdmin"
              class="btn btn-modern btn-primary"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else class="fas fa-user-plus me-2"></i>
              Add Admin
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Admin Confirmation Modal -->
    <div class="modal fade" id="removeAdminModal" tabindex="-1" aria-labelledby="removeAdminModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="removeAdminModalLabel">
              <i class="fas fa-exclamation-triangle me-2 text-warning"></i>
              Remove Admin
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to remove <strong>{{ selectedAdmin?.employee?.firstName }} {{ selectedAdmin?.employee?.lastName }}</strong> as an admin?</p>
            <p class="text-muted small">This action will revoke their admin privileges but keep their employee account active.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern btn-outline-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              @click="confirmRemoveAdmin"
              class="btn btn-modern btn-danger"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else class="fas fa-trash me-2"></i>
              Remove Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authAxios, authService } from '@/services/authService'
import { useToastStore } from '@/stores/toast'
import { Modal } from 'bootstrap'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import { employeeApiService } from '@/services/employeeApi'

const router = useRouter()
const toast = useToastStore()

// Reactive data
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const admins = ref<any[]>([])
const availableEmployees = ref<any[]>([])
const selectedAdmin = ref<any>(null)
const selectedEmployee = ref<any>(null)

// Password visibility states
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Password strength validation
const passwordStrength = ref({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false
})

// New admin form
const newAdmin = ref({
  employeeId: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const errors = ref<Record<string, string>>({})

// Get current user ID
const currentUserId = ref<number | null>(authService.getUserId())

// Computed properties
const userProfile = computed(() => {
  // This should come from your auth store
  return { roles: ['ADMIN'] } // Placeholder
})

// Employee items for SearchableDropdown
const employeeItems = computed(() => {
  return availableEmployees.value.map(employee => ({
    id: employee.id,
    name: `${employee.employeeId} - ${employee.firstName} ${employee.lastName}`,
    employeeId: employee.employeeId,
    email: employee.email,
    firstName: employee.firstName,
    lastName: employee.lastName
  }))
})

// Password match validation
const passwordsMatch = computed(() => {
  if (!newAdmin.value.password || !newAdmin.value.confirmPassword) {
    return false
  }
  return newAdmin.value.password === newAdmin.value.confirmPassword
})

// Methods
const fetchAdmins = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await authAxios.get('/admin/users')
    
    if (response.data.success) {
      admins.value = response.data.data.filter((user: any) => 
        user.roles && user.roles.includes('ADMIN')
      )
    } else {
      throw new Error('Failed to load admin users')
    }
  } catch (err: any) {
    console.error('Error fetching admins:', err)
    error.value = err.response?.data?.message || 'Failed to load admin users'
    toast.showError('Error', error.value || 'Failed to load admin users')
  } finally {
    isLoading.value = false
  }
}

const fetchAvailableEmployees = async () => {
  try {
    const response = await employeeApiService.getNonAdminEmployeesForDropdown()
    
    if (response.success) {
      availableEmployees.value = response.data
    }
  } catch (err: any) {
    console.error('Error fetching non-admin employees:', err)
    toast.showError('Error', 'Failed to load available employees')
  }
}

const showAddAdminModal = async () => {
  await fetchAvailableEmployees()
  const modal = new Modal(document.getElementById('addAdminModal')!)
  modal.show()
}

const onEmployeeChange = (employee: any) => {
  selectedEmployee.value = employee
  if (employee) {
    newAdmin.value.employeeId = employee.id
    // Auto-fill username with employee ID
    newAdmin.value.username = employee.employeeId
    // Clear validation errors when employee is selected
    clearFieldValidation('employeeId')
  } else {
    newAdmin.value.employeeId = ''
    newAdmin.value.username = ''
  }
}

// Password visibility toggle methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Password validation methods
const validatePassword = () => {
  const password = newAdmin.value.password
  
  passwordStrength.value = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
  
  // Clear password error if all validations pass
  if (Object.values(passwordStrength.value).every(Boolean)) {
    delete errors.value.password
  }
  
  // Also validate password match when password changes
  validatePasswordMatch()
}

const validatePasswordMatch = () => {
  if (!newAdmin.value.password) {
    // If no password, clear confirm password errors
    delete errors.value.confirmPassword
    return
  }
  
  if (!newAdmin.value.confirmPassword) {
    // If password exists but no confirm password
    errors.value.confirmPassword = 'Please confirm your password'
    return
  }
  
  if (newAdmin.value.password !== newAdmin.value.confirmPassword) {
    // Passwords don't match
    errors.value.confirmPassword = 'Passwords do not match'
  } else {
    // Passwords match
    delete errors.value.confirmPassword
  }
}

const isPasswordValid = () => {
  return Object.values(passwordStrength.value).every(Boolean)
}

const scrollToFirstError = () => {
  const firstInvalid = document.querySelector('.is-invalid, :invalid') as HTMLElement
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
    
    setTimeout(() => {
      firstInvalid.focus()
    }, 500)
  }
}

const getFieldClass = (fieldName: string) => {
  if (errors.value[fieldName]) {
    return 'is-invalid'
  }
  
  // For password fields, show valid state when they meet requirements
  if (fieldName === 'password' && newAdmin.value.password && isPasswordValid()) {
    return 'is-valid'
  }
  
  // For confirm password, show valid when passwords match
  if (fieldName === 'confirmPassword' && newAdmin.value.password && newAdmin.value.confirmPassword && passwordsMatch.value) {
    return 'is-valid'
  }
  
  // For username, show valid when it has content
  if (fieldName === 'username' && newAdmin.value.username?.trim()) {
    return 'is-valid'
  }
  
  // For employee selection, show valid when selected
  if (fieldName === 'employeeId' && newAdmin.value.employeeId) {
    return 'is-valid'
  }
  
  return ''
}

const clearFieldValidation = (fieldName: string) => {
  if (errors.value[fieldName]) {
    delete errors.value[fieldName]
  }
}

const handleAddAdmin = async () => {
  try {
    isSubmitting.value = true
    errors.value = {}

    // Validate all required fields
    const requiredFields = ['employeeId', 'username', 'password', 'confirmPassword']
    let isFormValid = true

    // Check if employee is selected
    if (!newAdmin.value.employeeId) {
      errors.value.employeeId = 'Please select an employee'
      isFormValid = false
    }

    // Check if username is provided
    if (!newAdmin.value.username?.trim()) {
      errors.value.username = 'Username is required'
      isFormValid = false
    }

    // Check password validation
    if (!isPasswordValid()) {
      errors.value.password = 'Password must meet all requirements'
      isFormValid = false
    }

    // Check password match
    if (newAdmin.value.password && newAdmin.value.confirmPassword && !passwordsMatch.value) {
      errors.value.confirmPassword = 'Passwords do not match'
      isFormValid = false
    } else if (!newAdmin.value.confirmPassword) {
      errors.value.confirmPassword = 'Please confirm your password'
      isFormValid = false
    }

    // If validation fails, scroll to first error and return
    if (!isFormValid) {
      await nextTick()
      scrollToFirstError()
      return
    }

    const response = await authAxios.post('/admin/users', {
      employeeId: parseInt(newAdmin.value.employeeId),
      username: newAdmin.value.username,
      password: newAdmin.value.password,
      roles: ['ADMIN']
    })

    if (response.data.success) {
      toast.showSuccess('Success', 'Admin user created successfully')
      
      // Reset form
      newAdmin.value = {
        employeeId: '',
        username: '',
        password: '',
        confirmPassword: ''
      }
      selectedEmployee.value = null
      
      // Close modal
      const modal = Modal.getInstance(document.getElementById('addAdminModal')!)
      modal?.hide()
      
      // Refresh admins list
      await fetchAdmins()
    } else {
      throw new Error(response.data.message || 'Failed to create admin user')
    }
  } catch (err: any) {
    console.error('Error creating admin:', err)
    const errorMessage = err.response?.data?.message || 'Failed to create admin user'
    
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      toast.showError('Error', errorMessage)
    }
  } finally {
    isSubmitting.value = false
  }
}

const toggleAdminStatus = async (admin: any) => {
  try {
    isSubmitting.value = true

    const response = await authAxios.patch(`/admin/users/${admin.id}/status`, {
      isActive: !admin.isActive
    })

    if (response.data.success) {
      admin.isActive = !admin.isActive
      toast.showSuccess('Success', `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`)
    } else {
      throw new Error(response.data.message || 'Failed to update admin status')
    }
  } catch (err: any) {
    console.error('Error updating admin status:', err)
    toast.showError('Error', err.response?.data?.message || 'Failed to update admin status')
  } finally {
    isSubmitting.value = false
  }
}

const removeAdmin = (admin: any) => {
  selectedAdmin.value = admin
  const modal = new Modal(document.getElementById('removeAdminModal')!)
  modal.show()
}

const confirmRemoveAdmin = async () => {
  try {
    isSubmitting.value = true

    const response = await authAxios.delete(`/admin/users/${selectedAdmin.value.id}`)

    if (response.data.success) {
      toast.showSuccess('Success', 'Admin removed successfully')
      
      // Close modal
      const modal = Modal.getInstance(document.getElementById('removeAdminModal')!)
      modal?.hide()
      
      // Refresh admins list
      await fetchAdmins()
    } else {
      throw new Error(response.data.message || 'Failed to remove admin')
    }
  } catch (err: any) {
    console.error('Error removing admin:', err)
    toast.showError('Error', err.response?.data?.message || 'Failed to remove admin')
  } finally {
    isSubmitting.value = false
  }
}

const getEmployeeIconColor = (employeeId: string) => {
  const colors = [
    'var(--secondary-purple)',
    'var(--secondary-green)', 
    'var(--secondary-pink)',
    'var(--secondary-orange)',
    'var(--secondary-red)',
    'var(--secondary-blue)',
    'var(--secondary-brown)',
    'var(--primary-dark-gray)'
  ]
  
  // Use employee ID to generate consistent color
  const hash = employeeId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Never'

  try {
    // Try native parse first (handles ISO and many standard formats)
    const native = new Date(dateString)
    if (!isNaN(native.getTime())) {
      return native.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Handle "DD/MM/YYYY" or "DD/MM/YYYY, HH:mm:ss"
    const [datePart] = dateString.split(',')
    const [dayStr, monthStr, yearStr] = datePart.trim().split('/')
    const day = parseInt(dayStr, 10)
    const month = parseInt(monthStr, 10) - 1
    const year = parseInt(yearStr, 10)

    const date = new Date(year, month, day)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return 'Never'
  } catch (error) {
    return 'Never'
  }
}

const formatTime = (dateString: string) => {
  if (!dateString) return ''

  try {
    // Try native parse
    const native = new Date(dateString)
    if (!isNaN(native.getTime())) {
      return native.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    // Handle "DD/MM/YYYY, HH:mm:ss" format
    const parts = dateString.split(',')
    if (parts.length >= 2) {
      const datePart = parts[0].trim()
      const timePart = parts[1].trim()

      const [dayStr, monthStr, yearStr] = datePart.split('/')
      const [hhStr, mmStr, ssStr = '00'] = timePart.split(':')

      const day = parseInt(dayStr, 10)
      const month = parseInt(monthStr, 10) - 1
      const year = parseInt(yearStr, 10)
      const hh = parseInt(hhStr, 10)
      const mm = parseInt(mmStr, 10)
      const ss = parseInt(ssStr, 10)

      const date = new Date(year, month, day, hh, mm, ss)
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
    }

    return ''
  } catch (error) {
    return ''
  }
}

// Lifecycle
onMounted(() => {
  // Ensure we have the latest user id
  currentUserId.value = authService.getUserId()
  fetchAdmins()
})
</script>

<style scoped>
.avatar-sm {
  width: 40px !important;
  height: 40px !important;
  font-size: 0.875rem;
  flex-shrink: 0 !important;
  min-width: 40px !important;
  min-height: 40px !important;
  max-width: 40px !important;
  max-height: 40px !important;
}

.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-group .btn {
  margin-right: 2px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

/* Admin table specific styling */
.admin-table {
  table-layout: fixed;
  width: 100%;
}

/* Column width adjustments - using fixed percentages */
.admin-table th:nth-child(1),
.admin-table td:nth-child(1) {
  width: 32% !important; /* Admin column - reduced space */
  min-width: 250px !important;
  max-width: none !important;
}

.admin-table th:nth-child(2),
.admin-table td:nth-child(2) {
  width: 25% !important; /* Email column - good space */
  min-width: 200px !important;
}

.admin-table th:nth-child(3),
.admin-table td:nth-child(3) {
  width: 18% !important; /* Employee ID column - increased */
  min-width: 120px !important;
}

.admin-table th:nth-child(4),
.admin-table td:nth-child(4) {
  width: 8% !important; /* Status column - minimal */
  min-width: 70px !important;
}

.admin-table th:nth-child(5),
.admin-table td:nth-child(5) {
  width: 12% !important; /* Last Login column - minimal */
  min-width: 100px !important;
}

.admin-table th:nth-child(6),
.admin-table td:nth-child(6) {
  width: 15% !important; /* Actions column - minimal */
  min-width: 120px !important;
}

/* Ensure text truncation works properly */
.min-width-0 {
  min-width: 0;
}

/* Force admin cell to not compress avatar */
.admin-table td:first-child {
  overflow: visible !important;
}

.admin-table td:first-child .d-flex {
  min-width: 0;
  align-items: center;
}

.admin-table td:first-child .d-flex > div:first-child {
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  flex-basis: 40px !important;
}

.admin-table td:first-child .d-flex > div:last-child {
  flex-grow: 1;
  min-width: 0;
  overflow: hidden;
}

/* Password strength indicator styles */
.password-strength {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
}

.strength-item {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.strength-item i {
  width: 16px;
  text-align: center;
}

.strength-item.valid {
  color: var(--bs-success);
}

.strength-item:not(.valid) {
  color: var(--bs-danger);
}

/* Input group button styling */
.input-group .btn {
  border-left: 0;
  border-color: #ced4da;
}

.input-group .form-control:focus + .btn {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Valid feedback styling */
.valid-feedback {
  display: block !important;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.valid-feedback i {
  font-size: 0.75rem;
}

/* Form validation styling */
.modal-body .form-control.is-valid {
  border-color: #21AF65 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
}

.modal-body .form-control.is-invalid {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
  animation: subtle-shake 0.3s ease-in-out;
}

.modal-body .form-control.is-valid:focus {
  border-color: #21AF65 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
}

.modal-body .form-control.is-invalid:focus {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
}

/* SearchableDropdown validation styling */
.modal-body :deep(.form-control.is-valid) {
  border-color: #21AF65 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
}

.modal-body :deep(.form-control.is-invalid) {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
  animation: subtle-shake 0.3s ease-in-out !important;
}

.modal-body :deep(.form-control.is-valid:focus) {
  border-color: #21AF65 !important;
  box-shadow: 0 0 0 0.2rem rgba(33, 175, 101, 0.25) !important;
}

.modal-body :deep(.form-control.is-invalid:focus) {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
}

/* Shake animation for invalid fields */
@keyframes subtle-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
</style>
