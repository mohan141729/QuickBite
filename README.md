# QuickBite

## 1. Executive Summary

### 1.1 Vision & Objectives
QuickBite unifies the food delivery ecosystem into a single, real-time platform.
- **Unified Operations**: Seamless synchronization between Customer, Restaurant, and Delivery apps.
- **Real-Time Transparency**: Instant status updates via Socket.io.
- **Scalability**: Micro-frontend architecture with a robust Node.js backend.

### 1.2 Scope
Four distinct web applications (Customer, Restaurant, Delivery, Admin) powered by a centralized API and MongoDB.

### 1.3 Brand Identity
![QuickBite Logo](docs/images/logo.png)

The **QuickBite** logo was designed to embody the core values of the platform: **Speed, Freshness, and Satisfaction**.
- **The Bite Mark**: Represents the immediate gratification of a delicious meal.
- **Vibrant Orange & Red**: Chosen to stimulate appetite and convey energy and urgency.
- **Minimalist Design**: Ensures high visibility and recognition across all devices, from mobile app icons to desktop dashboards.

---

## 2. Key Features

### 2.1 Customer App
- **Smart Search & Filtering**: Real-time search by cuisine, dietary preference, and rating.
- **Live Order Tracking**: Visual timeline from 'Placed' to 'Delivered'.
- **Secure Payments**: Integrated mock gateway for testing transaction flows.

### 2.2 Restaurant Dashboard
- **Order Management**: Real-time audio alerts for new orders; Accept/Reject workflows.
- **Menu Builder**: Dynamic category and item management with image uploads (Cloudinary).
- **Analytics**: Revenue charts and top-selling item reports.

### 2.3 Delivery App
- **Job Board**: Real-time broadcasting of available delivery requests.
- **Active Delivery Flow**: Step-by-step navigation (Pickup -> Drop) with Google Maps.
- **Earnings Wallet**: Instant balance updates after every delivery.

### 2.4 Admin Dashboard
- **User & Partner Management**: Approve restaurants/drivers and moderate content.
- **Platform Config**: Set global fees, tax rates, and delivery parameters.

---

## 3. User Flows

### 3.1 Order Placement & Fulfillment
This sequence demonstrates the lifecycle of an order from creation to delivery.

![Order Flow](docs/images/order_flow.png)

### 3.2 Authentication Flow
Secure login process using Clerk.

![Authentication Flow](docs/images/auth_flow.png)

---

## 4. System Architecture Deep Dive

### 4.1 High-Level Overview
![System Architecture](docs/images/system_architecture_v2.png)

### 4.2 Customer App Architecture
![Customer App Architecture](docs/images/customer_app_architecture.png)

### 4.3 Restaurant Dashboard Architecture
![Restaurant Dashboard Architecture](docs/images/restaurant_app_architecture.png)

### 4.4 Delivery App Architecture
![Delivery App Architecture](docs/images/delivery_app_architecture.png)

### 4.5 Admin Dashboard Architecture
![Admin Dashboard Architecture](docs/images/admin_app_architecture.png)

### 4.6 Micro-Frontend Pattern
QuickBite uses a **Monorepo** structure where each frontend is a separate React application. This ensures:
- **Decoupled Deployments**: A bug in the Customer App doesn't bring down the Restaurant Dashboard.
- **Optimized Bundles**: Each app loads only the libraries it needs (e.g., Recharts only in Dashboards).
- **Shared Utilities**: Common logic (date formatting, validation) is shared via internal packages or utility folders.

### 4.7 Backend Services
The backend is a monolithic Node.js/Express application, chosen for simplicity and speed of development, but structured for future microservices migration.
- **Controllers**: Handle business logic.
- **Services**: Encapsulate complex operations (e.g., `OrderService.createOrder`).
- **Middleware**: Handle Auth (`clerkAuth`), Error Handling, and Validation.

### 4.8 Real-Time Event Bus (Socket.io)
The heartbeat of QuickBite. It maintains persistent connections with all active clients.
- **Rooms**:
    - `restaurant_{id}`: For sending orders to specific restaurants.
    - `delivery_partners`: Broadcast channel for available jobs.
    - `order_{id}`: For tracking a specific order's lifecycle.
- **Events**:
    - `order:created` -> Emitted by API -> Received by Restaurant.
    - `order:status_change` -> Emitted by Restaurant/Driver -> Received by Customer.

### 4.9 Database Design (MongoDB)
We use MongoDB for its flexible schema, perfect for storing varied menu structures and order logs.
- **Geospatial Queries**: `2dsphere` indexes on Restaurant and User locations allow for efficient "Find restaurants near me" queries.
- **ACID Transactions**: Used for critical operations like Order Creation to ensure inventory and payment consistency.

---

## 5. API Reference

### 5.1 Authentication (`/api/auth`)
#### `POST /webhook`
- **Description**: Handles Clerk webhooks for user creation/update.
- **Payload**:
  ```json
  {
    "data": { "id": "user_123", "email_addresses": [...] },
    "type": "user.created"
  }
  ```
- **Response**: `200 OK`

