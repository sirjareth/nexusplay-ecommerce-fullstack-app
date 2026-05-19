<template>
  <nav class="nexus-navbar">
    <div class="container-xl py-3">
      <div class="d-flex align-items-center justify-content-between">

        <!-- Logo -->
        <router-link to="/products" class="nexus-logo text-decoration-none">
          <span class="logo-bracket">[</span>
          NEXUS<span class="logo-accent">PLAY</span>
          <span class="logo-bracket">]</span>
        </router-link>

        <!-- Burger button (mobile only) -->
        <button class="burger-btn d-lg-none" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Nav links (desktop) -->
        <div class="d-none d-lg-flex align-items-center gap-3">
          <template v-if="!auth.isLoggedIn">
            <router-link to="/products" class="nav-link-nexus"><i class="bi bi-grid me-1"></i>Games</router-link>
            <router-link to="/login" class="nav-link-nexus">Login</router-link>
            <router-link to="/register" class="btn btn-nexus btn-sm">Register</router-link>
          </template>
          <template v-else-if="!auth.isAdmin">
            <router-link to="/products" class="nav-link-nexus"><i class="bi bi-grid me-1"></i>Games</router-link>
            <router-link to="/cart" class="nav-link-nexus"><i class="bi bi-bag me-1"></i>Cart</router-link>
            <button class="btn btn-nexus-outline btn-sm" @click="handleLogout"><i class="bi bi-box-arrow-right me-1"></i>Logout</button>
          </template>
          <template v-else>
            <router-link to="/admin" class="nav-link-nexus"><i class="bi bi-speedometer2 me-1"></i>Dashboard</router-link>
            <button class="btn btn-nexus-outline btn-sm" @click="handleLogout"><i class="bi bi-box-arrow-right me-1"></i>Logout</button>
          </template>
        </div>

      </div>

      <!-- Mobile dropdown menu -->
      <transition name="mobile-menu">
        <div v-if="menuOpen" class="mobile-menu d-lg-none mt-3">
          <template v-if="!auth.isLoggedIn">
            <router-link to="/products" class="mobile-link" @click="menuOpen = false"><i class="bi bi-grid me-2"></i>Games</router-link>
            <router-link to="/login" class="mobile-link" @click="menuOpen = false"><i class="bi bi-box-arrow-in-right me-2"></i>Login</router-link>
            <router-link to="/register" class="mobile-link mobile-link-highlight" @click="menuOpen = false"><i class="bi bi-person-plus me-2"></i>Register</router-link>
          </template>
          <template v-else-if="!auth.isAdmin">
            <router-link to="/products" class="mobile-link" @click="menuOpen = false"><i class="bi bi-grid me-2"></i>Games</router-link>
            <router-link to="/cart" class="mobile-link" @click="menuOpen = false"><i class="bi bi-bag me-2"></i>Cart</router-link>
            <button class="mobile-link mobile-link-logout w-100 text-start" @click="handleLogout"><i class="bi bi-box-arrow-right me-2"></i>Logout</button>
          </template>
          <template v-else>
            <router-link to="/admin" class="mobile-link" @click="menuOpen = false"><i class="bi bi-speedometer2 me-2"></i>Dashboard</router-link>
            <button class="mobile-link mobile-link-logout w-100 text-start" @click="handleLogout"><i class="bi bi-box-arrow-right me-2"></i>Logout</button>
          </template>
        </div>
      </transition>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

function handleLogout() {
  menuOpen.value = false
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

.logo-accent { color: var(--np-primary); }
.logo-bracket { color: var(--np-secondary); font-size: 1.2rem; }

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

/* ===== Burger Button ===== */
.burger-btn {
  background: none;
  border: 1.5px solid var(--np-border);
  border-radius: 4px;
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: border-color 0.2s;
}

.burger-btn:hover { border-color: var(--np-primary); }

.burger-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--np-text);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Animate to X when open */
.burger-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger-btn.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.burger-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ===== Mobile Menu ===== */
.mobile-menu {
  border-top: 1px solid var(--np-border);
  padding-top: 0.75rem;
  padding-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-link {
  display: block;
  color: var(--np-muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.65rem 0.75rem;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-link:hover { background: rgba(255,255,255,0.05); color: var(--np-text); }

.mobile-link-highlight {
  color: var(--np-primary);
  border: 1.5px solid rgba(255,60,110,0.3);
  text-align: center;
  margin-top: 0.25rem;
}

.mobile-link-logout { color: var(--np-primary); }

/* ===== Mobile menu transition ===== */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
