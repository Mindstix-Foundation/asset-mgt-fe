<template>
  <div class="login-page">
    <div class="login-shell">
      <!-- Left: brand + register CTA (attendance-tool pattern) -->
      <aside class="login-brand-pane" aria-label="Pebble Asset Tracker">
        <div class="login-brand-pane__top">
          <img :src="brandLogo" alt="Pebble Asset Tracker" class="login-brand-wordmark" />
          <p class="login-brand-tagline">Asset Management Suite</p>
        </div>

        <section class="login-brand-pane__center">
          <div class="login-brand-hero">
            <span class="login-brand-hero__icon" aria-hidden="true">
              <i class="fas fa-boxes"></i>
            </span>
            <h1 class="login-brand-hero__headline">Track every asset. One place for every team.</h1>
            <p class="login-brand-hero__blurb">
              Inventory, assignments, maintenance, and vendors — scoped to your organization.
            </p>
          </div>
        </section>

        <div class="login-brand-pane__bottom">
          <p class="login-brand-pane__cta-label">New to the platform?</p>
          <router-link to="/register-organization" class="btn-register-org">
            <i class="fas fa-building me-2" aria-hidden="true"></i>
            Register as organization
          </router-link>
          <p class="login-brand-pane__cta-hint">
            Submit a request — a platform admin will review and grant access.
          </p>
        </div>
      </aside>

      <!-- Right: sign-in -->
      <main class="login-form-pane">
        <div class="login-card">
          <div class="login-card-body">
            <div class="text-center mb-4 login-header">
              <div class="login-logo mb-3">
                <img :src="loginLogo" alt="" class="login-logo-img" />
              </div>
              <h2 class="brand-name">Welcome</h2>
              <p class="login-subtitle">Sign in to your Asset Management portal</p>
            </div>

            <form class="login-form" @submit.prevent="handleLogin">
              <div class="login-field-label mb-2">
                <label for="username">
                  <i class="fas fa-user me-2"></i>Username, Employee ID, or Email
                </label>
              </div>
              <div class="mb-4 position-relative">
                <input
                  id="username"
                  v-model="loginForm.username"
                  type="text"
                  class="form-control login-input"
                  placeholder="Enter your username, employee ID, or email"
                  aria-label="Username, Employee ID, or Email Address"
                  :disabled="isLoading"
                  autocomplete="username"
                  @input="onUsernameInput"
                />
              </div>

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
                  autocomplete="current-password"
                  @input="onPasswordInput"
                />
                <button
                  class="password-toggle"
                  type="button"
                  aria-label="Toggle password visibility"
                  :disabled="isLoading"
                  @click="togglePassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>

              <div v-if="loginError" class="error-message mt-3" role="alert">
                <span>{{ loginError }}</span>
              </div>

              <div class="d-flex justify-content-end align-items-center mb-3">
                <router-link to="/forgot-password" class="forgot-password-link">
                  <i class="fas fa-key me-1"></i>
                  Forgot password?
                </router-link>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="btn btn-purple btn-lg w-100"
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

              <!-- Mobile-only register link (left pane hidden on small screens) -->
              <div class="login-mobile-register d-lg-none text-center mt-4">
                <p class="text-muted small mb-2">New organization?</p>
                <router-link to="/register-organization" class="forgot-password-link">
                  <i class="fas fa-building me-1"></i>
                  Register as organization
                </router-link>
              </div>
            </form>

            <p class="login-copyright">
              &copy; {{ currentYear }} Mindstix Software Labs
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { isPlatformUser } from '@/types/auth.types'
import loginLogo from '@/assets/logos/secondary/secondary-symbol.png'
import brandLogo from '@/assets/logos/primary/primary-wordmark.png'

const router = useRouter()
const authStore = useAuthStore()
const currentYear = new Date().getFullYear()

const loginForm = reactive({
  username: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const loginError = ref('')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const clearError = () => {
  if (loginError.value) {
    loginError.value = ''
  }
}

const onUsernameInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target) return
  const valueWithoutSpaces = target.value.replaceAll(/\s+/g, '')
  if (valueWithoutSpaces !== target.value) {
    target.value = valueWithoutSpaces
  }
  loginForm.username = valueWithoutSpaces
  clearError()
}

const onPasswordInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target) return
  const valueWithoutSpaces = target.value.replaceAll(/\s+/g, '')
  if (valueWithoutSpaces !== target.value) {
    target.value = valueWithoutSpaces
  }
  loginForm.password = valueWithoutSpaces
  clearError()
}

