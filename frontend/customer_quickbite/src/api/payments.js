import api from "./api"

// Simulate payment initiation (demo)
export const initiatePayment = async (amount) => {
  const res = await api.post("/api/payments/initiate", { amount })
  return res.data
}
