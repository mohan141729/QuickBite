import api from "./api"

// Register new user
export const registerCustomer = async (formData) => {
  const res = await api.post("/api/auth/register", { ...formData, role: "customer" })
  return res
}

// Login user
export const loginCustomer = async (formData) => {
  const res = await api.post("/api/auth/login", formData)
  return res
}

// Logout
export const logoutCustomer = async () => {
  const res = await api.post("/api/auth/logout")
  return res
}
