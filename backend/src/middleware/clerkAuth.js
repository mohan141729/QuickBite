import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { clerkClient } from '@clerk/clerk-sdk-node';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Clerk authentication middleware
 * Verifies JWT tokens (our custom tokens) or Clerk JWT tokens
 */
export const clerkAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log(`❌ Unauthenticated: No token. Method: ${req.method}, Path: ${req.originalUrl}`);
            return res.status(401).json({ message: 'Unauthenticated: No token' });
        }

        const token = authHeader.split(' ')[1];
        let claims;

        // Try to verify as our custom JWT first
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key-change-in-production'
            );

            if (decoded.type === 'access_token') {
                console.log('✅ Custom JWT verified! User:', decoded.userId);
                claims = {
                    sub: decoded.userId,
                    sid: 'jwt_session_' + decoded.userId,
                    sessionClaims: decoded,
                    publicMetadata: { role: decoded.role }
                };
            }
        } catch (jwtError) {
            // If JWT verification fails, try Clerk token verification
            // Or if token starts with 'user_', treat as Clerk ID (dev mode)
            if (token.startsWith('user_')) {
                console.log('🔑 Using Clerk ID as token:', token);
                claims = {
                    sub: token,
                    sid: 'mock_session_' + token,
                    publicMetadata: { role: 'admin' } // Add admin role for development
                };
            } else {
                // Verify token with Clerk
                claims = await clerkClient.verifyToken(token, {
                    secretKey: process.env.CLERK_SECRET_KEY,
                    clockSkewInMs: 10000,
                    authorizedParties: [
                        'http://localhost:5173',
                        'http://localhost:5174',
                        'http://localhost:5175',
                        'http://localhost:5176',
                        'http://localhost:5177',
                        'https://admin.quickbite.in',
                        'https://partner.quickbite.in',
                        'https://quickbite.in',
                        'https://quick-bite-smoky.vercel.app',
                        'https://restaurant-quickbite.vercel.app',
                        'https://deliverypartners-quickbite.vercel.app',
                        'https://admin-quickbite.vercel.app'
                    ]
                });
                console.log('✅ Clerk JWT verified! User:', claims.sub);
            }
        }

        // Mock the req.auth object
        req.auth = {
            userId: claims.sub,
            sessionId: claims.sid,
            sessionClaims: claims
        };

        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        res.status(500).json({ message: `Unauthenticated: ${error.message}` });
    }
};

/**
 * Attempt authentication but do not block if failed
 * Useful for routes that show different content for guests vs users
 */
export const attemptAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        let claims;

        // Try to verify as our custom JWT first
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key-change-in-production'
            );

            if (decoded.type === 'access_token') {
                claims = {
                    sub: decoded.userId,
                    sid: 'jwt_session_' + decoded.userId,
                    sessionClaims: decoded,
                    publicMetadata: { role: decoded.role }
                };
            }
        } catch (jwtError) {
            // If JWT verification fails, try Clerk token verification
            if (token.startsWith('user_')) {
                claims = {
                    sub: token,
                    sid: 'mock_session_' + token,
                    publicMetadata: { role: 'admin' }
                };
            } else {
                try {
                    claims = await clerkClient.verifyToken(token, {
                        secretKey: process.env.CLERK_SECRET_KEY,
                        clockSkewInMs: 10000,
                        authorizedParties: [
                            'http://localhost:5173',
                            'http://localhost:5174',
                            'http://localhost:5175',
                            'http://localhost:5176',
                            'http://localhost:5177',
                            'https://admin.quickbite.in',
                            'https://partner.quickbite.in',
                            'https://quickbite.in',
                            'https://quick-bite-smoky.vercel.app',
                            'https://restaurant-quickbite.vercel.app',
                            'https://deliverypartners-quickbite.vercel.app',
                            'https://admin-quickbite.vercel.app'
                        ]
                    });
                } catch (clerkError) {
                    console.log("⚠️ Optional auth: Clerk verification failed:", clerkError.message);
                    return next();
                }
            }
        }

        if (claims) {
            req.auth = {
                userId: claims.sub,
                sessionId: claims.sid,
                sessionClaims: claims
            };
        }

        next();
    } catch (error) {
        console.log("⚠️ Optional auth failed:", error.message);
        next();
    }
};

