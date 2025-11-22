import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    createUser
} from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"
import admin from "../middleware/adminMiddleware.js"

const router = express.Router()

router.use(protect)
router.use(admin)

router.route("/").get(getAllUsers).post(createUser)
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser)

router.route("/:id/toggle-status").put(toggleUserStatus);

export default router;
