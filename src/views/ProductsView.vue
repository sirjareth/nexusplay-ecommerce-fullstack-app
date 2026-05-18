<template>
  <div class="products-page">
    <div class="container-xl py-5">

      <!-- Hero Header -->
      <div class="catalog-header mb-5">
        <div class="d-flex align-items-center gap-3 mb-2">
          <span class="nexus-badge">Game Store</span>
          <span class="nexus-badge-cyan">{{ products.length }} Titles</span>
        </div>
        <h1 class="catalog-title">THE LIBRARY</h1>
        <p style="color: var(--np-muted); max-width: 500px; font-size: 0.95rem;">
          Discover your next obsession. Browse our full catalog of titles — from epic RPGs to fast-paced shooters.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
        <div>
          <div class="nexus-spinner mx-auto mb-3"></div>
          <p style="color: var(--np-muted); font-size: 0.9rem; text-align: center;">Loading catalog...</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="nexus-alert">
        <i class="bi bi-wifi-off me-2"></i>{{ error }}
      </div>

      <!-- Empty -->
      <div v-else-if="products.length === 0" class="text-center py-5">
        <i class="bi bi-controller" style="font-size: 3rem; color: var(--np-border);"></i>
        <p class="mt-3" style="color: var(--np-muted);">No games available right now. Check back soon!</p>
      </div>

      <!-- Product Grid -->
      <div v-else class="row g-4">
        <div
          v-for="product in products"
          :key="product._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <div class="nexus-card product-card h-100 d-flex flex-column">

            <!-- Game Cover Placeholder -->
            <div class="product-cover">
              <div class="cover-inner">
                <i class="bi bi-controller cover-icon"></i>
              </div>
              <div class="cover-overlay">
                <span class="nexus-badge-cyan">Available</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body-nexus flex-grow-1 d-flex flex-column p-3">
              <h5 class="product-name mb-1">{{ product.name }}</h5>
              <p class="product-desc mb-3">{{ truncate(product.description, 70) }}</p>
              <div class="mt-auto d-flex align-items-center justify-content-between">
                <span class="nexus-price">₱{{ product.price.toLocaleString() }}</span>
                <router-link
                  :to="`/products/${product._id}`"
                  class="btn btn-nexus-cyan btn-sm"
                >
                  Details
                </router-link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const products = ref([])
const loading = ref(true)
const error = ref('')

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

async function fetchProducts() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API}/products/active`)
    if (!res.ok) throw new Error('Failed to load products')
    products.value = await res.json()
  } catch (e) {
    error.value = 'Could not load the game catalog. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.catalog-title {
  font-family: var(--font-display);
  font-size: 4rem;
  color: var(--np-text);
  letter-spacing: 0.04em;
  line-height: 1;
  margin: 0;
}

.product-card {
  cursor: pointer;
}

.product-cover {
  position: relative;
  height: 160px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  overflow: hidden;
}

.cover-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, rgba(123,47,255,0.2), rgba(255,60,110,0.2));
}

.cover-icon {
  font-size: 3rem;
  color: var(--np-border);
  transition: color 0.3s, transform 0.3s;
}

.product-card:hover .cover-icon {
  color: var(--np-primary);
  transform: scale(1.1) rotate(-5deg);
}

.cover-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.product-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--np-text);
  letter-spacing: 0.03em;
}

.product-desc {
  color: var(--np-muted);
  font-size: 0.82rem;
  line-height: 1.5;
  margin: 0;
}

.card-body-nexus {
  border-top: 1px solid var(--np-border);
}
</style>
