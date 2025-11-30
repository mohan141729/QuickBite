import { Webhook } from 'svix';
import User from '../models/User.js';
import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * Handle Clerk webhook events
 * Syncs user data between Clerk and MongoDB
 */
export const handleClerkWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('CLERK_WEBHOOK_SECRET not configured');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        // Verify webhook signature
        const webhook = new Webhook(webhookSecret);
        let event;

        try {
            event = webhook.verify(
                req.body.toString(),
                {
                    'svix-id': req.headers['svix-id'],
                    'svix-timestamp': req.headers['svix-timestamp'],
                    'svix-signature': req.headers['svix-signature'],
                }
            );
        } catch (err) {
            console.error('Webhook verification failed:', err);
            return res.status(400).json({ error: 'Webhook verification failed' });
        }

        // Handle different event types
        const { type, data } = event;

        switch (type) {
            case 'user.created':
                await handleUserCreated(data);
                break;

            case 'user.updated':
                await handleUserUpdated(data);
                break;

            case 'user.deleted':
                await handleUserDeleted(data);
                break;

            default:
                console.log(`Unhandled webhook event type: ${type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Handle user.created event
 * Creates a corresponding user record in MongoDB
 * Auto-assigns restaurant_owner role for restaurant portal users
 */
async function handleUserCreated(data) {
    try {
        const { id, email_addresses, first_name, last_name, public_metadata, unsafe_metadata } = data;

        const primaryEmail = email_addresses.find(email => email.id === data.primary_email_address_id);

        // Check if user already exists
        const existingUser = await User.findOne({ clerkId: id });
        if (existingUser) {
            console.log(`User already exists: ${id}`);
            return;
        }

        // Determine user role
        let role = public_metadata?.role || 'customer';

        // Check if user signed up from restaurant portal (via unsafe_metadata or referrer)
        const isRestaurantPortalUser = unsafe_metadata?.portal === 'restaurant' ||
            unsafe_metadata?.app === 'restaurant_quickbite';

        // Auto-assign restaurant_owner role if from restaurant portal and no role set
        if (isRestaurantPortalUser && role === 'customer') {
            role = 'restaurant_owner';
            console.log(`🏪 Auto-assigning restaurant_owner role to user from restaurant portal: ${primaryEmail?.email_address}`);

            // Update user's public metadata in Clerk
            try {
                await clerkClient.users.updateUser(id, {
                    publicMetadata: {
                        ...public_metadata,
                        role: 'restaurant_owner'
                    }
                });
                console.log(`✅ Role updated in Clerk for user: ${id}`);
            } catch (clerkError) {
                console.error(`❌ Failed to update role in Clerk: ${clerkError.message}`);
            }
        }

        // Fallback: Check for invitations if role is still customer (default)
        if (role === 'customer' && primaryEmail?.email_address) {
            try {
                const invitations = await clerkClient.invitations.getInvitationList({
                    status: 'accepted'
                });
                const invitation = invitations.data.find(inv => inv.emailAddress === primaryEmail.email_address);
                if (invitation && invitation.publicMetadata?.role) {
                    role = invitation.publicMetadata.role;
                    console.log(`Found invitation role for ${primaryEmail.email_address}: ${role}`);
                }
            } catch (invError) {
                console.error('Error fetching invitations:', invError);
            }
        }

        // Create user in MongoDB
        const user = await User.create({
            clerkId: id,
            email: primaryEmail?.email_address,
            name: `${first_name || ''} ${last_name || ''}`.trim(),
            role: role,
            ...public_metadata
        });

        console.log(`✅ User created in MongoDB with role '${role}': ${user._id}`);
    } catch (error) {
        console.error('❌ Error creating user:', error);
    }
}

/**
 * Handle user.updated event
 * Updates user record in MongoDB
 */
async function handleUserUpdated(data) {
    try {
        const { id, email_addresses, first_name, last_name, public_metadata } = data;

        const primaryEmail = email_addresses.find(email => email.id === data.primary_email_address_id);

        const user = await User.findOneAndUpdate(
            { clerkId: id },
            {
                email: primaryEmail?.email_address,
                name: `${first_name || ''} ${last_name || ''}`.trim(),
                role: public_metadata?.role,
                ...public_metadata
            },
            { new: true, upsert: true }
        );

        console.log(`User updated in MongoDB: ${user._id}`);
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

/**
 * Handle user.deleted event
 * Soft deletes or removes user from MongoDB
 */
async function handleUserDeleted(data) {
    try {
        const { id } = data;

        // Option 1: Soft delete (recommended)
        await User.findOneAndUpdate(
            { clerkId: id },
            { deleted: true, deletedAt: new Date() }
        );

        // Option 2: Hard delete (uncomment if preferred)
        // await User.findOneAndDelete({ clerkId: id });

        console.log(`User deleted from MongoDB: ${id}`);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}
