<template>
  <div class="login-page min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="login-card bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <!-- Logo and Header -->
        <div class="text-center mb-8">
          <div class="login-logo w-20 h-20 bg-gray-100 border-2 border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-clipboard-check text-3xl text-blue-900"></i>
          </div>
          <div class="brand-name text-2xl font-bold text-gray-900 mb-2">TrackStix</div>
          <p class="login-subtitle text-gray-600 text-base">Sign in to your Asset Management portal</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username Input -->
          <div>
            <label for="username" class="login-field-label flex items-center text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-user mr-2 text-blue-900"></i>
              Employee ID or Email Address
            </label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="login-input w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base bg-white text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-blue-900 focus:ring-4 focus:ring-blue-900/25 hover:border-gray-600"
              placeholder="Enter your employee ID or email"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="login-field-label flex items-center text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-lock mr-2 text-blue-900"></i>
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="login-input w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg text-base bg-white text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-blue-900 focus:ring-4 focus:ring-blue-900/25 hover:border-gray-600"
                placeholder="Enter your password"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle absolute right-3 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :disabled="isLoading"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-base"></i>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="loginError" class="error-message text-center text-red-500 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3">
            {{ loginError }}
          </div>

          <!-- Forgot Password -->
          <div class="flex justify-end">
            <a href="#" class="forgot-password-link text-purple-600 hover:text-blue-900 text-sm font-semibold underline px-2 py-1 rounded hover:bg-purple-50 transition-all duration-200 inline-flex items-center">
              <i class="fas fa-key mr-1"></i>
              Forgot password?
            </a>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading || !loginForm.username || !loginForm.password"
            class="login-btn w-full bg-purple-600 hover:bg-blue-900 active:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg py-3.5 px-8 min-h-[48px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center relative focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4"
          >
            <span v-if="!isLoading" class="btn-text">Sign In to Account</span>
            <span v-else class="btn-text opacity-0">Signing In...</span>
            <div v-if="isLoading" class="btn-loader absolute inset-0 flex items-center justify-center">
              <i class="fas fa-spinner fa-spin text-lg"></i>
            </div>
          </button>
        </form>
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

// Authentication is now handled by the backend API

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Handle login form submission
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
  
  try {
    // Call the backend API
    const result = await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    if (result.success) {
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      loginError.value = result.error || 'Login failed'
      
      // Add shake animation
      const loginBtn = document.querySelector('.login-btn') as HTMLElement
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
    isLoading.value = false
  }
}

// Clear error when user types
const clearError = () => {
  if (loginError.value) {
    loginError.value = ''
  }
}

// Watch for input changes to clear errors
import { watch } from 'vue'
watch(() => loginForm.username, clearError)
watch(() => loginForm.password, clearError)
</script>

<style scoped>
/* TrackStix Color Palette */
:root {
  --primary-white: #FFFFFF;
  --primary-light-gray: #F3F3F3;
  --primary-mid-light: #B7B7B7;
  --primary-mid-gray: #999999;
  --primary-dark-gray: #666666;
  --primary-black: #0A0A0A;
  --secondary-purple: #331FEA;
  --secondary-pink: #FF579F;
  --secondary-yellow: #FF8C61;
  --secondary-green: #21AF65;
  --secondary-orange: #FF8C61;
  --secondary-red: #E97676;
  --accent-navy: #1A2A43;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --text-primary: #0A0A0A;
  --text-secondary: #222222;
  --element-gray: #E0E0E0;
  --element-light-gray: #CCCCCC;
}

/* Custom animations */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Login page specific styles */
.login-page {
  background: var(--bg-secondary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.login-card {
  animation: slideUp 0.6s ease-out;
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

.login-logo {
  background: var(--primary-light-gray);
  border-color: var(--element-gray);
}

.login-logo i {
  color: var(--accent-navy);
}

.brand-name {
  color: var(--text-primary);
}

.login-subtitle {
  color: var(--primary-dark-gray);
}

.login-field-label {
  color: var(--text-secondary);
}

.login-field-label i {
  color: var(--accent-navy);
}

.login-input {
  color: var(--text-secondary);
  background: var(--bg-primary);
  border-color: var(--element-gray);
}

.login-input:focus {
  border-color: var(--accent-navy);
  box-shadow: 0 0 0 3px rgba(26, 42, 67, 0.25);
}

.login-input:hover {
  border-color: var(--primary-dark-gray);
}

.password-toggle {
  color: var(--primary-mid-gray);
}

.password-toggle:hover {
  color: var(--primary-dark-gray);
  background: rgba(0, 0, 0, 0.05);
}

.forgot-password-link {
  color: var(--secondary-purple);
}

.forgot-password-link:hover {
  color: var(--accent-navy);
  background: rgba(51, 31, 234, 0.1);
}

.login-btn {
  background: var(--secondary-purple);
  color: var(--bg-primary);
  box-shadow: 0 2px 4px rgba(10, 10, 10, 0.1);
  text-shadow: 0 1px 1px rgba(10, 10, 10, 0.2);
}

.login-btn:hover:not(:disabled) {
  background: var(--accent-navy);
  box-shadow: 0 4px 8px rgba(10, 10, 10, 0.15);
}

.login-btn:active:not(:disabled) {
  background: var(--primary-dark-gray);
  box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1);
}

.error-message {
  background: rgba(233, 118, 118, 0.1);
  border-color: rgba(233, 118, 118, 0.2);
  color: var(--secondary-red);
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-card {
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
  .login-card {
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