#### `POST /token`
- **Description**: Exchanges Clerk ID for a backend JWT.
- **Headers**: `Authorization: Bearer <clerk_token>`
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUz...",
    "user": { "id": "user_123", "role": "customer" }
  }
  ```

### 5.2 User (`/api/user`)
#### `GET /profile`
- **Description**: Fetches current user profile.
- **Headers**: `Authorization: Bearer <backend_token>`
- **Response**:
  ```json
  {
    "_id": "65a...",
    "name": "Alice",
    "email": "alice@example.com",
    "addresses": [{ "line1": "123 Main St", "city": "New York" }]
  }
  ```

#### `PUT /profile`
- **Description**: Place a new order.
- **Body**:
  ```json
  {
    "restaurantId": "rest_1",
    "items": [{ "menuItem": "item_1", "quantity": 2, "price": 10 }],
    "totalAmount": 25,
    "address": { ... }
  }
  ```
- **Response**: `201 Created` with Order ID.

#### `GET /user`
- **Description**: Get order history for logged-in user.
- **Response**: List of orders with status.

#### `PUT /:id/status` (Restaurant/Driver/Admin)
- **Description**: Update order status.
- **Body**: `{ "status": "preparing" }`

### 5.3 Delivery (`/api/delivery`)
#### `GET /available`
- **Description**: List orders waiting for a driver.
- **Response**: List of orders with status `ready`.

#### `POST /accept/:orderId`
- **Description**: Driver accepts a delivery job.
- **Response**: Updates order with `deliveryPartner` ID.

---

## 6. Database Schema Reference

![ER Diagram](docs/images/er_diagram_comprehensive.png)

### 6.1 User Model
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `clerkId` | String | Yes | Unique ID from Clerk Auth |
| `email` | String | Yes | User's email address |
| `role` | Enum | Yes | `customer`, `restaurant_owner`, `delivery_partner`, `admin` |
| `addresses` | Array | No | List of saved addresses |

### 6.2 Restaurant Model
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `owner` | ObjectId | Yes | Reference to User (Owner) |
| `name` | String | Yes | Restaurant Name |
| `location` | Object | Yes | `{ lat, lng, address }` |
| `menu` | Array | No | List of MenuItem ObjectIds |
| `isSurgeActive` | Boolean | No | Dynamic pricing flag |

### 6.3 Order Model
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `user` | ObjectId | Yes | Customer who placed order |
| `restaurant` | ObjectId | Yes | Restaurant fulfilling order |
| `deliveryPartner` | ObjectId | No | Driver assigned (if any) |
| `status` | Enum | Yes | `pending`, `preparing`, `ready`, `out-for-delivery`, `delivered`, `cancelled` |
| `totalAmount` | Number | Yes | Final bill amount |

### 6.4 MenuItem Model
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Item Name |
| `price` | Number | Yes | Base Price |
| `category` | String | Yes | e.g., "Starters" |
| `image` | String | No | URL to Cloudinary image |

---

## 7. Codebase Walkthrough

### 7.1 Key Directories
- **`backend/src/controllers`**: Contains the business logic. For example, `orderController.js` handles all order-related logic like validation, state transitions, and socket emissions.
- **`backend/src/socket`**: `socket.js` initializes the Socket.io server and defines event listeners for `join-room` and `update-location`.
- **`frontend/customer_quickbite/src/context`**: `AuthContext.jsx` manages the global user state using Clerk, while `CartContext.jsx` handles the shopping cart logic.

### 7.2 Critical Files
- **`backend/src/middleware/clerkAuth.js`**: Custom middleware that verifies the Bearer token against Clerk's public key and attaches `req.auth.userId` to the request object.
- **`frontend/delivery_quickbite/src/pages/ActiveDelivery.jsx`**: Complex component that handles the driver's workflow, integrating Google Maps for navigation and Socket.io for status updates.

---

## 8. Deployment Guide

### 8.1 Backend (Render)
1.  Create a new Web Service on Render.
2.  Connect your GitHub repository.
3.  Set Build Command: `npm install`
4.  Set Start Command: `npm start`
5.  Add Environment Variables (`MONGO_URI`, `CLERK_SECRET_KEY`, etc.).
6.  Deploy!

### 8.2 Frontend (Vercel)
1.  Import the project into Vercel.
2.  Select the specific root directory (e.g., `frontend/customer_quickbite`).
3.  Vercel automatically detects Vite.
4.  Add Environment Variables (`VITE_API_URL`, `VITE_CLERK_PUBLISHABLE_KEY`).
5.  Deploy! Repeat for other 3 apps.

---

## 9. Troubleshooting & FAQ

### Q: Why are images not loading?
**A:** Ensure your Cloudinary credentials are correct in the backend `.env` file. Also, check if the image URL in the database is valid.

### Q: Socket events are not being received.
**A:** Check the CORS configuration in `backend/src/index.js`. The frontend origin must be whitelisted. Also, ensure the client is joining the correct room (e.g., `restaurant_<id>`).

### Q: "Unauthorized" error on API calls.
**A:** The frontend might be sending an expired token. Clerk handles token rotation automatically, but ensure `AuthContext` is correctly wrapping your app.

---

## 10. Roadmap
- **Phase 2**: AI-powered recommendations based on order history.
- **Phase 3**: Multi-language support for broader accessibility.
- **Phase 4**: Driver live location tracking on a map for customers.

## 11. Contributors
- **Mohan** - Lead Developer & Architect





---
