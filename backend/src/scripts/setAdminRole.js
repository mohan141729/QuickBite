import { clerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Load environment variables from backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const setAdminRole = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address.');
        console.log('Usage: node src/scripts/setAdminRole.js <email>');
        process.exit(1);
    }

    if (!process.env.CLERK_SECRET_KEY) {
        console.error('❌ CLERK_SECRET_KEY is missing in .env file');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        await connectDB();

        console.log(`🔍 Searching for user with email: ${email}...`);

        const userList = await clerkClient.users.getUserList({
            emailAddress: [email],
        });

        if (userList.length === 0) {
            console.error('❌ User not found in Clerk.');
            process.exit(1);
        }

        const user = userList[0];
        console.log(`✅ Clerk User found: ${user.firstName} ${user.lastName} (${user.id})`);

        console.log('🔄 Updating Clerk user metadata...');
        await clerkClient.users.updateUserMetadata(user.id, {
            publicMetadata: {
                role: 'admin',
            },
        });
        console.log('✅ Successfully assigned "admin" role to Clerk user.');

        // Update local MongoDB user
        console.log('🔄 Updating local MongoDB user...');
        const localUser = await User.findOne({ email: email });
        if (localUser) {
            localUser.role = 'admin';
            await localUser.save();
            console.log('✅ Successfully updated local MongoDB user role to "admin".');
        } else {
            console.warn('⚠️ Local MongoDB user not found. Only Clerk metadata updated.');
        }

        console.log('👉 You may need to sign out and sign back in for changes to take effect.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error updating user:', error);
        if (error.errors) {
            error.errors.forEach(err => {
                console.error(`   - ${err.longMessage || err.message}`);
            });
        }
        process.exit(1);
    }
};

setAdminRole();
