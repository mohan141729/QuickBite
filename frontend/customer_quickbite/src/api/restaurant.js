import api from "./api"

// ✅ Get all restaurants (for customers)
export const getRestaurants = async (search = "") => {
  const res = await api.get(`/api/restaurants?search=${search}`)
  return res.data
}

// ✅ Get restaurant by ID
export const getRestaurantById = async (id) => {
  const res = await api.get(`/api/restaurants/${id}`)
  return res.data
}
