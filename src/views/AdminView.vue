<template>
  <div class="admin-page">
    <div class="container-xl py-5">

      <div class="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
        <div>
          <p class="nexus-badge mb-2">Admin Panel</p>
          <h1 class="admin-title">DASHBOARD</h1>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-nexus-cyan" @click="activeTab = 'products'"><i class="bi bi-grid me-2"></i>Products</button>
          <button class="btn btn-nexus-outline" @click="activeTab = 'orders'; fetchOrders()"><i class="bi bi-receipt me-2"></i>Orders</button>
          <button class="btn btn-nexus" @click="openAddModal"><i class="bi bi-plus-lg me-2"></i>Add Product</button>
        </div>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">
        <div v-if="loadingProducts" class="d-flex justify-content-center py-5">
          <div class="nexus-spinner"></div>
        </div>
        <div v-else-if="productError" class="nexus-alert">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ productError }}
        </div>
        <div v-else class="nexus-card overflow-hidden">
          <div class="table-header px-4 py-3 d-flex align-items-center justify-content-between">
            <span style="color: var(--np-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em;">{{ products.length }} Total Products</span>
            <input v-model="search" class="nexus-input" style="max-width: 220px; font-size: 0.85rem; padding: 0.4rem 0.8rem;" placeholder="Search products..." />
          </div>
          <div class="table-responsive">
            <table class="nexus-table w-100">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredProducts.length === 0">
                  <td colspan="5" class="text-center py-4" style="color: var(--np-muted);">No products found</td>
                </tr>
                <tr v-for="product in filteredProducts" :key="product._id">
                  <td><span class="product-name-cell">{{ product.name }}</span></td>
                  <td><span style="color: var(--np-muted); font-size: 0.85rem;">{{ truncate(product.description, 50) }}</span></td>
                  <td><span class="nexus-price" style="font-size: 1rem;">₱{{ product.price.toLocaleString() }}</span></td>
                  <td>
                    <span v-if="product.isActive" class="nexus-badge-cyan">Active</span>
                    <span v-else class="status-badge-inactive">Inactive</span>
                  </td>
                  <td>
                    <div class="d-flex gap-2">
                      <button class="btn-action btn-action-update" @click="openUpdateModal(product)">Update</button>
                      <button v-if="product.isActive" class="btn-action btn-action-disable" @click="toggleProduct(product, false)" :disabled="togglingId === product._id">
                        {{ togglingId === product._id ? '...' : 'Disable' }}
                      </button>
                      <button v-else class="btn-action btn-action-activate" @click="toggleProduct(product, true)" :disabled="togglingId === product._id">
                        {{ togglingId === product._id ? '...' : 'Activate' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'">
        <div v-if="loadingOrders" class="d-flex justify-content-center py-5">
          <div class="nexus-spinner"></div>
        </div>
        <div v-else-if="orderError" class="nexus-alert">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ orderError }}
        </div>
        <div v-else-if="orders.length === 0" class="text-center py-5">
          <i class="bi bi-receipt" style="font-size: 3rem; color: var(--np-border);"></i>
          <p class="mt-3" style="color: var(--np-muted);">No orders yet.</p>
        </div>
        <div v-else class="nexus-card overflow-hidden">
          <div class="table-header px-4 py-3">
            <span style="color: var(--np-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em;">{{ orders.length }} Total Orders</span>
          </div>
          <div class="table-responsive">
            <table class="nexus-table w-100">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order._id">
                  <td><span style="font-size: 0.75rem; color: var(--np-muted); font-family: monospace;">{{ order._id.slice(-8) }}</span></td>
                  <td><span style="font-size: 0.75rem; color: var(--np-muted); font-family: monospace;">{{ order.userId.slice(-8) }}</span></td>
                  <td><span style="color: var(--np-text);">{{ order.productsOrdered.length }} item(s)</span></td>
                  <td><span class="nexus-price" style="font-size: 1rem;">₱{{ order.totalPrice.toLocaleString() }}</span></td>
                  <td><span class="nexus-badge-cyan">{{ order.status }}</span></td>
                  <td><span style="color: var(--np-muted); font-size: 0.82rem;">{{ formatDate(order.orderedOn) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddModal" class="nexus-modal-overlay" @click.self="showAddModal = false">
      <div class="nexus-modal">
        <div class="modal-header-nexus">
          <h3 class="modal-title-nexus">ADD PRODUCT</h3>
          <button class="modal-close" @click="showAddModal = false"><i class="bi bi-x-lg"></i></button>
        </div>
        <div v-if="addError" class="nexus-alert mb-3"><i class="bi bi-exclamation-triangle me-2"></i>{{ addError }}</div>
        <div class="mb-3">
          <label class="nexus-label">Product Name</label>
          <input v-model="addForm.name" class="nexus-input" :class="{'is-invalid': addErrors.name}" placeholder="e.g. God of War" />
          <div v-if="addErrors.name" class="field-error">{{ addErrors.name }}</div>
        </div>
        <div class="mb-3">
          <label class="nexus-label">Description</label>
          <textarea v-model="addForm.description" class="nexus-input" :class="{'is-invalid': addErrors.description}" rows="3" placeholder="Game description..."></textarea>
          <div v-if="addErrors.description" class="field-error">{{ addErrors.description }}</div>
        </div>
        <div class="mb-4">
          <label class="nexus-label">Price (₱)</label>
          <input v-model.number="addForm.price" type="number" min="0" class="nexus-input" :class="{'is-invalid': addErrors.price}" placeholder="e.g. 1999" />
          <div v-if="addErrors.price" class="field-error">{{ addErrors.price }}</div>
        </div>
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-nexus-outline" @click="showAddModal = false">Cancel</button>
          <button class="btn btn-nexus" @click="submitAddProduct" :disabled="addingProduct">
            <span v-if="addingProduct"><span class="spinner-border spinner-border-sm me-2"></span>Adding...</span>
            <span v-else><i class="bi bi-plus-lg me-2"></i>Add Product</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Update Product Modal -->
    <div v-if="showUpdateModal" class="nexus-modal-overlay" @click.self="showUpdateModal = false">
      <div class="nexus-modal">
        <div class="modal-header-nexus">
          <h3 class="modal-title-nexus">UPDATE PRODUCT</h3>
          <button class="modal-close" @click="showUpdateModal = false"><i class="bi bi-x-lg"></i></button>
        </div>
        <div v-if="updateError" class="nexus-alert mb-3"><i class="bi bi-exclamation-triangle me-2"></i>{{ updateError }}</div>
        <div class="mb-3">
          <label class="nexus-label">Product Name</label>
          <input v-model="updateForm.name" class="nexus-input" :class="{'is-invalid': updateErrors.name}" />
          <div v-if="updateErrors.name" class="field-error">{{ updateErrors.name }}</div>
        </div>
        <div class="mb-3">
          <label class="nexus-label">Description</label>
          <textarea v-model="updateForm.description" class="nexus-input" :class="{'is-invalid': updateErrors.description}" rows="3"></textarea>
          <div v-if="updateErrors.description" class="field-error">{{ updateErrors.description }}</div>
        </div>
        <div class="mb-4">
          <label class="nexus-label">Price (₱)</label>
          <input v-model.number="updateForm.price" type="number" min="0" class="nexus-input" :class="{'is-invalid': updateErrors.price}" />
          <div v-if="updateErrors.price" class="field-error">{{ updateErrors.price }}</div>
        </div>
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-nexus-outline" @click="showUpdateModal = false">Cancel</button>
          <button class="btn btn-nexus" @click="submitUpdateProduct" :disabled="updatingProduct">
            <span v-if="updatingProduct"><span class="spinner-border spinner-border-sm me-2"></span>Updating...</span>
            <span v-else><i class="bi bi-pencil me-2"></i>Update</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import api from '../api'

const activeTab = ref('products')
const search = ref('')
const products = ref([])
const loadingProducts = ref(true)
const productError = ref('')
const togglingId = ref(null)
const orders = ref([])
const loadingOrders = ref(false)
const orderError = ref('')
const showAddModal = ref(false)
const addingProduct = ref(false)
const addError = ref('')
const addForm = reactive({ name: '', description: '', price: '' })
const addErrors = reactive({ name: '', description: '', price: '' })
const showUpdateModal = ref(false)
const updatingProduct = ref(false)
const updateError = ref('')
const updateForm = reactive({ _id: '', name: '', description: '', price: '' })
const updateErrors = reactive({ name: '', description: '', price: '' })

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
})

