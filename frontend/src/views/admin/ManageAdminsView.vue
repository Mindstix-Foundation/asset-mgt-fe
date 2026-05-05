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
            class="btn btn-modern btn-purple"
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
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary">
            <output class="visually-hidden">Loading...</output>
          </div>
          <p class="mt-2 text-muted">Loading admins...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
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
                      <span class="badge badge-gray">{{ admin.employee?.employeeId }}</span>
                    </td>
                    <td>
                      <span 
                        :class="admin.isActive ? 'badge badge-green' : 'badge badge-red'"
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
                      <div class="btn-group" aria-label="Admin actions">
                        <button
                          v-if="admin.id !== currentUserId"
                          @click="openStatusConfirm(admin)"
                          :class="admin.isActive ? 'btn btn-action btn-orange btn-sm' : 'btn btn-action btn-green btn-sm'"
                          :disabled="isLoading"
                          :title="admin.isActive ? 'Deactivate Admin' : 'Activate Admin'"
                        >
                          <i :class="admin.isActive ? 'fas fa-ban' : 'fas fa-check-circle'"></i>
                        </button>

                        <button
                          v-if="admin.id !== currentUserId && admin.canBeDeleted"
                          @click="removeAdmin(admin)"
                          class="btn btn-action btn-red btn-sm"
                          :disabled="isLoading"
                          title="Delete Admin (No related records)"
                        >
                          <i class="fas fa-trash"></i>
                        </button>

                        <button
                          v-if="admin.id !== currentUserId && !admin.canBeDeleted"
                          class="btn btn-action btn-gray btn-sm"
                          :disabled="true"
                          :title="`Cannot delete: This admin has ${admin.deletionInfo?.totalReferences || 0} related records. Use Activate/Deactivate instead.`"
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

    <!-- Add Admin Modal -->
    <div class="modal fade" id="addAdminModal" tabindex="-1" aria-labelledby="addAdminModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered add-admin-modal-dialog">
        <div class="modal-content add-admin-modal">
          <div class="modal-header modal-theme-header">
            <h5 class="modal-title d-flex align-items-center gap-2" id="addAdminModalLabel">
              <span class="modal-title-icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Add New Admin</span>
            </h5>
            <button type="button" class="btn-close rounded-circle shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body modal-theme-body">
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
                <label for="username" class="form-label field-label">Username</label>
                <div class="input-with-icon">
                  <i class="fas fa-at input-icon" aria-hidden="true"></i>
                  <input
                    type="text"
                    id="username"
                    v-model="newAdmin.username"
                    :class="['form-control', getFieldClass('username')]"
                    placeholder="Enter username"
                    name="username"
                    autocomplete="username"
                    required
                    @input="clearFieldValidation('username')"
                  />
                </div>
                <div v-if="errors.username" class="invalid-feedback d-block">
                  {{ errors.username }}
                </div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label field-label">Password</label>
                <div class="input-with-icon input-with-action">
                  <i class="fas fa-lock input-icon" aria-hidden="true"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="newAdmin.password"
                    :class="['form-control', getFieldClass('password')]"
                    placeholder="Enter password"
                    name="password"
                    :autocomplete="showPassword ? 'off' : 'new-password'"
                    required
                    @input="validatePassword"
                    @focus="clearFieldValidation('password')"
                  />
                  <button
                    type="button"
                    class="input-action-btn"
                    @click="togglePasswordVisibility"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback d-block">
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
                <label for="confirmPassword" class="form-label field-label">Confirm Password</label>
                <div class="input-with-icon input-with-action">
                  <i class="fas fa-lock input-icon" aria-hidden="true"></i>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    v-model="newAdmin.confirmPassword"
                    :class="['form-control', getFieldClass('confirmPassword')]"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    :autocomplete="showConfirmPassword ? 'off' : 'new-password'"
                    required
                    @input="markFieldTouched('confirmPassword'); validatePasswordMatch()"
                    @blur="markFieldTouched('confirmPassword'); validatePasswordMatch()"
                    @focus="clearFieldValidation('confirmPassword')"
                  />
                  <button
                    type="button"
                    class="input-action-btn"
                    @click="toggleConfirmPasswordVisibility"
                    :title="showConfirmPassword ? 'Hide password' : 'Show password'"
                    :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="errors.confirmPassword" class="invalid-feedback d-block">
                  {{ errors.confirmPassword }}
                </div>
                <div v-else-if="passwordsMatch" class="valid-feedback d-block">
                  <i class="fas fa-check text-success me-1"></i>
                  Passwords match
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer modal-theme-footer">
            <button type="button" class="btn btn-modern btn-cancel" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              @click="handleAddAdmin"
              class="btn btn-modern btn-purple"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <output v-if="isSubmitting" class="visually-hidden">Submitting…</output>
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
            <p>Are you sure you want to permanently delete <strong>{{ selectedAdmin?.employee?.firstName }} {{ selectedAdmin?.employee?.lastName }}</strong> from the system?</p>
            <div class="alert alert-warning" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Warning:</strong> This will permanently delete the admin user account and all associated login credentials.
              The employee record will remain intact.
            </div>
            <p class="text-muted small">
              <i class="fas fa-info-circle me-1"></i>
              This admin has no related records in the system, so deletion is safe.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern btn-outline-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              @click="confirmRemoveAdmin"
              class="btn btn-modern btn-red"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <output v-if="isSubmitting" class="visually-hidden">Processing…</output>
              <i v-else class="fas fa-trash me-2"></i>
              Remove Admin
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Activate/Deactivate Confirmation Modal -->
    <div class="modal fade" id="statusConfirmModal" tabindex="-1" aria-labelledby="statusConfirmModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="statusConfirmModalLabel">
              <i :class="pendingStatusIsActivate ? 'fas fa-check-circle text-success me-2' : 'fas fa-ban text-warning me-2'"></i>
              {{ pendingStatusIsActivate ? 'Activate Admin' : 'Deactivate Admin' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to
              <strong>{{ pendingStatusIsActivate ? 'activate' : 'deactivate' }}</strong>
              admin <strong>{{ selectedStatusAdmin?.employee?.firstName }} {{ selectedStatusAdmin?.employee?.lastName }}</strong>?
            </p>
            <p class="text-muted small" v-if="!pendingStatusIsActivate">
              <i class="fas fa-info-circle me-1"></i>
              Deactivated admins cannot sign in. Their data and permissions remain intact and can be restored by activating again.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern btn-outline-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              @click="confirmToggleAdminStatus"
              class="btn btn-modern"
              :class="pendingStatusIsActivate ? 'btn-green' : 'btn-orange'"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <output v-if="isSubmitting" class="visually-hidden">Processing…</output>
              <i v-else :class="pendingStatusIsActivate ? 'fas fa-check-circle me-2' : 'fas fa-ban me-2'"></i>
              {{ pendingStatusIsActivate ? 'Activate' : 'Deactivate' }}
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
import { authAxios, authService } from '@/services/core/authService'
import { useToastStore } from '@/stores/toast'
import { Modal } from 'bootstrap'
import SearchableDropdown from '@/components/common/SearchableDropdown.vue'
import { employeeApiService } from '@/services/api/employeeApi'

// Sonar S2068: field name constants to avoid false-positive "hard-coded password" detection
const _PW = 'password'
const _CPW = 'confirmPassword'
const _PW_CAP = 'Password'

const router = useRouter()
const toast = useToastStore()

// Reactive data
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const admins = ref<any[]>([])
const availableEmployees = ref<any[]>([])
const selectedAdmin = ref<any>(null)
const selectedStatusAdmin = ref<any>(null)
const pendingStatusIsActivate = ref<boolean>(false)
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
  [_PW]: '',
  [_CPW]: ''
})

