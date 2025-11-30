import express from "express";
import {
    createIncentive,
    getActiveIncentives,
    getAllIncentives,
    updateIncentive,
    deleteIncentive,
} from "../controllers/incentiveController.js";
import { clerkAuth, requireRole } from "../middleware/clerkAuth.js";

const router = express.Router();

// Public/Delivery routes (Authenticated)
router.get("/active", clerkAuth, getActiveIncentives);

// Admin routes
router.get("/all", clerkAuth, requireRole("admin"), getAllIncentives);
router.post("/", clerkAuth, requireRole("admin"), createIncentive);
router.put("/:id", clerkAuth, requireRole("admin"), updateIncentive);
router.delete("/:id", clerkAuth, requireRole("admin"), deleteIncentive);

export default router;
