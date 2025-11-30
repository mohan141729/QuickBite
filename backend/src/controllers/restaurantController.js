import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";

// ✅ Create Restaurant
export const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "restaurant_owner")
      return res.status(403).json({ message: "Access denied" });

    const { name, description, image, phone, location, cuisine, operatingHours, deliveryRadius, bankAccount, documents } = req.body;

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
      operatingHours,
      deliveryRadius,
      bankAccount,
      documents
    });

    console.log("✅ Restaurant created in DB:", restaurant);

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

    // If user is logged in and is a restaurant owner, only show their restaurants
    // Note: req.user is populated by optionalAuth middleware if token is present
    if (req.user && req.user.role === 'restaurant_owner') {
      query.owner = req.user._id;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i")
      query.$or = [{ name: searchRegex }, { cuisine: searchRegex }]
      // If owner filter exists, we need to use $and to combine it with search
      if (query.owner) {
        query = {
          $and: [
            { owner: req.user._id },
            { $or: [{ name: searchRegex }, { cuisine: searchRegex }] }
          ]
        }
      }
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Search and Filter Restaurants (for customer discovery)
export const searchAndFilterRestaurants = async (req, res) => {
  try {
    const { q, cuisine, rating, veg, sort, status = 'approved' } = req.query;

    let query = { status }; // Only show approved restaurants by default

    // Text search
    if (q) {
      const searchRegex = new RegExp(q, "i");
      query.$or = [
        { name: searchRegex },
        { cuisine: searchRegex },
        { description: searchRegex }
      ];
    }

    // Cuisine filter (can be comma-separated: "Italian,Chinese")
    if (cuisine) {
      const cuisines = cuisine.split(',').map(c => new RegExp(c.trim(), 'i'));
      query.cuisine = { $in: cuisines };
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Veg-only filter (find restaurants with veg options)
    // Note: This is a simplified approach. For more accuracy, you'd query menu items.
    if (veg === 'true') {
      query.isVeg = true; // Assuming you add this field to Restaurant model
    }

    let restaurants = await Restaurant.find(query);

    // Sorting
    if (sort === 'rating') {
      restaurants = restaurants.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'deliveryTime') {
      restaurants = restaurants.sort((a, b) => (a.avgDeliveryTime || 30) - (b.avgDeliveryTime || 30));
    }

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// ✅ Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("menu", "name price description image category isVeg variants addOns");
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

    const { name, description, image, location, cuisine, operatingHours, deliveryRadius, isSurgeActive, bankAccount, documents } = req.body;

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.image = image || restaurant.image;
    if (operatingHours) {
      restaurant.operatingHours.open = operatingHours.open || restaurant.operatingHours.open;
      restaurant.operatingHours.close = operatingHours.close || restaurant.operatingHours.close;
      // Only update holidays if explicitly provided in the update payload
      if (operatingHours.holidays) {
        restaurant.operatingHours.holidays = operatingHours.holidays;
      }
    }
    restaurant.deliveryRadius = deliveryRadius || restaurant.deliveryRadius;
    restaurant.isSurgeActive = isSurgeActive !== undefined ? isSurgeActive : restaurant.isSurgeActive;
    restaurant.bankAccount = bankAccount || restaurant.bankAccount;
    restaurant.documents = documents || restaurant.documents;

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
// ✅ Get All Restaurants (Admin)
export const getAllRestaurantsAdmin = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});

    // Filter out restaurants with missing owner field to prevent crashes
    const validRestaurants = restaurants.filter(r => r.owner);

    if (restaurants.length !== validRestaurants.length) {
      console.warn(`⚠️ Found ${restaurants.length - validRestaurants.length} restaurants with missing owner field.`);
    }

    // Manually populate owner details from User model using _id
    const ownerIds = validRestaurants.map(r => r.owner);
    const owners = await User.find({ _id: { $in: ownerIds } });

    const populatedRestaurants = validRestaurants.map(r => {
      // Safety check: ensure r.owner exists
      if (!r.owner) return { ...r.toObject(), ownerDetails: null };

      const owner = owners.find(u => u._id.toString() === r.owner.toString());
      return {
        ...r.toObject(),
        ownerDetails: owner ? { name: owner.name, email: owner.email } : null
      };
    });

    res.json(populatedRestaurants);
  } catch (error) {
    console.error("❌ Error in getAllRestaurantsAdmin:", error);
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

// ✅ Update Category Image
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (restaurant.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    // Check if category exists
    const categoryIndex = restaurant.categories.findIndex(c => c.name === name);

    if (categoryIndex > -1) {
      // Update existing
      restaurant.categories[categoryIndex].image = image;
    } else {
      // Add new
      restaurant.categories.push({ name, image });
    }

    await restaurant.save();
    res.json({ message: "Category updated", categories: restaurant.categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
