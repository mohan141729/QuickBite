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
