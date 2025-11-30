import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    createUser,
    inviteAdmin,
    getProfile,
    updateUserAddress,
    addAddress,
    deleteAddress
} from "../controllers/userController.js"
import { clerkAuth, requireRole } from "../middleware/clerkAuth.js"

const router = express.Router()

// Profile routes (for customers) - require authentication but not admin role
router.get("/profile", clerkAuth, getProfile);
router.put("/profile/address", clerkAuth, updateUserAddress);
router.post("/profile/address", clerkAuth, addAddress);
router.delete("/profile/address/:index", clerkAuth, deleteAddress);

// Admin routes
router.use(clerkAuth)
router.use(requireRole(['admin']))

router.post("/invite", inviteAdmin);

router.route("/").get(getAllUsers).post(createUser)
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser)

router.route("/:id/toggle-status").put(toggleUserStatus);

export default router;

