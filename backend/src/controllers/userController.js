import User from "../models/User.js";
import { clerkClient } from '@clerk/clerk-sdk-node';

// Primary admin email - has full control over all users including other admins
const PRIMARY_ADMIN_EMAIL = 'mohan141729@gmail.com';

/**
 * Check if user is the primary admin
 * @param {string} email - User's email address
 * @returns {boolean}
 */
const isPrimaryAdmin = (email) => {
    return email === PRIMARY_ADMIN_EMAIL;
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 1. Create user in Clerk
        let clerkUser;
        try {
            clerkUser = await clerkClient.users.createUser({
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' '),
                emailAddress: [email],
                password: password,
                publicMetadata: { role }
            });
        } catch (clerkError) {
            console.error('Clerk create error:', clerkError);
            return res.status(400).json({ message: clerkError.errors?.[0]?.message || "Failed to create user in Clerk" });
        }

        // 2. Create user in MongoDB
        const user = await User.create({
            name,
            email,
            password, // We store it but Clerk handles auth. Ideally we shouldn't store it or hash it. User model hashes it.
            role,
            clerkId: clerkUser.id
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            clerkId: user.clerkId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Invite a new admin
// @route   POST /api/users/invite
// @access  Private/Admin
export const inviteAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Create invitation via Clerk
        const invitation = await clerkClient.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: process.env.FRONTEND_URL || 'http://localhost:5174/login',
            publicMetadata: {
                role: 'admin'
            }
        });

        res.status(201).json({
            message: `Invitation sent to ${email}`,
            invitation
        });
    } catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({
            message: error.errors?.[0]?.message || "Failed to send invitation"
        });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.pageNumber) || 1;
        const limitParam = req.query.limit;
        let pageSize = 10;
        let skip = 0;

        if (limitParam === 'all') {
            pageSize = 0;
        } else {
            pageSize = Number(limitParam) || 10;
            skip = pageSize * (page - 1);
        }

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};

        // Exclude current logged-in user from results
        let currentUserEmail = req.user?.email;

        // If email is missing from session claims, fetch it from Clerk
        if (!currentUserEmail && req.user?.clerkId) {
            try {
                const clerkUser = await clerkClient.users.getUser(req.user.clerkId);
                currentUserEmail = clerkUser.emailAddresses[0]?.emailAddress;
            } catch (err) {
                console.error('Failed to fetch user email for admin check:', err);
            }
        }

        let filter = { ...keyword };

        if (currentUserEmail) {
            filter.email = { $ne: currentUserEmail };
        }

        // HIERARCHY ENFORCEMENT:
        // If NOT Primary Admin, hide ALL admin users
        if (!isPrimaryAdmin(currentUserEmail)) {
            filter.role = { $ne: 'admin' };
        }

        const count = await User.countDocuments(filter);
        let query = User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        if (pageSize > 0) {
            query = query.limit(pageSize).skip(skip);
        }

        const users = await query;

        res.json({ users, page, pages: pageSize > 0 ? Math.ceil(count / pageSize) : 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Permission check: Only primary admin can update other admin users
        if (user && user.role === 'admin' && !isPrimaryAdmin(req.user?.email)) {
            return res.status(403).json({
                message: 'Access denied: Only the primary admin can modify other admin users'
            });
        }

        if (user) {
            // 1. Update in Clerk if clerkId exists
            if (user.clerkId) {
                try {
                    const updateData = {};
                    if (req.body.name) {
                        updateData.firstName = req.body.name.split(' ')[0];
                        updateData.lastName = req.body.name.split(' ').slice(1).join(' ');
                    }
                    if (req.body.role) {
                        updateData.publicMetadata = { role: req.body.role };
                    }
                    await clerkClient.users.updateUser(user.clerkId, updateData);
                } catch (clerkError) {
                    console.error('Clerk update error:', clerkError);
                    // Continue to update local DB even if Clerk fails? Maybe warning.
                }
            }

            // 2. Update in MongoDB
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email; // Note: Changing email in Clerk is harder, we skip it here for Clerk
            user.role = req.body.role || user.role;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Prevent self-deletion
        if (user && user.email === req.user?.email) {
            return res.status(403).json({
                message: 'You cannot delete your own account'
            });
        }

        // Permission check: Only primary admin can delete other admin users
        if (user && user.role === 'admin' && !isPrimaryAdmin(req.user?.email)) {
            return res.status(403).json({
                message: 'Access denied: Only the primary admin can delete other admin users'
            });
        }

        if (user) {
            // 1. Delete from Clerk
            if (user.clerkId) {
                try {
                    await clerkClient.users.deleteUser(user.clerkId);
                } catch (clerkError) {
                    console.error('Clerk delete error:', clerkError);
                }
            }

            // 2. Delete from MongoDB
            await user.deleteOne();
            res.json({ message: "User removed" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle user status
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Permission check: Only primary admin can toggle status of other admin users
        if (user && user.role === 'admin' && !isPrimaryAdmin(req.user?.email)) {
            return res.status(403).json({
                message: 'Access denied: Only the primary admin can modify other admin users'
            });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        user.status = user.status === "active" ? "inactive" : "active";
        await user.save();

        res.json({ message: `User status updated to ${user.status}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile (for customers to fetch their own data)
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user's addresses
// @route   PUT /api/users/profile/address
// @access  Private
export const updateUserAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findOne({ clerkId: req.auth.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.address = address;
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            address: updatedUser.address
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new address
// @route   POST /api/users/profile/address
// @access  Private
export const addAddress = async (req, res) => {
    try {
        const { line1, city, pincode } = req.body;
        const user = await User.findOne({ clerkId: req.auth.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.address.push({ line1, city, pincode });
        const updatedUser = await user.save();

        res.json({
            message: "Address added successfully",
            address: updatedUser.address
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an address
// @route   DELETE /api/users/profile/address/:index
// @access  Private
export const deleteAddress = async (req, res) => {
    try {
        const { index } = req.params;
        const user = await User.findOne({ clerkId: req.auth.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (index < 0 || index >= user.address.length) {
            return res.status(400).json({ message: "Invalid address index" });
        }

        user.address.splice(index, 1);
        const updatedUser = await user.save();

        res.json({
            message: "Address deleted successfully",
            address: updatedUser.address
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
