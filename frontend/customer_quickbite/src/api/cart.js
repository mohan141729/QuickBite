import api from "./api"

const API_URL = "/api/cart"

// 🛒 Fetch current user's cart
export const fetchCart = async () => {
  const { data } = await api.get(API_URL, { withCredentials: true })
  return data.cart
}

// ➕ Add item
export const addToCartAPI = async (menuItemId, quantity = 1, restaurantId, selectedVariant = null, selectedAddOns = []) => {
  const { data } = await api.post(
    API_URL,
    { menuItemId, quantity, restaurantId, selectedVariant, selectedAddOns },
    { withCredentials: true }
  )
  return data.cart
}

// 🔄 Update quantity
export const updateCartItemAPI = async (itemId, quantity) => {
  const { data } = await api.put(
    `${API_URL}/${itemId}`,
    { quantity },
    { withCredentials: true }
  )
  return data.cart
}

// ❌ Remove item
export const removeCartItemAPI = async (itemId) => {
  const { data } = await api.delete(`${API_URL}/${itemId}`, {
    withCredentials: true,
  })
  return data.cart
}

// 🧹 Clear cart
export const clearCartAPI = async () => {
  const { data } = await api.delete(API_URL, { withCredentials: true })
  return data.cart
}
