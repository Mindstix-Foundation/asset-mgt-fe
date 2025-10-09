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
                  <i class="fas fa-clipboard-check"></i>
                </div>
                <div class="brand-name mb-2">TrackStix</div>
                <p class="login-subtitle">Sign in to your Asset Management portal</p>
              </div>

              <!-- Login Form -->
              <form class="login-form" @submit.prevent="handleLogin">
                <!-- Username Input with clear label -->
                <div class="login-field-label mb-2">
                  <label for="username">
                    <i class="fas fa-user me-2"></i>Employee ID or Email Address
                  </label>
                </div>
                <div class="mb-4 position-relative">
                  <input
                    id="username"
                    v-model="loginForm.username"
                    type="text"
                    class="form-control login-input"
                    placeholder="Enter your employee ID or email"
                    aria-label="Employee ID or Email Address"
                    :disabled="isLoading"
                    @input="clearError"
                  />
                </div>

                <!-- Password Input with clear label -->
                <div class="login-field-label mb-2">
                  <label for="password">
                    <i class="fas fa-lock me-2"></i>Password
                  </label>
                </div>
                <div class="mb-3 position-relative password-field">
                  <input
                    id="password"
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control login-input"
                    placeholder="Enter your password"
                    aria-label="Password"
                    :disabled="isLoading"
                    @input="clearError"
                  />
                  <button
                    class="password-toggle"
                    type="button"
                    @click="togglePassword"
                    aria-label="Toggle password visibility"
                    :disabled="isLoading"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>

                <!-- Login Error Message -->
                <div v-if="loginError" class="error-message mt-3" role="alert">
                  <span>{{ loginError }}</span>
                </div>
                
                <!-- Forgot Password -->
                <div class="d-flex justify-content-end align-items-center mb-3">
                  <router-link to="/forgot-password" class="forgot-password-link">
                    <i class="fas fa-key me-1"></i>
                    Forgot password?
                  </router-link>
                </div>
                
                <!-- Login Button -->
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="btn btn-purple w-100"
                  :class="{ loading: isLoading }"
                  aria-label="Sign in to your account"
                >
                  <span class="btn-text" :class="{ 'opacity-0': isLoading }">
                    {{ isLoading ? 'Signing In...' : 'Sign In to Account' }}
                  </span>
                  <div v-if="isLoading" class="btn-loader">
                    <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive form data
const loginForm = reactive({
  username: '',
  password: ''
})

// Component state
const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref('')

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Clear error when user types
const clearError = () => {
  if (loginError.value) {
    loginError.value = ''
  }
}

// Handle login form submission - using proper backend authentication
const handleLogin = async () => {
  // Clear previous errors
  loginError.value = ''
  
  // Validate inputs
  if (!loginForm.username.trim()) {
    document.getElementById('username')?.focus()
    return
  }
  
  if (!loginForm.password.trim()) {
    document.getElementById('password')?.focus()
    return
  }
  
  // Set loading state
  isLoading.value = true
  
  // Prevent global auth expired handler from redirecting during login
  ;(globalThis as any).preventAuthExpiredRedirect = true
  
  try {
    // Call the backend API
    const result = await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    if (result.success) {
      // Redirect to dashboard
      router.push('/app/dashboard')
    } else {
      loginError.value = result.error || 'Login failed'
      
      // Add shake animation
      const loginBtn = document.querySelector('.btn.btn-purple') as HTMLElement
      if (loginBtn) {
        loginBtn.style.animation = 'shake 0.5s ease-in-out'
        setTimeout(() => {
          loginBtn.style.animation = ''
        }, 500)
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'An error occurred during login. Please try again.'
  } finally {
    // Re-enable global handler after login attempt completes
    ;(globalThis as any).preventAuthExpiredRedirect = false
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('../../assets/styles/components/buttons.css');
/* Use styles from main.css - no need to duplicate CSS variables */

/* Custom animations matching prototype */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
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

/* Login page specific styles - using main.css variables */
.login-page {
  background: var(--bg-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Login card styling to match prototype exactly */
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
  margin-bottom: 0;
}

/* Login field label styling to match prototype exactly */
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

/* Login inputs matching prototype */
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

/* Password field styling matching prototype */
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
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  pointer-events: auto;
  outline: none;
  -webkit-appearance: none;
}

.password-toggle:hover {
  color: var(--secondary-purple);
  background: rgba(51, 31, 234, 0.15);
}

.password-toggle:focus {
  outline: 2px solid var(--secondary-purple);
  outline-offset: 2px;
  color: var(--secondary-purple);
  background: rgba(51, 31, 234, 0.15);
}

.password-toggle i {
  font-size: 16px;
}

/* Forgot password link matching prototype */
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

/* Loading state for login button */
.btn.loading {
  pointer-events: none;
}

.btn-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Error message styling matching prototype */
.error-message {
  color: var(--secondary-red);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
  background: rgba(233, 118, 118, 0.1);
  border: 1px solid rgba(233, 118, 118, 0.2);
  border-radius: 8px;
  padding: 0.875rem;
  text-align: center;
}

/* Focus states for accessibility */
:focus-visible {
  outline: 3px solid var(--secondary-purple);
  outline-offset: 2px;
}

.login-btn:focus-visible {
  outline: 3px solid var(--primary-white);
  outline-offset: 3px;
}

/* Responsive design matching prototype */
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