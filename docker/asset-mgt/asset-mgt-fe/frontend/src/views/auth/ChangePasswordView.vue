<template>
  <div class="change-password-page">
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4" style="border: none; border-bottom: none;">
        <div>
          <h2 class="mb-0" style="color: var(--primary-black);">
            <i class="fas fa-key me-2"></i>
            Change Password
          </h2>
          <p class="text-muted mb-0">Update your password to keep your account secure</p>
        </div>
      </div>

      <!-- Change Password Form -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <form @submit.prevent="handleChangePassword">
                <!-- Current Password -->
                <div class="mb-4">
                  <label for="current-password" class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">
                    <i class="fas fa-lock me-2"></i>Current Password
                  </label>
                  <div class="position-relative password-field">
                    <input
                      id="current-password"
                      v-model="currentPassword"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      class="form-control"
                      placeholder="Enter current password"
                      name="current-password"
                      :autocomplete="showCurrentPassword ? 'off' : 'current-password'"
                      :class="{ 'is-invalid': currentPasswordError }"
                      :disabled="isLoading"
                      @input="clearErrors"
                      required
                    />
                    <button
                      class="password-toggle"
                      type="button"
                      @click="showCurrentPassword = !showCurrentPassword"
                      aria-label="Toggle password visibility"
                      :disabled="isLoading"
                    >
                      <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                    <div v-if="currentPasswordError" class="invalid-feedback">
                      {{ currentPasswordErrorMessage }}
                    </div>
                  </div>
                </div>

                <!-- New Password -->
                <div class="mb-4">
                  <label for="new-password" class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">
                    <i class="fas fa-key me-2"></i>New Password
                  </label>
                  <div class="position-relative password-field">
                    <input
                      id="new-password"
                      v-model="newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      class="form-control"
                      placeholder="Enter new password"
                      name="new-password"
                      :autocomplete="showNewPassword ? 'off' : 'new-password'"
                      :class="{ 'is-invalid': newPasswordError }"
                      :disabled="isLoading"
                      @input="validateNewPassword"
                      required
                    />
                    <button
                      class="password-toggle"
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      aria-label="Toggle password visibility"
                      :disabled="isLoading"
                    >
                      <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                    <div v-if="newPasswordError" class="invalid-feedback">
                      {{ newPasswordErrorMessage }}
                    </div>
                  </div>
                </div>

                <!-- Confirm New Password -->
                <div class="mb-4">
                  <label for="confirm-password" class="form-label fw-semibold text-muted" style="font-size: 0.875rem;">
                    <i class="fas fa-check me-2"></i>Confirm New Password
                  </label>
                  <div class="position-relative password-field">
                    <input
                      id="confirm-password"
                      v-model="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control"
                      placeholder="Confirm new password"
                      name="new-password"
                      :autocomplete="showConfirmPassword ? 'off' : 'new-password'"
                      :class="{ 'is-invalid': confirmPasswordError }"
                      :disabled="isLoading"
                      @input="validateConfirmPassword"
                      required
                    />
                    <button
                      class="password-toggle"
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      aria-label="Toggle password visibility"
                      :disabled="isLoading"
                    >
                      <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                    <div v-if="confirmPasswordError" class="invalid-feedback">
                      {{ confirmPasswordErrorMessage }}
                    </div>
                  </div>
                </div>

                <!-- Error/Success Messages -->
                <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
                  <i class="fas fa-check-circle me-2"></i>
                  {{ successMessage }}
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="d-flex gap-2 flex-wrap justify-content-center">
            <button
              type="button"
              @click="handleCancel"
              class="btn btn-cancel"
              :disabled="isLoading"
            >
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              @click="handleChangePassword"
              class="btn btn-purple"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              <i v-else class="fas fa-key me-2"></i>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAxios } from '@/services/core/authService'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const toast = useToastStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const currentPasswordError = ref(false)
const currentPasswordErrorMessage = ref('')
const newPasswordError = ref(false)
const newPasswordErrorMessage = ref('')
const confirmPasswordError = ref(false)
const confirmPasswordErrorMessage = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Password regex for validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const clearErrors = () => {
  currentPasswordError.value = false
  currentPasswordErrorMessage.value = ''
  newPasswordError.value = false
  newPasswordErrorMessage.value = ''
  confirmPasswordError.value = false
  confirmPasswordErrorMessage.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

const validateNewPassword = () => {
  clearErrors()
  if (newPassword.value && !passwordRegex.test(newPassword.value)) {
    newPasswordError.value = true
    newPasswordErrorMessage.value =
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
  }
  validateConfirmPassword() // Re-validate confirm password if new password changes
}

const validateConfirmPassword = () => {
  confirmPasswordError.value = false
  confirmPasswordErrorMessage.value = ''
  if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = true
    confirmPasswordErrorMessage.value = 'New passwords do not match.'
  }
}

const isFormValid = computed(() => {
  return (
    currentPassword.value &&
    newPassword.value &&
    confirmPassword.value &&
    passwordRegex.test(newPassword.value) &&
    newPassword.value === confirmPassword.value &&
    !currentPasswordError.value &&
    !newPasswordError.value &&
    !confirmPasswordError.value
  )
})

const handleChangePassword = async () => {
  clearErrors()
  validateNewPassword()
  validateConfirmPassword()

  if (!isFormValid.value) {
    errorMessage.value = 'Please correct the errors in the form.'
    return
  }

  try {
    isLoading.value = true
    const response = await authAxios.post('/auth/change-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })

    successMessage.value = response.data.message || 'Password changed successfully!'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    // Show success toast
    toast.showSuccess('Success', 'Password changed successfully!')

    // Redirect to profile after 2 seconds
    setTimeout(() => {
      router.push('/app/profile')
    }, 2000)
  } catch (error: any) {
    console.error('Change password error:', error)
    errorMessage.value =
      error.response?.data?.message || 'Failed to change password. Please try again.'
    if (error.response?.status === 401) {
      currentPasswordError.value = true
      currentPasswordErrorMessage.value = 'Current password is incorrect.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/app/profile')
}
</script>

<style scoped>
@import url('../../assets/unified-form-styles.css');
@import url('../../assets/styles/components/buttons.css');
.change-password-page {
  background: var(--primary-white);
  min-height: 100vh;
}

/* Remove any borders from the page header */
.change-password-page .d-flex.justify-content-between {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
}

.password-field {
  position: relative;
  display: inline-block;
  width: 100%;
}

.password-field .form-control {
  padding-right: 45px !important; /* Ensure consistent space for eye icon */
  height: 3rem !important; /* Fixed height to match unified form styles */
  min-height: 3rem !important;
  max-height: 3rem !important;
  position: relative;
  
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 1.5rem; /* Fixed position: half of 3rem height */
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--primary-dark-gray);
  cursor: pointer;
  padding: 0;
  
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* Ensure proper spacing for error messages */
.password-field .invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0;
  position: relative;
  
}

/* Ensure proper spacing and layout for each form field */
.change-password-page .mb-4 {
  margin-bottom: 1rem !important;
  position: relative;
  display: block;
}

/* Ensure error messages don't affect input positioning */
.change-password-page .mb-4 .password-field {
  margin-bottom: 0;
}

.password-toggle:hover {
  color: var(--primary-black);
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .change-password-page .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .change-password-page .d-flex.gap-2 .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .change-password-page .card-body {
    padding: 1.5rem;
  }
}
</style>