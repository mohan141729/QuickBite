import express from 'express';
import { handleClerkWebhook } from '../webhooks/clerkWebhooks.js';

const router = express.Router();

/**
 * Clerk webhook endpoint
 * Receives events from Clerk for user lifecycle management
 * 
 * Configure this endpoint in Clerk Dashboard:
 * Webhooks -> Add Endpoint -> https://your-backend-url.com/api/webhooks/clerk
 */
router.post('/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

export default router;
