<template>
  <div class="products-page">
    <div class="container-xl py-5">

      <!-- Header -->
      <div class="catalog-header mb-5">
        <div class="d-flex align-items-center gap-3 mb-2">
          <span class="nexus-badge">Game Store</span>
          <span class="nexus-badge-cyan">{{ filteredProducts.length }} Titles</span>
        </div>
        <h1 class="catalog-title">THE LIBRARY</h1>
        <p style="color: var(--np-muted); max-width: 500px; font-size: 0.95rem;">
          Discover your next obsession. Browse our full catalog of titles — from epic RPGs to fast-paced shooters.
        </p>
      </div>

      <!-- Search & Filter Bar -->
      <div class="filter-bar nexus-card p-3 mb-5">
        <div class="row g-3 align-items-end">

          <!-- Search by name -->
          <div class="col-12 col-md-5">
            <label class="nexus-label">Search by Name</label>
            <div style="position: relative;">
              <i class="bi bi-search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--np-muted); font-size: 0.85rem;"></i>
              <input
                v-model="searchName"
                class="nexus-input"
                style="padding-left: 2rem;"
                placeholder="e.g. God of War, Elden Ring..."
                @input="applyFilters"
              />
            </div>
          </div>

          <!-- Min price -->
          <div class="col-6 col-md-2">
            <label class="nexus-label">Min Price (₱)</label>
            <input
              v-model.number="minPrice"
              type="number"
              min="0"
              class="nexus-input"
              placeholder="0"
              @input="applyFilters"
            />
          </div>

          <!-- Max price -->
          <div class="col-6 col-md-2">
            <label class="nexus-label">Max Price (₱)</label>
            <input
              v-model.number="maxPrice"
              type="number"
              min="0"
              class="nexus-input"
              placeholder="99999"
              @input="applyFilters"
            />
          </div>

          <!-- Reset button -->
          <div class="col-12 col-md-3">
            <button class="btn btn-nexus-outline w-100" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
            </button>
          </div>

        </div>

        <!-- Active filter tags -->
        <div v-if="hasActiveFilters" class="d-flex align-items-center gap-2 mt-3 flex-wrap">
          <span style="color: var(--np-muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em;">Active:</span>
          <span v-if="searchName" class="filter-tag">
            Name: "{{ searchName }}" <button @click="searchName = ''; applyFilters()">×</button>
          </span>
          <span v-if="minPrice !== null && minPrice !== ''" class="filter-tag">
            Min: ₱{{ minPrice.toLocaleString() }} <button @click="minPrice = null; applyFilters()">×</button>
          </span>
          <span v-if="maxPrice !== null && maxPrice !== ''" class="filter-tag">
            Max: ₱{{ maxPrice.toLocaleString() }} <button @click="maxPrice = null; applyFilters()">×</button>
          </span>
        </div>
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

      <!-- No results -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
        <i class="bi bi-search" style="font-size: 3rem; color: var(--np-border);"></i>
        <p class="mt-3" style="color: var(--np-muted);">No games match your search. <button class="btn-inline-link" @click="resetFilters">Clear filters</button></p>
      </div>

      <!-- Product Grid -->
      <div v-else class="row g-4">
        <div v-for="product in filteredProducts" :key="product._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div class="nexus-card product-card h-100 d-flex flex-column">

            <div class="product-cover">
              <img
                v-if="getGameImage(product.name)"
                :src="getGameImage(product.name)"
                :alt="product.name"
                class="cover-img"
              />
              <div v-else class="cover-inner">
                <i class="bi bi-controller cover-icon"></i>
              </div>
              <div class="cover-overlay">
                <span class="nexus-badge-cyan">Available</span>
              </div>
            </div>

            <div class="card-body-nexus flex-grow-1 d-flex flex-column p-3">
              <h5 class="product-name mb-1">{{ product.name }}</h5>
              <p class="product-desc mb-3">{{ truncate(product.description, 70) }}</p>
              <div class="mt-auto d-flex align-items-center justify-content-between">
                <span class="nexus-price">₱{{ product.price.toLocaleString() }}</span>
                <router-link :to="`/products/${product._id}`" class="btn btn-nexus-cyan btn-sm">Details</router-link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import { getGameImage } from '../utils/gameImages'

const products = ref([])
const filteredProducts = ref([])
const loading = ref(true)
const error = ref('')

const searchName = ref('')
const minPrice = ref(null)
const maxPrice = ref(null)

const hasActiveFilters = computed(() => {
  return searchName.value || (minPrice.value !== null && minPrice.value !== '') || (maxPrice.value !== null && maxPrice.value !== '')
})

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

function applyFilters() {
  let result = [...products.value]

  // Filter by name
  if (searchName.value.trim()) {
    const q = searchName.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }

  // Filter by min price
  if (minPrice.value !== null && minPrice.value !== '') {
    result = result.filter(p => p.price >= minPrice.value)
  }

  // Filter by max price
  if (maxPrice.value !== null && maxPrice.value !== '') {
    result = result.filter(p => p.price <= maxPrice.value)
  }

  filteredProducts.value = result
}

function resetFilters() {
  searchName.value = ''
  minPrice.value = null
  maxPrice.value = null
  filteredProducts.value = [...products.value]
}

async function fetchProducts() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/products/active')
    products.value = res.data
    filteredProducts.value = res.data
  } catch {
    error.value = 'Could not load the game catalog. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.catalog-title { font-family: var(--font-display); font-size: 4rem; color: var(--np-text); letter-spacing: 0.04em; line-height: 1; margin: 0; }

/* Filter bar */
.filter-bar { background: var(--np-card); }

.filter-tag {
  background: rgba(0, 229, 255, 0.1);
  border: 1px solid rgba(0, 229, 255, 0.25);
  color: var(--np-accent);
  font-size: 0.78rem;
  padding: 0.2rem 0.5rem 0.2rem 0.75rem;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-tag button {
  background: none;
  border: none;
  color: var(--np-accent);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.filter-tag button:hover { opacity: 1; }

.btn-inline-link {
  background: none;
  border: none;
  color: var(--np-primary);
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  text-decoration: underline;
}

/* Cards */
.product-card { cursor: pointer; }

.product-cover {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .cover-img { transform: scale(1.06); }

.cover-inner { display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, rgba(123,47,255,0.2), rgba(255,60,110,0.2)); }
.cover-icon { font-size: 3rem; color: var(--np-border); transition: color 0.3s, transform 0.3s; }
.product-card:hover .cover-icon { color: var(--np-primary); transform: scale(1.1) rotate(-5deg); }
.cover-overlay { position: absolute; top: 10px; right: 10px; }
.product-name { font-family: var(--font-display); font-size: 1.1rem; color: var(--np-text); letter-spacing: 0.03em; }
.product-desc { color: var(--np-muted); font-size: 0.82rem; line-height: 1.5; margin: 0; }
.card-body-nexus { border-top: 1px solid var(--np-border); }
</style>
