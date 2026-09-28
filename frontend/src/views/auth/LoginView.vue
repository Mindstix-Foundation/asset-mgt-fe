<template>
  <div class="login-page">
    <div
      v-if="isCompletingGoogleSession"
      class="login-oauth-resume"
      aria-live="polite"
      aria-busy="true"
    >
      <img :src="loginLogo" alt="" class="login-oauth-resume__logo" />
      <p class="login-oauth-resume__title">Signing you in</p>
      <p class="login-oauth-resume__subtitle">Completing Google sign-in…</p>
      <span class="spinner-border login-oauth-resume__spinner" aria-hidden="true"></span>
    </div>

    <div
      v-else
      class="container-fluid min-vh-100 d-flex justify-content-center position-relative"
      style="padding-top: 5vh; padding-bottom: 5vh;"
    >
      <div class="row w-100 justify-content-center">
        <div class="col-12 col-md-8 col-lg-5 col-xl-4">
          <div class="login-card">
            <div class="login-card-body">
              <div class="text-center mb-4">
                <div class="login-logo mb-3">
                  <img :src="loginLogo" alt="Pebble Asset Tracker logo" class="login-logo-img" />
                </div>
                <div class="brand-name mb-2">
                  <img :src="brandLogo" alt="Pebble Asset Tracker wordmark" class="brand-logo-img" />
                </div>
                <p class="login-subtitle">Sign in to your Asset Management portal</p>
              </div>

              <div class="login-form">
                <p class="login-form__hint">
                  Sign in with your Google account to continue.
                </p>

                <a
                  :href="googleOAuthStartUrl"
                  class="gsi-custom-btn w-100"
                  :class="{ 'gsi-custom-btn--disabled': isLoading }"
                  :aria-disabled="isLoading ? 'true' : undefined"
                  aria-label="Sign in with Google"
                  @click="onGoogleSignInClick"
                >
                  <svg class="gsi-custom-btn__icon" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>Continue with Google</span>
                </a>

                <div class="form-check login-remember mt-3">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="remember"
                    v-model="rememberMe"
                  />
                  <label class="form-check-label" for="remember">Remember me</label>
                </div>

                <div v-if="loginError" class="error-message mt-3" role="alert">
                  <span>{{ loginError }}</span>
                </div>
              </div>
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
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/core/authService'
import loginLogo from '@/assets/logos/secondary/secondary-symbol.png'
import brandLogo from '@/assets/logos/primary/primary-wordmark.png'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const rememberMe = ref(false)
const isLoading = ref(false)
const loginError = ref('')
const isCompletingGoogleSession = ref(route.query.google_session === '1')

const googleOAuthStartUrl = computed(() =>
  authService.buildGoogleOAuthStartUrl(
    rememberMe.value,
    typeof route.query.redirect === 'string' ? route.query.redirect : undefined,
  ),
)

const onGoogleSignInClick = (event: MouseEvent) => {
  if (isLoading.value) {
    event.preventDefault()
  }
}

const stripOAuthQueryFromUrl = () => {
  const q = { ...route.query }
  for (const key of ['google_session', 'google_error', 'google_error_message', 'remember_me']) {
    delete q[key]
  }
  router.replace({ path: route.path, query: q })
}

const handleGoogleOAuthReturn = async () => {
  const errorFlag = route.query.google_error
  if (errorFlag === '1' || errorFlag === 'true') {
    const msg = route.query.google_error_message
    loginError.value =
      typeof msg === 'string' && msg.trim()
        ? msg
        : 'Google sign-in failed. Please try again.'
    isCompletingGoogleSession.value = false
    stripOAuthQueryFromUrl()
    return
  }

  if (route.query.google_session !== '1') {
    return
  }

  isCompletingGoogleSession.value = true
  isLoading.value = true
  ;(globalThis as any).preventAuthExpiredRedirect = true

  try {
    const result = await authStore.activateGoogleSession()
    if (result.success) {
      const redirect =
        typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
          ? route.query.redirect
          : '/app/dashboard'
      await router.replace(redirect)
    } else {
      loginError.value = result.error || 'Google login failed. Please try again.'
      isCompletingGoogleSession.value = false
      stripOAuthQueryFromUrl()
    }
  } catch (error) {
    console.error('Google session hydrate error:', error)
    loginError.value = 'Google login failed. Please try again.'
    isCompletingGoogleSession.value = false
    stripOAuthQueryFromUrl()
  } finally {
    ;(globalThis as any).preventAuthExpiredRedirect = false
    isLoading.value = false
  }
}

onMounted(() => {
  void handleGoogleOAuthReturn()
})
</script>

<style scoped>
@import url('../../assets/styles/components/buttons.css');

.login-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
}

.login-card-body {
  padding: 2.5rem;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-logo-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.brand-logo-img {
  max-width: 220px;
  height: auto;
}

.login-subtitle {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 0;
}

.login-form__hint {
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.25rem;
}

.gsi-custom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid #dadce0;
  border-radius: 8px;
  background: #fff;
  color: #3c4043;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

.gsi-custom-btn:hover {
  background: #f8f9fa;
  color: #202124;
  box-shadow: 0 1px 3px rgba(60, 64, 67, 0.2);
}

.gsi-custom-btn--disabled {
  pointer-events: none;
  opacity: 0.65;
}

.gsi-custom-btn__icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.login-remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.login-remember .form-check-label {
  color: #495057;
  font-size: 0.9rem;
  user-select: none;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.login-oauth-resume {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.login-oauth-resume__logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.login-oauth-resume__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.login-oauth-resume__subtitle {
  margin: 0;
  color: #6c757d;
}

.login-oauth-resume__spinner {
  width: 2rem;
  height: 2rem;
  color: #6f42c1;
}

@media (max-width: 576px) {
  .login-card-body {
    padding: 1.75rem 1.25rem;
  }
}
</style>
