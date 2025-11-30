# QuickBite Backend API

## 🛠️ Overview
The **QuickBite Backend** is a robust Node.js/Express application that powers the entire QuickBite ecosystem. It handles data persistence via MongoDB, real-time communication via Socket.io, and secure authentication using Clerk.

## 🔗 Live URL
**Base URL**: `https://quickbite-05uf.onrender.com`

## 🔑 Key Features
- **Secure Authentication**: Middleware to verify Clerk JWT tokens (`clerkAuth.js`).
- **Real-time Engine**: Socket.io server for instant order updates (`server.js`).
- **Role-Based Access**: Granular permissions for Admin, Restaurant, and Delivery roles.
- **RESTful API**: Clean and documented endpoints for all resources.
- **Image Handling**: Integration with Cloudinary for image uploads.

## ⚙️ Environment Variables

Create a `.env` file in the `backend` root:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quickbite

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Frontend URLs (CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
RESTAURANT_URL=http://localhost:5175
DELIVERY_URL=http://localhost:5176
```

## 🚀 Setup & Installation

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    *Server runs on port 5001 by default.*

3.  **Run Production Server**:
    ```bash
    npm start
    ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/sync-user`: Sync Clerk user data to MongoDB.

### Users (`/api/users`)
- `GET /profile`: Get current user profile.
- `PUT /profile`: Update user profile.

### Restaurants (`/api/restaurants`)
- `GET /`: List all restaurants (with filters).
- `GET /:id`: Get restaurant details & menu.
- `POST /`: Create a new restaurant (Admin/Owner).
- `PUT /:id`: Update restaurant details.

### Orders (`/api/orders`)
- `POST /`: Place a new order.
- `GET /my-orders`: Get customer's order history.
- `PUT /:id/status`: Update order status (Restaurant/Delivery).

### Delivery (`/api/delivery`)
- `GET /orders`: Get available orders for delivery.
- `PUT /accept/:id`: Accept a delivery request.
- `PUT /status/:id`: Update delivery status.

### Incentives (`/api/incentives`)
- `GET /`: List active incentives.
- `POST /`: Create a new incentive (Admin).

## 🔌 WebSockets (Socket.io)

The server listens for and emits the following events:

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `join-restaurant-room` | Client -> Server | Restaurant joins its private room. |
| `join-delivery-room` | Client -> Server | Delivery partner joins the delivery pool. |
| `new-order` | Server -> Client | Notifies restaurant of a new order. |
| `order-status-updated` | Server -> Client | Notifies customer of status change. |
| `new-delivery-request` | Server -> Client | Notifies delivery partners of a new job. |
