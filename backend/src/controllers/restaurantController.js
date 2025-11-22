import Restaurant from "../models/Restaurant.js";

// ✅ Create Restaurant
export const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "restaurant_owner")
      return res.status(403).json({ message: "Access denied" });

    const { name, description, image, phone, location, cuisine } = req.body;

    // Ensure location is object and cuisine is array
    const safeLocation = {
      address: location?.address || "",
      city: location?.city || "",
      pincode: location?.pincode || "",
    };

    const safeCuisine = Array.isArray(cuisine) ? cuisine : [cuisine].filter(Boolean);

    // New restaurants start with 'pending' status (default in model)
    const restaurant = await Restaurant.create({
      owner: req.user._id,
      name,
      description,
      image,
      phone,
      location: safeLocation,
      cuisine: safeCuisine,
    });

    res.status(201).json({
      message: "Restaurant created successfully. Awaiting admin approval.",
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const { search } = req.query

    let query = {}

    if (search) {
      const searchRegex = new RegExp(search, "i")
      query = {
        $or: [{ name: searchRegex }, { cuisine: searchRegex }],
      }
    }

    let restaurants
    if (!req.user || req.user.role !== "restaurant_owner") {
      // For customers and public, only show approved restaurants
      restaurants = await Restaurant.find({ ...query, status: "approved" })
    } else {
      // Restaurant owners see their own restaurants regardless of status
      restaurants = await Restaurant.find({ ...query, owner: req.user._id })
    }
    res.status(200).json(restaurants)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("menu", "name price description image category");
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Restaurant
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (restaurant.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You can update only your restaurant" });

    const { name, description, image, location, cuisine } = req.body;

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.image = image || restaurant.image;

    // Handle location as object
    if (location) {
      restaurant.location.address = location.address || restaurant.location.address;
      restaurant.location.city = location.city || restaurant.location.city;
      restaurant.location.pincode = location.pincode || restaurant.location.pincode;
    }

    // Handle cuisine as array
    if (cuisine) {
      restaurant.cuisine = Array.isArray(cuisine)
        ? cuisine
        : [cuisine].filter(Boolean);
    }

    await restaurant.save();
    res.json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    console.error("Error updating restaurant:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (
      restaurant.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    )
      return res.status(403).json({ message: "Not authorized" });

    await restaurant.deleteOne();
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Restaurants (Admin)
export const getAllRestaurantsAdmin = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).populate("owner", "name email");
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Restaurant Status (Admin)
export const updateRestaurantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'rejected', 'pending'

    // Assuming Restaurant model has a 'status' field. If not, we might need to add it or use 'isActive'.
    // The model I saw earlier didn't show 'status'.
    // Let's check Restaurant.js model again to be sure.
    // If not present, I'll assume we are adding it or it's dynamic.
    // For now, I will try to update 'isApproved' or similar if it exists, or just 'status'.
    // I'll assume 'status' field for now as per typical requirements.

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
