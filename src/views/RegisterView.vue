<template>
  <div class="auth-page">
    <!-- Decorative background -->
    <div class="auth-bg-deco">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-circle deco-3"></div>
    </div>

    <div class="container d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 70px);">
      <div class="auth-box">

        <!-- Header -->
        <div class="text-center mb-4">
          <p class="nexus-badge mb-3">New Player</p>
          <h1 class="auth-title">CREATE ACCOUNT</h1>
          <p style="color: var(--np-muted); font-size: 0.9rem;">Join NexusPlay and build your collection</p>
        </div>

        <!-- Alert -->
        <div v-if="errorMsg" class="nexus-alert mb-4">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMsg }}
        </div>
        <div v-if="successMsg" class="nexus-alert nexus-alert-success mb-4">
          <i class="bi bi-check-circle me-2"></i>{{ successMsg }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" novalidate>

          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="nexus-label">First Name</label>
              <input
                v-model="form.firstName"
                type="text"
                class="nexus-input"
                :class="{ 'is-invalid': errors.firstName }"
                placeholder="John"
              />
              <div v-if="errors.firstName" class="field-error">{{ errors.firstName }}</div>
            </div>
            <div class="col-6">
              <label class="nexus-label">Last Name</label>
              <input
                v-model="form.lastName"
                type="text"
                class="nexus-input"
                :class="{ 'is-invalid': errors.lastName }"
                placeholder="Doe"
              />
              <div v-if="errors.lastName" class="field-error">{{ errors.lastName }}</div>
            </div>
          </div>

          <div class="mb-3">
            <label class="nexus-label">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              class="nexus-input"
              :class="{ 'is-invalid': errors.email }"
              placeholder="john@example.com"
            />
            <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
          </div>

          <div class="mb-3">
            <label class="nexus-label">Mobile Number</label>
            <input
              v-model="form.mobileNo"
              type="text"
              class="nexus-input"
              :class="{ 'is-invalid': errors.mobileNo }"
              placeholder="09XXXXXXXXX (11 digits)"
              maxlength="11"
            />
            <div v-if="errors.mobileNo" class="field-error">{{ errors.mobileNo }}</div>
          </div>

          <div class="mb-3">
            <label class="nexus-label">Password</label>
            <div class="input-icon-wrap">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="nexus-input"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Minimum 8 characters"
              />
              <button type="button" class="input-icon-btn" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
          </div>

          <div class="mb-4">
            <label class="nexus-label">Confirm Password</label>
            <div class="input-icon-wrap">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="nexus-input"
                :class="{ 'is-invalid': errors.confirmPassword }"
                placeholder="Repeat your password"
              />
              <button type="button" class="input-icon-btn" @click="showConfirm = !showConfirm">
                <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</div>
          </div>

          <button type="submit" class="btn btn-nexus w-100 py-2" :disabled="loading">
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span>Creating account...
            </span>
            <span v-else><i class="bi bi-controller me-2"></i>Create Account</span>
          </button>

        </form>

        <hr class="nexus-divider mt-4" />

        <p class="text-center mb-0" style="color: var(--np-muted); font-size: 0.9rem;">
          Already have an account?
          <router-link to="/login" style="color: var(--np-primary); text-decoration: none; font-weight: 600;">
            Sign In
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobileNo: '',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobileNo: '',
  password: '',
  confirmPassword: '',
})

function validate() {
  let valid = true
  Object.keys(errors).forEach(k => errors[k] = '')

  if (!form.firstName.trim()) { errors.firstName = 'First name is required'; valid = false }
  if (!form.lastName.trim()) { errors.lastName = 'Last name is required'; valid = false }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) { errors.email = 'Email is required'; valid = false }
  else if (!emailRegex.test(form.email)) { errors.email = 'Enter a valid email'; valid = false }

  if (!form.mobileNo.trim()) { errors.mobileNo = 'Mobile number is required'; valid = false }
  else if (form.mobileNo.length !== 11) { errors.mobileNo = 'Must be exactly 11 digits'; valid = false }

  if (!form.password) { errors.password = 'Password is required'; valid = false }
  else if (form.password.length < 8) { errors.password = 'Minimum 8 characters'; valid = false }

  if (!form.confirmPassword) { errors.confirmPassword = 'Please confirm your password'; valid = false }
  else if (form.password !== form.confirmPassword) { errors.confirmPassword = 'Passwords do not match'; valid = false }

  return valid
}

async function handleRegister() {
  errorMsg.value = ''
  successMsg.value = ''
  if (!validate()) return

  loading.value = true
  try {
    const res = await fetch(`${API}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobileNo: form.mobileNo,
        password: form.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      errorMsg.value = data.error || 'Registration failed. Please try again.'
      return
    }

    successMsg.value = 'Account created! Redirecting to login...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    errorMsg.value = 'Network error. Please check your connection.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  position: relative;
  overflow: hidden;
}

.auth-bg-deco {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.deco-1 {
  width: 400px; height: 400px;
  background: var(--np-primary);
  top: -100px; left: -100px;
}
.deco-2 {
  width: 350px; height: 350px;
  background: var(--np-secondary);
  bottom: -50px; right: -80px;
}
.deco-3 {
  width: 200px; height: 200px;
  background: var(--np-accent);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.auth-box {
  background: var(--np-card);
  border: 1px solid var(--np-border);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
}

.auth-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  color: var(--np-text);
  margin: 0;
  letter-spacing: 0.04em;
}

.input-icon-wrap {
  position: relative;
}

.input-icon-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--np-muted);
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.input-icon-btn:hover { color: var(--np-text); }

.field-error {
  color: var(--np-primary);
  font-size: 0.78rem;
  margin-top: 0.3rem;
}
</style>