function truncate(str, len) { return str && str.length > len ? str.slice(0, len) + '...' : str }
function formatDate(d) { return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) }

async function fetchProducts() {
  loadingProducts.value = true
  productError.value = ''
  try {
    const res = await api.get('/products/all')
    products.value = res.data
  } catch { productError.value = 'Failed to load products.' }
  finally { loadingProducts.value = false }
}

async function fetchOrders() {
  loadingOrders.value = true
  orderError.value = ''
  try {
    const res = await api.get('/orders/all-orders')
    orders.value = res.data
  } catch { orderError.value = 'Failed to load orders.' }
  finally { loadingOrders.value = false }
}

function openAddModal() {
  Object.assign(addForm, { name: '', description: '', price: '' })
  Object.assign(addErrors, { name: '', description: '', price: '' })
  addError.value = ''
  showAddModal.value = true
}

function validateAdd() {
  let valid = true
  Object.assign(addErrors, { name: '', description: '', price: '' })
  if (!addForm.name.trim()) { addErrors.name = 'Name is required'; valid = false }
  if (!addForm.description.trim()) { addErrors.description = 'Description is required'; valid = false }
  if (addForm.price === '' || addForm.price === null) { addErrors.price = 'Price is required'; valid = false }
  else if (addForm.price < 0) { addErrors.price = 'Price must be positive'; valid = false }
  return valid
}

