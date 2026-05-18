<template>
  <nav class="nexus-navbar">
    <div class="container-xl d-flex align-items-center justify-content-between py-3">

      <!-- Logo -->
      <router-link to="/products" class="nexus-logo text-decoration-none">
        <span class="logo-bracket">[</span>
        NEXUS<span class="logo-accent">PLAY</span>
        <span class="logo-bracket">]</span>
      </router-link>

      <!-- Nav links -->
      <div class="d-flex align-items-center gap-3">

        <!-- Guest links -->
        <template v-if="!auth.isLoggedIn">
          <router-link to="/products" class="nav-link-nexus">
            <i class="bi bi-grid me-1"></i>Games
          </router-link>
          <router-link to="/login" class="nav-link-nexus">Login</router-link>
          <router-link to="/register" class="btn btn-nexus btn-sm">
            Register
          </router-link>
        </template>

        <!-- Logged-in user links -->
        <template v-else-if="!auth.isAdmin">
          <router-link to="/products" class="nav-link-nexus">
            <i class="bi bi-grid me-1"></i>Games
          </router-link>
          <router-link to="/cart" class="nav-link-nexus">
            <i class="bi bi-bag me-1"></i>Cart
          </router-link>
          <button class="btn btn-nexus-outline btn-sm" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </template>

        <!-- Admin links -->
        <template v-else>
          <router-link to="/admin" class="nav-link-nexus">
            <i class="bi bi-speedometer2 me-1"></i>Dashboard
          </router-link>
          <button class="btn btn-nexus-outline btn-sm" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </template>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.nexus-navbar {
  background: rgba(10, 10, 15, 0.95);
  border-bottom: 1px solid var(--np-border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nexus-logo {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--np-text);
  letter-spacing: 0.04em;
}

.logo-accent {
  color: var(--np-primary);
}

.logo-bracket {
  color: var(--np-secondary);
  font-size: 1.2rem;
}

.nav-link-nexus {
  color: var(--np-muted);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.nav-link-nexus:hover,
.nav-link-nexus.router-link-active {
  color: var(--np-text);
  border-bottom-color: var(--np-primary);
}
</style>