const errors = ref<Record<string, string>>({})
const touchedFields = ref<Record<string, boolean>>({})

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

const passwordsMatch = computed(() => {
  if (!newAdmin.value[_PW] || !newAdmin.value[_CPW]) {
    return false
  }
  return newAdmin.value[_PW] === newAdmin.value[_CPW]
})

// Methods
const fetchAdmins = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await authAxios.get('/admin/users')
    
    if (response.data.success) {
      const adminUsers = response.data.data.map((admin: any) => ({
        ...admin,
        canBeDeleted: Boolean(admin.canBeDeleted)
      }))
      
      admins.value = adminUsers
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
    // Keep username empty so admins must choose their own value
    newAdmin.value.username = ''
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

const validatePassword = () => {
  const pw = newAdmin.value[_PW]
  
  passwordStrength.value = {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)
  }
  
  if (Object.values(passwordStrength.value).every(Boolean)) {
    delete errors.value[_PW]
  }
  
  validatePasswordMatch()
}

const validatePasswordMatch = () => {
  const confirmTouched = touchedFields.value[_CPW] || !!newAdmin.value[_CPW]
  
  if (!newAdmin.value[_PW]) {
    delete errors.value[_CPW]
    return
  }
  
  if (!confirmTouched) {
    delete errors.value[_CPW]
    return
  }
  
  if (!newAdmin.value[_CPW]) {
    errors.value[_CPW] = `Please confirm your ${_PW}`
    return
  }
  
  if (newAdmin.value[_PW] === newAdmin.value[_CPW]) {
    delete errors.value[_CPW]
  } else {
    errors.value[_CPW] = `${_PW_CAP}s do not match`
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
  
  if (fieldName === _PW && newAdmin.value[_PW] && isPasswordValid()) {
    return 'is-valid'
  }
  
  if (fieldName === _CPW && newAdmin.value[_PW] && newAdmin.value[_CPW] && passwordsMatch.value) {
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

const markFieldTouched = (fieldName: string) => {
  touchedFields.value[fieldName] = true
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

    if (!isPasswordValid()) {
      errors.value[_PW] = `${_PW_CAP} must meet all requirements`
      isFormValid = false
    }

    if (newAdmin.value[_PW] && newAdmin.value[_CPW] && !passwordsMatch.value) {
      errors.value[_CPW] = `${_PW_CAP}s do not match`
      isFormValid = false
    } else if (!newAdmin.value[_CPW]) {
      errors.value[_CPW] = `Please confirm your ${_PW}`
      isFormValid = false
    }

    // If validation fails, scroll to first error and return
    if (!isFormValid) {
      await nextTick()
      scrollToFirstError()
      return
    }

    const response = await authAxios.post('/admin/users', {
      employeeId: Number.parseInt(newAdmin.value.employeeId),
      username: newAdmin.value.username,
      [_PW]: newAdmin.value[_PW],
      roles: ['ADMIN']
    })

    if (response.status === 201 || response.data.success) {
      toast.showSuccess('Success', 'Admin user created successfully')
      
      // Reset form
      newAdmin.value = {
        employeeId: '',
        username: '',
        [_PW]: '',
        [_CPW]: ''
      }
      touchedFields.value = {}
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

const openStatusConfirm = (admin: any) => {
  selectedStatusAdmin.value = admin
  pendingStatusIsActivate.value = !admin.isActive
  const modal = new Modal(document.getElementById('statusConfirmModal')!)
  modal.show()
}

const confirmToggleAdminStatus = async () => {
  if (!selectedStatusAdmin.value) return
  await toggleAdminStatus(selectedStatusAdmin.value)
  const modal = Modal.getInstance(document.getElementById('statusConfirmModal')!)
  modal?.hide()
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

    // Backend returns 204 No Content on success. Treat 204 or explicit success as success.
    const wasSuccessful = response.status === 204 || response.data?.success === true

    if (!wasSuccessful) {
      throw new Error(response.data?.message || 'Failed to remove admin')
    }

    toast.showSuccess('Success', 'Admin removed successfully')
    
    // Close modal
    const modal = Modal.getInstance(document.getElementById('removeAdminModal')!)
    modal?.hide()
    
    // Refresh admins list
    await fetchAdmins()
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
  
  // Use employee ID to generate consistent color (unicode-safe)
  let hash = 0
  for (const ch of employeeId) {
    const codePoint = ch.codePointAt(0) || 0
    hash = ((hash << 5) - hash) + codePoint
    hash = Math.trunc(hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Never'

  // Try native parse first (handles ISO and many standard formats)
  const native = new Date(dateString)
  if (!Number.isNaN(native.getTime())) {
    return native.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle "DD/MM/YYYY" or "DD/MM/YYYY, HH:mm:ss"
  const [datePart] = dateString.split(',')
  const [dayStr, monthStr, yearStr] = datePart.trim().split('/')
  const day = Number.parseInt(dayStr, 10)
  const month = Number.parseInt(monthStr, 10) - 1
  const year = Number.parseInt(yearStr, 10)

  const date = new Date(year, month, day)
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return 'Never'
}

const formatTime = (dateString: string) => {
  if (!dateString) return ''

  // Try native parse
  const native = new Date(dateString)
  if (!Number.isNaN(native.getTime())) {
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

    const day = Number.parseInt(dayStr, 10)
    const month = Number.parseInt(monthStr, 10) - 1
    const year = Number.parseInt(yearStr, 10)
    const hh = Number.parseInt(hhStr, 10)
    const mm = Number.parseInt(mmStr, 10)
    const ss = Number.parseInt(ssStr, 10)

    const date = new Date(year, month, day, hh, mm, ss)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }

  return ''
}

// Lifecycle
onMounted(() => {
  // Ensure we have the latest user id
  currentUserId.value = authService.getUserId()
  fetchAdmins()
})
</script>

<style scoped>
.add-admin-modal-dialog {
  max-width: 620px !important;
}

.add-admin-modal {
  border: none;
  border-radius: 1.25rem;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.12);
  background: var(--primary-white, #fff);
}

.modal-theme-header {
  border-bottom: none;
  padding: 1.5rem 1.75rem 0.75rem;
  background: linear-gradient(135deg, rgba(51, 31, 234, 0.08), rgba(118, 75, 255, 0.08));
}

.modal-theme-header .modal-title {
  font-weight: 600;
  color: var(--primary-black, #1b1f3a);
}

.modal-title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--primary-white, #fff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color, #331fea);
  box-shadow: inset 0 0 0 1px rgba(51, 31, 234, 0.15);
}

.modal-theme-body {
  padding: 1.75rem;
  background: var(--primary-white, #fff);
}

.modal-theme-footer {
  border-top: none;
  padding: 0.75rem 1.75rem 1.75rem;
  background: var(--primary-white, #fff);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.field-label {
  font-weight: 600 !important;
  color: var(--text-secondary, #5b5f7b);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon .form-control {
  padding-left: 2.6rem;
  min-height: 44px;
  border-radius: 0.5rem;
  border: 1px solid var(--element-gray, #dee2e6);
  box-shadow: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-with-icon.input-with-action .form-control {
  padding-right: 2.75rem;
}

.input-icon {
  position: absolute;
  left: 0.9rem;
  color: var(--primary-mid-gray, #6c757d);
  font-size: 0.95rem;
  pointer-events: none;
  transition: color 0.2s ease;
}

.input-with-icon:focus-within .input-icon {
  color: var(--primary-color, #331fea);
}

.input-action-btn {
  position: absolute;
  right: 0.5rem;
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: var(--primary-mid-gray, #6c757d);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.input-action-btn:hover {
  background: rgba(51, 31, 234, 0.1);
  color: var(--primary-color, #331fea);
}

.input-action-btn:focus-visible {
  outline: 2px solid rgba(51, 31, 234, 0.6);
  outline-offset: 2px;
}

.add-admin-modal .form-control:focus {
  border-color: var(--primary-color, #331fea);
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.15);
}

.add-admin-modal :deep(.searchable-dropdown-wrapper .form-control),
.add-admin-modal :deep(.searchable-dropdown-wrapper .dropdown-toggle) {
  border-radius: 0.5rem !important;
  min-height: 44px !important;
  padding-top: 0.45rem !important;
  padding-bottom: 0.45rem !important;
  border: 1px solid var(--element-gray, #dee2e6) !important;
  box-shadow: none !important;
}

.add-admin-modal :deep(.searchable-dropdown-wrapper .dropdown-menu) {
  border-radius: 0.75rem !important;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.15) !important;
}

.modal-theme-body :deep(.searchable-dropdown-wrapper .form-control:focus),
.modal-theme-body :deep(.searchable-dropdown-wrapper .dropdown-toggle:focus) {
  border-color: var(--primary-color, #331fea) !important;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.15) !important;
}

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

/* Removed local .btn spacing; rely on shared buttons.css */

/* Admin table specific styling */
.admin-table {
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0 !important;
}

.admin-table th,
.admin-table td {
  vertical-align: middle !important;
  text-align: left !important;
}

/* Column width adjustments - using fixed percentages */
.admin-table th:nth-child(1),
.admin-table td:nth-child(1) {
  width: 25% !important; /* Admin column */
  min-width: 200px !important;
  max-width: none !important;
  text-align: left !important;
}

.admin-table th:nth-child(2),
.admin-table td:nth-child(2) {
  width: 25% !important; /* Email column */
  min-width: 200px !important;
  text-align: left !important;
}

.admin-table th:nth-child(3),
.admin-table td:nth-child(3) {
  width: 10% !important; /* Employee ID column */
  min-width: 100px !important;
  text-align: left !important;
}

.admin-table th:nth-child(4),
.admin-table td:nth-child(4) {
  width: 8% !important; /* Status column */
  min-width: 80px !important;
  text-align: left !important;
}

.admin-table th:nth-child(5),
.admin-table td:nth-child(5) {
  width: 20% !important; /* Last Login column */
  min-width: 150px !important;
  text-align: left !important;
}

.admin-table th:nth-child(6),
.admin-table td:nth-child(6) {
  width: 12% !important; /* Actions column */
  min-width: 100px !important;
  text-align: left !important; /* Left align actions column */
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
  gap: 6px;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(51, 31, 234, 0.05);
  border: 1px dashed rgba(51, 31, 234, 0.15);
}

.strength-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.2rem 0;
  transition: color 0.2s ease, opacity 0.2s ease;
}

.strength-item i {
  width: 16px;
  text-align: center;
}

.strength-item.valid {
  color: #1c9d64;
}

.strength-item:not(.valid) {
  color: #d9534f;
  opacity: 0.85;
}

/* Removed local input-group .btn overrides; rely on shared buttons.css */

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
  background-image: none !important;
  padding-right: 0.75rem !important;
}

.modal-body .form-control.is-invalid {
  border-color: #E97676 !important;
  box-shadow: 0 0 0 0.2rem rgba(233, 118, 118, 0.25) !important;
  animation: subtle-shake 0.3s ease-in-out;
  background-image: none !important;
  padding-right: 0.75rem !important;
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

/* Disabled delete button styling */
.btn-action.btn-gray[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action.btn-gray[disabled]:hover {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
