import MenuItem from "../models/MenuItem.js"
import Restaurant from "../models/Restaurant.js"

// ✅ Create a menu item (only restaurant owner or admin)
export const createMenuItem = async (req, res) => {
  try {
    const { restaurantId, name, description, price, image, category } = req.body

    // Ensure restaurant exists
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" })

    // Ensure owner/admin authorization
    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to add items" })
    }

    const newItem = await MenuItem.create({
      restaurant: restaurantId,
      name,
      description,
      price,
      image,
      category,
    })

    // Push item reference into restaurant (optional but good practice)
    restaurant.menu.push(newItem._id)
    await restaurant.save()

    res.status(201).json({ message: "Menu item created successfully", item: newItem })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Get all menu items for a restaurant (public)
export const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId })
    res.json(menuItems)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// ✅ Get all menu items (public - for homepage & categories)
export const getAllMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query
    let query = {}

    if (category) {
      query.category = { $regex: new RegExp(category, "i") }
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ]
    }

    const menuItems = await MenuItem.find(query).populate("restaurant", "name")
    res.status(200).json(menuItems)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("restaurant", "name")
    if (!item) return res.status(404).json({ message: "Menu item not found" })
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Update menu item (only owner/admin)
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("restaurant");
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (
      item.restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(item, req.body);
    await item.save();

    // ✅ Return updated item
    res.json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ✅ Delete menu item (only owner/admin)
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("restaurant")
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (
      item.restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await item.deleteOne()
    res.json({ message: "Item deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
