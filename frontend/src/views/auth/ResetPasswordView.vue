<template>
  <div class="reset-password-page">
    <div class="container-fluid min-vh-100 d-flex justify-content-center position-relative" style="padding-top: 5vh; padding-bottom: 5vh;">
      <div class="row w-100 justify-content-center">
        <div class="col-12 col-md-8 col-lg-5 col-xl-4">
          <div class="reset-password-card">
            <div class="reset-password-card-body">
              <!-- Logo and Header -->
              <div class="text-center mb-4">
                <div class="reset-password-logo mb-3">
                  <i class="fas fa-clipboard-check"></i>
                </div>
                <div class="brand-name mb-2">Pebble Asset Tracker</div>
                <p class="reset-password-subtitle">Create your new password</p>
                <p class="reset-password-description">Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
              </div>

              <!-- Reset Password Form -->
              <form class="reset-password-form" @submit.prevent="resetPassword">
                <!-- New Password Input -->
                <div class="reset-password-field-label mb-2">
                  <label for="new-password">
                    <i class="fas fa-lock me-2"></i>New Password
                  </label>
                </div>
                <div class="mb-3 position-relative password-field">
                  <input
                    id="new-password"
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-control reset-password-input"
                    :class="{
                      'is-invalid': !isPasswordValid && newPassword,
                      'is-valid': isPasswordValid && newPassword,
                    }"
                    placeholder="Enter new password"
                    :disabled="isLoading"
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
                </div>
                <div v-if="!isPasswordValid && newPassword" class="hint-message mb-3">
                  <i class="fas fa-info-circle me-2"></i>
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                </div>

                <!-- Confirm Password Input -->
                <div class="reset-password-field-label mb-2">
                  <label for="confirm-password">
                    <i class="fas fa-check-double me-2"></i>Confirm Password
                  </label>
                </div>
                <div class="mb-3 position-relative password-field">
                  <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control reset-password-input"
                    :class="{
                      'is-invalid': showError || (!doPasswordsMatch && confirmPassword),
                      'is-valid': doPasswordsMatch && confirmPassword,
                    }"
                    placeholder="Confirm new password"
                    :disabled="isLoading"
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
                </div>
                <div v-if="!doPasswordsMatch && confirmPassword" class="error-message mb-3">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Passwords do not match
                </div>

                <!-- Success Message -->
                <div v-if="successMessage" class="success-message" role="alert">
                  <i class="fas fa-check-circle me-2"></i>
                  {{ successMessage }}
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="error-message" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ errorMessage }}
                </div>

                <!-- Reset Password Button -->
                <button
                  type="submit"
                  class="btn btn-purple btn-lg w-100 mb-3"
                  :disabled="isLoading || !isPasswordValid || !doPasswordsMatch"
                >
                  <span class="btn-text" :class="{ 'opacity-0': isLoading }">
                    <i v-if="!isLoading" class="fas fa-check me-2"></i>
                    {{ isLoading ? 'Resetting...' : 'Reset Password' }}
                  </span>
                  <div v-if="isLoading" class="btn-loader">
                    <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                  </div>
                </button>

                <!-- Back to Login -->
                <div class="d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-gray btn-sm"
                    @click="backToLogin"
                    :disabled="isLoading"
                  >
                    <i class="fas fa-arrow-left me-2"></i>
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const showError = ref(false)
const successMessage = ref('')
const isLoading = ref(false)

// Get token from URL
const token = computed(() => route.query.token as string)

// Validate token on mount
onMounted(() => {
  if (!token.value) {
    router.push({ name: 'login' })
  }
})

// Password regex for validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Computed properties for validation
const isPasswordValid = computed(() => passwordRegex.test(newPassword.value))
const doPasswordsMatch = computed(() => newPassword.value === confirmPassword.value)

const resetPassword = async () => {
  // Reset error states
  showError.value = false
  errorMessage.value = ''
  successMessage.value = ''

  // Validate password
  if (!isPasswordValid.value) {
    showError.value = true
    errorMessage.value = 'Password does not meet complexity requirements.'
    return
  }

  // Check if passwords match
  if (!doPasswordsMatch.value) {
    showError.value = true
    errorMessage.value = 'Passwords do not match.'
    return
  }

  // Prevent global auth expired handler from redirecting during password reset
  ;(globalThis as any).preventAuthExpiredRedirect = true

  try {
    isLoading.value = true
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    const response = await axios.post(`${apiUrl}/auth/reset-password`, {
      token: token.value,
      newPassword: newPassword.value,
    })

    // Show success message
    successMessage.value = response.data.message || 'Password successfully reset!'

    // Clear form
    newPassword.value = ''
    confirmPassword.value = ''

    // Wait for 2 seconds before redirecting to login
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } catch (error: any) {
    console.error('Password reset error:', error)
    showError.value = true
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else if (error.response?.status === 401) {
      errorMessage.value = 'Invalid or expired reset token. Please request a new reset link.'
    } else {
      errorMessage.value = 'Failed to reset password. Please try again.'
    }
  } finally {
    // Re-enable global handler after request completes
    ;(globalThis as any).preventAuthExpiredRedirect = false
    isLoading.value = false
  }
}

const backToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped>
@import url('../../assets/unified-form-styles.css');
@import url('../../assets/styles/components/buttons.css');
/* Animations (match login) */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Page background to match login */
.reset-password-page {
  background: var(--bg-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Card styling aligned with login */
.reset-password-card {
  background: var(--bg-primary);
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--element-gray);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.reset-password-card-body {
  padding: 2.5rem;
}

.reset-password-logo {
  width: 80px;
  height: 80px;
  background: var(--primary-light-gray);
  border: 2px solid var(--element-gray);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.reset-password-logo i {
  font-size: 2rem;
  color: var(--accent-navy);
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 0.5rem;
}

.reset-password-subtitle {
  color: var(--primary-dark-gray);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.reset-password-description {
  color: var(--primary-mid-gray);
  font-size: 0.95rem;
  margin-bottom: 0;
}

/* Field labels aligned with login */
.reset-password-field-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.reset-password-field-label label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.reset-password-field-label i {
  color: var(--accent-navy);
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

/* Inputs aligned with login - consistent styling for both password fields */
.reset-password-input {
  border: 2px solid var(--element-gray);
  border-radius: 8px;
  padding: 0.75rem 3rem 0.75rem 1rem;
  height: auto;
  font-size: 1.05rem;
  transition: all 0.2s ease;
  background: var(--bg-primary);
  color: var(--text-secondary);
  box-shadow: none;
  width: 100%;
}

.reset-password-input::placeholder {
  color: var(--primary-mid-gray);
  opacity: 0.8;
}

/* Consistent focus effect for both input fields - matching LoginView */
.reset-password-input:focus {
  border-color: var(--accent-navy) !important;
  box-shadow: 0 0 0 3px rgba(26, 42, 67, 0.25) !important;
  outline: none !important;
  background-color: var(--primary-white) !important;
  background-image: none !important;
}

.reset-password-input:hover {
  border-color: var(--primary-dark-gray);
}

.reset-password-input.is-invalid {
  border-color: var(--secondary-red);
  background: rgba(233, 118, 118, 0.08);
}

.reset-password-input.is-valid {
  border-color: #22c55e;
  background: #f0fdf4;
}

.reset-password-input:disabled {
  background: var(--primary-light-gray);
  cursor: not-allowed;
}

/* Password toggle aligned with login */
.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--primary-mid-gray);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  z-index: var(--z-dropdown);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  pointer-events: auto;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.password-toggle:hover:not(:disabled) {
  color: var(--secondary-purple);
  background: rgba(51, 31, 234, 0.15);
}

.password-toggle:focus {
  outline: 2px solid var(--secondary-purple);
  outline-offset: 2px;
  color: var(--secondary-purple);
  background: rgba(51, 31, 234, 0.15);
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.password-toggle i {
  font-size: 16px;
}

/* Hints and messages aligned with login */
.hint-message {
  color: var(--primary-dark-gray);
  font-size: 0.9rem;
}

.error-message {
  color: var(--secondary-red);
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(233, 118, 118, 0.1);
  border: 1px solid rgba(233, 118, 118, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
}

.success-message {
  color: #166534;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f0fdf4;
  border: 1px solid rgba(22, 101, 52, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
}

/* Button loader for reset password button */
.btn-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments (match login) */
@media (max-width: 768px) {
  .reset-password-card-body {
    padding: 2rem 1.5rem;
  }

  .brand-name {
    font-size: 1.25rem;
  }

  .reset-password-logo {
    width: 70px;
    height: 70px;
  }

  .reset-password-logo i {
    font-size: 1.75rem;
  }
}

@media (max-width: 576px) {
  .reset-password-card-body {
    padding: 1.5rem 1rem;
  }

  .brand-name {
    font-size: 1.1rem;
  }

  .reset-password-logo {
    width: 60px;
    height: 60px;
  }

  .reset-password-logo i {
    font-size: 1.5rem;
  }
}
</style>

