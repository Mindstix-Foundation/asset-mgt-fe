<template>
  <div class="login-page">
    <div class="container-fluid min-vh-100 d-flex justify-content-center position-relative" style="padding-top: 5vh; padding-bottom: 5vh;">
      <div class="row w-100 justify-content-center">
        <div class="col-12 col-md-8 col-lg-5 col-xl-4">
          <div class="login-card">
            <div class="login-card-body">
              <!-- Logo and Header -->
              <div class="text-center mb-4">
                <div class="login-logo mb-3">
                  <i class="fas fa-key"></i>
                </div>
                <div class="brand-name mb-2">Pebble Asset Tracker</div>
                <p class="login-subtitle">Reset your account password</p>
                <p class="forgot-password-description">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              <!-- Forgot Password Form -->
              <form class="forgot-password-form" @submit.prevent="handleSendResetLink">
                <!-- Email Input -->
                <div class="login-field-label mb-2">
                  <label for="email">
                    <i class="fas fa-envelope me-2"></i>Email Address
                  </label>
                </div>
                <div class="mb-4 position-relative">
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-control login-input"
                    :class="{ 'is-invalid': emailError }"
                    placeholder="Enter your email address"
                    aria-label="Email Address"
                    :disabled="isLoading"
                    @input="clearError"
                  />
                </div>

                <!-- Success Message -->
                <div v-if="successMessage" class="success-message mt-3" role="alert">
                  <i class="fas fa-check-circle me-2"></i>
                  <span>{{ successMessage }}</span>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="error-message mt-3" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  <span>{{ errorMessage }}</span>
                </div>

                <!-- Send Reset Link Button -->
                <button
                  type="submit"
                  class="btn btn-purple btn-lg w-100 mt-3"
                  :disabled="isLoading || !email"
                  aria-label="Send password reset link"
                >
                  <i v-if="isLoading" class="fas fa-spinner fa-spin me-2"></i>
                  <i v-else class="fas fa-paper-plane me-2"></i>
                  {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
                </button>

                <!-- Back to Login -->
                <div class="d-flex justify-content-end mt-3">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api.config'

const router = useRouter()
const email = ref('')
const emailError = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/
  return emailRegex.test(String(email).toLowerCase())
}

const clearError = () => {
  emailError.value = false
  errorMessage.value = ''
}

const handleSendResetLink = async () => {
  // Reset messages
  errorMessage.value = ''
  successMessage.value = ''
  emailError.value = false

  // Validate email format
  if (!validateEmail(email.value)) {
    emailError.value = true
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  // Prevent global auth expired handler from redirecting during password reset
  ;(globalThis as any).preventAuthExpiredRedirect = true

  try {
    isLoading.value = true
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.auth.forgotPassword}`, {
      email: email.value,
    })

    // Show success message
    successMessage.value = response.data.message || 'Password reset link sent successfully! Please check your email.'

    // Clear the email input
    email.value = ''

    // Automatically redirect to login after 5 seconds
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 5000)
  } catch (error: any) {
    console.error('Reset link send error:', error)
    errorMessage.value =
      error.response?.data?.message ?? 'Failed to send reset link. Please try again.'
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
@import url('../../assets/styles/components/buttons.css');
@import url('../../assets/unified-form-styles.css');

/* Match login page theme and components */
.login-page {
  background: var(--bg-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.login-card {
  background: var(--bg-primary);
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--element-gray);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

.login-card-body {
  padding: 2.5rem;
}

.login-logo {
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

.login-logo i {
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

.login-subtitle {
  color: var(--primary-dark-gray);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.forgot-password-description {
  color: var(--primary-mid-gray);
  font-size: 0.95rem;
  margin-bottom: 0;
}

.login-field-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.login-field-label label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.login-field-label i {
  color: var(--accent-navy);
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.login-input {
  border: 2px solid var(--element-gray);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  height: auto;
  font-size: 1.05rem;
  transition: all 0.2s ease;
  background: var(--bg-primary);
  color: var(--text-secondary);
  box-shadow: none;
}

.login-input::placeholder {
  color: var(--primary-mid-gray);
  opacity: 0.8;
}

.login-input:focus {
  border-color: var(--accent-navy);
  box-shadow: 0 0 0 3px rgba(26, 42, 67, 0.25);
  outline: none;
  background-color: var(--primary-white);
  background-image: none;
}

.login-input:hover {
  border-color: var(--primary-dark-gray);
}

.login-input.is-invalid {
  border-color: rgba(233, 118, 118, 0.8);
  background: rgba(233, 118, 118, 0.08);
}

/* Custom button styles removed - using shared button system */

.error-message {
  color: var(--secondary-red);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
  background: rgba(233, 118, 118, 0.1);
  border: 1px solid rgba(233, 118, 118, 0.2);
  border-radius: 8px;
  padding: 0.875rem;
  text-align: left;
}

.success-message {
  color: #166534;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
  background: rgba(22, 101, 52, 0.1);
  border: 1px solid rgba(22, 101, 52, 0.2);
  border-radius: 8px;
  padding: 0.875rem;
  text-align: left;
}

.forgot-password-link {
  color: var(--secondary-purple);
  text-decoration: underline;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
}

.forgot-password-link:hover {
  color: var(--accent-navy);
  background: rgba(51, 31, 234, 0.1);
  text-decoration: underline;
}

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

/* Responsive */
@media (max-width: 768px) {
  .login-card-body {
    padding: 2rem 1.5rem;
  }

  .brand-name {
    font-size: 1.25rem;
  }

  .login-logo {
    width: 70px;
    height: 70px;
  }

  .login-logo i {
    font-size: 1.75rem;
  }
}

@media (max-width: 576px) {
  .login-card-body {
    padding: 1.5rem 1rem;
  }

  .brand-name {
    font-size: 1.1rem;
  }

  .login-logo {
    width: 60px;
    height: 60px;
  }

  .login-logo i {
    font-size: 1.5rem;
  }
}
</style>

