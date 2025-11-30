import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { clerkAuth, populateUser } from "../middleware/clerkAuth.js";

const router = express.Router();

router.get("/", clerkAuth, populateUser, getProfile);
router.put("/", clerkAuth, populateUser, updateProfile);

export default router;
