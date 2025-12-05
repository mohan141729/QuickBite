import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";
import { isRestaurantOpen } from "../utils/timeUtils.js";

// Helper to recalculate total price
const recalcTotal = async (cart) => {
  let total = 0;

  // We need to populate menu items to get current prices if not stored
  // However, for performance, we'll assume the cart items have the necessary price info 
  // OR we fetch it. To be safe and accurate, let's fetch the MenuItem prices.
  // But since we can't easily do async inside reduce, we'll iterate.

  for (const item of cart.items) {
    const menuItem = await MenuItem.findById(item.menuItem);
    if (menuItem) {
      let price = menuItem.price;

      // If variant is selected, use variant price
      if (item.selectedVariant && item.selectedVariant.price) {
        price = item.selectedVariant.price;
      }

      // Add addons price
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        const addonsTotal = item.selectedAddOns.reduce((sum, addon) => sum + (addon.price || 0), 0);
        price += addonsTotal;
      }

      total += price * item.quantity;
    }
  }

  cart.totalPrice = Math.round(total); // Ensure integer for currency if needed, or float. JS numbers are floats.
};

// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("items.menuItem")
      .populate("items.restaurant");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity, restaurantId, selectedVariant, selectedAddOns } = req.body;

    // Validate inputs
    if (!menuItemId || !restaurantId) {
      return res.status(400).json({ success: false, message: "Menu Item and Restaurant ID are required" });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    // Check if restaurant is open
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    if (!isRestaurantOpen(restaurant)) {
      return res.status(400).json({
        success: false,
        message: "This restaurant is currently closed.",
        code: "RESTAURANT_CLOSED"
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if cart has items from a different restaurant
    if (cart.items.length > 0) {
      const existingRestaurantId = cart.items[0].restaurant.toString();
      if (existingRestaurantId !== restaurantId) {
        return res.status(400).json({
          success: false,
          message: "Cart contains items from another restaurant. Please clear your cart first.",
          code: "DIFFERENT_RESTAURANT"
        });
      }
    }

    // Check if item already exists in cart (matching variant and addons)
    const existingItemIndex = cart.items.findIndex(item => {
      const isSameItem = item.menuItem.toString() === menuItemId;

      // Simple variant check (assuming name uniqueness or object equality if structure matches)
      const isSameVariant = JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant);

      // Simple addons check (sort and stringify to compare arrays)
      const currentAddOns = item.selectedAddOns ? [...item.selectedAddOns].sort((a, b) => a.name.localeCompare(b.name)) : [];
      const newAddOns = selectedAddOns ? [...selectedAddOns].sort((a, b) => a.name.localeCompare(b.name)) : [];
      const isSameAddOns = JSON.stringify(currentAddOns) === JSON.stringify(newAddOns);

      return isSameItem && isSameVariant && isSameAddOns;
    });

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItem: menuItemId,
        restaurant: restaurantId,
        quantity,
        selectedVariant,
        selectedAddOns
      });
    }

    await recalcTotal(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.menuItem")
      .populate("items.restaurant");

    res.status(200).json({ success: true, cart: populatedCart });
  } catch (err) {
    console.error("❌ Add to Cart Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ success: false, message: `Failed to update cart: ${err.message}` });
  }
};

// ✅ Update Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = req.params.itemId; // This is usually the menuItemId in simple implementations, or the subdocument _id

    // NOTE: The previous code used `i.menuItem.toString() === itemId`. 
    // If the frontend sends the MenuItem ID, this updates ALL instances of that menu item (even with diff variants).
    // Ideally, we should use the Cart Item Subdocument ID (`_id` of the item in the array).
    // But let's stick to the previous logic if that's what the frontend expects, OR improve it.
    // Given the previous code: `const item = cart.items.find((i) => i.menuItem.toString() === itemId)`
    // It seems it expects MenuItem ID. This is flawed for variants.
    // I will try to support both: if itemId matches a subdocument _id, use that. If not, try menuItemId.

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    let item = cart.items.id(itemId); // Try finding by subdoc ID first

    if (!item) {
      // Fallback to menuItem ID (legacy support, but risky for variants)
      item = cart.items.find((i) => i.menuItem.toString() === itemId);
    }

    if (!item) return res.status(404).json({ success: false, message: "Item not in cart" });

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.pull(item._id);
    } else {
      item.quantity = quantity;
    }

    await recalcTotal(cart);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Remove Item
export const removeCartItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    // Try removing by subdoc ID first
    const itemExists = cart.items.id(itemId);

    if (itemExists) {
      cart.items.pull(itemId);
    } else {
      // Fallback: Filter by menuItem ID
      const initialLength = cart.items.length;
      cart.items = cart.items.filter((i) => i.menuItem.toString() !== itemId);
      if (cart.items.length === initialLength) {
        return res.status(404).json({ success: false, message: "Item not found in cart" });
      }
    }

    await recalcTotal(cart);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Clear Cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalPrice: 0 }
    );
    res.json({ success: true, cart: { items: [], totalPrice: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
