import Cart from "../models/Cart.js"
import MenuItem from "../models/MenuItem.js"

// 🧮 Helper: recalc total efficiently
const recalcTotal = async (cart) => {
  const menuIds = cart.items.map((i) => i.menuItem)
  const menus = await MenuItem.find({ _id: { $in: menuIds } })
  const priceMap = Object.fromEntries(menus.map((m) => [m._id.toString(), m.price]))

  cart.totalPrice = cart.items.reduce(
    (sum, i) => sum + (priceMap[i.menuItem.toString()] || 0) * i.quantity,
    0
  )
  return cart.totalPrice
}

// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.menuItem",
        populate: { path: "restaurant" },
      })
    if (!cart) {
      return res.json({ success: true, cart: { items: [], totalPrice: 0 } })
    }
    res.json({ success: true, cart })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body
    const userId = req.user._id
    const menuItem = await MenuItem.findById(menuItemId).populate("restaurant")
    if (!menuItem)
      return res.status(404).json({ success: false, message: "Menu item not found" })

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            menuItem: menuItem._id,
            restaurant: menuItem.restaurant._id,
            quantity,
          },
        ],
      })
    } else {
      const existingItem = cart.items.find(
        (i) => i.menuItem.toString() === menuItemId
      )
      if (existingItem) existingItem.quantity += quantity
      else
        cart.items.push({
          menuItem: menuItem._id,
          restaurant: menuItem.restaurant._id,
          quantity,
        })
    }

    await recalcTotal(cart)
    await cart.save()

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.menuItem",
        populate: { path: "restaurant" },
      })

    res.status(200).json({ success: true, cart: populatedCart })
  } catch (err) {
    console.error("Add to Cart Error:", err)
    res.status(500).json({ success: false, message: "Failed to update cart" })
  }
}

// ✅ Update Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const itemId = req.params.itemId
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

    const item = cart.items.find((i) => i.menuItem.toString() === itemId)
    if (!item) return res.status(404).json({ success: false, message: "Item not in cart" })

    item.quantity = quantity
    await recalcTotal(cart)
    await cart.save()

    res.json({ success: true, cart })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Remove Item
export const removeCartItem = async (req, res) => {
  try {
    const itemId = req.params.itemId
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" })

    cart.items = cart.items.filter((i) => i.menuItem.toString() !== itemId)
    await recalcTotal(cart)
    await cart.save()

    res.json({ success: true, cart })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Clear Cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 }
    )
    res.json({ success: true, cart: { items: [], totalPrice: 0 } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
