import express from 'express';
import { generateToken, syncUser } from '../controllers/authController.js';
import { clerkAuth } from '../middleware/clerkAuth.js';
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

const router = express.Router();

/**
 * POST /api/auth/token
 * Generate JWT token from Clerk ID
 */
router.post('/token', clerkAuth, generateToken);

/**
 * GET /api/auth/sync
 * Sync Clerk user with MongoDB
 */
router.get('/sync', ClerkExpressRequireAuth(), syncUser);

/**
 * POST /api/auth/set-role
 * Set user role based on portal (customer, restaurant_owner, delivery_partner, admin)
 */
router.post('/set-role', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { role } = req.body;

        // Validate role
        const validRoles = ['customer', 'restaurant_owner', 'delivery_partner', 'admin'];
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({
                error: 'Invalid role',
                message: `Role must be one of: ${validRoles.join(', ')}`
            });
        }

        console.log(`🔧 Setting role '${role}' for user: ${userId}`);

        // Update role in Clerk
        await clerkClient.users.updateUser(userId, {
            publicMetadata: {
                role: role
            }
        });

        // Update role in MongoDB
        await User.findOneAndUpdate(
            { clerkId: userId },
            { role: role },
            { upsert: true }
        );

        // ✅ Auto-create DeliveryPartner profile if role is delivery_partner
        if (role === 'delivery_partner') {
            const DeliveryPartner = (await import('../models/DeliveryPartner.js')).default;
            const user = await User.findOne({ clerkId: userId });

            if (user) {
                const existingPartner = await DeliveryPartner.findOne({ user: user._id });
                if (!existingPartner) {
                    await DeliveryPartner.create({
                        user: user._id,
                        status: 'approved', // Auto-approve for now or 'pending'
                        isAvailable: true,
                        currentLocation: { type: 'Point', coordinates: [0, 0] } // Default location
                    });
                    console.log(`✅ Created DeliveryPartner profile for user: ${userId}`);
                }
            }
        }

        console.log(`✅ Successfully set role '${role}' for user: ${userId}`);

        res.json({
            success: true,
            message: `Role set to ${role}`,
            role: role
        });
    } catch (error) {
        console.error('❌ Error setting role:', error);
        res.status(500).json({
            error: 'Failed to set role',
            message: error.message
        });
    }
});

/**
 * POST /api/auth/set-restaurant-role
 * Legacy endpoint - kept for backwards compatibility
 */
router.post('/set-restaurant-role', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;

        // Update role in Clerk
        await clerkClient.users.updateUser(userId, {
            publicMetadata: {
                role: 'restaurant_owner'
            }
        });

        // Update role in MongoDB
        await User.findOneAndUpdate(
            { clerkId: userId },
            { role: 'restaurant_owner' },
            { upsert: true }
        );

        console.log(`✅ Successfully set restaurant_owner role for user: ${userId}`);

        res.json({
            success: true,
            message: 'Role set to restaurant_owner',
            role: 'restaurant_owner'
        });
    } catch (error) {
        console.error('❌ Error setting restaurant role:', error);
        res.status(500).json({
            error: 'Failed to set role',
            message: error.message
        });
    }
});

export default router;
