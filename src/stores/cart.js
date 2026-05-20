import { defineStore } from 'pinia'
import api from '../../api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    totalPrice: 0,
    loading: false,
    error: '',
  }),

  actions: {
    async getCart() {
      this.loading = true
      this.error = ''
      try {
        const res = await api.get('/cart/get-cart')
        this.cartItems = res.data.cartItems || []
        this.totalPrice = res.data.totalPrice || 0
      } catch (err) {
        if (err.response?.status === 404) {
          this.cartItems = []
          this.totalPrice = 0
        } else {
          this.error = 'Failed to load cart.'
        }
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(productId, newQuantity) {
      try {
        const res = await api.patch('/cart/update-cart-quantity', { productId, newQuantity })
        this.cartItems = res.data.cartItems || []
        this.totalPrice = res.data.totalPrice || 0
      } catch {
        this.error = 'Failed to update quantity.'
      }
    },

    async removeItem(productId) {
      try {
        const res = await api.patch(`/cart/${productId}/remove-from-cart`)
        this.cartItems = res.data.cart?.cartItems || []
        this.totalPrice = res.data.cart?.totalPrice || 0
      } catch {
        this.error = 'Failed to remove item.'
      }
    },

    async clearCart() {
      try {
        await api.put('/cart/clear-cart')
        this.cartItems = []
        this.totalPrice = 0
      } catch {
        this.error = 'Failed to clear cart.'
      }
    },

    async checkout() {
      try {
        const res = await api.post('/orders/checkout')
        this.cartItems = []
        this.totalPrice = 0
        return res.data
      } catch {
        this.error = 'Checkout failed.'
        return null
      }
    },
  },
})