/**
 * Role-based access control middleware
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
export const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.auth) {
                console.log('❌ Access denied: req.auth is missing');
                return res.status(401).json({ message: 'Unauthorized: No authentication data' });
            }

            // Get role from Clerk session claims
            let role = req.auth.sessionClaims?.publicMetadata?.role;

            // ⚠️ Fallback: If role is missing in claims, fetch from Clerk API
            // This handles cases where "Customize Session Token" is not configured in Clerk Dashboard
            if (!role && req.auth.userId) {
                try {
                    const user = await clerkClient.users.getUser(req.auth.userId);
                    role = user.publicMetadata?.role;
                    // console.log(`🔄 Fetched role from Clerk API: ${role}`);
                } catch (err) {
                    console.error('Failed to fetch user from Clerk:', err);
                }
            }

            if (!role) {
                return res.status(403).json({
                    message: 'Access denied: No role assigned to user'
                });
            }

            if (!allowedRoles.includes(role)) {
                return res.status(403).json({
                    message: `Access denied: Required roles: ${allowedRoles.join(', ')}`
                });
            }

            // Fetch user from MongoDB to get the real _id
            const dbUser = await User.findOne({ clerkId: req.auth.userId });

            if (!dbUser) {
                console.log('❌ Access denied: User not found in database');
                return res.status(401).json({ message: 'Unauthorized: User not found in database' });
            }

            // Attach user info to request for easy access
            req.user = dbUser;

            next();
        } catch (error) {
            res.status(500).json({ message: error.message, stack: error.stack });
        }
    };
};

/**
 * Optional middleware to attach user info without requiring authentication
 * Useful for routes that work for both authenticated and non-authenticated users
 */
export const optionalAuth = async (req, res, next) => {
    if (req.auth?.userId) {
        try {
            let role = req.auth.sessionClaims?.publicMetadata?.role;

            // ⚠️ Fallback: If role is missing in claims, fetch from Clerk API
            if (!role) {
                try {
                    const user = await clerkClient.users.getUser(req.auth.userId);
                    role = user.publicMetadata?.role;
                    // console.log(`🔄 [optionalAuth] Fetched role from Clerk API: ${role}`);
                } catch (err) {
                    console.error('Failed to fetch user from Clerk in optionalAuth:', err);
                }
            }

            const dbUser = await User.findOne({ clerkId: req.auth.userId });
            if (dbUser) {
                req.user = dbUser;
            } else {
                // Fallback if not in DB yet (rare)
                req.user = {
                    clerkId: req.auth.userId,
                    email: req.auth.sessionClaims?.email,
                    role: role,
                    ...req.auth.sessionClaims?.publicMetadata
                };
            }
        } catch (error) {
            console.error("Error in optionalAuth:", error);
        }
    }
    next();
};

/**
 * Middleware to populate req.user from Clerk auth data
 * Must be used AFTER clerkAuth middleware
 */
export const populateUser = async (req, res, next) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let role = req.auth.sessionClaims?.publicMetadata?.role;

        // ⚠️ Fallback: If role is missing in claims, fetch from Clerk API
        if (!role) {
            try {
                const user = await clerkClient.users.getUser(req.auth.userId);
                role = user.publicMetadata?.role;
                // console.log(`🔄 [populateUser] Fetched role from Clerk API: ${role}`);
            } catch (err) {
                console.error('Failed to fetch user from Clerk in populateUser:', err);
            }
        }

        // ✅ Optimization: If req.user is already set (e.g. by requireRole), skip DB fetch
        if (req.user) {
            return next();
        }

        const dbUser = await User.findOne({ clerkId: req.auth.userId });

        if (!dbUser) {
            return res.status(404).json({ message: "User not found in database" });
        }

        req.user = dbUser;

        next();
    } catch (error) {
        console.error("Error in populateUser:", error);
        res.status(500).json({ message: "Internal server error during user population" });
    }
};
