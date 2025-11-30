import Category from "../models/Category.js";

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a category (Admin only)
export const createCategory = async (req, res) => {
    try {
        const { name, image, description } = req.body;

        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = await Category.create({ name, image, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category (Admin only)
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, description, isActive } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name, image, description, isActive },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a category (Admin only)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Bulk create categories (Admin only)
export const bulkCreateCategories = async (req, res) => {
    try {
        const { items } = req.body; // items is an array of category objects

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items array is required and cannot be empty" });
        }

        const createdItems = [];
        const errors = [];

        for (const itemData of items) {
            try {
                if (!itemData.name) {
                    errors.push({ item: itemData, error: "Missing required field: name" });
                    continue;
                }

                // Check for existing category (case-insensitive)
                const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${itemData.name}$`, 'i') } });
                if (existingCategory) {
                    errors.push({ item: itemData, error: `Category '${itemData.name}' already exists` });
                    continue;
                }

                const newCategory = await Category.create({
                    name: itemData.name,
                    image: itemData.image || "",
                    description: itemData.description || "",
                    isActive: itemData.isActive !== undefined ? itemData.isActive : true
                });

                createdItems.push(newCategory);
            } catch (err) {
                errors.push({ item: itemData, error: err.message });
            }
        }

        res.status(201).json({
            message: `Successfully added ${createdItems.length} categories. ${errors.length} failed.`,
            createdItems,
            errors
        });

    } catch (error) {
        console.error("Bulk create categories error:", error);
        res.status(500).json({ message: error.message });
    }
};
