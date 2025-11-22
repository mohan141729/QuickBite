import api from "./axios"

// Register new user
export const registerOwner = async (formData) => {
  const res = await api.post("/api/auth/register", { ...formData, role: "delivery_partner" })
  return res
}

// Login user
export const loginOwner = async (formData) => {
  const res = await api.post("/api/auth/login", formData)
  return res
}

// Logout
export const logoutOwner = async () => {
  const res = await api.post("/api/auth/logout")
  return res
}
