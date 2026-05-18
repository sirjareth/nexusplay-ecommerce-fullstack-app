<template>
  <div class="auth-page">
    <div class="auth-bg-deco">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
    </div>

    <div class="container d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 70px);">
      <div class="auth-box">

        <!-- Header -->
        <div class="text-center mb-4">
          <p class="nexus-badge-cyan mb-3">Welcome Back</p>
          <h1 class="auth-title">SIGN IN</h1>
          <p style="color: var(--np-muted); font-size: 0.9rem;">Continue your adventure at NexusPlay</p>
        </div>

        <!-- Alert -->
        <div v-if="errorMsg" class="nexus-alert mb-4">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMsg }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" novalidate>

          <div class="mb-3">
            <label class="nexus-label">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              class="nexus-input"
              :class="{ 'is-invalid': errors.email }"
              placeholder="john@example.com"
              autocomplete="email"
            />
            <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
          </div>

          <div class="mb-4">
            <label class="nexus-label">Password</label>
            <div class="input-icon-wrap">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="nexus-input"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Your password"
                autocomplete="current-password"
              />
              <button type="button" class="input-icon-btn" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
          </div>

          <button type="submit" class="btn btn-nexus w-100 py-2" :disabled="loading">
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span>Signing in...
            </span>
            <span v-else><i class="bi bi-controller me-2"></i>Sign In</span>
          </button>

        </form>

        <hr class="nexus-divider mt-4" />

        <p class="text-center mb-0" style="color: var(--np-muted); font-size: 0.9rem;">
          New to NexusPlay?
          <router-link to="/register" style="color: var(--np-primary); text-decoration: none; font-weight: 600;">
            Create Account
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function validate() {
  let valid = true
  errors.email = ''
  errors.password = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) { errors.email = 'Email is required'; valid = false }
  else if (!emailRegex.test(form.email)) { errors.email = 'Enter a valid email'; valid = false }

  if (!form.password) { errors.password = 'Password is required'; valid = false }

  return valid
}

async function handleLogin() {
  errorMsg.value = ''
  if (!validate()) return

  loading.value = true
  try {
    const res = await fetch(`${API}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    })

    const data = await res.json()

    if (!res.ok) {
      errorMsg.value = data.error || 'Login failed. Please try again.'
      return
    }

    // Decode the token to get user info
    const token = data.access
    const payload = JSON.parse(atob(token.split('.')[1]))
    auth.login(token, { id: payload.id, email: payload.email, isAdmin: payload.isAdmin })

    // Redirect based on role
    if (payload.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/products')
    }
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
  width: 450px; height: 450px;
  background: var(--np-secondary);
  top: -120px; right: -100px;
}
.deco-2 {
  width: 350px; height: 350px;
  background: var(--np-primary);
  bottom: -80px; left: -80px;
}

.auth-box {
  background: var(--np-card);
  border: 1px solid var(--np-border);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.auth-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--np-text);
  margin: 0;
  letter-spacing: 0.04em;
}

.input-icon-wrap { position: relative; }
.input-icon-btn {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: var(--np-muted); cursor: pointer;
  padding: 0; transition: color 0.2s;
}
.input-icon-btn:hover { color: var(--np-text); }
.field-error { color: var(--np-primary); font-size: 0.78rem; margin-top: 0.3rem; }
</style>
