<template>
  <div class="container-xl py-5">

    <div class="mb-5">
      <p class="nexus-badge mb-2">My Cart</p>
      <h1 class="cart-title">YOUR CART</h1>
    </div>

    <div v-if="cart.loading" class="d-flex justify-content-center py-5">
      <div class="nexus-spinner"></div>
    </div>

    <div v-else-if="cart.error" class="nexus-alert">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ cart.error }}
    </div>

    <div v-else-if="cart.cartItems.length === 0" class="text-center py-5">
      <i class="bi bi-bag-x" style="font-size: 4rem; color: var(--np-border);"></i>
      <h3 class="mt-3" style="font-family: var(--font-display); color: var(--np-muted);">YOUR CART IS EMPTY</h3>
      <p style="color: var(--np-muted); font-size: 0.9rem;">Looks like you haven't added any games yet.</p>
      <router-link to="/products" class="btn btn-nexus mt-3"><i class="bi bi-grid me-2"></i>Browse Games</router-link>
    </div>

    <div v-else class="row g-4">

      <!-- Items Table -->
      <div class="col-12 col-lg-8">
        <div class="nexus-card overflow-hidden">
          <div class="table-header px-4 py-3">
            <span style="color: var(--np-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em;">
              {{ cart.cartItems.length }} Item(s)
            </span>
          </div>
          <div class="table-responsive">
            <table class="nexus-table w-100">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart.cartItems" :key="item.productId">
                  <td>
                    <div class="d-flex align-items-center gap-3">
                      <div class="item-cover"><i class="bi bi-controller"></i></div>
                      <div>
                        <div class="item-name">{{ getProductName(item.productId) }}</div>
                        <div style="font-size: 0.75rem; color: var(--np-muted); font-family: monospace;">{{ item.productId.slice(-8) }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style="color: var(--np-muted); font-size: 0.88rem;">₱{{ pricePerItem(item).toLocaleString() }}</span></td>
                  <td>
                    <div class="qty-control">
                      <button class="qty-btn" @click="decreaseQty(item)" :disabled="item.quantity <= 1">−</button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button class="qty-btn" @click="increaseQty(item)">+</button>
                    </div>
                  </td>
                  <td><span class="nexus-price" style="font-size: 1rem;">₱{{ item.subtotal.toLocaleString() }}</span></td>
                  <td>
                    <button class="btn-remove" @click="removeItem(item.productId)">
                      <i class="bi bi-trash"></i> Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="col-12 col-lg-4">
        <div class="nexus-card p-4">
          <h3 class="summary-title mb-4">ORDER SUMMARY</h3>

          <div class="summary-rows mb-3">
            <div v-for="item in cart.cartItems" :key="item.productId" class="d-flex justify-content-between mb-2">
              <span style="color: var(--np-muted); font-size: 0.85rem;">{{ getProductName(item.productId) }} x{{ item.quantity }}</span>
              <span style="color: var(--np-text); font-size: 0.85rem;">₱{{ item.subtotal.toLocaleString() }}</span>
            </div>
          </div>

          <hr class="nexus-divider" />

          <div class="d-flex justify-content-between align-items-center mb-4">
            <span style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.9rem;">Total</span>
            <span class="nexus-price" style="font-size: 1.6rem;">₱{{ cart.totalPrice.toLocaleString() }}</span>
          </div>

          <button class="btn btn-nexus w-100 py-2 mb-3" @click="handleCheckout" :disabled="checkingOut">
            <span v-if="checkingOut"><span class="spinner-border spinner-border-sm me-2"></span>Processing...</span>
            <span v-else><i class="bi bi-bag-check me-2"></i>Checkout</span>
          </button>

          <button class="btn btn-nexus-outline w-100 py-2" @click="handleClearCart" :disabled="clearing">
            <span v-if="clearing"><span class="spinner-border spinner-border-sm me-2"></span>Clearing...</span>
            <span v-else><i class="bi bi-x-circle me-2"></i>Clear Cart</span>
          </button>

          <div v-if="checkoutSuccess" class="nexus-alert nexus-alert-success mt-3">
            <i class="bi bi-check-circle me-2"></i>Order placed! Redirecting...
          </div>
          <div v-if="actionError" class="nexus-alert mt-3">
            <i class="bi bi-exclamation-triangle me-2"></i>{{ actionError }}
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import api from '../../api'

const cart = useCartStore()
const router = useRouter()

const checkingOut = ref(false)
const clearing = ref(false)
const checkoutSuccess = ref(false)
const actionError = ref('')
const productNames = ref({})

async function fetchProductName(productId) {
  if (productNames.value[productId]) return
  try {
    const res = await api.get(`/products/${productId}`)
    productNames.value[productId] = res.data.name
  } catch {
    productNames.value[productId] = 'Unknown Product'
  }
}

function getProductName(productId) {
  return productNames.value[productId] || productId.slice(-8)
}

function pricePerItem(item) {
  return item.quantity > 0 ? item.subtotal / item.quantity : 0
}

async function loadCart() {
  await cart.getCart()
  for (const item of cart.cartItems) {
    await fetchProductName(item.productId)
  }
}

async function increaseQty(item) {
  await cart.updateQuantity(item.productId, item.quantity + 1)
  for (const i of cart.cartItems) fetchProductName(i.productId)
}

async function decreaseQty(item) {
  if (item.quantity <= 1) return
  await cart.updateQuantity(item.productId, item.quantity - 1)
  for (const i of cart.cartItems) fetchProductName(i.productId)
}

async function removeItem(productId) {
  await cart.removeItem(productId)
  for (const i of cart.cartItems) fetchProductName(i.productId)
}

async function handleClearCart() {
  clearing.value = true
  actionError.value = ''
  await cart.clearCart()
  clearing.value = false
}

async function handleCheckout() {
  checkingOut.value = true
  actionError.value = ''
  checkoutSuccess.value = false
  const order = await cart.checkout()
  checkingOut.value = false
  if (order) {
    checkoutSuccess.value = true
    setTimeout(() => router.push('/products'), 2000)
  } else {
    actionError.value = 'Checkout failed. Please try again.'
  }
}

onMounted(loadCart)
</script>

<style scoped>
.cart-title { font-family: var(--font-display); font-size: 3.5rem; color: var(--np-text); letter-spacing: 0.04em; line-height: 1; margin: 0; }
.summary-title { font-family: var(--font-display); font-size: 1.4rem; color: var(--np-text); letter-spacing: 0.04em; margin: 0; }
.table-header { border-bottom: 1px solid var(--np-border); background: var(--np-surface); }
.nexus-table { border-collapse: collapse; }
.nexus-table thead tr { background: var(--np-surface); border-bottom: 1px solid var(--np-border); }
.nexus-table th { padding: 0.75rem 1.25rem; color: var(--np-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
.nexus-table td { padding: 1rem 1.25rem; border-bottom: 1px solid var(--np-border); vertical-align: middle; }
.nexus-table tbody tr:last-child td { border-bottom: none; }
.nexus-table tbody tr:hover { background: rgba(255,255,255,0.02); }
.item-cover { width: 42px; height: 42px; background: linear-gradient(135deg, rgba(123,47,255,0.2), rgba(255,60,110,0.2)); border: 1px solid var(--np-border); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--np-muted); flex-shrink: 0; }
.item-name { font-weight: 600; color: var(--np-text); font-size: 0.88rem; }
.qty-control { display: inline-flex; align-items: center; border: 1.5px solid var(--np-border); border-radius: 4px; overflow: hidden; }
.qty-btn { background: var(--np-surface); border: none; color: var(--np-text); width: 30px; height: 30px; font-size: 1rem; cursor: pointer; transition: background 0.2s; line-height: 1; }
.qty-btn:hover:not(:disabled) { background: var(--np-border); }
.qty-btn:disabled { color: var(--np-border); cursor: not-allowed; }
.qty-value { min-width: 36px; text-align: center; font-weight: 600; font-size: 0.88rem; background: var(--np-card); height: 30px; line-height: 30px; }
.btn-remove { background: none; border: 1.5px solid rgba(255,60,110,0.3); color: var(--np-primary); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.3rem 0.65rem; border-radius: 3px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-remove:hover { background: var(--np-primary); color: white; }
.summary-rows { max-height: 200px; overflow-y: auto; }
</style>
