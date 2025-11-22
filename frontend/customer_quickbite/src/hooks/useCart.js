import { useEffect, useState, useCallback } from "react"
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../api/cart"

/**
 * useCart — manages user's cart state synced with backend.
 * Works with cookie-based JWT auth (auto via axios config).
 */
const useCart = () => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ Load cart from backend
  const loadCart = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchCart()
      setCart(data || { items: [], totalPrice: 0 })
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Add new item to cart
  const add = async (menuItemId, quantity = 1) => {
    try {
      setLoading(true)
      await addToCart(menuItemId, quantity)
      await loadCart()
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add item")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Update item quantity
  const update = async (menuItemId, quantity) => {
    try {
      await updateCartItem(menuItemId, quantity)
      await loadCart()
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update quantity")
    }
  }

  // ✅ Remove item from cart
  const remove = async (menuItemId) => {
    try {
      await removeCartItem(menuItemId)
      await loadCart()
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove item")
    }
  }

  // Auto-load on mount
  useEffect(() => {
    loadCart()
  }, [loadCart])

  return { cart, loading, error, add, update, remove, refresh: loadCart }
}

export default useCart
