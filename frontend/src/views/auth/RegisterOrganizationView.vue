<template>
  <div class="login-page">
    <div
      class="container-fluid min-vh-100 d-flex justify-content-center position-relative"
      style="padding-top: 5vh; padding-bottom: 5vh;"
    >
      <div class="row w-100 justify-content-center">
        <div class="col-12 col-md-10 col-lg-7 col-xl-6">
          <div class="login-card">
            <div class="login-card-body">
              <div class="text-center mb-4">
                <div class="login-logo mb-3">
                  <img :src="loginLogo" alt="Pebble Asset Tracker logo" class="login-logo-img" />
                </div>
                <div class="brand-name mb-2">
                  <img :src="brandLogo" alt="Pebble Asset Tracker wordmark" class="brand-logo-img" />
                </div>
                <p class="login-subtitle">Register your organization</p>
                <p class="text-muted small mb-0">
                  Submit a request. A platform administrator will review and approve access.
                </p>
              </div>

              <div v-if="successMessage" class="alert alert-success" role="status">
                {{ successMessage }}
                <div class="mt-2">
                  <router-link to="/">Back to sign in</router-link>
                </div>
              </div>

              <form
                v-else
                ref="registrationForm"
                class="login-form"
                novalidate
                @submit.prevent="handleSubmit"
              >
                <h6 class="section-label">Organization</h6>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="login-field-label" for="orgName">
                      Organization name <span class="text-danger">*</span>
                    </label>
                    <input
                      id="orgName"
                      v-model="form.organizationName"
                      class="form-control login-input"
                      :class="getFieldClass('organizationName')"
                      maxlength="100"
                      autocomplete="organization"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('organizationName')"
                      @blur="formatPersonOrOrgName('organizationName'); validateFieldInline('organizationName')"
                      @input="onNameFieldInput('organizationName')"
                    />
                    <div v-if="fieldErrors.organizationName" class="invalid-feedback">
                      {{ fieldErrors.organizationName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="login-field-label" for="phone">
                      Phone <span class="text-muted">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      class="form-control login-input"
                      :class="getFieldClass('phone')"
                      maxlength="10"
                      placeholder="9876543210"
                      inputmode="numeric"
                      autocomplete="tel"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('phone')"
                      @blur="validateFieldInline('phone')"
                      @input="formatPhoneInput"
                    />
                    <div v-if="fieldErrors.phone" class="invalid-feedback">{{ fieldErrors.phone }}</div>
                  </div>
                  <div class="col-12">
                    <label class="login-field-label" for="message">
                      Message <span class="text-muted">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      v-model="form.message"
                      class="form-control login-input"
                      :class="getFieldClass('message')"
                      rows="2"
                      maxlength="500"
                      placeholder="Briefly describe your team / asset needs"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('message')"
                      @blur="validateFieldInline('message')"
                    />
                    <div v-if="fieldErrors.message" class="invalid-feedback">{{ fieldErrors.message }}</div>
                  </div>
                </div>

                <h6 class="section-label">Organization admin (first login account)</h6>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="login-field-label" for="firstName">
                      First name <span class="text-danger">*</span>
                    </label>
                    <input
                      id="firstName"
                      v-model="form.adminFirstName"
                      class="form-control login-input"
                      :class="getFieldClass('adminFirstName')"
                      maxlength="50"
                      autocomplete="given-name"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('adminFirstName')"
                      @blur="formatPersonOrOrgName('adminFirstName'); validateFieldInline('adminFirstName')"
                      @input="onNameFieldInput('adminFirstName')"
                    />
                    <div v-if="fieldErrors.adminFirstName" class="invalid-feedback">
                      {{ fieldErrors.adminFirstName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="login-field-label" for="lastName">
                      Last name <span class="text-danger">*</span>
                    </label>
                    <input
                      id="lastName"
                      v-model="form.adminLastName"
                      class="form-control login-input"
                      :class="getFieldClass('adminLastName')"
                      maxlength="50"
                      autocomplete="family-name"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('adminLastName')"
                      @blur="formatPersonOrOrgName('adminLastName'); validateFieldInline('adminLastName')"
                      @input="onNameFieldInput('adminLastName')"
                    />
                    <div v-if="fieldErrors.adminLastName" class="invalid-feedback">
                      {{ fieldErrors.adminLastName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="login-field-label" for="email">
                      Work email <span class="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.adminEmail"
                      type="email"
                      class="form-control login-input"
                      :class="getFieldClass('adminEmail')"
                      maxlength="255"
                      autocomplete="email"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('adminEmail')"
                      @blur="validateFieldInline('adminEmail')"
                    />
                    <div v-if="fieldErrors.adminEmail" class="invalid-feedback">
                      {{ fieldErrors.adminEmail }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="login-field-label" for="username">
                      Username <span class="text-danger">*</span>
                    </label>
                    <input
                      id="username"
                      v-model="form.adminUsername"
                      class="form-control login-input"
                      :class="getFieldClass('adminUsername')"
                      maxlength="50"
                      autocomplete="username"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('adminUsername')"
                      @blur="validateFieldInline('adminUsername')"
                    />
                    <div v-if="fieldErrors.adminUsername" class="invalid-feedback">
                      {{ fieldErrors.adminUsername }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="login-field-label" for="password">
                      Password <span class="text-danger">*</span>
                    </label>
                    <input
                      id="password"
                      v-model="form.adminPassword"
                      type="password"
                      class="form-control login-input"
                      :class="getFieldClass('adminPassword')"
                      maxlength="100"
                      autocomplete="new-password"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('adminPassword')"
                      @blur="onPasswordBlur"
                      @input="onPasswordInput"
                    />
                    <div v-if="fieldErrors.adminPassword" class="invalid-feedback">
                      {{ fieldErrors.adminPassword }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="login-field-label" for="confirmPassword">
                      Confirm password <span class="text-danger">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      v-model="confirmPassword"
                      type="password"
                      class="form-control login-input"
                      :class="getFieldClass('confirmPassword')"
                      maxlength="100"
                      autocomplete="new-password"
                      :disabled="isLoading"
                      @focus="clearFieldValidation('confirmPassword')"
                      @blur="validateFieldInline('confirmPassword')"
                      @input="onConfirmPasswordInput"
                    />
                    <div v-if="fieldErrors.confirmPassword" class="invalid-feedback">
                      {{ fieldErrors.confirmPassword }}
                    </div>
                  </div>
                </div>

                <div v-if="errorMessage" class="error-message mb-3" role="alert">
                  <span>{{ errorMessage }}</span>
                </div>

                <button
                  type="submit"
                  class="btn btn-purple btn-lg w-100"
                  :disabled="isLoading"
                  :class="{ loading: isLoading }"
                >
                  <span class="btn-text" :class="{ 'opacity-0': isLoading }">
                    {{ isLoading ? 'Submitting…' : 'Submit registration request' }}
                  </span>
                  <div v-if="isLoading" class="btn-loader">
                    <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                  </div>
                </button>

                <div class="text-center mt-3">
                  <router-link to="/" class="forgot-password-link">
                    Already have an account? Sign in
                  </router-link>
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
import { nextTick, reactive, ref } from 'vue'
import platformApi, { type SubmitRegistrationPayload } from '@/services/api/platformApi'
import loginLogo from '@/assets/logos/secondary/secondary-symbol.png'
import brandLogo from '@/assets/logos/primary/primary-wordmark.png'

type FieldKey =
  | 'organizationName'
  | 'phone'
  | 'message'
  | 'adminFirstName'
  | 'adminLastName'
  | 'adminEmail'
  | 'adminUsername'
  | 'adminPassword'
  | 'confirmPassword'

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const confirmPassword = ref('')
const formSubmitted = ref(false)
const registrationForm = ref<HTMLFormElement>()

const form = reactive({
  organizationName: '',
  phone: '',
  message: '',
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  adminUsername: '',
  adminPassword: '',
})

const fieldErrors = reactive<Record<string, string>>({})
const fieldValidation = reactive<Record<string, boolean | null>>({})

const ORG_NAME_RE = /^[A-Z0-9][A-Za-z0-9.,&'\-()]*(?: [A-Z0-9][A-Za-z0-9.,&'\-()]*)*$/
/** First letter of each word capital, single spaces only */
const NAME_RE = /^[A-Z][a-zA-Z']*(?: [A-Z][a-zA-Z']*)*$/
const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9._-]*$/
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
/** Indian mobile: exactly 10 digits, starting with 6–9 */
const INDIAN_PHONE_RE = /^[6-9]\d{9}$/
const SPECIAL_CHAR_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

const getPasswordRequirementErrors = (password: string): string[] => {
  const missing: string[] = []
  if (password.length < 8) missing.push('at least 8 characters')
  if (!/[A-Z]/.test(password)) missing.push('an uppercase letter')
  if (!/[a-z]/.test(password)) missing.push('a lowercase letter')
  if (!/\d/.test(password)) missing.push('a number')
  if (!SPECIAL_CHAR_RE.test(password)) missing.push('a special character (e.g. @$!%*?&#)')
  return missing
}

const formatPasswordError = (missing: string[]): string => {
  if (missing.length === 0) return ''
  if (missing.length === 1) {
    return `Password must include ${missing[0]}`
  }
  if (missing.length === 2) {
    return `Password must include ${missing[0]} and ${missing[1]}`
  }
  return `Password must include ${missing.slice(0, -1).join(', ')}, and ${missing[missing.length - 1]}`
}

const ALL_FIELDS: FieldKey[] = [
  'organizationName',
  'phone',
  'message',
  'adminFirstName',
  'adminLastName',
  'adminEmail',
  'adminUsername',
  'adminPassword',
  'confirmPassword',
]

const FIELD_ELEMENT_IDS: Record<FieldKey, string> = {
  organizationName: 'orgName',
  phone: 'phone',
  message: 'message',
  adminFirstName: 'firstName',
  adminLastName: 'lastName',
  adminEmail: 'email',
  adminUsername: 'username',
  adminPassword: 'password',
  confirmPassword: 'confirmPassword',
}

const getFieldClass = (fieldName: FieldKey) => {
  const state = fieldValidation[fieldName]
  if (state === true) return { 'is-valid': true }
  if (state === false || fieldErrors[fieldName]) return { 'is-invalid': true }
  return {}
}

const setFieldError = (fieldName: FieldKey, message: string) => {
  fieldErrors[fieldName] = message
  fieldValidation[fieldName] = false
}

const setFieldValid = (fieldName: FieldKey) => {
  delete fieldErrors[fieldName]
  fieldValidation[fieldName] = true
}

/** Neutral state — no green/red border (used for empty optional fields) */
const setFieldNeutral = (fieldName: FieldKey) => {
  delete fieldErrors[fieldName]
  fieldValidation[fieldName] = null
}

const clearFieldValidation = (fieldName: FieldKey) => {
  if (fieldValidation[fieldName] === false) {
    setFieldNeutral(fieldName)
  }
}

const validateFieldInline = (fieldName: FieldKey): boolean => {
  // Only show validation after submit (or once a field was marked)
  if (!formSubmitted.value && fieldValidation[fieldName] === null) {
    return true
  }

  switch (fieldName) {
    case 'organizationName': {
      const v = form.organizationName.trim()
      if (!v) {
        setFieldError(fieldName, 'Organization name is required')
        return false
      }
      if (v.length < 2) {
        setFieldError(fieldName, 'Organization name must be at least 2 characters')
        return false
      }
      if (v.length > 100) {
        setFieldError(fieldName, 'Organization name must be at most 100 characters')
        return false
      }
      if (!ORG_NAME_RE.test(v)) {
        setFieldError(
          fieldName,
          'Start each word with a capital letter; only one space between words',
        )
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    case 'phone': {
      const v = form.phone.trim()
      if (!v) {
        setFieldNeutral(fieldName)
        return true
      }
      if (!/^\d+$/.test(v)) {
        setFieldError(fieldName, 'Phone number must contain digits only')
        return false
      }
      if (v.length !== 10) {
        setFieldError(fieldName, 'Phone number must be exactly 10 digits')
        return false
      }
      if (!INDIAN_PHONE_RE.test(v)) {
        setFieldError(fieldName, 'Enter a valid Indian mobile number (starts with 6–9)')
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    case 'message': {
      if (!form.message.trim()) {
        setFieldNeutral(fieldName)
        return true
      }
      if (form.message.trim().length > 500) {
        setFieldError(fieldName, 'Message must be at most 500 characters')
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    case 'adminFirstName':
    case 'adminLastName': {
      const label = fieldName === 'adminFirstName' ? 'First name' : 'Last name'
      const v = (
        fieldName === 'adminFirstName' ? form.adminFirstName : form.adminLastName
      ).trim()
      if (!v) {
        setFieldError(fieldName, `${label} is required`)
        return false
      }
      if (v.length < 2) {
        setFieldError(fieldName, `${label} must be at least 2 characters`)
        return false
      }
      if (v.length > 50) {
        setFieldError(fieldName, `${label} must be at most 50 characters`)
        return false
      }
      if (!NAME_RE.test(v)) {
        setFieldError(
          fieldName,
          `${label} must start with a capital letter; only one space between words`,
        )
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    case 'adminEmail': {
      const v = form.adminEmail.trim()
      if (!v) {
        setFieldError(fieldName, 'Work email is required')
        return false
      }
      if (v.length > 255) {
        setFieldError(fieldName, 'Email must be at most 255 characters')
        return false
      }
      if (!EMAIL_RE.test(v) || /\.\./.test(v)) {
        setFieldError(fieldName, 'Please enter a valid email address')
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    case 'adminUsername': {
      const v = form.adminUsername.trim()
      if (!v) {
        setFieldError(fieldName, 'Username is required')
        return false
      }
      if (v.length < 3) {
        setFieldError(fieldName, 'Username must be at least 3 characters')
        return false
      }
      if (v.length > 50) {
        setFieldError(fieldName, 'Username must be at most 50 characters')
        return false
      }
      if (!USERNAME_RE.test(v)) {
        setFieldError(
          fieldName,
          'Username must start with a letter and may include letters, numbers, . _ -',
        )
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    case 'adminPassword': {
      const v = form.adminPassword
      if (!v) {
        setFieldError(fieldName, 'Password is required')
        return false
      }
      if (v.length > 100) {
        setFieldError(fieldName, 'Password must be at most 100 characters')
        return false
      }
      const missing = getPasswordRequirementErrors(v)
      if (missing.length > 0) {
        setFieldError(fieldName, formatPasswordError(missing))
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    case 'confirmPassword': {
      if (!confirmPassword.value) {
        setFieldError(fieldName, 'Please confirm your password')
        return false
      }
      if (confirmPassword.value !== form.adminPassword) {
        setFieldError(fieldName, 'Passwords do not match')
        return false
      }
      setFieldValid(fieldName)
      return true
    }
    default:
      return true
  }
}

const validateAllFields = (): boolean => {
  formatPersonOrOrgName('organizationName')
  formatPersonOrOrgName('adminFirstName')
  formatPersonOrOrgName('adminLastName')
  return ALL_FIELDS.map((field) => validateFieldInline(field)).every(Boolean)
}

/**
 * Capitalize first letter of each word and allow only a single space between words.
 */
const toTitleCaseSingleSpace = (raw: string): string => {
  return raw
    .replaceAll(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      if (!word) return word
      // Keep digit-leading tokens as-is (e.g. "2", "3M")
      if (/^\d/.test(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

type NameFieldKey = 'organizationName' | 'adminFirstName' | 'adminLastName'

const formatPersonOrOrgName = (field: NameFieldKey) => {
  const current = form[field]
  if (!current) return
  // While typing, collapse multi-spaces but don't force case until blur if trailing space
  form[field] = toTitleCaseSingleSpace(current)
}

const onNameFieldInput = (field: NameFieldKey) => {
  // Prevent multiple consecutive spaces while typing; keep trailing space so user can type next word
  const value = form[field]
  const endsWithSpace = /\s$/.test(value)
  let next = value.replaceAll(/\s+/g, ' ')
  if (!endsWithSpace) {
    next = next.trimEnd()
  } else if (!next.endsWith(' ')) {
    next = `${next.trimEnd()} `
  }
  // Capitalize first letter of each completed word as user types
  next = next
    .split(' ')
    .map((word, index, arr) => {
      if (!word) return word
      // Don't force-lowercase the word currently being typed (last segment) beyond first char
      const isLast = index === arr.length - 1 && !endsWithSpace
      if (isLast) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
  form[field] = next

  if (formSubmitted.value) {
    validateFieldInline(field)
  }
}

const onPasswordBlur = () => {
  validateFieldInline('adminPassword')
  // Always re-check match after password blur once submit was attempted
  if (formSubmitted.value || confirmPassword.value) {
    validateFieldInline('confirmPassword')
  }
}

const onPasswordInput = () => {
  if (!formSubmitted.value) return
  validateFieldInline('adminPassword')
  if (confirmPassword.value || fieldValidation.confirmPassword !== null) {
    validateFieldInline('confirmPassword')
  }
}

const onConfirmPasswordInput = () => {
  if (!formSubmitted.value) return
  validateFieldInline('confirmPassword')
}

const formatPhoneInput = () => {
  form.phone = form.phone.replaceAll(/\D/g, '').slice(0, 10)
}

const focusFirstInvalidField = async () => {
  await nextTick()
  const firstInvalidField = ALL_FIELDS.find(
    (field) => fieldValidation[field] === false || !!fieldErrors[field],
  )
  if (!firstInvalidField) return

  const el = document.getElementById(
    FIELD_ELEMENT_IDS[firstInvalidField],
  ) as HTMLElement | null
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => el.focus(), 300)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  formSubmitted.value = true

  const isValid = validateAllFields()
  if (!isValid) {
    await focusFirstInvalidField()
    return
  }

  ;(globalThis as any).preventAuthExpiredRedirect = true
  isLoading.value = true
  try {
    const payload: SubmitRegistrationPayload = {
      organizationName: form.organizationName.trim(),
      adminFirstName: form.adminFirstName.trim(),
      adminLastName: form.adminLastName.trim(),
      adminEmail: form.adminEmail.trim().toLowerCase(),
      adminUsername: form.adminUsername.trim(),
      adminPassword: form.adminPassword,
    }
    if (form.phone.trim()) payload.phone = `+91 ${form.phone.trim()}`
    if (form.message.trim()) payload.message = form.message.trim()

    const res = await platformApi.submitRegistration(payload)
    successMessage.value =
      res.message ||
      'Registration submitted. A platform administrator will review your request.'
  } catch (e: any) {
    const msg = e?.response?.data?.message
    errorMessage.value = Array.isArray(msg)
      ? msg.join(', ')
      : msg || 'Failed to submit registration. Please try again.'
  } finally {
    ;(globalThis as any).preventAuthExpiredRedirect = false
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('../../assets/styles/components/buttons.css');

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
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-logo-img {
  max-width: 260px;
  width: 100%;
  height: auto;
}

.login-subtitle {
  color: var(--primary-dark-gray);
  margin-bottom: 0.25rem;
}

.login-field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-dark-gray);
  margin-bottom: 0.35rem;
}

.login-input {
  border-radius: 0.75rem;
  border: 1px solid var(--element-gray);
  padding: 0.75rem 1rem;
}

.login-input:focus {
  border-color: #331fea;
  box-shadow: 0 0 0 0.2rem rgba(51, 31, 234, 0.25);
  outline: 2px solid transparent;
}

.section-label {
  color: var(--primary-black);
  font-weight: 700;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
}

.error-message {
  color: #b42318;
  background: #fef3f2;
  border: 1px solid #fecdca;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.forgot-password-link {
  color: var(--secondary-purple, #331fea);
  text-decoration: none;
  font-size: 0.9rem;
}

.text-danger {
  color: #dc2626 !important;
  font-weight: 700;
}

.text-muted {
  color: #4b5563 !important;
  font-weight: 600;
  font-size: 0.9em;
}

.form-control.is-valid {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25) !important;
}

.form-control.is-invalid {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.25) !important;
  animation: subtle-shake 0.3s ease-in-out;
}

@keyframes subtle-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
}

.btn-loader {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.btn.loading {
  position: relative;
}
</style>
