import jwt from 'jsonwebtoken';
import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';

/**
 * Generate JWT token based on Clerk user
 * POST /api/auth/token
 */
export const generateToken = async (req, res) => {
    try {
        // Get user ID from the authenticated request (set by clerkAuth middleware)
        const clerkId = req.auth.userId;

        if (!clerkId) {
            return res.status(401).json({ message: 'Unauthorized: No user ID found' });
        }

        // Verify the Clerk ID exists
        const clerkUser = await clerkClient.users.getUser(clerkId);

        if (!clerkUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user role from Clerk metadata
        const role = clerkUser.publicMetadata?.role || 'customer';

        // Create JWT payload
        const payload = {
            userId: clerkId,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            role: role,
            type: 'access_token'
        };

        // Sign JWT with secret
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '7d' } // Token expires in 7 days
        );

        res.json({
            success: true,
            token,
            user: {
                id: clerkId,
                email: clerkUser.primaryEmailAddress?.emailAddress,
                name: clerkUser.firstName + ' ' + clerkUser.lastName,
                role: role
            }
        });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ message: 'Failed to generate token', error: error.message });
    }
};

/**
 * Sync Clerk user with MongoDB
 * GET /api/auth/sync
 */
export const syncUser = async (req, res) => {
    try {
        const { userId } = req.auth;

        // 1. Get clerk user details
        const clerkUser = await clerkClient.users.getUser(userId);

        // 2. Check if user already exists
        let user = await User.findOne({ clerkId: userId });

        // Get role from Clerk metadata, default to customer if not set
        const role = clerkUser.publicMetadata?.role || 'customer';

        if (!user) {
            // Check if user exists by email to prevent duplicates if they signed up differently
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            if (email) {
                user = await User.findOne({ email });
                if (user) {
                    // Link existing user to Clerk ID
                    user.clerkId = userId;
                    user.role = role; // Sync role
                    await user.save();
                }
            }

            if (!user) {
                user = await User.create({
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress,
                    name: (clerkUser.firstName + " " + clerkUser.lastName).trim() || "User",
                    // avatar: clerkUser.imageUrl, // Add avatar if your schema supports it
                    role: role // Use role from Clerk
                });
            }
        } else {
            // Update existing user details to match Clerk
            user.name = (clerkUser.firstName + " " + clerkUser.lastName).trim() || user.name;
            user.email = clerkUser.emailAddresses[0]?.emailAddress || user.email;

            // CRITICAL: Always sync role from Clerk to DB
            // This ensures if role changes in Clerk (e.g. via dashboard), it reflects in DB
            if (role && user.role !== role) {
                user.role = role;
            }

            await user.save();
        }

        res.json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Failed to sync user', error: error.message });
    }
};