const handleLogin = async () => {
  loginError.value = ''

  if (!loginForm.username.trim()) {
    document.getElementById('username')?.focus()
    return
  }

  if (!loginForm.password.trim()) {
    document.getElementById('password')?.focus()
    return
  }

  isLoading.value = true
  ;(globalThis as any).preventAuthExpiredRedirect = true

  try {
    const result = await authStore.login({
      username: loginForm.username,
      password: loginForm.password,
    })

    if (result.success) {
      const user = result.user ?? authStore.user
      router.push(isPlatformUser(user) ? '/app/platform/organizations' : '/app/dashboard')
    } else {
      loginError.value = result.error || 'Login failed'

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
    ;(globalThis as any).preventAuthExpiredRedirect = false
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('../../assets/styles/components/buttons.css');

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.login-page {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

.login-shell {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
}

/* ── Left brand pane (desktop) — white theme ── */
.login-brand-pane {
  display: none;
  flex: 0 0 52%;
  max-width: 52%;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem 3.25rem;
  background: #ffffff;
  color: var(--primary-black, #0a0a0a);
  border-right: 1px solid var(--element-gray, #e0e0e0);
  position: relative;
  overflow: hidden;
}

.login-brand-pane::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 45% at 0% 0%, rgba(26, 42, 67, 0.04), transparent 55%),
    radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255, 140, 97, 0.07), transparent 50%);
  pointer-events: none;
}

@media (min-width: 992px) {
  .login-brand-pane {
    display: flex;
  }
}

.login-brand-pane__top,
.login-brand-pane__center,
.login-brand-pane__bottom {
  position: relative;
  z-index: 1;
}

.login-brand-wordmark {
  max-width: 280px;
  width: 100%;
  height: auto;
  filter: none;
}

.login-brand-tagline {
  margin: 0.75rem 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--primary-dark-gray, #666);
}

.login-brand-pane__center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
}

.login-brand-hero__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f3f3f3;
  border: 1px solid var(--element-gray, #e0e0e0);
  color: var(--accent-navy, #1a2a43);
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
}

.login-brand-hero__headline {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin: 0 0 0.75rem;
  max-width: 28rem;
  color: var(--primary-black, #0a0a0a);
}

.login-brand-hero__blurb {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--primary-dark-gray, #666);
  max-width: 26rem;
}

.login-brand-pane__cta-label {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-dark-gray, #666);
}

.btn-register-org {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 22rem;
  padding: 0.9rem 1.25rem;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--accent-navy, #1a2a43);
  background: #ffffff;
  border: 2px solid var(--element-gray, #e0e0e0);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease,
    color 0.15s ease;
  box-shadow: none;
}

.btn-register-org:hover {
  color: var(--accent-navy, #1a2a43);
  background: #ffffff;
  border-color: var(--accent-navy, #1a2a43);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 42, 67, 0.08);
}

.btn-register-org:focus-visible {
  outline: 3px solid rgba(26, 42, 67, 0.25);
  outline-offset: 3px;
}

.login-brand-pane__cta-hint {
  margin: 0.75rem 0 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--primary-mid-gray, #888);
  max-width: 22rem;
}

/* ── Right form pane ── */
.login-form-pane {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  background: #ffffff;
}

.login-card {
  background: var(--bg-primary, #fff);
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--element-gray, #e0e0e0);
  overflow: hidden;
  width: 100%;
  max-width: 440px;
}

.login-card-body {
  padding: 2.5rem;
}

.login-logo {
  width: 72px;
  height: 72px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-black, #0a0a0a);
  margin: 0 0 0.35rem;
}

.login-subtitle {
  color: var(--primary-dark-gray, #666);
  font-size: 1rem;
  margin-bottom: 0;
}

.login-field-label {
  color: var(--text-secondary, #666);
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.login-field-label label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.login-field-label i {
  color: var(--accent-navy, #1a2a43);
  margin-right: 0.5rem;
}

.login-input {
  border: 2px solid var(--element-gray, #e0e0e0);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1.05rem;
  transition: all 0.2s ease;
  background: var(--bg-primary, #fff);
  color: var(--text-secondary, #333);
  width: 100%;
}

.login-input:focus {
  border-color: var(--accent-navy, #1a2a43) !important;
  box-shadow: 0 0 0 3px rgba(26, 42, 67, 0.25) !important;
  outline: none !important;
}

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
  color: var(--primary-mid-gray, #888);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: var(--accent-navy, #1a2a43);
  background: rgba(26, 42, 67, 0.08);
}

.forgot-password-link {
  color: var(--secondary-purple, #331fea);
  text-decoration: underline;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.forgot-password-link:hover {
  color: var(--accent-navy, #1a2a43);
}

.btn.loading {
  pointer-events: none;
  position: relative;
}

.btn-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-message {
  color: var(--secondary-red, #e97676);
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(233, 118, 118, 0.1);
  border: 1px solid rgba(233, 118, 118, 0.2);
  border-radius: 8px;
  padding: 0.875rem;
  text-align: center;
}

.login-copyright {
  margin: 2rem 0 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--primary-mid-gray, #999);
}

@media (max-width: 991.98px) {
  .login-form-pane {
    padding: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  .login-card-body {
    padding: 1.75rem 1.25rem;
  }

  .login-logo {
    width: 60px;
    height: 60px;
  }
}
</style>