async function submitAddProduct() {
  addError.value = ''
  if (!validateAdd()) return
  addingProduct.value = true
  try {
    await api.post('/products', { name: addForm.name, description: addForm.description, price: addForm.price })
    showAddModal.value = false
    await fetchProducts()
  } catch (err) {
    addError.value = err.response?.data?.error || 'Failed to add product.'
  } finally { addingProduct.value = false }
}

function openUpdateModal(product) {
  Object.assign(updateForm, { _id: product._id, name: product.name, description: product.description, price: product.price })
  Object.assign(updateErrors, { name: '', description: '', price: '' })
  updateError.value = ''
  showUpdateModal.value = true
}

function validateUpdate() {
  let valid = true
  Object.assign(updateErrors, { name: '', description: '', price: '' })
  if (!updateForm.name.trim()) { updateErrors.name = 'Name is required'; valid = false }
  if (!updateForm.description.trim()) { updateErrors.description = 'Description is required'; valid = false }
  if (updateForm.price === '' || updateForm.price === null) { updateErrors.price = 'Price is required'; valid = false }
  else if (updateForm.price < 0) { updateErrors.price = 'Price must be positive'; valid = false }
  return valid
}

async function submitUpdateProduct() {
  updateError.value = ''
  if (!validateUpdate()) return
  updatingProduct.value = true
  try {
    await api.patch(`/products/${updateForm._id}/update`, { name: updateForm.name, description: updateForm.description, price: updateForm.price })
    showUpdateModal.value = false
    await fetchProducts()
  } catch (err) {
    updateError.value = err.response?.data?.error || 'Failed to update product.'
  } finally { updatingProduct.value = false }
}

async function toggleProduct(product, activate) {
  togglingId.value = product._id
  try {
    await api.patch(`/products/${product._id}/${activate ? 'activate' : 'archive'}`)
    await fetchProducts()
  } catch { alert('Failed to update product status.') }
  finally { togglingId.value = null }
}

onMounted(fetchProducts)
</script>

<style scoped>
.admin-title { font-family: var(--font-display); font-size: 3.5rem; color: var(--np-text); letter-spacing: 0.04em; line-height: 1; margin: 0; }
.table-header { border-bottom: 1px solid var(--np-border); background: var(--np-surface); }
.nexus-table { border-collapse: collapse; }
.nexus-table thead tr { background: var(--np-surface); border-bottom: 1px solid var(--np-border); }
.nexus-table th { padding: 0.75rem 1.25rem; color: var(--np-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
.nexus-table td { padding: 0.9rem 1.25rem; border-bottom: 1px solid var(--np-border); vertical-align: middle; }
.nexus-table tbody tr:last-child td { border-bottom: none; }
.nexus-table tbody tr:hover { background: rgba(255,255,255,0.02); }
.product-name-cell { font-weight: 600; color: var(--np-text); font-size: 0.9rem; }
.status-badge-inactive { background: rgba(136,136,170,0.1); color: var(--np-muted); border: 1px solid rgba(136,136,170,0.2); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.2rem 0.6rem; border-radius: 3px; }
.btn-action { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.3rem 0.75rem; border-radius: 3px; border: 1.5px solid; cursor: pointer; transition: all 0.2s; background: transparent; }
.btn-action-update { color: var(--np-accent); border-color: var(--np-accent); }
.btn-action-update:hover { background: var(--np-accent); color: var(--np-bg); }
.btn-action-disable { color: var(--np-primary); border-color: var(--np-primary); }
.btn-action-disable:hover { background: var(--np-primary); color: white; }
.btn-action-activate { color: var(--np-green); border-color: var(--np-green); }
.btn-action-activate:hover { background: var(--np-green); color: var(--np-bg); }
.btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
.nexus-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.nexus-modal { background: var(--np-card); border: 1px solid var(--np-border); border-radius: 12px; padding: 2rem; width: 100%; max-width: 480px; }
.modal-header-nexus { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.modal-title-nexus { font-family: var(--font-display); font-size: 1.6rem; color: var(--np-text); margin: 0; letter-spacing: 0.04em; }
.modal-close { background: none; border: none; color: var(--np-muted); font-size: 1rem; cursor: pointer; padding: 0.25rem; transition: color 0.2s; }
.modal-close:hover { color: var(--np-primary); }
.field-error { color: var(--np-primary); font-size: 0.78rem; margin-top: 0.3rem; }
</style>
