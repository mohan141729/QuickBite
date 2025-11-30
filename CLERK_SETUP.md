# Clerk Setup Guide for QuickBite

## Step 1: Create Clerk Account

1. Go to https://clerk.com and sign up
2. Create a new application named "QuickBite"
3. Choose "Email & Password" as authentication method
4. Enable social logins if desired (Google, GitHub, etc.)

## Step 2: Get Your API Keys

From your Clerk Dashboard:

1. Go to **API Keys** section
2. Copy the following keys:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

## Step 3: Configure User Metadata

In Clerk Dashboard:

1. Go to **Users** → **User Metadata**
2. Add the following public metadata schema:

```json
{
  "role": "string",
  "restaurantId": "string (optional)",
  "deliveryPartnerId": "string (optional)"
}
```

Valid roles:
- `admin`
- `restaurant_owner`
- `customer`
- `delivery_partner`

## Step 4: Add Environment Variables

### Backend (.env)

Add these to your `backend/.env` file:

```env
# Clerk Configuration
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

### Frontend Apps

Add to each frontend app's `.env` file:

**restaurant_quickbite/.env**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

**admin_quickbite/.env**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

**customer_quickbite/.env**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

**delivery_quickbite/.env**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

## Step 5: Configure Webhooks (Optional but Recommended)

1. In Clerk Dashboard, go to **Webhooks**
2. Add endpoint: `https://your-backend-url.com/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the **Signing Secret** and add to backend `.env`:

```env
CLERK_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

## Next Steps

Once you've completed these steps:
1. Replace the placeholder keys in the environment files
2. Restart your backend and frontend servers
3. The Clerk integration will be ready to use

## Important Notes

- **Never commit** your `.env` files to Git
- Use different keys for development and production
- Keep your secret keys secure
- Test authentication flows before going live
