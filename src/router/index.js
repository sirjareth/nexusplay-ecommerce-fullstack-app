import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CartView from '../views/CartView.vue'
import AdminView from '../views/AdminView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', redirect: '/products' },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guestOnly: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetailView,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartView,
    meta: { requiresAuth: true, userOnly: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Redirect logged-in users away from guest-only pages
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next('/products')
  }

  // Require auth
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/login')
  }

  // Admin-only route
  if (to.meta.adminOnly && !auth.isAdmin) {
    return next('/products')
  }

  // Block admins from user-only routes (e.g. cart)
  if (to.meta.userOnly && auth.isAdmin) {
    return next('/admin')
  }

  next()
})

export default router
