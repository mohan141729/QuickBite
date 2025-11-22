/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react"
import {
  fetchCart,
  addToCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../api/cart"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 🔹 Normalize cart item to always include restaurant info
  const normalizeItems = (items = []) =>
    items.map((i) => ({
      _id: i.menuItem?._id || i._id,
      name: i.menuItem?.name || i.name,
      price: i.menuItem?.price || i.price,
      image: i.menuItem?.image,
      quantity: i.quantity,
      restaurant:
        i.restaurant ||
        i.menuItem?.restaurant || // from populated data
        i.menuItem?.restaurant?._id || // ensure ObjectId format
        null,
    }))

  // 🧭 Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true)
        const data = await fetchCart()
        const items = data?.cart?.items || data?.items || []
        setCartItems(normalizeItems(items))
        setTotal(data?.cart?.totalPrice || data?.totalPrice || 0)
      } catch (err) {
        console.error("Failed to load cart:", err)
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  // ➕ Add item
  const addToCart = async (menuItem, quantity = 1) => {
    try {
      const updatedCart = await addToCartAPI(menuItem._id, quantity)
      const items = updatedCart?.cart?.items || updatedCart?.items || []
      setCartItems(normalizeItems(items))
      setTotal(updatedCart?.cart?.totalPrice || updatedCart?.totalPrice || 0)
    } catch (err) {
      console.error("Failed to add to cart:", err)
    }
  }

  // 🔄 Update quantity
  const updateCartItem = async (menuItemId, quantity) => {
    try {
      const updatedCart = await updateCartItemAPI(menuItemId, quantity)
      const items = updatedCart?.cart?.items || updatedCart?.items || []
      setCartItems(normalizeItems(items))
      setTotal(updatedCart?.cart?.totalPrice || updatedCart?.totalPrice || 0)
    } catch (err) {
      console.error("Failed to update cart:", err)
    }
  }

  // ❌ Remove item
  const removeFromCart = async (menuItemId) => {
    try {
      const updatedCart = await removeCartItemAPI(menuItemId)
      const items = updatedCart?.cart?.items || updatedCart?.items || []
      setCartItems(normalizeItems(items))
      setTotal(updatedCart?.cart?.totalPrice || updatedCart?.totalPrice || 0)
    } catch (err) {
      console.error("Failed to remove item:", err)
    }
  }

  // 🧹 Clear all
  const clearCart = async () => {
    try {
      await clearCartAPI()
      setCartItems([])
      setTotal(0)
    } catch (err) {
      console.error("Failed to clear cart:", err)
      setCartItems([])
      setTotal(0)
    }
  }

  return (
    <CartContext.Provider
      value={{
        loading,
        cartItems,
        total,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
