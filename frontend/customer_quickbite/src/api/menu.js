
import api from './api'

export const getMenuItemsByRestaurant = async (restaurantId) => {
  const res = await api.get(`/api/menu/restaurant/${restaurantId}`)
  return res.data
}

