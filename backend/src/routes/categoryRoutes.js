import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { clerkAuth, requireRole } from "../middleware/clerkAuth.js";

const router = express.Router();

// Public route to fetch categories
router.get("/", getCategories);

// Admin routes
router.post("/", clerkAuth, requireRole(['admin']), createCategory);
router.put("/:id", clerkAuth, requireRole(['admin']), updateCategory);
router.delete("/:id", clerkAuth, requireRole(['admin']), deleteCategory);

export default router;
