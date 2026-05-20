<template>
  <div class="container-xl py-5">

    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="nexus-spinner"></div>
    </div>

    <div v-else-if="error" class="nexus-alert">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
    </div>

    <div v-else-if="product" class="product-detail">

      <router-link to="/products" class="back-link mb-4 d-inline-flex align-items-center gap-2">
        <i class="bi bi-arrow-left"></i> Back to Catalog
      </router-link>

      <div class="row g-5 align-items-start mt-1">

        <!-- Cover -->
        <div class="col-12 col-md-5">
          <div class="detail-cover">
            <img
              v-if="getGameImage(product.name)"
              :src="getGameImage(product.name)"
              :alt="product.name"
              class="detail-cover-img"
            />
            <div v-else class="detail-cover-inner">
              <i class="bi bi-controller detail-cover-icon"></i>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="col-12 col-md-7">
          <div class="d-flex gap-2 mb-3">
            <span v-if="product.isActive" class="nexus-badge-cyan">In Stock</span>
            <span v-else class="nexus-badge" style="color: var(--np-muted); border-color: var(--np-border);">Unavailable</span>
          </div>

          <h1 class="product-detail-title">{{ product.name }}</h1>
          <p class="product-detail-desc">{{ product.description }}</p>
          <div class="detail-price mb-4">₱{{ product.price.toLocaleString() }}</div>

          <div v-if="cartMsg" class="nexus-alert mb-3" :class="{ 'nexus-alert-success': cartSuccess }">
            <i :class="cartSuccess ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'" class="me-2"></i>{{ cartMsg }}
          </div>

          <!-- Add to cart -->
          <div v-if="auth.isLoggedIn && !auth.isAdmin && product.isActive">
            <div class="d-flex align-items-center gap-3 mb-3">
              <label class="nexus-label mb-0">Qty</label>
              <div class="qty-control">
                <button class="qty-btn" @click="qty > 1 && qty--">−</button>
                <span class="qty-value">{{ qty }}</span>
                <button class="qty-btn" @click="qty++">+</button>
              </div>
            </div>
            <button class="btn btn-nexus px-4 py-2" @click="addToCart" :disabled="addingToCart">
              <span v-if="addingToCart"><span class="spinner-border spinner-border-sm me-2"></span>Adding...</span>
              <span v-else><i class="bi bi-bag-plus me-2"></i>Add to Cart</span>
            </button>
          </div>

          <div v-else-if="!auth.isLoggedIn">
            <p style="color: var(--np-muted); font-size: 0.9rem;">
              <router-link to="/login" style="color: var(--np-primary); text-decoration: none; font-weight: 600;">Sign in</router-link>
              to add this to your cart.
            </p>
          </div>

          <div v-else-if="auth.isAdmin">
            <p class="nexus-badge">Admin accounts cannot purchase items</p>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../../api'
import { getGameImage } from '../utils/gameImages'

const route = useRoute()
const auth = useAuthStore()

const product = ref(null)
const loading = ref(true)
const error = ref('')
const qty = ref(1)
const addingToCart = ref(false)
const cartMsg = ref('')
const cartSuccess = ref(false)

async function fetchProduct() {
  loading.value = true
  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data
  } catch {
    error.value = 'Could not load this product.'
  } finally {
    loading.value = false
  }
}

async function addToCart() {
  cartMsg.value = ''
  addingToCart.value = true
  try {
    const subtotal = product.value.price * qty.value
    await api.post('/cart/add-to-cart', {
      productId: product.value._id,
      quantity: qty.value,
      subtotal,
    })
    cartMsg.value = `${product.value.name} added to your cart!`
    cartSuccess.value = true
    qty.value = 1
  } catch (err) {
    cartMsg.value = err.response?.data?.error || 'Failed to add to cart.'
    cartSuccess.value = false
  } finally {
    addingToCart.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.back-link { color: var(--np-muted); text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; transition: color 0.2s; }
.back-link:hover { color: var(--np-primary); }

.detail-cover {
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid var(--np-border);
}

.detail-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-cover-inner { display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, rgba(123,47,255,0.2), rgba(255,60,110,0.2)); }
.detail-cover-icon { font-size: 6rem; color: var(--np-border); }

.product-detail-title { font-family: var(--font-display); font-size: 3rem; color: var(--np-text); letter-spacing: 0.03em; line-height: 1.05; margin-bottom: 1rem; }
.product-detail-desc { color: var(--np-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem; }
.detail-price { font-family: var(--font-display); font-size: 2.5rem; color: var(--np-yellow); letter-spacing: 0.02em; }

.qty-control { display: flex; align-items: center; border: 1.5px solid var(--np-border); border-radius: 4px; overflow: hidden; }
.qty-btn { background: var(--np-surface); border: none; color: var(--np-text); width: 36px; height: 36px; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }
.qty-btn:hover { background: var(--np-border); }
.qty-value { min-width: 44px; text-align: center; font-weight: 600; font-size: 0.95rem; background: var(--np-card); height: 36px; line-height: 36px; }
</style>
